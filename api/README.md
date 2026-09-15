# TurfOps API

Backend REST API for TurfOps, a turf/lawn maintenance management system. Built with
ASP.NET Core 9 (Web API), EF Core 9, and SQL Server (LocalDB by default for local dev).

The React Native mobile client (`../mobile`) consumes this API over REST with JWT bearer auth.

## Solution structure

```
api/
  TurfOps.sln
  src/
    TurfOps.Domain/          Entities, enums - no dependencies on anything else
    TurfOps.Application/     DTOs, service interfaces + implementations, FluentValidation validators,
                              due/overdue calculation logic. Depends only on Domain (+ EF Core abstractions
                              for the IAppDbContext interface - no SQL Server dependency here).
    TurfOps.Infrastructure/  EF Core DbContext, entity configurations, migrations, seed data,
                              JWT/BCrypt/local-disk-photo-storage implementations. Depends on
                              Application + Domain.
    TurfOps.Api/              Controllers, Program.cs, appsettings, Swagger/JWT/CORS wiring,
                              global exception handling middleware. Depends on all three above.
  tests/
    TurfOps.Tests/            xUnit tests: due/overdue calculator, LawnAreaService (happy path +
                              not-found) against a real EF Core DbContext backed by in-memory SQLite,
                              and FluentValidation validator tests (happy path + failure).
  database/
    schema.sql                Generated via `dotnet ef migrations script --idempotent` for DBA review.
                              This is NOT the source of truth - EF Core migrations are. Regenerate
                              this file whenever you add a migration (see below).
```

Controllers never touch EF Core directly - they call into `Application` service interfaces
(`ILawnAreaService`, `IMowRecordService`, etc.), which use `IAppDbContext` (an abstraction
implemented by `TurfOpsDbContext`). This keeps `Application` testable without a SQL Server
dependency and keeps the layering boundary real, not just cosmetic.

## Prerequisites

- .NET 9 SDK (`dotnet --version` should report `9.0.x`)
- SQL Server LocalDB (ships with SQL Server Express/Developer or Visual Studio; this machine
  already has `MSSQLLocalDB` available - confirm with `sqllocaldb info`)
- The `dotnet-ef` global tool (`dotnet tool install -g dotnet-ef`, or update with
  `dotnet tool update -g dotnet-ef`) - used to create/apply migrations

## Local database setup

The default connection string (`appsettings.json`) points at LocalDB:

```
Server=(localdb)\mssqllocaldb;Database=TurfOpsDb;Trusted_Connection=True;TrustServerCertificate=True;
```

This requires no separate SQL Server install - LocalDB is a lightweight, user-instance SQL Server
that ships with SSMS/VS tooling. If you'd rather point at a full SQL Server instance (Express,
Developer, or a container), just change `ConnectionStrings:DefaultConnection` in
`appsettings.Development.json` (create it if needed) or via the `ConnectionStrings__DefaultConnection`
environment variable.

### Apply migrations

From `api/src/TurfOps.Api`:

```
dotnet ef database update --project ../TurfOps.Infrastructure/TurfOps.Infrastructure.csproj --startup-project TurfOps.Api.csproj
```

This creates the `TurfOpsDb` database (if it doesn't exist) and applies all migrations, including
seed data (People, Equipment, LawnAreas, and one Admin user - see credentials below).

**Note:** in Development, `Program.cs` also calls `db.Database.Migrate()` automatically on startup,
so running `dotnet run` the first time will create/update the database for you even if you skip the
step above. Production should NOT rely on this - run `dotnet ef database update` as an explicit,
auditable release/deploy step instead (the automatic-migrate call is gated to `IsDevelopment()`).

### Regenerating the DBA-review SQL script

After adding a new migration:

```
dotnet ef migrations script --project ../TurfOps.Infrastructure/TurfOps.Infrastructure.csproj --startup-project TurfOps.Api.csproj -o ../../database/schema.sql --idempotent
```

## Running the API

From `api/src/TurfOps.Api`:

```
dotnet run
```

By default (see `Properties/launchSettings.json`) this listens on `http://localhost:5123` (and an
HTTPS profile) in the `Development` environment. Swagger UI is available at
`http://localhost:5123/swagger` when running in Development.

## Authentication

- `POST /api/v1/auth/login` - email + password -> `{ accessToken, refreshToken, accessTokenExpiresAt, user }`
- `POST /api/v1/auth/refresh` - exchange a refresh token for a new token pair
- `POST /api/v1/auth/register` - Admin-only, creates a new staff/admin login

All other endpoints require `Authorization: Bearer <accessToken>`. All authenticated users
(Staff or Admin) can read all data (shared visibility across the team). Admin role is required
to manage lookups (LawnAreas/People/Equipment create/update/deactivate) and to register new users.

### Seeded dev-only admin login

```
Email:    admin@turfops.local
Password: TurfAdmin#2026
```

This is a development convenience seeded via EF Core migrations (`SeedData.cs`) - rotate or
remove it before any real deployment.

### Using Swagger UI with JWT

1. Run the API, open `http://localhost:5123/swagger`.
2. Call `POST /api/v1/auth/login` with the seeded admin credentials above, copy the `accessToken`.
3. Click **Authorize** (top right), enter `Bearer <accessToken>`, click Authorize.
4. All other endpoints in the UI will now send that token automatically.

## Configuration & secrets

- `appsettings.json` - shared defaults (LocalDB connection string, JWT issuer/audience, photo
  storage path). `Jwt:SigningKey` is intentionally blank here.
- `appsettings.Development.json` - a dev-only JWT signing key is provided so `dotnet run` works
  out of the box locally. Fine for local dev; not a real secret.
- `appsettings.Production.json` - connection string and signing key are blank placeholders.
  **Production must supply these via environment variables** (`ConnectionStrings__DefaultConnection`,
  `Jwt__SigningKey`) or a secrets manager (Azure Key Vault, AWS Secrets Manager, etc.) - never commit
  real production secrets to source control. `Cors:AllowedOrigins` must also be set to the real
  production origin(s) the mobile app is served/proxied from.

## Photo uploads

`POST /api/v1/mow-records/{id}/photo` accepts `multipart/form-data` with a `file` field (jpg, jpeg,
png, heic, webp; 10MB limit) and saves it to local disk under `PhotoStorage:RootPath`
(default `App_Data/mow-photos`, relative to the app's base directory), serving it back at
`PhotoStorage:PublicPathPrefix` (default `/media/mow-photos`). This is a Phase 1 placeholder -
the `IPhotoStorageService` interface is the extension point for swapping in blob storage
(Azure Blob Storage, S3, etc.) later without touching controllers or services.

## How the mobile app should point at this API

- Base URL (local dev): `http://localhost:5123/api/v1` (or your machine's LAN IP instead of
  `localhost` if testing from a physical device/emulator, e.g. `http://192.168.x.x:5123/api/v1`;
  Android emulators typically use `http://10.0.2.2:5123/api/v1`).
- Auth: obtain `accessToken`/`refreshToken` from `POST /auth/login`, send
  `Authorization: Bearer <accessToken>` on every subsequent request, and call `POST /auth/refresh`
  when the access token expires (`accessTokenExpiresAt` in the login/refresh response).
- CORS in Development is permissive (any origin) specifically so the Expo/Metro dev server and
  device/emulator combinations "just work" without CORS configuration churn. Production CORS is
  restricted to `Cors:AllowedOrigins` - update this once the mobile app's production API host is known.

## Key endpoints (all under `/api/v1`)

- `auth/login`, `auth/refresh`, `auth/register` (Admin-only)
- `lawn-areas` (GET list/get; POST/PUT/DELETE Admin-only - DELETE soft-deletes via IsActive)
- `people`, `equipment` (same CRUD shape as lawn-areas)
- `mow-records` (GET list with filters: `lawnAreaId`, `personId`, `equipmentId`, `dateFrom`,
  `dateTo`, `mowHeight`, `notes`, plus `page`/`pageSize`; GET by id; POST/PUT/DELETE for any
  authenticated staff member; `POST mow-records/{id}/photo` for photo upload)
- `dashboard` (GET - overdue / due-today / due-this-week lawn areas + recently-mowed records)
- `reports/mows-per-lawn-area`, `reports/mows-per-person`, `reports/mows-per-equipment`
  (all accept optional `dateFrom`/`dateTo`)

## Running tests

```
dotnet test
```

Covers:
- `DueStatusCalculatorTests` - the overdue/due-today/due-this-week/up-to-date calculation logic,
  including the Custom frequency band, using fixed "as of" dates for determinism.
- `LawnAreaServiceTests` - happy-path create, not-found, and deactivate/soft-delete behaviour
  against a real `TurfOpsDbContext` backed by an in-memory SQLite database (not a mock - this
  exercises real EF Core query/save behaviour).
- `MowRecordValidatorTests` - FluentValidation happy-path pass and two failure cases (missing
  foreign keys, date too far in the future).

## Verification performed

- `dotnet build` - succeeds, 0 errors/warnings.
- `dotnet ef database update` against local `MSSQLLocalDB` - succeeded; confirmed via `sqlcmd`
  that `People` (7 rows), `Equipment` (11 rows), `LawnAreas` (15 rows), and `Users` (1 admin row)
  were seeded correctly.
- `dotnet test` - 17/17 tests passed.
- `dotnet run` + `curl` end-to-end: `POST /auth/login` with the seeded admin returned a valid JWT;
  `GET /lawn-areas` and `GET /dashboard` with that JWT returned real seeded data; `POST /mow-records`
  created a mow record with correctly-joined LawnArea/Person/Equipment/User names; an invalid
  `POST /mow-records` (zeroed foreign keys) correctly returned `400`; `DELETE /mow-records/{id}`
  correctly returned `204`.

## Notable decisions / deviations from the brief

- Used a lightweight custom JWT + BCrypt implementation rather than full ASP.NET Core Identity -
  Identity's user/role/claim machinery is heavier than this app needs (a handful of staff logins,
  two roles), and the brief explicitly allowed either approach "your call, keep it standard."
- `IAppDbContext` is a thin abstraction (DbSet + SaveChanges) rather than a repository-per-aggregate
  pattern. For an app this size, a full repository layer on top of EF Core (which is already a
  unit-of-work/repository abstraction) would add indirection without adding testability - the
  in-memory-SQLite tests prove the Application layer is independently testable as-is.
  Controllers still never reference EF Core types directly.
- Mow-height and frequency bands are modeled as enums with the band's *upper bound* used for the
  due-date calculation (e.g. "10-14 days" -> due 14 days after the last mow) - this is the more
  conservative choice (flags things as due/overdue sooner rather than later), and is isolated to
  `DueStatusCalculator.GetFrequencyDays` if the farm wants a different convention later.
- `dotnet-ef` 10.0.7 (already installed globally on this machine) was used instead of pinning to
  9.x - it targets the same EF Core 9 packages referenced by the projects and worked without issue.
