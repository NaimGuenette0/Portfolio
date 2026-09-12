using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using RaiditeServer.DTOs;
using RaiditeServer.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Image = SixLabors.ImageSharp.Image;
using static System.Net.Mime.MediaTypeNames;

namespace RaiditeServer.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<ActionResult> Register(RegisterDTO register)
        {
            if (register.Password != register.PasswordConfirm)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Les deux mots de passe spécifiés sont différents." });
            }
            User user = new User()
            {
                UserName = register.Username,
                Email = register.Email
            };
            IdentityResult identityResult = await _userManager.CreateAsync(user, register.Password);
            if (!identityResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { Message = "La création de l'utilisateur a échoué." });
            }
            return Ok(new { Message = "Inscription réussie ! 🥳" });
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginDTO login)
        {
            User? user = await _userManager.FindByNameAsync(login.Username);
            if (user == null) user = await _userManager.FindByEmailAsync(login.Username);

            if (user != null && await _userManager.CheckPasswordAsync(user, login.Password))
            {
                IList<string> roles = await _userManager.GetRolesAsync(user);
                List<Claim> authClaims = new List<Claim>();
                foreach (string role in roles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }
                authClaims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
                SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8
                    .GetBytes("LooOOongue Phrase SiNoN Ça ne Marchera PaAaAAAaAas !"));
                JwtSecurityToken token = new JwtSecurityToken(
                    issuer: "https://localhost:7127",
                    audience: "http://localhost:3000",
                    claims: authClaims,
                    expires: DateTime.Now.AddMinutes(300),
                    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
                    );
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    validTo = token.ValidTo,
                    username = user.UserName,
                    roles = roles
                });
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Le nom d'utilisateur ou le mot de passe est invalide." });
            }

           
        }
        [Authorize]
        [HttpPut]
        public async Task<ActionResult> ChangerAvatar()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            User? user = await _userManager.FindByIdAsync(userId);
            IFormCollection formCollection = await Request.ReadFormAsync();
            IFormFile? file = formCollection.Files.GetFile("myImage");
            if (file == null) return BadRequest(new { Message = "Fournis une image, niochon" });
            Image image = Image.Load(file.OpenReadStream());
            user.FileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            user.MimeType = file.ContentType;

            image.Save(Directory.GetCurrentDirectory() + "/images/avatar/" + user.FileName);
            await _userManager.UpdateAsync(user);

            return Ok(new { Message = "Avatar changé avec succès !" });
        }
        [HttpGet("{username}")]
        public async Task<ActionResult> Avatar(string username)
        {
            User? user = await _userManager.FindByNameAsync(username);
            if (user == null || user.FileName == null)
                return NotFound();
            return PhysicalFile(Directory.GetCurrentDirectory() + "/images/avatar/" + user.FileName, user.MimeType);

        }
        [Authorize]
        [HttpPut]
        public async Task<ActionResult> ChangePassword(ChangePasswordDTO dto)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            User? user = await _userManager.FindByIdAsync(userId);

            if (user == null) return Unauthorized();
            if(dto.NewPass != dto.ConNewPass)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Les deux mots de passe ne sont pas les mêmes" });
            }
            var result = await _userManager.ChangePasswordAsync(user, dto.OldPass, dto.NewPass);
            if (result.Succeeded)
            {
                await _userManager.UpdateAsync(user);
                return Ok("Mot de passe changer avec succès!");
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "L'ancien mot de passe n'est pas le bon." });
            }
        }
        [HttpPut]
        [Authorize(Roles = "Administrateur")]
        public async Task<IActionResult> MakeModerator(string username)
        {

            User? newModo = await _userManager.FindByNameAsync(username);
            if (newModo == null) return NotFound(new { Message = "Cet utilisateur n'existe pas." });

            await _userManager.AddToRoleAsync(newModo, "Moderator");
            return Ok(new { Message = newModo.UserName = " est maintenant un(e) modérateur!" });

        }
    }
}
