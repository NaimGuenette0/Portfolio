using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace projetWeb.Models;

[Table("Joueur", Schema = "Hockey")]
[Index("EquipeId", Name = "IX_Joueur_EquipeID")]
[Index("Identifiant", Name = "UC_Joueur_Identifiant", IsUnique = true)]
[Index("Numero", "EquipeId", Name = "UC_Joueur_numero", IsUnique = true)]
public partial class Joueur
{
    [Key]
    [Column("JoueurID")]
    public int JoueurId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Prenom { get; set; } = null!;

    [Column("nom")]
    [StringLength(50)]
    [Unicode(false)]
    public string Nom { get; set; } = null!;

    [Column("numero")]
    public int Numero { get; set; }

    [Column("position")]
    [StringLength(30)]
    [Unicode(false)]
    public string Position { get; set; } = null!;

    [Column("AdresseID")]
    public int? AdresseId { get; set; }

    [Column("NumeroTelephoneID")]
    public int? NumeroTelephoneId { get; set; }

    [Column("EquipeID")]
    public int EquipeId { get; set; }

    public Guid Identifiant { get; set; }

    public byte[]? Photo { get; set; }

    [ForeignKey("AdresseId")]
    [InverseProperty("Joueurs")]
    public virtual Adresse? Adresse { get; set; }

    [ForeignKey("EquipeId")]
    [InverseProperty("Joueurs")]
    public virtual Equipe Equipe { get; set; } = null!;

    [InverseProperty("GardienNavigation")]
    public virtual Gardien? Gardien { get; set; }

    [ForeignKey("NumeroTelephoneId")]
    [InverseProperty("Joueurs")]
    public virtual NumeroTelephone? NumeroTelephone { get; set; }

    [InverseProperty("Joueur")]
    public virtual ICollection<Statistique> Statistiques { get; set; } = new List<Statistique>();
}
