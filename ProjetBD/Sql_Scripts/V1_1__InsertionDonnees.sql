use LigueNationalHockey
INSERT INTO Info.Adresse (rue, ville, codePostal) VALUES
('101 Rue A','Montreal','H1A1A1'),
('102 Rue B','Montreal','H1A1A2'),
('103 Rue C','Montreal','H1A1A3'),
('104 Rue D','Montreal','H1A1A4'),

('201 Rue A','Quebec','G1A1A1'),
('202 Rue B','Quebec','G1A1A2'),
('203 Rue C','Quebec','G1A1A3'),
('204 Rue D','Quebec','G1A1A4'),

('301 Rue A','Laval','H7A1A1'),
('302 Rue B','Laval','H7A1A2'),
('303 Rue C','Laval','H7A1A3'),
('304 Rue D','Laval','H7A1A4'),

('401 Rue A','Ottawa','K1A1A1'),
('402 Rue B','Ottawa','K1A1A2'),
('403 Rue C','Ottawa','K1A1A3'),
('404 Rue D','Ottawa','K1A1A4');

INSERT INTO Info.NumeroTelephone (NumeroTelephone) VALUES
('514-000-0001'),('514-000-0002'),('514-000-0003'),('514-000-0004'),
('418-000-0001'),('418-000-0002'),('418-000-0003'),('418-000-0004'),
('450-000-0001'),('450-000-0002'),('450-000-0003'),('450-000-0004'),
('613-000-0001'),('613-000-0002'),('613-000-0003'),('613-000-0004');

INSERT INTO Hockey.Equipe (nom, ville) VALUES
('Canadiens','Montreal'),
('Nordiques','Quebec'),
('Rocket','Laval'),
('Senateurs','Ottawa');

INSERT INTO Hockey.Joueur (Prenom, nom, numero, position, AdresseID, NumeroTelephoneID, EquipeID) VALUES

-- Canadiens
('Jean','Tremblay',9,'Attaquant',1,1,1),
('Marc','Gagnon',22,'Attaquant',2,2,1),
('Simon','Roy',5,'Defenseur',3,3,1),
('Alex','Price',30,'Gardien',4,4,1),

-- Nordiques
('Luc','Bouchard',11,'Attaquant',5,5,2),
('Eric','Lavoie',18,'Attaquant',6,6,2),
('David','Cloutier',4,'Defenseur',7,7,2),
('Kevin','Smith',31,'Gardien',8,8,2),

-- Rocket
('Mathieu','Bergeron',14,'Attaquant',9,9,3),
('Olivier','Parent',19,'Attaquant',10,10,3),
('Patrick','Deslauriers',6,'Defenseur',11,11,3),
('Ryan','Miller',35,'Gardien',12,12,3),

-- Senateurs
('Anthony','Girard',12,'Attaquant',13,13,4),
('Samuel','Fortin',17,'Attaquant',14,14,4),
('Jonathan','Caron',3,'Defenseur',15,15,4),
('Chris','Allen',40,'Gardien',16,16,4);

INSERT INTO Hockey.Gardien (GardienID, ButsAccordes, Blanchissages) VALUES
(4, 2, 1),
(8, 3, 0),
(12, 1, 2),
(16, 4, 0);

INSERT INTO Hockey.Match (dateMatch, scoreLocal, scoreVisiteur, EquipeLocal, EquipeVisiteur) VALUES
('2025-01-01',3,2,1,2),
('2025-01-05',4,1,3,4),
('2025-01-10',2,2,2,3),
('2025-01-15',5,3,4,1),
('2025-01-20',1,0,1,3),
('2025-01-25',3,4,2,4),
('2025-02-01',2,1,3,1),
('2025-02-05',4,2,4,2);

INSERT INTO Hockey.Statistique (buts, passes, minutesGlace, JoueurID, MatchID) VALUES

-- MATCH 1 (1 vs 2)
(1,1,18,1,1),
(3,1,20,2,1),
(2,0,22,3,1),
(4,0,60,4,1),

(5,0,17,5,1),
(2,2,19,6,1),
(1,0,21,7,1),
(0,0,60,8,1),

-- MATCH 2 (3 vs 4)
(4,0,18,9,2),
(2,1,19,10,2),
(3,0,23,11,2),
(6,0,60,12,2),

(1,0,20,13,2),
(4,1,18,14,2),
(2,0,22,15,2),
(5,0,60,16,2),

-- MATCH 3 (1 vs 3)
(1,0,17,1,3),
(3,2,19,2,3),
(2,0,21,3,3),
(1,0,60,4,3),

(2,1,18,9,3),
(4,1,20,10,3),
(0,0,22,11,3),
(0,0,60,12,3),

-- MATCH 4 (2 vs 4)
(1,1,18,5,4),
(2,0,20,6,4),
(6,0,22,7,4),
(4,0,60,8,4),

(2,0,19,13,4),
(0,1,18,14,4),
(0,0,23,15,4),
(0,0,60,16,4),

-- MATCH 5 (1 vs 4)
(1,0,18,1,5),
(0,1,19,2,5),
(0,0,22,3,5),
(0,0,60,4,5),

(2,1,20,13,5),
(0,0,18,14,5),
(0,0,21,15,5),
(0,0,60,16,5),

-- MATCH 6 (2 vs 3)
(1,1,19,5,6),
(0,0,18,6,6),
(0,0,22,7,6),
(0,0,60,8,6),

(2,0,20,9,6),
(1,1,18,10,6),
(0,0,21,11,6),
(0,0,60,12,6);