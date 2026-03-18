using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PMO.Platform.Domain.Common.Entities;
using PMO.Platform.Domain.Entities;

namespace PMO.Platform.Infrastructure.Persistence.Configurations;

internal abstract class BaseEntityConfiguration<TEntity> : IEntityTypeConfiguration<TEntity>
    where TEntity : BaseEntity
{
    public virtual void Configure(EntityTypeBuilder<TEntity> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CreatedAt).IsRequired();
        builder.Property(x => x.CreatedBy).HasMaxLength(256).IsRequired();
        builder.Property(x => x.UpdatedBy).HasMaxLength(256);
        builder.Property(x => x.IsDeleted).HasDefaultValue(false);
    }
}

internal sealed class UserConfiguration : BaseEntityConfiguration<User>
{
    public override void Configure(EntityTypeBuilder<User> builder)
    {
        base.Configure(builder);

        builder.ToTable("users");

        builder.Property(x => x.FirstName).HasMaxLength(100).IsRequired();
        builder.Property(x => x.LastName).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Email).HasMaxLength(256).IsRequired();
        builder.Property(x => x.PasswordHash).HasMaxLength(512).IsRequired();
        builder.Property(x => x.IsActive).HasDefaultValue(true);

        builder.HasIndex(x => x.Email).IsUnique();
    }
}

internal sealed class RoleConfiguration : BaseEntityConfiguration<Role>
{
    public override void Configure(EntityTypeBuilder<Role> builder)
    {
        base.Configure(builder);

        builder.ToTable("roles");

        builder.Property(x => x.Name).HasMaxLength(100).IsRequired();
        builder.Property(x => x.NormalizedName).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(250).IsRequired();

        builder.HasIndex(x => x.Name).IsUnique();
        builder.HasIndex(x => x.NormalizedName).IsUnique();
    }
}

internal sealed class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("user_roles");
        builder.HasKey(x => new { x.UserId, x.RoleId });

        builder.HasOne(x => x.User)
            .WithMany(x => x.UserRoles)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Role)
            .WithMany(x => x.UserRoles)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

internal sealed class ProjectConfiguration : BaseEntityConfiguration<Project>
{
    public override void Configure(EntityTypeBuilder<Project> builder)
    {
        base.Configure(builder);

        builder.ToTable("projects");

        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Code).HasMaxLength(50).IsRequired();
        builder.Property(x => x.Type).HasConversion<int>().IsRequired();
        builder.Property(x => x.Status).HasConversion<int>().IsRequired();
        builder.Property(x => x.Description).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.BusinessOwner).HasMaxLength(150).IsRequired();
        builder.Property(x => x.RagStatus).HasConversion<int>().IsRequired();
        builder.Property(x => x.Sponsor).HasMaxLength(150).IsRequired();
        builder.Property(x => x.Priority).HasConversion<int>().IsRequired();
        builder.Property(x => x.Stage).HasConversion<int>().IsRequired();
        builder.Property(x => x.Budget).HasColumnType("numeric(18,2)");
        builder.Property(x => x.Department).HasMaxLength(150).IsRequired();
        builder.Property(x => x.Notes).HasMaxLength(2000).IsRequired();

        builder.HasIndex(x => x.Code).IsUnique();

        builder.HasOne(x => x.ProjectManager)
            .WithMany(x => x.ManagedProjects)
            .HasForeignKey(x => x.ProjectManagerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class ProjectCharterConfiguration : BaseEntityConfiguration<ProjectCharter>
{
    public override void Configure(EntityTypeBuilder<ProjectCharter> builder)
    {
        base.Configure(builder);

        builder.ToTable("project_charters");

        builder.Property(x => x.Purpose).HasMaxLength(1000).IsRequired();
        builder.Property(x => x.Objectives).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.Scope).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.OutOfScope).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.SuccessCriteria).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.RisksAndAssumptions).HasMaxLength(4000).IsRequired();
        builder.Property(x => x.Dependencies).HasMaxLength(4000).IsRequired();
        builder.Property(x => x.Stakeholders).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.TimelineSummary).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.BudgetSummary).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.ApprovalNotes).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.Version).HasDefaultValue(1);

        builder.HasIndex(x => x.ProjectId).IsUnique();

        builder.HasOne(x => x.Project)
            .WithOne(x => x.Charter)
            .HasForeignKey<ProjectCharter>(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

internal sealed class GateConfiguration : BaseEntityConfiguration<Gate>
{
    public override void Configure(EntityTypeBuilder<Gate> builder)
    {
        base.Configure(builder);

        builder.ToTable("gates");

        builder.Property(x => x.Name).HasMaxLength(150).IsRequired();
        builder.Property(x => x.Status).HasConversion<int>().IsRequired();
        builder.Property(x => x.GateNo).IsRequired();
        builder.Property(x => x.OpenedAt).IsRequired();
        builder.Property(x => x.OpenDate).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.RequiredEvidenceCount).HasDefaultValue(0);
        builder.Property(x => x.CurrentStep).HasMaxLength(100);
        builder.Property(x => x.CurrentOwner).HasMaxLength(150);

        builder.HasIndex(x => new { x.ProjectId, x.GateNo }).IsUnique();

        builder.HasOne(x => x.Project)
            .WithMany(x => x.Gates)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

internal sealed class GateApprovalConfiguration : BaseEntityConfiguration<GateApproval>
{
    public override void Configure(EntityTypeBuilder<GateApproval> builder)
    {
        base.Configure(builder);

        builder.ToTable("gate_approvals");

        builder.Property(x => x.ApproverName).HasMaxLength(150).IsRequired();
        builder.Property(x => x.Role).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Status).HasConversion<int>().IsRequired();
        builder.Property(x => x.Note).HasMaxLength(1000);

        builder.HasOne(x => x.Gate)
            .WithMany(x => x.Approvals)
            .HasForeignKey(x => x.GateId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Approver)
            .WithMany(x => x.GateApprovals)
            .HasForeignKey(x => x.ApproverId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class EvidenceFileConfiguration : BaseEntityConfiguration<EvidenceFile>
{
    public override void Configure(EntityTypeBuilder<EvidenceFile> builder)
    {
        base.Configure(builder);

        builder.ToTable("evidence_files");

        builder.Property(x => x.FileName).HasMaxLength(255).IsRequired();
        builder.Property(x => x.OriginalFileName).HasMaxLength(255).IsRequired();
        builder.Property(x => x.FilePath).HasMaxLength(1000).IsRequired();
        builder.Property(x => x.ContentType).HasMaxLength(200).IsRequired();
        builder.Property(x => x.UploadedByName).HasMaxLength(150).IsRequired();
        builder.Property(x => x.UploadedAt).IsRequired();
        builder.Property(x => x.Category).HasConversion<int>().IsRequired();

        builder.HasOne(x => x.Gate)
            .WithMany(x => x.EvidenceFiles)
            .HasForeignKey(x => x.GateId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.GateApproval)
            .WithMany(x => x.EvidenceFiles)
            .HasForeignKey(x => x.GateApprovalId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.UploadedBy)
            .WithMany(x => x.UploadedEvidenceFiles)
            .HasForeignKey(x => x.UploadedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class NotificationConfiguration : BaseEntityConfiguration<Notification>
{
    public override void Configure(EntityTypeBuilder<Notification> builder)
    {
        base.Configure(builder);

        builder.ToTable("notifications");

        builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Content).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.Type).HasConversion<int>().IsRequired();
        builder.Property(x => x.IsRead).HasDefaultValue(false);
        builder.Property(x => x.SentAt).IsRequired();

        builder.HasOne(x => x.RecipientUser)
            .WithMany(x => x.Notifications)
            .HasForeignKey(x => x.RecipientUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Project)
            .WithMany(x => x.Notifications)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.Gate)
            .WithMany(x => x.Notifications)
            .HasForeignKey(x => x.GateId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

internal sealed class RaidItemConfiguration : BaseEntityConfiguration<RaidItem>
{
    public override void Configure(EntityTypeBuilder<RaidItem> builder)
    {
        base.Configure(builder);

        builder.ToTable("raid_items");

        builder.Property(x => x.Type).HasConversion<int>().IsRequired();
        builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.Status).HasConversion<int>().IsRequired();
        builder.Property(x => x.Priority).HasConversion<int>();
        builder.Property(x => x.Impact).HasConversion<int>();
        builder.Property(x => x.Owner).HasMaxLength(150).IsRequired();
        builder.Property(x => x.ActionPlan).HasMaxLength(2000).IsRequired();
        builder.Property(x => x.Note).HasMaxLength(1000).IsRequired();

        builder.HasOne(x => x.Project)
            .WithMany(x => x.RaidItems)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
