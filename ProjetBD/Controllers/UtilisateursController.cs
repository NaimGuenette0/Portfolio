using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using projetWeb.Data;
using projetWeb.Models;
using projetWeb.ViewModels;
using System.Security.Claims;

namespace projetWeb.Controllers
{
    public class UtilisateursController : Controller
    {
        private readonly LigueNationalHockeyContext _context;

        public UtilisateursController(LigueNationalHockeyContext context)
        {
            _context = context;
        }
        public IActionResult Inscription()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Inscription(InscriptionViewModel ivm)
        {
            if (!ModelState.IsValid)
                return View(ivm);

            bool existeDeja = await _context.Utilisateurs
                .AnyAsync(x => x.Courriel == ivm.Courriel);

            if (existeDeja)
            {
                ModelState.AddModelError("Courriel", "Ce courriel est déjà utilisé.");
                return View(ivm);
            }

            string query = "EXEC Auth.USP_CreerUtilisateur @Courriel, @MotDePasse";
            List<SqlParameter> parameters = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@Courriel", Value = ivm.Courriel },
                new SqlParameter { ParameterName = "@MotDePasse", Value = ivm.MotDePasse }
            };

            try
            {
                await _context.Database.ExecuteSqlRawAsync(query, parameters.ToArray());
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Une erreur est survenue. Veuillez réessayer.");
                return View(ivm);
            }

            return RedirectToAction("Connexion", "Utilisateurs");
        }
        public IActionResult Connexion()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Connexion(ConnexionViewModel cvm)
        {
            if (!ModelState.IsValid)
                return View(cvm);

            string query = "EXEC Auth.USP_AuthUtilisateur @Courriel, @MotDePasse";
            List<SqlParameter> parameters = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@Courriel", Value = cvm.Courriel },
                new SqlParameter { ParameterName = "@MotDePasse", Value = cvm.MotDePasse }
            };

            Utilisateur? utilisateur = (await _context.Utilisateurs
                .FromSqlRaw(query, parameters.ToArray())
                .ToListAsync())
                .FirstOrDefault();

            if (utilisateur == null)
            {
                ModelState.AddModelError("", "Courriel ou mot de passe invalide.");
                return View(cvm);
            }

            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, utilisateur.UtilisateurId.ToString()),
                new Claim(ClaimTypes.Name, utilisateur.Courriel)
            };

            ClaimsIdentity identite = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            ClaimsPrincipal principal = new ClaimsPrincipal(identite);
            await HttpContext.SignInAsync(principal);

            return RedirectToAction("Index", "Statistiques");
        }

        public async Task<IActionResult> Deconnexion()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Connexion", "Utilisateurs");
        }
    }
}