using FluentAssertions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using TurfOps.Application.Common;
using TurfOps.Application.DTOs;
using TurfOps.Application.Services;
using TurfOps.Domain.Enums;
using TurfOps.Infrastructure.Persistence;
using Xunit;

namespace TurfOps.Tests.Services;

/// <summary>
/// Exercises LawnAreaService against a real EF Core DbContext backed by an in-memory
/// SQLite database, so the test verifies actual query/save behaviour rather than a mock.
/// </summary>
public class LawnAreaServiceTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly TurfOpsDbContext _db;
    private readonly LawnAreaService _sut;

    public LawnAreaServiceTests()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<TurfOpsDbContext>()
            .UseSqlite(_connection)
            .Options;

        _db = new TurfOpsDbContext(options);
        _db.Database.EnsureCreated();

        _sut = new LawnAreaService(_db);
    }

    public void Dispose()
    {
        _db.Dispose();
        _connection.Dispose();
    }

    [Fact]
    public async Task CreateAsync_HappyPath_PersistsAndReturnsNewLawnArea()
    {
        var request = new CreateLawnAreaRequest
        {
            Name = "New Paddock",
            DefaultMowHeight = MowHeight.Mm30To35,
            DefaultFrequency = MowFrequency.Days14To21,
            Notes = "Test note"
        };

        var result = await _sut.CreateAsync(request);

        result.Id.Should().BeGreaterThan(0);
        result.Name.Should().Be("New Paddock");
        result.IsActive.Should().BeTrue();

        var fetched = await _sut.GetByIdAsync(result.Id);
        fetched.Name.Should().Be("New Paddock");
    }

    [Fact]
    public async Task GetByIdAsync_UnknownId_ThrowsNotFoundException()
    {
        var act = () => _sut.GetByIdAsync(999_999);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task DeactivateAsync_SetsIsActiveFalse_AndExcludedFromDefaultList()
    {
        var created = await _sut.CreateAsync(new CreateLawnAreaRequest
        {
            Name = "To Deactivate",
            DefaultMowHeight = MowHeight.Mm25To30,
            DefaultFrequency = MowFrequency.Days7To10
        });

        await _sut.DeactivateAsync(created.Id);

        var active = await _sut.GetAllAsync(includeInactive: false);
        active.Should().NotContain(x => x.Id == created.Id);

        var all = await _sut.GetAllAsync(includeInactive: true);
        all.Should().Contain(x => x.Id == created.Id && !x.IsActive);
    }
}
