USE LigueNationalHockey
GO

CREATE PROCEDURE Hockey.USP_ClassementJoueurs
    @EquipeID INT = NULL,
    @Position VARCHAR(30) = NULL,
    @ButsMinimum INT = 0,
    @PassesMinimum INT = 0
AS
BEGIN
    SELECT j.JoueurID,j.Prenom,j.nom, j.position,j.EquipeID,SUM(s.buts) AS TotalButs,SUM(s.passes) AS TotalPasses
    FROM Hockey.Joueur j
    INNER JOIN Hockey.Statistique s ON s.JoueurID = j.JoueurID
    WHERE 
        (@EquipeID IS NULL OR j.EquipeID = @EquipeID)AND (@Position IS NULL OR j.position = @Position)
    GROUP BY j.JoueurID, j.Prenom, j.nom, j.position, j.EquipeID
    HAVING SUM(s.buts) >= @ButsMinimum AND SUM(s.passes) >= @PassesMinimum
    ORDER BY TotalButs DESC, TotalPasses DESC
END
GO