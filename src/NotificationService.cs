using PMO.Platform.Domain.Common.Entities;

namespace PMO.Platform.Domain.Entities;

public sealed class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<Project> ManagedProjects { get; set; } = new List<Project>();
    public ICollection<GateApproval> GateApprovals { get; set; } = new List<GateApproval>();
    public ICollection<EvidenceFile> UploadedEvidenceFiles { get; set; } = new List<EvidenceFile>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}

public sealed class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

public sealed class UserRole
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }

    public User User { get; set; } = null!;
    public Role Role { get; set; } = null!;
}
