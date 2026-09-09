CREATE DATABASE ExofaceDB;
USE ExofaceDB;

CREATE TABLE Lehrer (
    lehrerId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE Modul (
    modulId INT AUTO_INCREMENT PRIMARY KEY,
    kuerzel VARCHAR(10) UNIQUE,
    beschreibung VARCHAR(100)
);

CREATE TABLE Klassen (
    klassenId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10)
);

CREATE TABLE Schueler (
    schuelerId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    enabled BOOLEAN,
    klassenId INT,
    FOREIGN KEY (klassenId) REFERENCES Klassen(klassenId) ON DELETE SET NULL
);

CREATE TABLE Vm (
    vmId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    schuelerId INT,
    FOREIGN KEY (schuelerId) REFERENCES Schueler(schuelerId) ON DELETE CASCADE
);

CREATE TABLE KlassenModul (
    modulId INT,
    klassenId INT,
    PRIMARY KEY (modulId, klassenId),
    FOREIGN KEY (modulId) REFERENCES Modul(modulId) ON DELETE CASCADE,
    FOREIGN KEY (klassenId) REFERENCES Klassen(klassenId) ON DELETE CASCADE
);

CREATE TABLE LehrerModul (
    modulId INT,
    lehrerId INT,
    PRIMARY KEY (modulId, lehrerId),
    FOREIGN KEY (modulId) REFERENCES Modul(modulId) ON DELETE CASCADE,
    FOREIGN KEY (lehrerId) REFERENCES Lehrer(lehrerId) ON DELETE CASCADE
);