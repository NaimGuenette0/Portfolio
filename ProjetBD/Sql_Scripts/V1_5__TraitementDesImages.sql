USE LigueNationalHockey
GO

ALTER TABLE Hockey.Joueur ADD
    Identifiant uniqueidentifier NOT NULL ROWGUIDCOL DEFAULT newid();
GO

ALTER TABLE Hockey.Joueur ADD CONSTRAINT UC_Joueur_Identifiant 
    UNIQUE (Identifiant);
GO

ALTER TABLE Hockey.Joueur ADD
    Photo varbinary(max) FILESTREAM NULL;
GO