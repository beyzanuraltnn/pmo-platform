using System.Globalization;
using Microsoft.EntityFrameworkCore;
using PMO.Platform.Application.Common.Interfaces;
using PMO.Platform.Application.Common.Interfaces.Services;
using PMO.Platform.Application.Raid;
using PMO.Platform.Domain.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Infrastructure.Services;

public sealed class RaidService(IApplicationDbContext dbContext) : IRaidService
{
    private static readonly CultureInfo TurkishCulture = new("tr-TR");

    public async Task<IReadOnlyList<RaidListItemDto>> GetProjectRaidItemsAsync(
        Guid projectId,
        GetRaidItemsQueryDto query,
        Guid userId,
        IReadOnlyList<string> roles,
        CancellationToken cancellationToken = default)
    {
        var itemsQuery = dbContext.RaidItems
            .AsNoTracking()
            .Where(x => x.ProjectId == projectId)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Type) && Enum.TryParse<RaidItemType>(query.Type, true, out var type))
        {
            itemsQuery = itemsQuery.Where(x => x.Type == type);
        }

        if (!string.IsNullOrWhiteSpace(query.Status) && Enum.TryParse<RaidStatus>(query.Status, true, out var status))
        {
            itemsQuery = itemsQuery.Where(x => x.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(query.Priority) && Enum.TryParse<RaidPriority>(query.Priority, true, out var priority))
        {
            itemsQuery = itemsQuery.Where(x => x.Priority == priority);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            itemsQuery = itemsQuery.Where(x =>
                x.Title.ToLower().Contains(search) ||
                x.Description.ToLower().Contains(search) ||
                x.Owner.ToLower().Contains(search));
        }

        var items = await itemsQuery
            .OrderByDescending(x => x.Priority)
            .ThenBy(x => x.DueDate)
            .ThenByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        return items.Select(MapListItem).ToList();
    }

    public async Task<RaidDetailDto?> GetRaidItemAsync(Guid id, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        var item = await dbContext.RaidItems
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        return item is null ? null : MapDetail(item, CanManage(roles));
    }

    public async Task<RaidDetailDto> CreateRaidItemAsync(Guid projectId, CreateRaidItemRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        EnsureCanManage(roles);

        var project = await dbContext.Projects
            .Include(x => x.ProjectManager)
            .SingleOrDefaultAsync(x => x.Id == projectId, cancellationToken)
            ?? throw new InvalidOperationException("Proje bulunamadı.");

        var item = new RaidItem
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId
        };

        ApplyValues(item, request);
        item.ResolvedDate = item.Status == RaidStatus.Closed ? DateTime.UtcNow : null;

        await dbContext.RaidItems.AddAsync(item, cancellationToken);
        await CreateNotificationsIfNeededAsync(item, project, userId, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return MapDetail(item, true);
    }

    public async Task<RaidDetailDto> UpdateRaidItemAsync(Guid id, UpdateRaidItemRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        EnsureCanManage(roles);

        var item = await dbContext.RaidItems
            .Include(x => x.Project)
                .ThenInclude(x => x.ProjectManager)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new InvalidOperationException("RAID kaydı bulunamadı.");

        ApplyValues(item, request);
        item.ResolvedDate = item.Status == RaidStatus.Closed ? item.ResolvedDate ?? DateTime.UtcNow : null;

        await CreateNotificationsIfNeededAsync(item, item.Project, userId, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return MapDetail(item, true);
    }

    public async Task<RaidDetailDto> CloseRaidItemAsync(Guid id, CloseRaidItemRequestDto? request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        EnsureCanManage(roles);

        var item = await dbContext.RaidItems
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new InvalidOperationException("RAID kaydı bulunamadı.");

        item.Status = RaidStatus.Closed;
        item.ResolvedDate = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(request?.Note))
        {
            item.Note = request.Note.Trim();
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return MapDetail(item, true);
    }

    public async Task<RaidSummaryDto> GetProjectRaidSummaryAsync(Guid projectId, CancellationToken cancellationToken = default)
    {
        var items = await dbContext.RaidItems
            .AsNoTracking()
            .Where(x => x.ProjectId == projectId)
            .ToListAsync(cancellationToken);

        var now = DateTime.UtcNow.Date;

        return new RaidSummaryDto
        {
            TotalCount = items.Count,
            OpenCount = items.Count(x => x.Status is RaidStatus.Open or RaidStatus.InProgress or RaidStatus.Blocked),
            CriticalRiskCount = items.Count(x => x.Type == RaidItemType.Risk && x.Priority == RaidPriority.Critical && x.Status != RaidStatus.Closed),
            OverdueCount = items.Count(x => x.DueDate.HasValue && x.DueDate.Value.Date < now && x.Status != RaidStatus.Closed),
            RiskCount = items.Count(x => x.Type == RaidItemType.Risk),
            IssueCount = items.Count(x => x.Type == RaidItemType.Issue),
            AssumptionCount = items.Count(x => x.Type == RaidItemType.Assumption),
            DependencyCount = items.Count(x => x.Type == RaidItemType.Dependency)
        };
    }

    private static void ApplyValues(RaidItem item, CreateRaidItemRequestDto request)
    {
        item.Type = Enum.Parse<RaidItemType>(request.Type, true);
        item.Title = request.Title.Trim();
        item.Description = request.Description.Trim();
        item.Status = Enum.Parse<RaidStatus>(request.Status, true);
        item.Priority = string.IsNullOrWhiteSpace(request.Priority) ? null : Enum.Parse<RaidPriority>(request.Priority, true);
        item.Impact = string.IsNullOrWhiteSpace(request.Impact) ? null : Enum.Parse<RaidImpact>(request.Impact, true);
        item.Owner = request.Owner.Trim();
        item.ActionPlan = request.ActionPlan.Trim();
        item.DueDate = request.DueDate;
        item.Note = request.Note.Trim();
    }

    private async Task CreateNotificationsIfNeededAsync(RaidItem item, Project project, Guid actorUserId, CancellationToken cancellationToken)
    {
        if (item.Type == RaidItemType.Risk && item.Priority == RaidPriority.Critical)
        {
            var adminIds = await dbContext.UserRoles
                .AsNoTracking()
                .Where(x => x.Role.Name == SystemRoles.PmoAdmin)
                .Select(x => x.UserId)
                .ToListAsync(cancellationToken);

            foreach (var adminId in adminIds)
            {
                await dbContext.Notifications.AddAsync(new Notification
                {
                    Id = Guid.NewGuid(),
                    RecipientUserId = adminId,
                    ProjectId = project.Id,
                    Title = "Kritik RAID Riski Oluşturuldu",
                    Content = $"{project.Name} projesinde kritik risk açıldı: {item.Title}",
                    Type = NotificationType.RaidAlert,
                    IsRead = false,
                    SentAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = actorUserId.ToString()
                }, cancellationToken);
            }
        }

        if (item.Type == RaidItemType.Issue &&
            item.DueDate.HasValue &&
            item.DueDate.Value.Date < DateTime.UtcNow.Date &&
            item.Status != RaidStatus.Closed)
        {
            await dbContext.Notifications.AddAsync(new Notification
            {
                Id = Guid.NewGuid(),
                RecipientUserId = project.ProjectManagerId,
                ProjectId = project.Id,
                Title = "Overdue RAID Issue",
                Content = $"{project.Name} projesinde geciken issue var: {item.Title}",
                Type = NotificationType.RaidAlert,
                IsRead = false,
                SentAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = actorUserId.ToString()
            }, cancellationToken);
        }
    }

    private static RaidListItemDto MapListItem(RaidItem item)
    {
        return new RaidListItemDto
        {
            Id = item.Id,
            Type = item.Type.ToString(),
            Title = item.Title,
            Status = item.Status.ToString(),
            Priority = item.Priority?.ToString(),
            Impact = item.Impact?.ToString(),
            Owner = item.Owner,
            DueDateText = FormatDueDate(item.DueDate, item.Status),
            Note = item.Note,
            BadgeTone = GetTypeTone(item.Type)
        };
    }

    private static RaidDetailDto MapDetail(RaidItem item, bool canManage)
    {
        return new RaidDetailDto
        {
            Id = item.Id,
            ProjectId = item.ProjectId,
            Type = item.Type.ToString(),
            Title = item.Title,
            Description = item.Description,
            Status = item.Status.ToString(),
            Priority = item.Priority?.ToString(),
            Impact = item.Impact?.ToString(),
            Owner = item.Owner,
            ActionPlan = item.ActionPlan,
            DueDate = item.DueDate,
            DueDateText = FormatDueDate(item.DueDate, item.Status),
            ResolvedDate = item.ResolvedDate,
            ResolvedDateText = item.ResolvedDate?.ToString("dd MMM yyyy", TurkishCulture),
            Note = item.Note,
            CanEdit = canManage,
            CanClose = canManage && item.Status != RaidStatus.Closed
        };
    }

    private static string GetTypeTone(RaidItemType type) => type switch
    {
        RaidItemType.Risk => "red",
        RaidItemType.Issue => "yellow",
        RaidItemType.Assumption => "blue",
        RaidItemType.Dependency => "purple",
        _ => "gray"
    };

    private static string FormatDueDate(DateTime? date, RaidStatus status)
    {
        if (!date.HasValue)
        {
            return "-";
        }

        var text = date.Value.ToString("dd MMM yyyy", TurkishCulture);
        if (date.Value.Date < DateTime.UtcNow.Date && status != RaidStatus.Closed)
        {
            return $"{text} (Gecikmiş)";
        }

        return text;
    }

    private static bool CanManage(IReadOnlyList<string> roles)
    {
        return roles.Contains(SystemRoles.PmoAdmin)
            || roles.Contains(SystemRoles.ProjectManager)
            || roles.Contains(SystemRoles.ProductManager)
            || roles.Contains(SystemRoles.TechLead);
    }

    private static void EnsureCanManage(IReadOnlyList<string> roles)
    {
        if (!CanManage(roles))
        {
            throw new UnauthorizedAccessException("Bu işlem için RAID yönetim yetkisi gerekir.");
        }
    }
}
