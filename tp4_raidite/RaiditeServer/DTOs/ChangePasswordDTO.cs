namespace RaiditeServer.DTOs
{
    public class ChangePasswordDTO
    {
        public string OldPass { get; set; } = null!;
        public string NewPass { get; set; } = null!;

        public string ConNewPass { get; set; } = null!;
    }
}
