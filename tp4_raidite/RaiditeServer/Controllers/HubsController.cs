
using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RaiditeServer.DTOs;
using RaiditeServer.Models;
using RaiditeServer.Services;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace RaiditeServer.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HubsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly HubService _hubService;

        public HubsController(HubService hubService, UserManager<User> userManager)
        {
            _hubService = hubService;
            _userManager = userManager;
        }

        // Obtenir la liste des hubs rejoints par un utilisateur
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HubDisplayDTO>>> GetUserHubs()
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            IEnumerable<Hub>? allHubs = await _hubService.GetAllHubs();
            if(allHubs == null) return StatusCode(StatusCodes.Status500InternalServerError);

            allHubs = allHubs.OrderByDescending(h => h.Users.Count).Take(8);

            if (user == null)
            {
                return Ok(allHubs.Select(h => new HubDisplayDTO(h, user)));
            }
            else
            {
                allHubs = allHubs.Where(h => !h.Users.Contains(user));
            }

            List<Hub> userHubs = user.Hubs.ToList();

            userHubs.AddRange(allHubs.ToList());
            userHubs = userHubs.Take(Math.Max(user.Hubs.Count, 8)).ToList();

            return Ok(userHubs.Select(h => new HubDisplayDTO(h, user)));
        }

        // Créer un nouveau hub
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<HubDisplayDTO>> PostHub()
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (user == null) return Unauthorized();
            IFormCollection formCollection = await Request.ReadFormAsync();
            IFormFile? file = formCollection.Files.GetFile("image");
            string? title = formCollection["titre"].ToString();
            Hub hub = new Hub
            {
                Id = 0,
                Creator = user,
                Name = title,
            };
            if(file == null)
            {
                hub.FileName = null;
                hub.MimeType = null;
            }
            else
            {
                Image image = Image.Load(file.OpenReadStream());
                hub.FileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                hub.MimeType = file.ContentType;
                image.Save(Directory.GetCurrentDirectory() + "/images/hub/" + hub.FileName);
            }
            Hub? newHub = await _hubService.CreateHub(hub);
            if (newHub == null) return StatusCode(StatusCodes.Status500InternalServerError);
            Hub? joinedHub = await _hubService.ToggleJoinHub(newHub.Id, user);
            if (joinedHub == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(new HubDisplayDTO(joinedHub, user));
        }

        // Obtenir un hub spécifique par son id
        [HttpGet("{id}")]
        public async Task<ActionResult<HubDisplayDTO>> GetHub(int id)
        {
            string? userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            User? user = null;
            if (userid != null) user = await _userManager.FindByIdAsync(userid);

            Hub? hub = await _hubService.GetHub(id);
            if (hub == null) return NotFound();

            return Ok(new HubDisplayDTO(hub, user));
        }

        // Permet à un utilisateur d'ajouter / retirer un hub de sa liste de hubs
        [HttpPut("{hubId}")]
        [Authorize]
        public async Task<ActionResult> ToggleJoinHub(int hubId)
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (user == null) return BadRequest();

            Hub? hub = await _hubService.ToggleJoinHub(hubId, user);
            if (hub == null) return NotFound();

            return Ok(new { Message = hub.Users!.Contains(user) ? "Hub rejoint." : "Hub quitté." });
        }
        [HttpGet("{hubId}")]
        public async Task<IActionResult> HubImage(int hubId)
        {
            Hub? hub = await _hubService.GetHub(hubId);
            if (hub == null || hub.FileName == null) return NotFound();
            byte[] bytes = System.IO.File.ReadAllBytes(Directory.GetCurrentDirectory() + "/images/hub/" + hub.FileName);
            return File(bytes, hub.MimeType);
        }
    }
}
