namespace TurfOps.Infrastructure.Storage;

/// <summary>
/// Bound from the "PhotoStorage" configuration section. Phase 1 stores photos on local
/// disk; Phase 2 extension point is to add a blob-storage-backed IPhotoStorageService
/// implementation and swap it in DependencyInjection without touching callers.
/// </summary>
public class PhotoStorageOptions
{
    public const string SectionName = "PhotoStorage";

    /// <summary>Root folder (absolute or relative to the app's content root) that photos are saved under.</summary>
    public string RootPath { get; set; } = "App_Data/mow-photos";

    /// <summary>Public URL prefix the API serves saved photos from, e.g. "/media/mow-photos".</summary>
    public string PublicPathPrefix { get; set; } = "/media/mow-photos";
}
