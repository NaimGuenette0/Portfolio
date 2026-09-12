using RaiditeServer.Models;

namespace RaiditeServer.DTOs
{
    public class HubDisplayDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool? IsJoined { get; set; }
        public string? MimeType { get; set; }
        public string? FileName { get; set; }
        public HubDisplayDTO(Hub h, User? user)
        {
            Id = h.Id;
            Name = h.Name;
            IsJoined = user != null && h.Users.Contains(user);
            MimeType = h.MimeType;
            FileName = h.FileName;
        }
    }
}
