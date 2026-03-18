using PMO.Platform.Application.Notifications;

namespace PMO.Platform.Application.Common.Interfaces.Services;

public interface INotificationService
{
    Task<IReadOnlyList<NotificationItemDto>> GetNotificationsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<bool> MarkAsReadAsync(Guid notificationId, Guid userId, CancellationToken cancellationToken = default);
    Task<int> MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default);
}
