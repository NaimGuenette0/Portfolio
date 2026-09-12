CREATE DATABASE LigueNationalHockey
GO
USE LigueNationalHockey
GO

EXEC sp_configure filestream_access_level, 2 RECONFIGURE

ALTER DATABASE LigueNationalHockey
ADD FILEGROUP FG_Images CONTAINS FILESTREAM;
GO

ALTER DATABASE LigueNationalHockey
ADD FILE (
    NAME = FG_Images,
    FILENAME = 'C:\EspaceLabo\FG_Images_2360188'
)
TO FILEGROUP FG_Images
GO