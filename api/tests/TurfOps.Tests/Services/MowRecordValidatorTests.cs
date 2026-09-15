using FluentAssertions;
using TurfOps.Application.DTOs;
using TurfOps.Application.Validators;
using TurfOps.Domain.Enums;
using Xunit;

namespace TurfOps.Tests.Services;

public class MowRecordValidatorTests
{
    private readonly CreateMowRecordRequestValidator _sut = new();

    [Fact]
    public void Validate_ValidRequest_Passes()
    {
        var request = new CreateMowRecordRequest
        {
            LawnAreaId = 1,
            PersonId = 1,
            EquipmentId = 1,
            Date = DateTime.UtcNow.Date,
            MowHeight = MowHeight.Mm35To40,
            Direction = Direction.N,
            Notes = "All good"
        };

        var result = _sut.Validate(request);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_MissingForeignKeys_Fails()
    {
        var request = new CreateMowRecordRequest
        {
            LawnAreaId = 0,
            PersonId = 0,
            EquipmentId = 0,
            Date = DateTime.UtcNow.Date,
            MowHeight = MowHeight.Mm35To40,
            Direction = Direction.N
        };

        var result = _sut.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateMowRecordRequest.LawnAreaId));
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateMowRecordRequest.PersonId));
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateMowRecordRequest.EquipmentId));
    }

    [Fact]
    public void Validate_FutureDateBeyondTolerance_Fails()
    {
        var request = new CreateMowRecordRequest
        {
            LawnAreaId = 1,
            PersonId = 1,
            EquipmentId = 1,
            Date = DateTime.UtcNow.Date.AddDays(5),
            MowHeight = MowHeight.Mm35To40,
            Direction = Direction.N
        };

        var result = _sut.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateMowRecordRequest.Date));
    }
}
