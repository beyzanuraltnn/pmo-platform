using Microsoft.EntityFrameworkCore;
using PMO.Platform.Application.Common.Interfaces;
using PMO.Platform.Application.Common.Interfaces.Services;
using PMO.Platform.Application.Notifications;

namespace PMO.Platform.Infrastructure.Services;

public sealed class NotificationService(IApplicationDbContext dbContext) : INotificationService
{
    public async Task<IReadOnlyList<NotificationItemDto>> GetNotificationsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Notifications
            .AsNoTracking()
            .Where(x => x.RecipientUserId == userId)
            .OrderByDescending(x => x.SentAt)
            .Select(x => new NotificationItemDto
            {
                Id = x.Id,
                Title = x.Title,
                Body = x.Content,
                Time = FormatRelativeTime(x.SentAt),
                Unread = !x.IsRead
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> MarkAsReadAsync(Guid notificationId, Guid userId, CancellationToken cancellationToken = default)
    {
        var notification = await dbContext.Notifications
            .SingleOrDefaultAsync(x => x.Id == notificationId && x.RecipientUserId == userId, cancellationToken);

        if (notification is null)
        {
            return false;
        }

        notification.IsRead = true;
        notification.UpdatedAt = DateTime.UtcNow;
        notification.UpdatedBy = userId.ToString();
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<int> MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var notifications = await dbContext.Notifications
            .Where(x => x.RecipientUserId == userId && !x.IsRead)
            .ToListAsync(cancellationToken);

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.UpdatedAt = DateTime.UtcNow;
            notification.UpdatedBy = userId.ToString();
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return notifications.Count;
    }

    private static string FormatRelativeTime(DateTime sentAt)
    {
        var span = DateTime.UtcNow - sentAt;

        if (span.TotalMinutes < 60)
        {
            return $"{Math.Max(1, (int)span.TotalMinutes)} dk önce";
        }

        if (span.TotalHours < 24)
        {
            return $"{(int)span.TotalHours} saat önce";
        }

        return $"{(int)span.TotalDays} gün önce";
    }
}
