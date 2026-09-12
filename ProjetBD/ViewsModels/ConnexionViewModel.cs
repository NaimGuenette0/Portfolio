using System.ComponentModel.DataAnnotations;

namespace projetWeb.ViewModels
{
    public class ConnexionViewModel
    {
        [Required(ErrorMessage = "Le courriel est obligatoire.")]
        [EmailAddress(ErrorMessage = "Courriel invalide.")]
        public string? Courriel { get; set; }

        [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
        public string? MotDePasse { get; set; }
    }
}