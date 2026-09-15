using Microsoft.Extensions.Options;
using TurfOps.Application.Interfaces;

namespace TurfOps.Infrastructure.Storage;

public class LocalDiskPhotoStorageService : IPhotoStorageService
{
    private readonly PhotoStorageOptions _options;

    public LocalDiskPhotoStorageService(IOptions<PhotoStorageOptions> options)
    {
        _options = options.Value;
    }

    public async Task<string> SaveAsync(int mowRecordId, Stream content, string fileName, CancellationToken cancellationToken = default)
    {
        var rootPath = Path.IsPathRooted(_options.RootPath)
            ? _options.RootPath
            : Path.Combine(AppContext.BaseDirectory, _options.RootPath);

        Directory.CreateDirectory(rootPath);

        var safeExtension = Path.GetExtension(fileName);
        if (string.IsNullOrWhiteSpace(safeExtension) || safeExtension.Length > 10)
            safeExtension = ".jpg";

        var storedFileName = $"mow-{mowRecordId}-{Guid.NewGuid():N}{safeExtension}";
        var fullPath = Path.Combine(rootPath, storedFileName);

        await using (var fileStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
        {
            await content.CopyToAsync(fileStream, cancellationToken);
        }

        return $"{_options.PublicPathPrefix.TrimEnd('/')}/{storedFileName}";
    }
}
