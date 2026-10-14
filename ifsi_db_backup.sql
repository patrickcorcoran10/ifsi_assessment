-- MySQL dump 10.13  Distrib 26.7.0, for macos26.6 (arm64)
--
-- Host: localhost    Database: ifsi_db
-- ------------------------------------------------------
-- Server version	26.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '3d2f3d28-c2a0-11f1-8ce7-224e21b93f10:1-58';

--
-- Table structure for table `exam_request`
--

DROP TABLE IF EXISTS `exam_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `course_code` varchar(20) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `request_date` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Pending',
  `needs_accommodation` int NOT NULL DEFAULT '0',
  `notes` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `exam_request_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_request`
--

LOCK TABLES `exam_request` WRITE;
/*!40000 ALTER TABLE `exam_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_requests`
--

DROP TABLE IF EXISTS `exam_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `request_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Pending',
  `needs_accommodation` int NOT NULL DEFAULT '0',
  `notes` text,
  PRIMARY KEY (`request_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `exam_requests_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_requests`
--

LOCK TABLES `exam_requests` WRITE;
/*!40000 ALTER TABLE `exam_requests` DISABLE KEYS */;
INSERT INTO `exam_requests` VALUES (1,1,'FF2','Firefighter II','2026-08-03','Completed',0,NULL),(2,1,'FF2','Firefighter II','2026-09-14','Pending',0,'Retaking practical portion'),(3,2,'FF2','Firefighter II','2026-09-15','Pending',1,'Extended time requested'),(4,3,'HMO','Hazardous Materials Operations','2026-08-20','Approved',0,NULL),(5,3,'FF2','Firefighter II','2026-09-18','Pending',0,NULL),(6,4,'FAE','Fire Apparatus Engineer','2026-07-11','Completed',0,NULL),(7,4,'FAE','Fire Apparatus Engineer','2026-08-29','Denied',0,'Missing prerequisite'),(8,4,'FAE','Fire Apparatus Engineer','2026-09-20','Pending',0,'Prerequisite now on file'),(9,5,'HMO','Hazardous Materials Operations','2026-09-02','Pending',1,'Reader requested'),(10,6,'FIO','Fire Instructor I','2026-09-05','Approved',0,NULL),(11,6,'FF2','Firefighter II','2026-09-21','Pending',0,NULL),(12,7,'FIO','Fire Instructor I','2026-08-15','Completed',0,NULL),(13,7,'FIO','Fire Instructor I','2026-09-22','Pending',0,NULL),(14,8,'HMO','Hazardous Materials Operations','2026-09-09','Pending',0,NULL),(15,9,'FAE','Fire Apparatus Engineer','2026-09-10','Approved',1,'Separate room'),(16,9,'HMO','Hazardous Materials Operations','2026-09-23','Pending',0,NULL),(17,10,'FF2','Firefighter II','2026-06-30','Completed',0,NULL),(18,10,'FIO','Fire Instructor I','2026-09-24','Pending',0,NULL),(19,2,'HMO','Hazardous Materials Operations','2026-09-25','Pending',0,NULL),(20,5,'HMO','Hazardous Materials Operations','2026-07-19','Completed',0,NULL),(21,13,'FIO','Fire Instructor I','2026-10-22','Pending',0,NULL),(22,14,'FIO','Fire Instructor I','2026-10-31','Pending',0,NULL),(23,15,'FF2','Firefighter II','2026-10-29','Pending',1,NULL),(24,11,'HMO','Hazardous Materials Operations','2026-10-28','Pending',0,NULL),(25,11,'FAE','Fire Apparatus Engineer','2026-10-17','Pending',0,NULL),(26,16,'FF2','Firefighter II','2026-10-22','Pending',1,NULL);
/*!40000 ALTER TABLE `exam_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(120) NOT NULL,
  `fire_department` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Jordan','Miller','jmiller@example.com','Champaign FD'),(2,'Casey','Nguyen','cnguyen@example.com','Urbana FD'),(3,'Riley','Johnson','rjohnson@example.com','Savoy FPD'),(4,'Morgan','Patel','mpatel@example.com','Decatur FD'),(5,'Taylor','Brooks','tbrooks@example.com','Danville FD'),(6,'Avery','Garcia','agarcia@example.com','Champaign FD'),(7,'Quinn','Robinson','qrobinson@example.com','Mahomet FPD'),(8,'Drew','Anderson','danderson@example.com','Rantoul FD'),(9,'Jamie','Lee','jlee@example.com','Urbana FD'),(10,'Parker','Wilson','pwilson@example.com','Tolono FPD'),(11,'test','test','test@email.com',NULL),(13,'Chase','Meidroth','cmeidroth@email.com','Chicago'),(14,'colson','montgomery','cmonty@whitesox.com','Chicago'),(15,'sam','antinochi','santinochi@whitesox.com','chicago'),(16,'Braden','Montgomery','bmonty@email.com','Chicago');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ifsi_db'
--

--
-- Dumping routines for database 'ifsi_db'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-13 20:00:09
