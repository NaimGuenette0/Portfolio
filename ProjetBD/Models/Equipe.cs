using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace projetWeb.Models;

[Table("Equipe", Schema = "Hockey")]
[Index("Nom", Name = "UC_Equipe_nom", IsUnique = true)]
public partial class Equipe
{
    [Key]
    [Column("EquipeID")]
    public int EquipeId { get; set; }

    [Column("nom")]
    [StringLength(50)]
    [Unicode(false)]
    public string Nom { get; set; } = null!;

    [Column("ville")]
    [StringLength(50)]
    [Unicode(false)]
    public string Ville { get; set; } = null!;

    [Column("butsPour")]
    public int? ButsPour { get; set; }

    [Column("butsContre")]
    public int? ButsContre { get; set; }

    [Column("differentielButs")]
    public int? DifferentielButs { get; set; }

    [InverseProperty("Equipe")]
    public virtual ICollection<Joueur> Joueurs { get; set; } = new List<Joueur>();

    [InverseProperty("EquipeLocalNavigation")]
    public virtual ICollection<Match> MatchEquipeLocalNavigations { get; set; } = new List<Match>();

    [InverseProperty("EquipeVisiteurNavigation")]
    public virtual ICollection<Match> MatchEquipeVisiteurNavigations { get; set; } = new List<Match>();
}
