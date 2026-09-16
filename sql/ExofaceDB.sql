DROP DATABASE IF EXISTS ExofaceDB;
CREATE DATABASE ExofaceDB;
USE ExofaceDB;

CREATE TABLE teachers (
                          teacherID INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(50),
                          email VARCHAR(50) UNIQUE,
                          password VARCHAR(255)
);

CREATE TABLE modules (
                         moduleID INT AUTO_INCREMENT PRIMARY KEY,
                         abbreviation VARCHAR(10) UNIQUE,
                         description VARCHAR(100)
);

CREATE TABLE class (
                       classID INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(10)
);

CREATE TABLE Students (
                          studentID INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(50),
                          email VARCHAR(50) UNIQUE,
                          password VARCHAR(255),
                          enabled BOOLEAN,
                          classID INT,
                          FOREIGN KEY (classID) REFERENCES class(classID) ON DELETE SET NULL
);

CREATE TABLE Vm (
                    vmID INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(50),
                    studentId INT,
                    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE CASCADE
);

CREATE TABLE ClassModule (
                             moduleID INT,
                             classID INT,
                             PRIMARY KEY (moduleID, classID),
                             FOREIGN KEY (moduleID) REFERENCES modules(moduleID) ON DELETE CASCADE,
                             FOREIGN KEY (classID) REFERENCES class(classID) ON DELETE CASCADE
);

CREATE TABLE TeacherModule (
                            teacherModuleID INT AUTO_INCREMENT PRIMARY KEY,
                            moduleID INT,
                            teacherID INT,
                            FOREIGN KEY (moduleID) REFERENCES modules(moduleID) ON DELETE CASCADE,
                            FOREIGN KEY (teacherID) REFERENCES teachers(teacherID) ON DELETE CASCADE
);