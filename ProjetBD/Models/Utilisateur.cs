using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace projetWeb.Models;

[Table("Utilisateur", Schema = "Auth")]
[Index("Courriel", Name = "UC_Utilisateur_Courriel", IsUnique = true)]
public partial class Utilisateur
{
    [Key]
    [Column("UtilisateurID")]
    public int UtilisateurId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Courriel { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string MotDePasse { get; set; } = null!;
}
