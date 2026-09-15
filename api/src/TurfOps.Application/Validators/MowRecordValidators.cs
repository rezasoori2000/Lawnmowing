using FluentValidation;
using TurfOps.Application.DTOs;

namespace TurfOps.Application.Validators;

public class CreateMowRecordRequestValidator : AbstractValidator<CreateMowRecordRequest>
{
    public CreateMowRecordRequestValidator()
    {
        RuleFor(x => x.LawnAreaId).GreaterThan(0);
        RuleFor(x => x.PersonId).GreaterThan(0);
        RuleFor(x => x.EquipmentId).GreaterThan(0);
        RuleFor(x => x.Date).NotEmpty().LessThanOrEqualTo(DateTime.UtcNow.Date.AddDays(1));
        RuleFor(x => x.MowHeight).IsInEnum();
        RuleFor(x => x.Direction).IsInEnum();
        RuleFor(x => x.Notes).MaximumLength(2000);
    }
}

public class UpdateMowRecordRequestValidator : AbstractValidator<UpdateMowRecordRequest>
{
    public UpdateMowRecordRequestValidator()
    {
        RuleFor(x => x.LawnAreaId).GreaterThan(0);
        RuleFor(x => x.PersonId).GreaterThan(0);
        RuleFor(x => x.EquipmentId).GreaterThan(0);
        RuleFor(x => x.Date).NotEmpty().LessThanOrEqualTo(DateTime.UtcNow.Date.AddDays(1));
        RuleFor(x => x.MowHeight).IsInEnum();
        RuleFor(x => x.Direction).IsInEnum();
        RuleFor(x => x.Notes).MaximumLength(2000);
    }
}
