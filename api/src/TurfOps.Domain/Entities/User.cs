using TurfOps.Domain.Common;
using TurfOps.Domain.Enums;

namespace TurfOps.Domain.Entities;

public class User : AuditableEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Staff;
    public bool IsActive { get; set; } = true;

    // Refresh token support (simple single-active-token-per-user model for Phase 1).
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiresAt { get; set; }

    public ICollection<MowRecord> MowRecordsCreated { get; set; } = new List<MowRecord>();
}
