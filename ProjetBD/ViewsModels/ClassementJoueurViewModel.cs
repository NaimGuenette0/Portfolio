namespace projetWeb.ViewModels
{
    public class ClassementJoueurViewModel
    {
        public int JoueurId { get; set; }
        public string? Prenom { get; set; }
        public string? Nom { get; set; }
        public string? Position { get; set; }
        public int EquipeId { get; set; }
        public int TotalButs { get; set; }
        public int TotalPasses { get; set; }
    }
}