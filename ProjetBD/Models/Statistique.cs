using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace projetWeb.Models;

[Table("Statistique", Schema = "Hockey")]
[Index("JoueurId", Name = "IX_Statistique_JoueurID")]
public partial class Statistique
{
    [Key]
    [Column("StatistiqueID")]
    public int StatistiqueId { get; set; }

    [Column("buts")]
    public int? Buts { get; set; }

    [Column("passes")]
    public int? Passes { get; set; }

    [Column("minutesGlace")]
    public int? MinutesGlace { get; set; }

    [Column("JoueurID")]
    public int JoueurId { get; set; }

    [Column("MatchID")]
    public int MatchId { get; set; }

    [ForeignKey("JoueurId")]
    [InverseProperty("Statistiques")]
    public virtual Joueur Joueur { get; set; } = null!;

    [ForeignKey("MatchId")]
    [InverseProperty("Statistiques")]
    public virtual Match Match { get; set; } = null!;
}
