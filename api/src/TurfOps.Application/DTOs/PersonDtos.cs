namespace TurfOps.Application.DTOs;

public class PersonDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePersonRequest
{
    public string Name { get; set; } = string.Empty;
}

public class UpdatePersonRequest
{
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
