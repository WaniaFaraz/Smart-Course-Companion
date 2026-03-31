-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2026 at 08:52 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--
-- Creation: Mar 31, 2026 at 04:54 PM
-- Last update: Mar 31, 2026 at 05:27 PM
--

CREATE TABLE `assignments` (
  `assignmentId` int(11) NOT NULL COMMENT 'unique assignment id',
  `instructorId` int(11) NOT NULL COMMENT 'professor who created the assignment',
  `courseId` int(11) NOT NULL,
  `title` varchar(30) NOT NULL COMMENT 'title of assignment',
  `description` text NOT NULL,
  `weight` int(11) NOT NULL,
  `dateCreated` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'by default - date the date and time the data was entered in the table',
  `dueDate` datetime NOT NULL COMMENT 'due date of assignment'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='All assignments created by all professors';

--
-- RELATIONSHIPS FOR TABLE `assignments`:
--   `courseId`
--       `courses` -> `courseId`
--   `instructorId`
--       `instructors` -> `instructorId`
--

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`assignmentId`, `instructorId`, `courseId`, `title`, `description`, `weight`, `dateCreated`, `dueDate`) VALUES
(1, 2001, 3, 'Assignment1', 'The assignment instructions have been emailed.', 20, '2026-03-31 17:27:47', '2026-03-31 19:26:06');

--
-- Triggers `assignments`
--
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
DELIMITER $$
CREATE TRIGGER `insertAssignmentWeightLimitations` BEFORE INSERT ON `assignments` FOR EACH ROW BEGIN
    IF NEW.weight <= 0 OR NEW.weight > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Weight must be greater than 0 and less than or equal to 100';
    END IF;
END
$$
DELIMITER ;
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
-- Creation: Mar 31, 2026 at 04:42 PM
-- Last update: Mar 31, 2026 at 06:49 PM
--

CREATE TABLE `courses` (
  `courseId` int(11) NOT NULL,
  `title` varchar(70) NOT NULL,
  `code` varchar(8) NOT NULL,
  `section` varchar(1) NOT NULL,
  `visibility` int(11) NOT NULL DEFAULT 1 COMMENT '1 : course visible, 0: not visible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='List of all course codes available at the institution.';

--
-- RELATIONSHIPS FOR TABLE `courses`:
--

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
-- Creation: Mar 31, 2026 at 04:42 PM
-- Last update: Mar 31, 2026 at 04:37 PM
--

CREATE TABLE `instructors` (
  `instructorId` int(11) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `emailAddress` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='List of all professors at the institution';

--
-- RELATIONSHIPS FOR TABLE `instructors`:
--

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
-- Creation: Mar 31, 2026 at 04:43 PM
-- Last update: Mar 31, 2026 at 04:50 PM
--

CREATE TABLE `instructor_courses` (
  `instructorId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Maps instructors to ids. (1 course -> 1 prof)';

--
-- RELATIONSHIPS FOR TABLE `instructor_courses`:
--   `courseId`
--       `courses` -> `courseId`
--   `instructorId`
--       `instructors` -> `instructorId`
--

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
-- Creation: Mar 31, 2026 at 04:43 PM
-- Last update: Mar 31, 2026 at 04:30 PM
--

CREATE TABLE `students` (
  `studentId` int(11) NOT NULL COMMENT 'Primary key - added by student at account creation',
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `emailAddress` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Basic student info - ID, names, email, account password';

--
-- RELATIONSHIPS FOR TABLE `students`:
--

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
-- Table structure for table `student_courses`
--
-- Creation: Mar 31, 2026 at 04:44 PM
-- Last update: Mar 31, 2026 at 04:33 PM
--

CREATE TABLE `student_courses` (
  `studentId` int(11) NOT NULL,
  `courseCode` varchar(8) NOT NULL,
  `courseSection` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Maps students to courses - makes sure that one student cannot be in more than one section of the same course';

--
-- RELATIONSHIPS FOR TABLE `student_courses`:
--   `courseCode`
--       `courses` -> `Code`
--   `courseSection`
--       `courses` -> `Section`
--   `studentID`
--       `students` -> `studentId`
--

--
-- Dumping data for table `student_courses`
--

INSERT INTO `student_courses` (`studentId`, `courseCode`, `courseSection`) VALUES
(1000, 'COMP 232', 'S'),
(1000, 'COMP 248', 'Y'),
(1006, 'COMP 248', 'Y'),
(1001, 'ENGR 201', 'S'),
(1006, 'ENGR 201', 'S'),
(1000, 'ENGR 213', 'Y'),
(1006, 'SOEN 228', 'X'),
(1006, 'SOEN 287', 'S');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`assignmentId`),
  ADD KEY `professorID` (`instructorId`),
  ADD KEY `courseId` (`courseId`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`courseId`),
  ADD UNIQUE KEY `Code` (`code`,`section`);

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`instructorId`);

--
-- Indexes for table `instructor_courses`
--
ALTER TABLE `instructor_courses`
  ADD UNIQUE KEY `course_id` (`courseId`),
  ADD KEY `instructor_id` (`instructorId`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`studentId`);

--
-- Indexes for table `student_courses`
--
ALTER TABLE `student_courses`
  ADD UNIQUE KEY `studentID` (`studentId`,`courseCode`),
  ADD KEY `course` (`courseCode`,`courseSection`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `assignmentId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'unique assignment id', AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `courseId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
-- Constraints for table `student_courses`
--
ALTER TABLE `student_courses`
  ADD CONSTRAINT `course` FOREIGN KEY (`courseCode`,`courseSection`) REFERENCES `courses` (`Code`, `Section`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_of_course` FOREIGN KEY (`studentID`) REFERENCES `students` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE;


--
-- Metadata
--
USE `phpmyadmin`;

--
-- Metadata for table assignments
--

--
-- Metadata for table courses
--

--
-- Dumping data for table `pma__table_uiprefs`
--

INSERT INTO `pma__table_uiprefs` (`username`, `db_name`, `table_name`, `prefs`, `last_update`) VALUES
('root', 'lms_info', 'courses', '{\"CREATE_TIME\":\"2026-03-30 11:32:30\"}', '2026-03-31 16:40:12');

--
-- Metadata for table instructors
--

--
-- Metadata for table instructor_courses
--

--
-- Metadata for table students
--

--
-- Metadata for table student_courses
--

--
-- Metadata for database lms_info
--
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
