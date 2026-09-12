namespace projetWeb.ViewModels
{
    public class RechercheClassementViewModel
    {
        public int? EquipeID { get; set; }
        public string? Position { get; set; }
        public int ButsMinimum { get; set; } = 0;
        public int PassesMinimum { get; set; } = 0;
        public List<ClassementJoueurViewModel> Resultats { get; set; } = new();
    }
}