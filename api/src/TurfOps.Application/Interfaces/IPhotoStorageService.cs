namespace TurfOps.Application.Interfaces;

/// <summary>
/// Saves mow-record photos to local disk under a configurable root path (Phase 1).
/// Phase 2 extension point: swap the implementation for blob storage without changing callers.
/// </summary>
public interface IPhotoStorageService
{
    Task<string> SaveAsync(int mowRecordId, Stream content, string fileName, CancellationToken cancellationToken = default);
}
