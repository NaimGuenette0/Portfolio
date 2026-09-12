using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace projetWeb.Models;

[Table("Adresse", Schema = "Info")]
[Index("CodePostal", Name = "UC_Adresse_codePostal", IsUnique = true)]
public partial class Adresse
{
    [Key]
    [Column("AdresseID")]
    public int AdresseId { get; set; }

    [Column("rue")]
    [StringLength(100)]
    [Unicode(false)]
    public string Rue { get; set; } = null!;

    [Column("ville")]
    [StringLength(50)]
    [Unicode(false)]
    public string Ville { get; set; } = null!;

    [Column("codePostal")]
    [StringLength(10)]
    [Unicode(false)]
    public string CodePostal { get; set; } = null!;

    [InverseProperty("Adresse")]
    public virtual ICollection<Joueur> Joueurs { get; set; } = new List<Joueur>();
}
