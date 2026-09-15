using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TurfOps.Domain.Entities;

namespace TurfOps.Infrastructure.Persistence.Configurations;

public class LawnAreaConfiguration : IEntityTypeConfiguration<LawnArea>
{
    public void Configure(EntityTypeBuilder<LawnArea> builder)
    {
        builder.ToTable("LawnAreas");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Notes).HasMaxLength(2000);
        builder.HasIndex(x => x.Name).IsUnique();

        builder.HasMany(x => x.MowRecords)
            .WithOne(x => x.LawnArea)
            .HasForeignKey(x => x.LawnAreaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
