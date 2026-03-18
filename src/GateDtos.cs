using Microsoft.EntityFrameworkCore;
using PMO.Platform.Domain.Entities;

namespace PMO.Platform.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<Project> Projects { get; }
    DbSet<ProjectCharter> ProjectCharters { get; }
    DbSet<Gate> Gates { get; }
    DbSet<GateApproval> GateApprovals { get; }
    DbSet<EvidenceFile> EvidenceFiles { get; }
    DbSet<RaidItem> RaidItems { get; }
    DbSet<Notification> Notifications { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
