IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE TABLE [Equipment] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(200) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Equipment] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE TABLE [LawnAreas] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(200) NOT NULL,
        [DefaultMowHeight] int NOT NULL,
        [DefaultFrequency] int NOT NULL,
        [CustomFrequencyDays] int NULL,
        [Notes] nvarchar(2000) NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_LawnAreas] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE TABLE [People] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(200) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_People] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE TABLE [Users] (
        [Id] int NOT NULL IDENTITY,
        [Email] nvarchar(320) NOT NULL,
        [PasswordHash] nvarchar(max) NOT NULL,
        [DisplayName] nvarchar(200) NOT NULL,
        [Role] int NOT NULL,
        [IsActive] bit NOT NULL,
        [RefreshToken] nvarchar(max) NULL,
        [RefreshTokenExpiresAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE TABLE [MowRecords] (
        [Id] int NOT NULL IDENTITY,
        [LawnAreaId] int NOT NULL,
        [Date] datetime2 NOT NULL,
        [MowHeight] int NOT NULL,
        [Direction] int NOT NULL,
        [PersonId] int NOT NULL,
        [EquipmentId] int NOT NULL,
        [Notes] nvarchar(2000) NULL,
        [PhotoUrl] nvarchar(1000) NULL,
        [CreatedByUserId] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_MowRecords] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_MowRecords_Equipment_EquipmentId] FOREIGN KEY ([EquipmentId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_MowRecords_LawnAreas_LawnAreaId] FOREIGN KEY ([LawnAreaId]) REFERENCES [LawnAreas] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_MowRecords_People_PersonId] FOREIGN KEY ([PersonId]) REFERENCES [People] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_MowRecords_Users_CreatedByUserId] FOREIGN KEY ([CreatedByUserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'IsActive', N'Name') AND [object_id] = OBJECT_ID(N'[Equipment]'))
        SET IDENTITY_INSERT [Equipment] ON;
    EXEC(N'INSERT INTO [Equipment] ([Id], [CreatedAt], [IsActive], [Name])
    VALUES (1, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''JD 9009a''),
    (2, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''JD 1585''),
    (3, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''JD 997''),
    (4, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Trimax Pegasus''),
    (5, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Trimax Snake''),
    (6, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Walker''),
    (7, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Toro Pro Stripe''),
    (8, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Push mower''),
    (9, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''JD 300r''),
    (10, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''JD 1580''),
    (11, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Club Cadet'')');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'IsActive', N'Name') AND [object_id] = OBJECT_ID(N'[Equipment]'))
        SET IDENTITY_INSERT [Equipment] OFF;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'CustomFrequencyDays', N'DefaultFrequency', N'DefaultMowHeight', N'IsActive', N'Name', N'Notes') AND [object_id] = OBJECT_ID(N'[LawnAreas]'))
        SET IDENTITY_INSERT [LawnAreas] ON;
    EXEC(N'INSERT INTO [LawnAreas] ([Id], [CreatedAt], [CustomFrequencyDays], [DefaultFrequency], [DefaultMowHeight], [IsActive], [Name], [Notes])
    VALUES (1, ''2026-01-01T00:00:00.0000000Z'', NULL, 1, 4, CAST(1 AS bit), N''Deer shed'', NULL),
    (2, ''2026-01-01T00:00:00.0000000Z'', NULL, 1, 4, CAST(1 AS bit), N''Tractor compound'', NULL),
    (3, ''2026-01-01T00:00:00.0000000Z'', NULL, 2, 5, CAST(1 AS bit), N''Lucerne edge'', NULL),
    (4, ''2026-01-01T00:00:00.0000000Z'', NULL, 2, 5, CAST(1 AS bit), N''Lower Lucerne tracks / Hauiti'', NULL),
    (5, ''2026-01-01T00:00:00.0000000Z'', NULL, 0, 3, CAST(1 AS bit), N''Farm track entrance (turf farm)'', NULL),
    (6, ''2026-01-01T00:00:00.0000000Z'', NULL, 2, 5, CAST(1 AS bit), N''Farm tracks'', NULL),
    (7, ''2026-01-01T00:00:00.0000000Z'', NULL, 0, 3, CAST(1 AS bit), N''Totara Grove entrance'', NULL),
    (8, ''2026-01-01T00:00:00.0000000Z'', NULL, 1, 4, CAST(1 AS bit), N''Totara / Hanger'', NULL),
    (9, ''2026-01-01T00:00:00.0000000Z'', NULL, 1, 4, CAST(1 AS bit), N''Totara / amply theatre'', NULL),
    (10, ''2026-01-01T00:00:00.0000000Z'', NULL, 2, 5, CAST(1 AS bit), N''Farm track to rd gates'', NULL),
    (11, ''2026-01-01T00:00:00.0000000Z'', NULL, 2, 5, CAST(1 AS bit), N''Amp to top of totara x2'', NULL),
    (12, ''2026-01-01T00:00:00.0000000Z'', NULL, 1, 4, CAST(1 AS bit), N''Storage shed'', NULL),
    (13, ''2026-01-01T00:00:00.0000000Z'', NULL, 3, 6, CAST(1 AS bit), N''Lower trees'', NULL),
    (14, ''2026-01-01T00:00:00.0000000Z'', NULL, 1, 4, CAST(1 AS bit), N''Stables Takapoto south'', NULL),
    (15, ''2026-01-01T00:00:00.0000000Z'', NULL, 3, 6, CAST(1 AS bit), N''Old arena'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'CustomFrequencyDays', N'DefaultFrequency', N'DefaultMowHeight', N'IsActive', N'Name', N'Notes') AND [object_id] = OBJECT_ID(N'[LawnAreas]'))
        SET IDENTITY_INSERT [LawnAreas] OFF;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'IsActive', N'Name') AND [object_id] = OBJECT_ID(N'[People]'))
        SET IDENTITY_INSERT [People] ON;
    EXEC(N'INSERT INTO [People] ([Id], [CreatedAt], [IsActive], [Name])
    VALUES (1, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Hamish''),
    (2, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Steve''),
    (3, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Tony''),
    (4, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Kane''),
    (5, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Noah''),
    (6, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Grant''),
    (7, ''2026-01-01T00:00:00.0000000Z'', CAST(1 AS bit), N''Glen'')');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'IsActive', N'Name') AND [object_id] = OBJECT_ID(N'[People]'))
        SET IDENTITY_INSERT [People] OFF;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'DisplayName', N'Email', N'IsActive', N'PasswordHash', N'RefreshToken', N'RefreshTokenExpiresAt', N'Role') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] ON;
    EXEC(N'INSERT INTO [Users] ([Id], [CreatedAt], [DisplayName], [Email], [IsActive], [PasswordHash], [RefreshToken], [RefreshTokenExpiresAt], [Role])
    VALUES (1, ''2026-01-01T00:00:00.0000000Z'', N''Admin'', N''admin@turfops.local'', CAST(1 AS bit), N''$2a$11$7csfOE/DBtia89Lb3f7ZWe78w4RTUkffeDgVgtD2Va1MuM.LZa8/W'', NULL, NULL, 1)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'DisplayName', N'Email', N'IsActive', N'PasswordHash', N'RefreshToken', N'RefreshTokenExpiresAt', N'Role') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] OFF;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Equipment_Name] ON [Equipment] ([Name]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_LawnAreas_Name] ON [LawnAreas] ([Name]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MowRecords_CreatedByUserId] ON [MowRecords] ([CreatedByUserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MowRecords_Date] ON [MowRecords] ([Date]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MowRecords_EquipmentId] ON [MowRecords] ([EquipmentId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MowRecords_LawnAreaId] ON [MowRecords] ([LawnAreaId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MowRecords_PersonId] ON [MowRecords] ([PersonId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_People_Name] ON [People] ([Name]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260914003044_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260914003044_InitialCreate', N'9.0.0');
END;

COMMIT;
GO

