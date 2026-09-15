using FluentAssertions;
using TurfOps.Application.Interfaces;
using TurfOps.Application.Services;
using TurfOps.Domain.Entities;
using TurfOps.Domain.Enums;
using Xunit;

namespace TurfOps.Tests.Services;

public class DueStatusCalculatorTests
{
    private readonly DueStatusCalculator _sut = new();

    private static LawnArea MakeLawnArea(MowFrequency frequency, int? customDays = null) => new()
    {
        Id = 1,
        Name = "Test Area",
        DefaultMowHeight = MowHeight.Mm35To40,
        DefaultFrequency = frequency,
        CustomFrequencyDays = customDays
    };

    [Theory]
    [InlineData(MowFrequency.Days7To10, 10)]
    [InlineData(MowFrequency.Days10To14, 14)]
    [InlineData(MowFrequency.Days14To21, 21)]
    [InlineData(MowFrequency.Days21To25, 25)]
    public void GetFrequencyDays_ReturnsUpperBoundOfBand(MowFrequency frequency, int expectedDays)
    {
        var lawnArea = MakeLawnArea(frequency);
        _sut.GetFrequencyDays(lawnArea).Should().Be(expectedDays);
    }

    [Fact]
    public void GetFrequencyDays_Custom_ReturnsCustomFrequencyDays()
    {
        var lawnArea = MakeLawnArea(MowFrequency.Custom, customDays: 33);
        _sut.GetFrequencyDays(lawnArea).Should().Be(33);
    }

    [Fact]
    public void Calculate_NeverMowed_ReturnsNoHistoryBucket()
    {
        var lawnArea = MakeLawnArea(MowFrequency.Days10To14);
        var asOf = new DateTime(2026, 6, 1);

        var result = _sut.Calculate(lawnArea, lastMowedDate: null, asOf);

        result.Bucket.Should().Be(DueBucket.NoHistory);
        result.LastMowedDate.Should().BeNull();
        result.DueDate.Should().BeNull();
    }

    [Fact]
    public void Calculate_WithinFrequencyWindow_ReturnsUpToDate()
    {
        // 14-day band; mowed 3 days ago -> due date is 11 days from now -> UpToDate (not within the 7-day warning window)
        var lawnArea = MakeLawnArea(MowFrequency.Days10To14);
        var asOf = new DateTime(2026, 6, 15);
        var lastMowed = asOf.AddDays(-3);

        var result = _sut.Calculate(lawnArea, lastMowed, asOf);

        result.Bucket.Should().Be(DueBucket.UpToDate);
        result.DaysUntilDue.Should().Be(11);
    }

    [Fact]
    public void Calculate_DueWithinSevenDays_ReturnsDueThisWeek()
    {
        // 14-day band; mowed 10 days ago -> due in 4 days -> DueThisWeek
        var lawnArea = MakeLawnArea(MowFrequency.Days10To14);
        var asOf = new DateTime(2026, 6, 15);
        var lastMowed = asOf.AddDays(-10);

        var result = _sut.Calculate(lawnArea, lastMowed, asOf);

        result.Bucket.Should().Be(DueBucket.DueThisWeek);
        result.DaysUntilDue.Should().Be(4);
    }

    [Fact]
    public void Calculate_DueExactlyToday_ReturnsDueToday()
    {
        var lawnArea = MakeLawnArea(MowFrequency.Days10To14);
        var asOf = new DateTime(2026, 6, 15);
        var lastMowed = asOf.AddDays(-14);

        var result = _sut.Calculate(lawnArea, lastMowed, asOf);

        result.Bucket.Should().Be(DueBucket.DueToday);
        result.DaysUntilDue.Should().Be(0);
    }

    [Fact]
    public void Calculate_PastDueDate_ReturnsOverdueWithDaysOverdue()
    {
        var lawnArea = MakeLawnArea(MowFrequency.Days10To14);
        var asOf = new DateTime(2026, 6, 15);
        var lastMowed = asOf.AddDays(-20); // due date was 6 days ago (14-day band)

        var result = _sut.Calculate(lawnArea, lastMowed, asOf);

        result.Bucket.Should().Be(DueBucket.Overdue);
        result.DaysOverdue.Should().Be(6);
    }

    [Fact]
    public void Calculate_CustomFrequency_UsesCustomDays()
    {
        var lawnArea = MakeLawnArea(MowFrequency.Custom, customDays: 5);
        var asOf = new DateTime(2026, 6, 15);
        var lastMowed = asOf.AddDays(-6); // overdue by 1 day under a 5-day custom frequency

        var result = _sut.Calculate(lawnArea, lastMowed, asOf);

        result.Bucket.Should().Be(DueBucket.Overdue);
        result.DaysOverdue.Should().Be(1);
    }
}
