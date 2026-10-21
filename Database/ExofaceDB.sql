DROP DATABASE IF EXISTS ExofaceDB;
CREATE DATABASE ExofaceDB;
USE ExofaceDB;

CREATE TABLE Class (
                       classId INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(10)
);

CREATE TABLE User (
                      userId INT AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(50),
                      surname VARCHAR(50),
                      email VARCHAR(50) UNIQUE,
                      password VARCHAR(255),
                      role ENUM('teacher', 'student') NOT NULL,
                      classId INT NULL,
                      FOREIGN KEY (classId) REFERENCES Class(classId) ON DELETE SET NULL
);

CREATE TABLE Module (
                        moduleId INT AUTO_INCREMENT PRIMARY KEY,
                        shortcut VARCHAR(10) UNIQUE,
                        description VARCHAR(100)
);

CREATE TABLE Vm (
                    vmId INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(50),
                    userId INT,
                    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE ClassModule (
                             moduleId INT,
                             classId INT,
                             PRIMARY KEY (moduleId, classId),
                             FOREIGN KEY (moduleId) REFERENCES Module(moduleId) ON DELETE CASCADE,
                             FOREIGN KEY (classId) REFERENCES Class(classId) ON DELETE CASCADE
);

CREATE TABLE UserModule (
                            moduleId INT,
                            userId INT,
                            PRIMARY KEY (moduleId, userId),
                            FOREIGN KEY (moduleId) REFERENCES Module(moduleId) ON DELETE CASCADE,
                            FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE TempUser (
                          userId INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(50),
                          surname VARCHAR(50),
                          email VARCHAR(50) UNIQUE,
                          password VARCHAR(255),
                          role ENUM('teacher', 'student') NOT NULL,
                          classId INT NULL,
                          FOREIGN KEY (classId) REFERENCES Class(classId) ON DELETE SET NULL
);