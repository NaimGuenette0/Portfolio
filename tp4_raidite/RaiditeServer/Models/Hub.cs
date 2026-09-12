using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace RaiditeServer.Models
{
    public class Hub
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        [JsonIgnore]
        public virtual List<Post> Posts { get; set; } = new List<Post>();

        [JsonIgnore]
        [InverseProperty("Hubs")]
        public virtual List<User> Users { get; set; } = new List<User>();

        [JsonIgnore]
        [InverseProperty("CreatedHubs")]
        public virtual User Creator { get; set; } = null!;
        public string? FileName { get; set; } = null!;
        public string? MimeType { get; set; } = null!;
    }
}
