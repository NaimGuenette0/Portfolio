use LigueNationalHockey
go 

-- Nombre de joueurs, moyenne de buts, total de points par équipe
CREATE VIEW Hockey.VwStatistiquesJoueursParEquipe AS
SELECT EquipeID, COUNT(*) AS NombreJoueurs, AVG(s.buts) AS MoyenneButs, SUM(s.passes) AS TotalPasses
FROM Hockey.Joueur j 
inner join [Hockey].[Statistique] s 
on s.JoueurID = j.JoueurID
GROUP BY EquipeID