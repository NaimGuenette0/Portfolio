using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using projetWeb.Data;
using projetWeb.ViewModels;
namespace projetWeb.Controllers
{
    public class StatistiquesController : Controller
    {
        private readonly LigueNationalHockeyContext _context;

        public StatistiquesController(LigueNationalHockeyContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var stats = await _context.VwStatistiquesJoueursParEquipes.ToListAsync();
            return View(stats);
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Classement(RechercheClassementViewModel? recherche)
        {
            var equipes = await _context.Equipes.ToListAsync();
            ViewBag.Equipes = equipes;

            if (recherche == null)
                return View(new RechercheClassementViewModel());

           var parameters = new List<SqlParameter>
         {
              new SqlParameter("@EquipeID", (object?)recherche.EquipeID ?? DBNull.Value),
              new SqlParameter("@Position", (object?)recherche.Position ?? DBNull.Value),
              new SqlParameter("@ButsMinimum", recherche.ButsMinimum),
              new SqlParameter("@PassesMinimum", recherche.PassesMinimum)
         };

            string query = "EXEC Hockey.USP_ClassementJoueurs @EquipeID, @Position, @ButsMinimum, @PassesMinimum";

            IQueryable<ClassementJoueurViewModel> resultatsQuery =
                _context.Database.SqlQueryRaw<ClassementJoueurViewModel>(query, parameters.ToArray());

            recherche.Resultats = await resultatsQuery.ToListAsync();

            return View(recherche);
        }
        public IActionResult UploadPhoto()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> UploadPhoto(UploadPhotoViewModel vm)
        {
            if (ModelState.IsValid)
            {
                var joueur = await _context.Joueurs
                    .FirstOrDefaultAsync(j => j.Numero == vm.NumeroJoueur);

                if (joueur == null)
                {
                    ModelState.AddModelError("NumeroJoueur", "Aucun joueur trouvé avec ce numéro.");
                    return View(vm);
                }

                if (vm.FormFile != null && vm.FormFile.Length >= 0)
                {
                    MemoryStream stream = new MemoryStream();
                    await vm.FormFile.CopyToAsync(stream);
                    byte[] fichierImage = stream.ToArray();
                    joueur.Photo = fichierImage;
                }

                await _context.SaveChangesAsync();
                return RedirectToAction("AfficherJoueurs");
            }
            return View(vm);
        }
        public async Task<IActionResult> AfficherJoueurs()
        {
            var joueurs = await _context.Joueurs.ToListAsync();

            var photos = joueurs
                .Select(j => j.Photo == null ? null : $"data:image/png;base64,{Convert.ToBase64String(j.Photo)}")
                .ToList();

            ViewBag.Photos = photos;
            return View(joueurs);
        }

    }
}