USE LigueNationalHockey
GO

CREATE SCHEMA Auth;
GO

CREATE TABLE Auth.Utilisateur (
    UtilisateurID INT IDENTITY(1,1) NOT NULL,
    Courriel VARCHAR(100) NOT NULL,
    MotDePasse VARCHAR(255) NOT NULL,
    CONSTRAINT PK_Utilisateur_UtilisateurID PRIMARY KEY (UtilisateurID),
    CONSTRAINT UC_Utilisateur_Courriel UNIQUE (Courriel)
);
GO

CREATE PROCEDURE Auth.USP_CreerUtilisateur
    @Courriel VARCHAR(100),
    @MotDePasse VARCHAR(255)
AS
BEGIN
    INSERT INTO Auth.Utilisateur (Courriel, MotDePasse)
    VALUES (@Courriel, @MotDePasse)
END
GO

CREATE PROCEDURE Auth.USP_AuthUtilisateur
    @Courriel VARCHAR(100),
    @MotDePasse VARCHAR(255)
AS
BEGIN
    SELECT * FROM Auth.Utilisateur
    WHERE Courriel = @Courriel AND MotDePasse = @MotDePasse
END
GO