namespace TurfOps.Infrastructure.Security;

/// <summary>
/// Bound from the "Jwt" configuration section. In Production, SigningKey should come from
/// an environment variable or secrets manager - see README - never committed to source control.
/// </summary>
public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string SigningKey { get; set; } = string.Empty;
    public string Issuer { get; set; } = "TurfOps";
    public string Audience { get; set; } = "TurfOpsClients";
    public int AccessTokenMinutes { get; set; } = 60;
}
