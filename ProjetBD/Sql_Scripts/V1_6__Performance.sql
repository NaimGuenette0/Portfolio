USE LigueNationalHockey
GO

--Dans ma procédure USP_ClassementJoueurs, je fais un JOIN entre Joueur et Statistique sur JoueurID. Cet index permet à SQL Server de trouver rapidement les statistiques d'un joueur sans scanner toute la table.
CREATE NONCLUSTERED INDEX IX_Statistique_JoueurID
ON Hockey.Statistique(JoueurID);
GO

-- Toujours dans USP_ClassementJoueurs, l'utilisateur peut filtrer par équipe avec @EquipeID. Sans index, SQL Server doit vérifier chaque joueur un par un. Avec l'index, la recherche est beaucoup plus rapide.
CREATE NONCLUSTERED INDEX IX_Joueur_EquipeID
ON Hockey.Joueur(EquipeID);
GO