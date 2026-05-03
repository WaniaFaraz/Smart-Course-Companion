-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2026 at 04:38 AM
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
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
CREATE TABLE IF NOT EXISTS `announcements` (
  `announcementId` int(11) NOT NULL AUTO_INCREMENT,
  `instructorId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `title` varchar(70) NOT NULL,
  `message` text NOT NULL,
  `dateCreated` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`announcementId`),
  KEY `courseId` (`courseId`),
  KEY `instructorId` (`instructorId`,`courseId`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`announcementId`, `instructorId`, `courseId`, `title`, `message`, `dateCreated`) VALUES
(1, 2001, 4, 'Assignment 1 released', 'The assignment is now officially posted.\r\nYou can find the full instructions, grading rubric and any other information in the email that has been sent. This assignment is designed to help you apply the concepts we’ve covered regarding inheritance.', '2026-04-04'),
(2, 2001, 4, 'This is a test announcement', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '2026-04-05'),
(17, 2001, 36, 'Cancelled class Tuesday', 'There will be no class this Tuesday.', '2026-04-05'),
(18, 2001, 4, 'Deadline approaching', 'The deadline for Assignment 2 is in 3 days.', '2026-04-05');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='All assignments created by all professors';

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`assignmentId`, `instructorId`, `courseId`, `title`, `description`, `weight`, `dateCreated`, `dueDate`) VALUES
(3, 2001, 4, 'Assignment 1', 'The assignment instructions have been sent by email.', 20, '2026-04-04 21:23:56', '2026-04-29 00:00:00'),
(4, 2001, 4, 'Assignment 2', 'This assignment builds on assignment 1. Details in the email.', 10, '2026-04-06 02:32:13', '2026-04-24 00:00:00');

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
DROP TRIGGER IF EXISTS `insertPopulateStudentAssignments`;
DELIMITER $$
CREATE TRIGGER `insertPopulateStudentAssignments` AFTER INSERT ON `assignments` FOR EACH ROW BEGIN
INSERT INTO student_assignments (assignmentId, courseId, studentId)
    SELECT NEW.assignmentId, NEW.courseId, sc.studentId
    FROM student_courses sc
    WHERE sc.courseId = NEW.courseId;
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
DROP TRIGGER IF EXISTS `updatePopulateStudentAssignments`;
DELIMITER $$
CREATE TRIGGER `updatePopulateStudentAssignments` AFTER UPDATE ON `assignments` FOR EACH ROW BEGIN
    -- Update all existing records in student_assignments 
    -- that match the OLD assignmentId
    UPDATE student_assignments
    SET assignmentId = NEW.assignmentId,
        courseId = NEW.courseId
    WHERE assignmentId = OLD.assignmentId;
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
  `background` int(11) NOT NULL,
  PRIMARY KEY (`courseId`),
  UNIQUE KEY `Code` (`code`,`section`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='List of all course codes available at the institution.';

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`courseId`, `title`, `code`, `section`, `visibility`, `background`) VALUES
(1, 'Mathematics for Computer Science', 'COMP 232', 'S', 1, 1),
(2, 'Mathematics for Computer Science', 'COMP 232', 'Y', 1, 2),
(4, 'Object Oriented Prog. I', 'COMP 248', 'Y', 1, 4),
(5, 'Object Oriented Prog. II', 'COMP 249', 'W', 1, 5),
(6, 'Object Oriented Prog. II', 'COMP 249', 'Y', 1, 6),
(7, 'Applied Advanced Calculus', 'ENGR 233', 'X', 1, 1),
(8, 'Applied Advanced Calculus', 'ENGR 233', 'Y', 1, 2),
(9, 'System Hardware', 'SOEN 228', 'T', 1, 3),
(10, 'System Hardware', 'SOEN 228', 'X', 1, 4),
(11, 'Intro to Web Programming', 'SOEN 287', 'S', 1, 5),
(12, 'Intro to Web Programming', 'SOEN 287', 'W', 1, 6),
(14, 'Mathematics for Computer Science', 'COMP 232', 'N', 1, 1),
(15, 'Applied Ordinary Differential Equations', 'ENGR 213', 'Y', 1, 2),
(16, 'Professional Practice and Responsibility', 'ENGR 201', 'S', 1, 3),
(17, 'Applied Ordinary Differential Equations', 'ENGR 213', 'W', 1, 4),
(19, 'Materials Science', 'MIAE 221', 'X', 1, 5),
(23, 'Professional Practice and Responsibility', 'ENGR 201', 'T', 1, 6),
(34, 'Test', 'COMP 249', 'A', 1, 2),
(36, 'Introduction to Python', 'COMP 336', 'W', 0, 3),
(39, 'Web Programming', 'SOEN 287', 'R', 1, 8);

--
-- Triggers `courses`
--
DROP TRIGGER IF EXISTS `insertCourseBackground`;
DELIMITER $$
CREATE TRIGGER `insertCourseBackground` BEFORE INSERT ON `courses` FOR EACH ROW IF NEW.background < 1 OR NEW.background > 9 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Value must be between 1 and 9 inclusive.';
    END IF
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `updateBackground`;
DELIMITER $$
CREATE TRIGGER `updateBackground` BEFORE UPDATE ON `courses` FOR EACH ROW IF NEW.background < 1 OR NEW.background > 9 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Value must be between 1 and 9 inclusive.';
    END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `course_templates`
--

DROP TABLE IF EXISTS `course_templates`;
CREATE TABLE IF NOT EXISTS `course_templates` (
  `templateId` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` int(11) NOT NULL,
  `instructorId` int(11) NOT NULL,
  `description` text NOT NULL,
  `textbook` varchar(50) NOT NULL,
  `week1_2` text NOT NULL,
  `week3_4` text NOT NULL,
  `week5_6` text NOT NULL,
  `week7_8` text NOT NULL,
  `week9_10` text NOT NULL,
  `week11_12` text NOT NULL,
  PRIMARY KEY (`templateId`),
  UNIQUE KEY `courseId` (`courseId`,`instructorId`),
  KEY `instructor_courses_tenplates` (`instructorId`,`courseId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_templates`
--

INSERT INTO `course_templates` (`templateId`, `courseId`, `instructorId`, `description`, `textbook`, `week1_2`, `week3_4`, `week5_6`, `week7_8`, `week9_10`, `week11_12`) VALUES
(1, 4, 2001, 'Introduction to programming through Java. Basics of programming such as data types, variables, loops and other control statements, etc. More details in the course outline.', '', 'Introduction to Java', 'Variables and Data Types', 'Control Flow', 'Methods and Functions', 'Arrays', 'Object Oriented Programming');

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
(2001, 4),
(2001, 36),
(2001, 39),
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
(1000, 'Jane', 'Doe', 'jdoe@gmail.com', 'j1000'),
(1001, 'Adam', 'Black', 'aBlack@gmail.com', 'a1001'),
(1002, 'Stephanie', 'Grant', 'sgrant@gmail.com', 's1002'),
(1003, 'Emily', 'Clarkson', 'eclarkson@gmail.com', 'e1003'),
(1004, 'Harry', 'Chapman', 'hchapman@gmail.com', 'h1004'),
(1005, 'Eric', 'Fisher', 'efisher@gmail.com', 'e1005'),
(1006, 'Jessica', 'Coleman', 'jcoleman@gmail.com', 'j1006'),
(1014, 'Lily', 'Smith', 'lilys@gmail.com', 'ls1014');

-- --------------------------------------------------------

--
-- Table structure for table `student_assignments`
--

DROP TABLE IF EXISTS `student_assignments`;
CREATE TABLE IF NOT EXISTS `student_assignments` (
  `studentId` int(11) NOT NULL,
  `assignmentId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `grade` double DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  KEY `studentId` (`studentId`,`assignmentId`,`courseId`),
  KEY `courseId` (`courseId`,`assignmentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_assignments`
--

INSERT INTO `student_assignments` (`studentId`, `assignmentId`, `courseId`, `grade`, `completed`) VALUES
(1000, 3, 4, 90, 0),
(1006, 3, 4, NULL, 0),
(1000, 4, 4, NULL, 0),
(1002, 4, 4, NULL, 0),
(1006, 4, 4, NULL, 0);

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
(1002, 1, 'COMP 232', 'S'),
(1002, 4, 'COMP 248', 'Y'),
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

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
  `taskId` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `description` text NOT NULL,
  `completed` tinyint(1) NOT NULL,
  PRIMARY KEY (`taskId`),
  KEY `courseId` (`courseId`),
  KEY `studentId` (`studentId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`taskId`, `studentId`, `courseId`, `description`, `completed`) VALUES
(2, 1000, 4, 'Assignment 1', 0),
(3, 1000, 4, 'Check midterm', 0),
(4, 1000, 4, 'Revise Lecture 2', 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`instructorId`,`courseId`) REFERENCES `instructor_courses` (`instructorId`, `courseId`);

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `courseId_of_assignment` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `professorID_that_assigned_assignment` FOREIGN KEY (`instructorId`) REFERENCES `instructors` (`instructorId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course_templates`
--
ALTER TABLE `course_templates`
  ADD CONSTRAINT `instructor_courses_tenplates` FOREIGN KEY (`instructorId`,`courseId`) REFERENCES `instructor_courses` (`instructorId`, `courseId`);

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

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
