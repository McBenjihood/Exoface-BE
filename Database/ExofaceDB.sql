DROP DATABASE IF EXISTS ExofaceDB;
CREATE DATABASE ExofaceDB;
USE ExofaceDB;

CREATE TABLE Klassen (
                         klassenId INT AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(10)
);
CREATE TABLE User (
                      userId INT AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(50),
                      surname VARCHAR(50),
                      email VARCHAR(50) UNIQUE,
                      password VARCHAR(255),
                      role ENUM('lehrer', 'schueler') NOT NULL,
                      klassenId INT NULL,
                      FOREIGN KEY (klassenId) REFERENCES Klassen(klassenId) ON DELETE SET NULL
);

CREATE TABLE Modul (
                       modulId INT AUTO_INCREMENT PRIMARY KEY,
                       kuerzel VARCHAR(10) UNIQUE,
                       beschreibung VARCHAR(100)
);



CREATE TABLE Vm (
                    vmId INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(50),
                    userId INT,
                    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE KlassenModul (
                              modulId INT,
                              klassenId INT,
                              PRIMARY KEY (modulId, klassenId),
                              FOREIGN KEY (modulId) REFERENCES Modul(modulId) ON DELETE CASCADE,
                              FOREIGN KEY (klassenId) REFERENCES Klassen(klassenId) ON DELETE CASCADE
);

CREATE TABLE UserModul (
                           modulId INT,
                           userId INT,
                           PRIMARY KEY (modulId, userId),
                           FOREIGN KEY (modulId) REFERENCES Modul(modulId) ON DELETE CASCADE,
                           FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);
CREATE TABLE tempuser (
                      userId INT AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(50),
                      surname VARCHAR(50),
                      email VARCHAR(50) UNIQUE,
                      password VARCHAR(255),
                      role ENUM('lehrer', 'schueler') NOT NULL,
                      klassenId INT NULL,
                      FOREIGN KEY (klassenId) REFERENCES Klassen(klassenId) ON DELETE SET NULL
);