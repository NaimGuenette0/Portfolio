using System.ComponentModel.DataAnnotations.Schema;

namespace RaiditeServer.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public virtual Hub? Hub { get; set; }

        [InverseProperty("MainCommentOf")]
        [ForeignKey(nameof(Comment))]
        public virtual Comment? MainComment { get; set; } // Commentaire principal de l'auteur qui a créé le post

        [InverseProperty("SavedPosts")]
        public virtual List<User> SavedBy { get; set; } = new List<User>();
     }
}
