using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace projetWeb.Models;

[Keyless]
public partial class VwStatistiquesJoueursParEquipe
{
    [Column("EquipeID")]
    public int EquipeId { get; set; }

    public int? NombreJoueurs { get; set; }

    public int? MoyenneButs { get; set; }

    public int? TotalPasses { get; set; }
}
