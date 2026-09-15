using System.Security.Claims;

namespace TurfOps.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("User has no NameIdentifier claim.");
        return int.Parse(value);
    }
}
