using System.ComponentModel.DataAnnotations;

namespace projetWeb.ViewModels
{
    
    public class InscriptionViewModel
    {
        [Required(ErrorMessage = "Le courriel est obligatoire.")]
        [EmailAddress(ErrorMessage = "Courriel invalide.")]
        public string? Courriel { get; set; }

        [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
        [MinLength(6, ErrorMessage = "Minimum 6 caractères.")]
        public string? MotDePasse { get; set; }

        [Required(ErrorMessage = "La confirmation est obligatoire.")]
        [Compare("MotDePasse", ErrorMessage = "Les mots de passe ne correspondent pas.")]
        public string? ConfirmationMotDePasse { get; set; }
    }
}