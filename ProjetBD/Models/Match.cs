using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace projetWeb.Models;

[Table("Match", Schema = "Hockey")]
public partial class Match
{
    [Key]
    [Column("MatchID")]
    public int MatchId { get; set; }

    [Column("dateMatch")]
    public DateOnly DateMatch { get; set; }

    [Column("scoreLocal")]
    public int? ScoreLocal { get; set; }

    [Column("scoreVisiteur")]
    public int? ScoreVisiteur { get; set; }

    public int EquipeLocal { get; set; }

    public int EquipeVisiteur { get; set; }

    [ForeignKey("EquipeLocal")]
    [InverseProperty("MatchEquipeLocalNavigations")]
    public virtual Equipe EquipeLocalNavigation { get; set; } = null!;

    [ForeignKey("EquipeVisiteur")]
    [InverseProperty("MatchEquipeVisiteurNavigations")]
    public virtual Equipe EquipeVisiteurNavigation { get; set; } = null!;

    [InverseProperty("Match")]
    public virtual ICollection<Statistique> Statistiques { get; set; } = new List<Statistique>();
}
