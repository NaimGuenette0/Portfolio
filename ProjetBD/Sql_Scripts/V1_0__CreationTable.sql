USE LigueNationalHockey;
GO


CREATE TABLE Info.Adresse(
 AdresseID INT IDENTITY(1,1) NOT NULL,
 rue VARCHAR(100) NOT NULL,
 ville VARCHAR(50) NOT NULL,
 codePostal VARCHAR(10) NOT NULL,
 CONSTRAINT PK_Adresse_AdresseID PRIMARY KEY (AdresseID));
 GO

CREATE TABLE Info.NumeroTelephone(
 NumeroTelephoneID INT IDENTITY(1,1) NOT NULL,
 NumeroTelephone VARCHAR(20) NOT NULL,
 CONSTRAINT PK_NumeroTelephone_NumeroTelephoneID PRIMARY KEY (NumeroTelephoneID));
GO

CREATE TABLE Hockey.Equipe(
 EquipeID INT IDENTITY(1,1) NOT NULL,
  nom VARCHAR(50) NOT NULL,
  ville VARCHAR(50) NOT NULL,
  butsPour INT,
  butsContre INT,
  differentielButs AS (butsPour - butsContre),
  CONSTRAINT PK_Equipe_EquipeID PRIMARY KEY (EquipeID));
GO

CREATE TABLE Hockey.Joueur(
 JoueurID INT IDENTITY(1,1) NOT NULL,
 Prenom VARCHAR(50) NOT NULL,
 nom VARCHAR(50) NOT NULL,
 numero INT NOT NULL,
 position VARCHAR(30) NOT NULL,
 AdresseID INT,
 NumeroTelephoneID INT,
 EquipeID INT NOT NULL,
 CONSTRAINT PK_Joueur_JoueurID PRIMARY KEY (JoueurID));
GO

CREATE TABLE Hockey.Gardien(
 GardienID INT NOT NULL,
 ButsAccordes INT,
 Blanchissages INT,
 CONSTRAINT PK_Gardien_GardienID PRIMARY KEY (GardienID));
GO

CREATE TABLE Hockey.Match(
 MatchID INT IDENTITY(1,1) NOT NULL,
 dateMatch DATE NOT NULL,
 scoreLocal INT,
 scoreVisiteur INT,
 EquipeLocal INT NOT NULL,
 EquipeVisiteur INT NOT NULL,
 CONSTRAINT PK_Match_MatchID PRIMARY KEY (MatchID));
GO

CREATE TABLE Hockey.Statistique (
 StatistiqueID INT IDENTITY(1,1) NOT NULL,
 buts INT,
 passes INT,
 minutesGlace INT,
 JoueurID INT NOT NULL,
 MatchID INT NOT NULL, 
 CONSTRAINT PK_Statistique_StatistiqueID PRIMARY KEY (StatistiqueID));
GO

ALTER TABLE Hockey.Joueur ADD CONSTRAINT FK_Joueur_AdresseID FOREIGN KEY (AdresseID) REFERENCES Info.Adresse(AdresseID);
GO
ALTER TABLE Hockey.Joueur ADD CONSTRAINT FK_Joueur_NumeroTelephoneID FOREIGN KEY (NumeroTelephoneID) REFERENCES Info.NumeroTelephone(NumeroTelephoneID);
GO
ALTER TABLE Hockey.Joueur ADD CONSTRAINT FK_Joueur_EquipeID FOREIGN KEY (EquipeID) REFERENCES Hockey.Equipe(EquipeID);
GO
ALTER TABLE Hockey.Gardien ADD CONSTRAINT FK_Gardien_GardienID FOREIGN KEY (GardienID) REFERENCES Hockey.Joueur(JoueurID);
GO
ALTER TABLE Hockey.Match ADD CONSTRAINT FK_Match_EquipeLocal FOREIGN KEY (EquipeLocal) REFERENCES Hockey.Equipe(EquipeID);
GO
ALTER TABLE Hockey.Match ADD CONSTRAINT FK_Match_EquipeVisiteur FOREIGN KEY (EquipeVisiteur) REFERENCES Hockey.Equipe(EquipeID);
GO
ALTER TABLE Hockey.Statistique ADD CONSTRAINT FK_Statistique_JoueurID FOREIGN KEY (JoueurID) REFERENCES Hockey.Joueur(JoueurID);
GO
ALTER TABLE Hockey.Statistique ADD CONSTRAINT FK_Statistique_MatchID FOREIGN KEY (MatchID) REFERENCES Hockey.Match(MatchID);
GO
ALTER TABLE Info.Adresse ADD CONSTRAINT UC_Adresse_codePostal UNIQUE (codePostal);
GO
ALTER TABLE Hockey.Equipe ADD CONSTRAINT UC_Equipe_nom UNIQUE (nom);
GO
ALTER TABLE Hockey.Joueur ADD CONSTRAINT UC_Joueur_numero UNIQUE (numero, EquipeID);
GO
ALTER TABLE Hockey.Joueur ADD CONSTRAINT CK_Joueur_position CHECK (position IN ('Attaquant','Defenseur','Gardien'));
GO
ALTER TABLE Hockey.Equipe ADD CONSTRAINT CK_Equipe_butsPour CHECK (butsPour >= 0);
GO
ALTER TABLE Hockey.Equipe ADD CONSTRAINT CK_Equipe_butsContre CHECK (butsContre >= 0);
GO
ALTER TABLE Hockey.Equipe ADD CONSTRAINT DF_Equipe_butsPour DEFAULT 0 FOR butsPour;
GO
ALTER TABLE Hockey.Equipe ADD CONSTRAINT DF_Equipe_butsContre DEFAULT 0 FOR butsContre;
GO