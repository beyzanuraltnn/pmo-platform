namespace PMO.Platform.Infrastructure.Common.Interfaces;

public interface ICurrentUserService
{
    string GetCurrentUserIdentifier();
    Guid? GetCurrentUserId();
}
