using FluentValidation;
using TurfOps.Application.DTOs;
using TurfOps.Domain.Enums;

namespace TurfOps.Application.Validators;

public class CreateLawnAreaRequestValidator : AbstractValidator<CreateLawnAreaRequest>
{
    public CreateLawnAreaRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.DefaultMowHeight).IsInEnum();
        RuleFor(x => x.DefaultFrequency).IsInEnum();
        RuleFor(x => x.CustomFrequencyDays)
            .NotNull().GreaterThan(0)
            .When(x => x.DefaultFrequency == MowFrequency.Custom)
            .WithMessage("CustomFrequencyDays is required and must be greater than 0 when DefaultFrequency is Custom.");
        RuleFor(x => x.Notes).MaximumLength(2000);
    }
}

public class UpdateLawnAreaRequestValidator : AbstractValidator<UpdateLawnAreaRequest>
{
    public UpdateLawnAreaRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.DefaultMowHeight).IsInEnum();
        RuleFor(x => x.DefaultFrequency).IsInEnum();
        RuleFor(x => x.CustomFrequencyDays)
            .NotNull().GreaterThan(0)
            .When(x => x.DefaultFrequency == MowFrequency.Custom)
            .WithMessage("CustomFrequencyDays is required and must be greater than 0 when DefaultFrequency is Custom.");
        RuleFor(x => x.Notes).MaximumLength(2000);
    }
}
