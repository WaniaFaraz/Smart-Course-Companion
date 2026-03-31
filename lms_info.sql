-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 01, 2026 at 01:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms_info`
--
CREATE DATABASE IF NOT EXISTS `lms_info` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `lms_info`;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
CREATE TABLE IF NOT EXISTS `assignments` (
  `assignmentId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'unique assignment id',
  `instructorId` int(11) NOT NULL COMMENT 'professor who created the assignment',
  `courseId` int(11) NOT NULL,
  `title` varchar(30) NOT NULL COMMENT 'title of assignment',
  `description` text NOT NULL,
  `weight` int(11) NOT NULL,
  `dateCreated` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'by default - date the date and time the data was entered in the table',
  `dueDate` datetime NOT NULL COMMENT 'due date of assignment',
  PRIMARY KEY (`assignmentId`),
  KEY `professorID` (`instructorId`),
  KEY `courseId` (`courseId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='All assignments created by all professors';

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`assignmentId`, `instructorId`, `courseId`, `title`, `description`, `weight`, `dateCreated`, `dueDate`) VALUES
(1, 2001, 3, 'Assignment1', 'The assignment instructions have been emailed.', 20, '2026-03-31 17:27:47', '2026-03-31 19:26:06');

--
-- Triggers `assignments`
--
DROP TRIGGER IF EXISTS `beforeUpdateCourseExistsForInstructor`;
DELIMITER $$
CREATE TRIGGER `beforeUpdateCourseExistsForInstructor` BEFORE UPDATE ON `assignments` FOR EACH ROW BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM instructor_courses 
        WHERE instructorId = NEW.instructorId 
          AND courseId = NEW.courseId
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Instructor is not associated with this Course ID in the reference table.';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `courseExistsForInstructor`;
DELIMITER $$
CREATE TRIGGER `courseExistsForInstructor` BEFORE INSERT ON `assignments` FOR EACH ROW BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM instructor_courses 
        WHERE instructorId = NEW.instructorId 
          AND courseId = NEW.courseId
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Instructor is not associated with this Course ID in the reference table.';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `insertAssignmentWeightLimitations`;
DELIMITER $$
CREATE TRIGGER `insertAssignmentWeightLimitations` BEFORE INSERT ON `assignments` FOR EACH ROW BEGIN
    IF NEW.weight <= 0 OR NEW.weight > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Weight must be greater than 0 and less than or equal to 100';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `updateAssignmentWeightLimitations`;
DELIMITER $$
CREATE TRIGGER `updateAssignmentWeightLimitations` BEFORE INSERT ON `assignments` FOR EACH ROW BEGIN
    IF NEW.weight <= 0 OR NEW.weight > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Weight must be greater than 0 and less than or equal to 100';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE IF NOT EXISTS `courses` (
  `courseId` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(70) NOT NULL,
  `code` varchar(8) NOT NULL,
  `section` varchar(1) NOT NULL,
  `visibility` int(11) NOT NULL DEFAULT 1 COMMENT '1 : course visible, 0: not visible',
  PRIMARY KEY (`courseId`),
  UNIQUE KEY `Code` (`code`,`section`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='List of all course codes available at the institution.';

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`courseId`, `title`, `code`, `section`, `visibility`) VALUES
(1, 'Mathematics for Computer Science', 'COMP 232', 'S', 1),
(2, 'Mathematics for Computer Science', 'COMP 232', 'Y', 1),
(3, 'Object Oriented Prog. I', 'COMP 248', 'W', 1),
(4, 'Object Oriented Prog. I', 'COMP 248', 'Y', 1),
(5, 'Object Oriented Prog. II', 'COMP 249', 'W', 1),
(6, 'Object Oriented Prog. II', 'COMP 249', 'Y', 1),
(7, 'Applied Advanced Calculus', 'ENGR 233', 'X', 1),
(8, 'Applied Advanced Calculus', 'ENGR 233', 'Y', 1),
(9, 'System Hardware', 'SOEN 228', 'T', 1),
(10, 'System Hardware', 'SOEN 228', 'X', 1),
(11, 'Intro to Web Programming', 'SOEN 287', 'S', 1),
(12, 'Intro to Web Programming', 'SOEN 287', 'W', 1),
(14, 'Mathematics for Computer Science', 'COMP 232', 'N', 1),
(15, 'Applied Ordinary Differential Equations', 'ENGR 213', 'Y', 1),
(16, 'Professional Practice and Responsibility', 'ENGR 201', 'S', 1),
(17, 'Applied Ordinary Differential Equations', 'ENGR 213', 'W', 1);

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

DROP TABLE IF EXISTS `instructors`;
CREATE TABLE IF NOT EXISTS `instructors` (
  `instructorId` int(11) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `emailAddress` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  PRIMARY KEY (`instructorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='List of all professors at the institution';

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`instructorId`, `firstName`, `lastName`, `emailAddress`, `password`) VALUES
(2000, 'Johnathan', 'Brown', 'jbrown@gmail.com', 'j2000'),
(2001, 'Sonia', 'Thompson', 'sthompson@gmail.com', 's2001'),
(2002, 'David', 'Ferguson', 'dferguson@gmail.com', 'd2002'),
(2003, 'Howard', 'Ross', 'hross@gmail.com', 'h2003'),
(2004, 'Zoe', 'Gordon', 'zgordon@gmail.com', 'z2004');

-- --------------------------------------------------------

--
-- Table structure for table `instructor_courses`
--

DROP TABLE IF EXISTS `instructor_courses`;
CREATE TABLE IF NOT EXISTS `instructor_courses` (
  `instructorId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  UNIQUE KEY `course_id` (`courseId`),
  KEY `instructor_id` (`instructorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Maps instructors to ids. (1 course -> 1 prof)';

--
-- Dumping data for table `instructor_courses`
--

INSERT INTO `instructor_courses` (`instructorId`, `courseId`) VALUES
(2001, 3),
(2001, 4),
(2002, 1),
(2002, 2),
(2003, 14),
(2003, 15),
(2003, 17);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `studentId` int(11) NOT NULL COMMENT 'Primary key - added by student at account creation',
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `emailAddress` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  PRIMARY KEY (`studentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Basic student info - ID, names, email, account password';

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`studentId`, `firstName`, `lastName`, `emailAddress`, `password`) VALUES
(1000, 'Jane', 'Doe', 'janedoe@gmail.com', 'j1000'),
(1001, 'Adam', 'Black', 'aBlack@gmail.com', 'a1001'),
(1002, 'Stephanie', 'Grant', 'sgrant@gmail.com', 's1002'),
(1003, 'Emily', 'Clarkson', 'eclarkson@gmail.com', 'e1003'),
(1004, 'Harry', 'Chapman', 'hchapman@gmail.com', 'h1004'),
(1005, 'Eric', 'Fisher', 'efisher@gmail.com', 'e1005'),
(1006, 'Jessica', 'Coleman', 'jcoleman@gmail.com', 'j1006');

-- --------------------------------------------------------

--
-- Table structure for table `student_assignments`
--

DROP TABLE IF EXISTS `student_assignments`;
CREATE TABLE IF NOT EXISTS `student_assignments` (
  `studentId` int(11) NOT NULL,
  `assignmentId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `grade` double NOT NULL,
  `completed` tinyint(1) NOT NULL,
  KEY `studentId` (`studentId`,`assignmentId`,`courseId`),
  KEY `courseId` (`courseId`,`assignmentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `student_assignments`
--
DROP TRIGGER IF EXISTS `insertAssignmentIdAndCourseIdCombo`;
DELIMITER $$
CREATE TRIGGER `insertAssignmentIdAndCourseIdCombo` BEFORE INSERT ON `student_assignments` FOR EACH ROW BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM assignments
        WHERE assignmentId = NEW.assignmentId 
          AND courseId = NEW.courseId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: assignmentId and courseId combination does not exist in the reference table.';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `insertCourseIdAndStudentIdCombo`;
DELIMITER $$
CREATE TRIGGER `insertCourseIdAndStudentIdCombo` BEFORE INSERT ON `student_assignments` FOR EACH ROW BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM student_courses 
        WHERE student_courses.studentId = NEW.studentId 
          AND student_courses.courseId = NEW.courseId
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: Student is not registered for this course offering.';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `updateAssignmentIdAndCourseIdCombo`;
DELIMITER $$
CREATE TRIGGER `updateAssignmentIdAndCourseIdCombo` BEFORE UPDATE ON `student_assignments` FOR EACH ROW BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM assignments
        WHERE assignmentId = NEW.assignmentId 
          AND courseId = NEW.courseId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: assignmentId and courseId combination does not exist in the reference table.';
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `updateCourseIdAndStudentIdCombo`;
DELIMITER $$
CREATE TRIGGER `updateCourseIdAndStudentIdCombo` BEFORE UPDATE ON `student_assignments` FOR EACH ROW BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM student_courses 
        WHERE student_courses.studentId = NEW.studentId 
          AND student_courses.courseId = NEW.courseId
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: Student is not registered for this course offering.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `student_courses`
--

DROP TABLE IF EXISTS `student_courses`;
CREATE TABLE IF NOT EXISTS `student_courses` (
  `studentId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `courseCode` varchar(8) NOT NULL,
  `courseSection` varchar(1) NOT NULL,
  UNIQUE KEY `studentID` (`studentId`,`courseCode`),
  KEY `course` (`courseCode`,`courseSection`),
  KEY `courseId` (`courseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Maps students to courses - makes sure that one student cannot be in more than one section of the same course';

--
-- Dumping data for table `student_courses`
--

INSERT INTO `student_courses` (`studentId`, `courseId`, `courseCode`, `courseSection`) VALUES
(1000, 1, 'COMP 232', 'S'),
(1000, 4, 'COMP 248', 'Y'),
(1000, 15, 'ENGR 213', 'Y'),
(1001, 16, 'ENGR 201', 'S'),
(1006, 4, 'COMP 248', 'Y'),
(1006, 16, 'ENGR 201', 'S'),
(1006, 10, 'SOEN 228', 'X'),
(1006, 11, 'SOEN 287', 'S');

--
-- Triggers `student_courses`
--
DROP TRIGGER IF EXISTS `insertCourseIdFromCourseCodeAndSection`;
DELIMITER $$
CREATE TRIGGER `insertCourseIdFromCourseCodeAndSection` BEFORE INSERT ON `student_courses` FOR EACH ROW BEGIN
    
    DECLARE tempCourseId INT;
    
    
    SELECT courseId INTO tempCourseId 
    FROM courses 
    WHERE courses.code = NEW.courseCode 
      AND courses.section = NEW.courseSection
    LIMIT 1;
    
    
    SET NEW.courseId = tempCourseId;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `updateCourseIdFromCourseCodeAndSection`;
DELIMITER $$
CREATE TRIGGER `updateCourseIdFromCourseCodeAndSection` BEFORE UPDATE ON `student_courses` FOR EACH ROW BEGIN
    
    DECLARE tempCourseId INT;
    
    
    SELECT courseId INTO tempCourseId 
    FROM courses 
    WHERE courses.code = NEW.courseCode 
      AND courses.section = NEW.courseSection
    LIMIT 1;
    
    
    SET NEW.courseId = tempCourseId;
END
$$
DELIMITER ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `courseId_of_assignment` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `professorID_that_assigned_assignment` FOREIGN KEY (`instructorId`) REFERENCES `instructors` (`instructorId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `instructor_courses`
--
ALTER TABLE `instructor_courses`
  ADD CONSTRAINT `instructor_courses_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `instructor_courses_ibfk_2` FOREIGN KEY (`instructorId`) REFERENCES `instructors` (`instructorId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_assignments`
--
ALTER TABLE `student_assignments`
  ADD CONSTRAINT `student_assignments_ibfk_1` FOREIGN KEY (`courseId`,`assignmentId`) REFERENCES `assignments` (`courseId`, `assignmentId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_assignments_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_courses`
--
ALTER TABLE `student_courses`
  ADD CONSTRAINT `course` FOREIGN KEY (`courseCode`,`courseSection`) REFERENCES `courses` (`code`, `section`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_of_course` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
