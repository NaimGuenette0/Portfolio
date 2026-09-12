using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace projetWeb.ViewModels
{
    public class UploadPhotoViewModel
    {
        [Required(ErrorMessage = "Il faut joindre un fichier image.")]
        public IFormFile? FormFile { get; set; }

        [Required(ErrorMessage = "Il faut spécifier le numéro du joueur.")]
        [DisplayName("Numéro du joueur")]
        public int NumeroJoueur { get; set; }
    }
}