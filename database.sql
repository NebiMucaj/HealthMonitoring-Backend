CREATE TABLE patient (
    patientID INT NOT NULL PRIMARY KEY,
    name VARCHAR(255),
    lastName VARCHAR(255),
    age INT,
    height FLOAT,
    weight FLOAT,
    phoneNumber VARCHAR(255),
    email VARCHAR(255) 
);

CREATE TABLE prescription (
    prescriptionID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    patientID INT REFERENCES patient(patientID),
    doctorID INT REFERENCES doctor(doctorID),
    drugID INT REFERENCES drug(drugID),
    startDate DATETIME,
    endDate DATETIME,
    specificDays varchar(255),
    frequenzID INT REFERENCES frequenz(frequenzID),
    amount INT,
    description varchar(500)
);

CREATE TABLE doctor (
    doctorID INT NOT NULL PRIMARY KEY,
    name VARCHAR(255),
	lastName VARCHAR(255),
    spezializationID INT REFERENCES spezialization(spezializationID)
);

CREATE TABLE Adherence (
    AdherenceID INT NOT NULL PRIMARY KEY,
    PatientID INT REFERENCES Patient(PatientID),
    PrescriptionID INT REFERENCES Prescription(PrescriptionID),
    StatusOf VARCHAR(255)
);

CREATE TABLE vitalParameters (
    VitalsID INT NOT NULL PRIMARY KEY,
    PatientID INT REFERENCES Patient(PatientID),
    BloodPressure1 INT,
    BloodPressure2 INT,
    Pulse INT,
    Temperature FLOAT,
    Weight FLOAT,
    T datetime
);

CREATE TABLE drug (
    drugID INT NOT NULL PRIMARY KEY,
    drugName varchar(255),
    sideEffects varchar(255),
    dosageForm VARCHAR(255)
);
CREATE TABLE spezialization (
    spezializationID INT NOT NULL PRIMARY KEY,
    spezialization varchar(255)
);
Create Table frequenz(
    frequenzID INT NOT NULL PRIMARY KEY,
    frequenz varchar(255)

);

Create Table amount(
	amountID Int Not Null PRIMARY KEY AUTO_INCREMENT,
	prescriptionID INT REFERENCES prescription (prescriptionID),
	amount INT,
	intakeTime Int 
);

create table intake(
	patientId INT NOT NULL,
    drugId INT NOT NULL,
    T datetime,
    FOREIGN KEY (patientId) REFERENCES patient(PatientID),
    foreign key (drugId) references drug(drugID)
);

create table criticalScore(
	patientId INT NOT NULL,
    criticalScore INT
);

create table normalVitals(
	patientId INT NOT NULL,
    BloodPressure1 INT,
    BloodPressure2 INT,
    Pulse INT,
    Temperature FLOAT,
    Weight FLOAT
);
create table users(
    id varchar(255) NOT NULL,
    userName varchar(255),
    password varchar(255),
    registered datetime,
    last_login datetime,
    role varchar(255)
);

create table doctorUser(
	userID varchar(255) NOT NULL REFERENCES users(id),
        doctorID INT NOT NULL REFERENCES doctor(doctorID)
);


create table message(

	messageID Int Not Null PRIMARY KEY AUTO_INCREMENT,
	message varchar(255),
	timestamp timestamp,
	patientIsReceiver tinyint(1),
	patientID INT REFERENCES patient (patientID),
	prescriptionID INT REFERENCES prescription (prescriptionID)
	

);

delimiter //

CREATE PROCEDURE computeCritical(ptID INTEGER)
BEGIN
	DECLARE c INTEGER default 0;
    if (abs((select bloodpressure1 from normalVitals as n where ptID = n.PatientID) - (select bloodpressure1 from vitalParameters as v where ptID = v.PatientID order by T desc limit 1)) > 10)
    then set c = c + 1;
    end if;
	if (abs((select bloodpressure2 from normalVitals as n where n.PatientID = ptID) - (select bloodpressure2 from vitalParameters as v where v.PatientID = ptID order by T desc limit 1)) > 10)
    then set c = c + 1;
    end if;
	if (abs((select pulse from normalVitals as n where n.PatientID = ptID) - (select pulse from vitalParameters as v where v.PatientID = ptID order by T desc limit 1)) > 10)
    then set c = c + 1;
    end if;
	if (abs((select temperature from normalVitals as n where n.PatientID = ptID) - (select temperature from vitalParameters as v where v.PatientID = ptID order by T desc limit 1)) > 1)
    then set c = c + 1;
    end if;
	if (abs((select weight from normalVitals as n where n.PatientID = ptID) - (select weight from vitalParameters as v where v.PatientID = ptID order by T desc limit 1 offset 4)) > 5)
    then set c = c + 1;
    end if;
    
    IF (NOT EXISTS ((SELECT * from criticalScore as c where c.PatientId = ptID)))
    THEN INSERT INTO criticalScore values (ptID,c);
    else update criticalScore set criticalScore = c where patientId = ptID;
	end if;
END//

delimiter ;




/*  
essentielle Einträge in der Datenbank    
*/  

insert into frequenz Values(0,'keine');
insert into frequenz Values(1,'täglich');
insert into frequenz Values(2,'wöchentlich');
insert into frequenz Values(3,'monatlich');

/*  
-------------Beispiele----------------------------------------------------------------------  
*/  
/*  
Patients 
*/  
INSERT INTO `patient` (`patientID`, `name`, `lastName`, `age`, `height`, `weight`, `phoneNumber`, `email`) VALUES (1, 'Syble', 'Johns', 40, '193', '3', '1-843-066-5619', 'cyost@example.net');
INSERT INTO `patient` (`patientID`, `name`, `lastName`, `age`, `height`, `weight`, `phoneNumber`, `email`) VALUES (2, 'Vivianne', 'Hilpert', 25, '188', '2', '00369599641', 'pwisozk@example.net');
INSERT INTO `patient` (`patientID`, `name`, `lastName`, `age`, `height`, `weight`, `phoneNumber`, `email`) VALUES (3, 'Dave', 'Schimmel', 47, '170', '3', '1-469-256-7352x27599', 'cale.considine@example.net');
INSERT INTO `patient` (`patientID`, `name`, `lastName`, `age`, `height`, `weight`, `phoneNumber`, `email`) VALUES (4, 'Dion', 'Hodkiewicz', 71, '153', '1', '942.528.0790x06701', 'urban82@example.net');
INSERT INTO `patient` (`patientID`, `name`, `lastName`, `age`, `height`, `weight`, `phoneNumber`, `email`) VALUES (5, 'Jayde', 'Wolff', 70, '197', '4', '1-767-065-7580x43636', 'balistreri.anita@example.com');
INSERT INTO `patient` (`patientID`, `name`, `lastName`, `age`, `height`, `weight`, `phoneNumber`, `email`) VALUES (6, 'Dolores', 'Stokes', 28, '162', '8', '(313)155-6922x7610', 'xwest@example.net');
INSERT INTO `patient` (`patientID`, `name`, `lastName`, `age`, `height`, `weight`, `phoneNumber`, `email`) VALUES (7, 'Fannie', 'Jacobson', 41, '161', '7', '540-550-8767x594', 'ova43@example.com');
INSERT INTO `patient` (`patientID`, `name`, `lastName`, `age`, `height`, `weight`, `phoneNumber`, `email`) VALUES (8, 'Hoyt', 'Crona', 31, '189', '9', '(258)023-0496x13279', 'nitzsche.sonny@example.org');
INSERT INTO `patient` (`patientID`, `name`, `lastName`, `age`, `height`, `weight`, `phoneNumber`, `email`) VALUES (9, 'Quinton', 'Klocko', 64, '175', '6', '+07(2)5357530661', 'reid27@example.org');
INSERT INTO `patient` (`patientID`, `name`, `lastName`, `age`, `height`, `weight`, `phoneNumber`, `email`) VALUES (10, 'Bernadette', 'Dare', 66, '174', '4', '213.482.6222x38068', 'kautzer.lonie@example.com');
/*  
Spezialization
*/

insert into spezialization Values(0,'Hausarzt');
insert into spezialization Values(1,'Unfallarzt');
insert into spezialization Values(2,'Zahnarzt');

/*  
Doctors
*/

insert into doctor values(1,'Hans','Mustermann',1);
insert into doctor values(3,'Christan','Guthenke',0);

/*  
Drugs
*/

insert into drug values(1,'Insulin','Gewichtszunahme','flüssig');
insert into drug values(2,'Antibiotikum','Magen-Darm-Beschwerden,Rötungen und Juckreiz ','tabletten');


/*  
users(username;password)-->(user1;user12),(user2:user12) 
*/

insert into users values ('7a117048-272b-41d6-8d88-0543e2d5ae3d','user2','$2a$10$zZHdM1k5r//Tj8wfTovX9OWhlrJRgoGWEnDajzSBgFPJ5hXTgac2q','2020-07-13 23:49:40',null,null);
insert into users values ('eb6a8872-7482-43b4-beb0-5c145f9b6ab6','user1','$2a$10$nT9gQc9VtWfMnSR9nwfe0uNET.Y3sySKpeCJiTG6CXXTE3iucp1aO','2020-07-13 23:50:40',null,null);


/*  
Zuweisung des users zum Doctor
*/

insert into doctorUser values('7a117048-272b-41d6-8d88-0543e2d5ae3d',1);
insert into doctorUser values('eb6a8872-7482-43b4-beb0-5c145f9b6ab6',3);



	
