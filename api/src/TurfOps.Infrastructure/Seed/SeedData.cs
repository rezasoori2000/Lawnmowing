using Microsoft.EntityFrameworkCore;
using TurfOps.Domain.Entities;
using TurfOps.Domain.Enums;

namespace TurfOps.Infrastructure.Seed;

/// <summary>
/// Static EF Core seed data (HasData), applied via migrations. All CreatedAt values are
/// fixed (not DateTime.UtcNow) so the generated migration is stable across builds.
///
/// Dev-only admin login seeded here: admin@turfops.local / TurfAdmin#2026
/// (BCrypt hash below corresponds to that password - see README for details.)
/// </summary>
public static class SeedData
{
    private static readonly DateTime SeedDate = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    // BCrypt hash for dev password "TurfAdmin#2026" - precomputed so the migration is deterministic.
    private const string AdminPasswordHash = "$2a$11$7csfOE/DBtia89Lb3f7ZWe78w4RTUkffeDgVgtD2Va1MuM.LZa8/W";

    public static void Apply(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>().HasData(
            new Person { Id = 1, Name = "Hamish", IsActive = true, CreatedAt = SeedDate },
            new Person { Id = 2, Name = "Steve", IsActive = true, CreatedAt = SeedDate },
            new Person { Id = 3, Name = "Tony", IsActive = true, CreatedAt = SeedDate },
            new Person { Id = 4, Name = "Kane", IsActive = true, CreatedAt = SeedDate },
            new Person { Id = 5, Name = "Noah", IsActive = true, CreatedAt = SeedDate },
            new Person { Id = 6, Name = "Grant", IsActive = true, CreatedAt = SeedDate },
            new Person { Id = 7, Name = "Glen", IsActive = true, CreatedAt = SeedDate }
        );

        modelBuilder.Entity<Equipment>().HasData(
            new Equipment { Id = 1, Name = "JD 9009a", IsActive = true, CreatedAt = SeedDate },
            new Equipment { Id = 2, Name = "JD 1585", IsActive = true, CreatedAt = SeedDate },
            new Equipment { Id = 3, Name = "JD 997", IsActive = true, CreatedAt = SeedDate },
            new Equipment { Id = 4, Name = "Trimax Pegasus", IsActive = true, CreatedAt = SeedDate },
            new Equipment { Id = 5, Name = "Trimax Snake", IsActive = true, CreatedAt = SeedDate },
            new Equipment { Id = 6, Name = "Walker", IsActive = true, CreatedAt = SeedDate },
            new Equipment { Id = 7, Name = "Toro Pro Stripe", IsActive = true, CreatedAt = SeedDate },
            new Equipment { Id = 8, Name = "Push mower", IsActive = true, CreatedAt = SeedDate },
            new Equipment { Id = 9, Name = "JD 300r", IsActive = true, CreatedAt = SeedDate },
            new Equipment { Id = 10, Name = "JD 1580", IsActive = true, CreatedAt = SeedDate },
            new Equipment { Id = 11, Name = "Club Cadet", IsActive = true, CreatedAt = SeedDate }
        );

        modelBuilder.Entity<LawnArea>().HasData(
            new LawnArea { Id = 1, Name = "Deer shed", DefaultMowHeight = MowHeight.Mm35To40, DefaultFrequency = MowFrequency.Days10To14, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 2, Name = "Tractor compound", DefaultMowHeight = MowHeight.Mm35To40, DefaultFrequency = MowFrequency.Days10To14, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 3, Name = "Lucerne edge", DefaultMowHeight = MowHeight.Mm40To45, DefaultFrequency = MowFrequency.Days14To21, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 4, Name = "Lower Lucerne tracks / Hauiti", DefaultMowHeight = MowHeight.Mm40To45, DefaultFrequency = MowFrequency.Days14To21, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 5, Name = "Farm track entrance (turf farm)", DefaultMowHeight = MowHeight.Mm30To35, DefaultFrequency = MowFrequency.Days7To10, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 6, Name = "Farm tracks", DefaultMowHeight = MowHeight.Mm40To45, DefaultFrequency = MowFrequency.Days14To21, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 7, Name = "Totara Grove entrance", DefaultMowHeight = MowHeight.Mm30To35, DefaultFrequency = MowFrequency.Days7To10, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 8, Name = "Totara / Hanger", DefaultMowHeight = MowHeight.Mm35To40, DefaultFrequency = MowFrequency.Days10To14, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 9, Name = "Totara / amply theatre", DefaultMowHeight = MowHeight.Mm35To40, DefaultFrequency = MowFrequency.Days10To14, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 10, Name = "Farm track to rd gates", DefaultMowHeight = MowHeight.Mm40To45, DefaultFrequency = MowFrequency.Days14To21, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 11, Name = "Amp to top of totara x2", DefaultMowHeight = MowHeight.Mm40To45, DefaultFrequency = MowFrequency.Days14To21, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 12, Name = "Storage shed", DefaultMowHeight = MowHeight.Mm35To40, DefaultFrequency = MowFrequency.Days10To14, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 13, Name = "Lower trees", DefaultMowHeight = MowHeight.Mm45To50, DefaultFrequency = MowFrequency.Days21To25, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 14, Name = "Stables Takapoto south", DefaultMowHeight = MowHeight.Mm35To40, DefaultFrequency = MowFrequency.Days10To14, IsActive = true, CreatedAt = SeedDate },
            new LawnArea { Id = 15, Name = "Old arena", DefaultMowHeight = MowHeight.Mm45To50, DefaultFrequency = MowFrequency.Days21To25, IsActive = true, CreatedAt = SeedDate }
        );

        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Email = "admin@turfops.local",
                PasswordHash = AdminPasswordHash,
                DisplayName = "Admin",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = SeedDate
            }
        );
    }
}
