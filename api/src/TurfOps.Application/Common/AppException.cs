namespace TurfOps.Application.Common;

/// <summary>Base for expected application-level failures translated into ProblemDetails by middleware.</summary>
public abstract class AppException : Exception
{
    protected AppException(string message) : base(message) { }
}

public class NotFoundException : AppException
{
    public NotFoundException(string entity, object key) : base($"{entity} with id '{key}' was not found.") { }
}

public class ValidationAppException : AppException
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationAppException(IDictionary<string, string[]> errors) : base("Validation failed.")
    {
        Errors = errors;
    }
}

public class ConflictException : AppException
{
    public ConflictException(string message) : base(message) { }
}

public class UnauthorizedAppException : AppException
{
    public UnauthorizedAppException(string message) : base(message) { }
}
