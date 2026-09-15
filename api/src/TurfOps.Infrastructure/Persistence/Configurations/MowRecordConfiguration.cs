using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TurfOps.Domain.Entities;

namespace TurfOps.Infrastructure.Persistence.Configurations;

public class MowRecordConfiguration : IEntityTypeConfiguration<MowRecord>
{
    public void Configure(EntityTypeBuilder<MowRecord> builder)
    {
        builder.ToTable("MowRecords");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Notes).HasMaxLength(2000);
        builder.Property(x => x.PhotoUrl).HasMaxLength(1000);

        builder.HasIndex(x => x.Date);
        builder.HasIndex(x => x.LawnAreaId);
        builder.HasIndex(x => x.PersonId);
        builder.HasIndex(x => x.EquipmentId);
    }
}
