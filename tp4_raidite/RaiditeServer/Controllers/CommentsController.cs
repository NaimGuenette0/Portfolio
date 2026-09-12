
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RaiditeServer.DTOs;
using RaiditeServer.Models;
using RaiditeServer.Services;
using System.ComponentModel.Design;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace RaiditeServer.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly PostService _postService;
        private readonly CommentService _commentService;
        private readonly PictureService _pictureService;

        public CommentsController(UserManager<User> userManager, PostService postService, CommentService commentService, PictureService pictureService)
        {
            _userManager = userManager;
            _postService = postService;
            _commentService = commentService;
            _pictureService = pictureService;
        }

        // Créer un nouveau commentaire. (Ne permet pas de créer le commentaire principal d'un post, pour cela,
        // voir l'action PostPost dans PostsController)
        [HttpPost("{parentCommentId}")]
        [Authorize]
        public async Task<ActionResult<CommentDisplayDTO>> PostComment(int parentCommentId)
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (user == null) return Unauthorized();
            try
            {
                Comment? parentComment = await _commentService.GetComment(parentCommentId);
                if (parentComment == null || parentComment.User == null) return BadRequest();

                IFormCollection formCollection = await Request.ReadFormAsync();
                string? text = formCollection["text"].ToString();
                if (text == null) return BadRequest(new { Message = "Aucun texte trouvé" });

                Comment? newComment = await _commentService.CreateComment(user, text, parentComment, null);
                if (newComment == null) return StatusCode(StatusCodes.Status500InternalServerError);

                List<Picture>? pictures = await _pictureService.CreatePicture(formCollection, newComment);
                if (pictures == null) return StatusCode(StatusCodes.Status500InternalServerError);
                newComment.Pictures = pictures;

                bool voteToggleSuccess = await _commentService.UpvoteComment(newComment.Id, user);
                if (!voteToggleSuccess) return StatusCode(StatusCodes.Status500InternalServerError);

                return Ok(new CommentDisplayDTO(newComment, true, user));
            }
            catch (Exception ex)
            {
                return RedirectToAction("PostComment");
            }
        }

        // Modifier le texte d'un commentaire
        [HttpPut("{commentId}")]
        [Authorize]
        public async Task<ActionResult<CommentDisplayDTO>> PutComment(int commentId, CommentDTO commentDTO)
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            Comment? comment = await _commentService.GetComment(commentId);
            if (comment == null) return NotFound();

            if (user == null || comment.User != user) return Unauthorized();

            Comment? editedComment = await _commentService.EditComment(comment, commentDTO.Text);
            if (editedComment == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(new CommentDisplayDTO(editedComment, true, user));

        }

        // Upvoter (ou annuler l'upvote) un commentaire
        [HttpPut("{commentId}")]
        [Authorize]
        public async Task<ActionResult> UpvoteComment(int commentId)
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (user == null) return BadRequest();

            bool voteToggleSuccess = await _commentService.UpvoteComment(commentId, user);
            if (!voteToggleSuccess) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(new { Message = "Vote complété." });
        }

        // Downvoter (ou annuler le downvote) un commentaire
        [HttpPut("{commentId}")]
        [Authorize]
        public async Task<ActionResult> DownvoteComment(int commentId)
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (user == null) return BadRequest();

            bool voteToggleSuccess = await _commentService.DownvoteComment(commentId, user);
            if (!voteToggleSuccess) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(new { Message = "Vote complété." });
        }

        // Supprimer un commentaire.
        // S'il possède des sous-commentaires -> Il sera soft-delete pour préserver les sous-commentaires.
        // S'il ne possède pas de sous-commentaires -> Il sera hard-delete.
        // Si c'est le commentaire principal d'un post et qu'il n'a pas de sous-commentaire -> Le post sera supprimé.
        [HttpDelete("{commentId}")]
        [Authorize]
        public async Task<ActionResult> DeleteComment(int commentId)
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            bool isModerator = await _userManager.IsInRoleAsync(user, "Moderator");
            Comment? comment = await _commentService.GetComment(commentId);
            if (comment == null) return NotFound();

            if (user == null || (comment.User != user && !isModerator))
            {
                return Unauthorized();
            }

            List<Picture> pics = new List<Picture>(comment.Pictures);
            foreach(Picture p in pics)
            {
                await _pictureService.DeletePicture(p);
            }
            
            // Cette boucle permet non-seulement de supprimer le commentaire lui-même, mais s'il possède
            // un commentaire parent qui a été soft-delete et qui n'a pas de sous-commentaires,
            // le supprime aussi. (Et ainsi de suite)
            do
            {
                comment.SubComments ??= new List<Comment>();

                Comment? parentComment = comment.ParentComment;

                // C'est un commentaire principal sans sous-commentaire :
                if (comment.MainCommentOf != null && comment.GetSubCommentTotal() == 0)
                {
                    Post? deletedPost = await _postService.DeletePost(comment.MainCommentOf);
                    if (deletedPost == null) return StatusCode(StatusCodes.Status500InternalServerError);
                }

                // Le commentaire n'a aucun sous-commentaire :
                if (comment.GetSubCommentTotal() == 0)
                {
                    Comment? deletedComment = await _commentService.HardDeleteComment(comment);
                    if (deletedComment == null) return StatusCode(StatusCodes.Status500InternalServerError);
                }
                // Le commentaire a des sous-commentaires :
                else
                {
                    Comment? deletedComment = await _commentService.SoftDeleteComment(comment);
                    if (deletedComment == null) return StatusCode(StatusCodes.Status500InternalServerError);
                    break;
                }

                comment = parentComment;

            } while (comment != null && comment.User == null && comment.GetSubCommentTotal() == 0);

            return Ok(new { Message = "Commentaire supprimé." });
        }
        [HttpGet("{size}/{id}")]
        public async Task<ActionResult> GetPicture(string size, int id)
        {
            Picture? pic = await _pictureService.GetPicture(id);
            if (pic == null) return NotFound();

            if (!Regex.Match(size, "full|thumbnail").Success) return BadRequest(new { Message = "La taille demandée n'existe pas" });

            byte[] bytes = System.IO.File.ReadAllBytes(Directory.GetCurrentDirectory() + "/images/" + size + "/" + pic.FileName);
            return File(bytes, pic.MimeType);
        }
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeletePicture(int id) 
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            Picture picture = await _pictureService.GetPicture(id);

            if (picture == null) return NotFound();

            if (user == null || picture.Comment.User != user) return Unauthorized();
            await _pictureService.DeletePicture(picture);

            return Ok();
        }
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> ReportComment(int id) 
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            Comment? comment = await _commentService.GetComment(id);
            if (user == null || comment == null) return NotFound();
            if (comment.User == user) return Unauthorized();
           

            bool success = await _commentService.ReportComment(id);
            if (!success) return StatusCode(StatusCodes.Status500InternalServerError);
            return Ok(new { Message = "Commentaire signalé." });
        }
        [HttpGet]
        [Authorize(Roles = "Moderator")]
        public async Task<ActionResult<IEnumerable<CommentDisplayDTO>>> GetReportedComments()
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            List<Comment> comments = await _commentService.GetReportedComments();

            return Ok(comments.Select(c => new CommentDisplayDTO(c, false, user)));
        }

    }
}
