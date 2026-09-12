using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace projetWeb.Models;

[Table("Gardien", Schema = "Hockey")]
public partial class Gardien
{
    [Key]
    [Column("GardienID")]
    public int GardienId { get; set; }

    public int? ButsAccordes { get; set; }

    public int? Blanchissages { get; set; }

    [ForeignKey("GardienId")]
    [InverseProperty("Gardien")]
    public virtual Joueur GardienNavigation { get; set; } = null!;
}
