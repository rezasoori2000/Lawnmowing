using Microsoft.EntityFrameworkCore;
using TurfOps.Application.Interfaces;
using TurfOps.Domain.Entities;
using TurfOps.Infrastructure.Seed;

namespace TurfOps.Infrastructure.Persistence;

public class TurfOpsDbContext : DbContext, IAppDbContext
{
    public TurfOpsDbContext(DbContextOptions<TurfOpsDbContext> options) : base(options) { }

    public DbSet<LawnArea> LawnAreas => Set<LawnArea>();
    public DbSet<Person> People => Set<Person>();
    public DbSet<Equipment> Equipment => Set<Equipment>();
    public DbSet<MowRecord> MowRecords => Set<MowRecord>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TurfOpsDbContext).Assembly);

        SeedData.Apply(modelBuilder);

        base.OnModelCreating(modelBuilder);
    }
}
