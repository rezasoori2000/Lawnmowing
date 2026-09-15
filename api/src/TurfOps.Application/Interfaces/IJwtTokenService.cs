using TurfOps.Domain.Entities;

namespace TurfOps.Application.Interfaces;

public record AccessTokenResult(string Token, DateTime ExpiresAt);

public interface IJwtTokenService
{
    AccessTokenResult GenerateAccessToken(User user);
    string GenerateRefreshToken();
}
