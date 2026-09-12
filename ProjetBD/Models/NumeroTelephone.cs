using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace projetWeb.Models;

[Table("NumeroTelephone", Schema = "Info")]
public partial class NumeroTelephone
{
    [Key]
    [Column("NumeroTelephoneID")]
    public int NumeroTelephoneId { get; set; }

    [Column("NumeroTelephone")]
    [StringLength(20)]
    [Unicode(false)]
    public string NumeroTelephone1 { get; set; } = null!;

    [InverseProperty("NumeroTelephone")]
    public virtual ICollection<Joueur> Joueurs { get; set; } = new List<Joueur>();
}
