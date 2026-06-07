/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: sql_item_shop
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `archived_orders`
--

DROP TABLE IF EXISTS `archived_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `archived_orders` (
  `archive_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('OPEN','PAID','CANCELLED') NOT NULL,
  `archived_at` date NOT NULL,
  PRIMARY KEY (`archive_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archived_orders`
--

LOCK TABLES `archived_orders` WRITE;
/*!40000 ALTER TABLE `archived_orders` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `archived_orders` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `categories` VALUES
(2,'Armor'),
(8,'Artifacts'),
(7,'Equipment'),
(4,'Food'),
(5,'Magic'),
(3,'Potions'),
(9,'Supplements'),
(6,'Tools'),
(1,'Weapons');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `birthdate` date NOT NULL,
  `city` varchar(100) NOT NULL,
  `registration_date` date NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `email` varchar(255) DEFAULT NULL,
  `discount_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `customers` VALUES
(1,'Max','Müller','1995-03-12','Berlin','2021-04-01',1,'max.mueller@mail.de',0.00),
(2,'Anna','Schmidt','1990-07-21','Berlin','2020-06-15',1,'anna.schmidt@mail.de',0.00),
(3,'Tom','Fischer','1988-01-11','Berlin','2019-08-03',1,'tom.fischer@mail.de',0.00),
(4,'Lena','Becker','2001-05-18','Berlin','2024-01-10',1,'lena.becker@mail.de',0.00),
(5,'Paul','Wagner','1998-02-07','Berlin','2022-03-20',1,'paul.wagner@mail.de',0.00),
(6,'Marie','Koch','1993-10-12','Berlin','2021-07-22',1,'marie.koch@mail.de',0.00),
(7,'Jan','Wolf','1987-04-02','Berlin','2018-09-12',1,'jan.wolf@mail.de',0.00),
(8,'Sophie','Neumann','1999-12-09','Berlin','2023-05-08',1,'sophie.neumann@mail.de',0.00),
(9,'Felix','Hartmann','1994-11-22','Hamburg','2020-11-01',1,'felix.hartmann@mail.de',0.00),
(10,'Laura','Krüger','1997-08-17','Hamburg','2022-05-10',1,'laura.krueger@mail.de',0.00),
(11,'Tim','Werner','1989-01-03','Hamburg','2019-12-01',1,'tim.werner@mail.de',0.00),
(12,'Julia','Schwarz','1996-09-13','Hamburg','2021-08-20',1,'julia.schwarz@mail.de',0.00),
(13,'Ben','Zimmermann','2000-06-05','Hamburg','2024-02-01',1,'ben.zimmermann@mail.de',0.00),
(14,'Nina','Braun','1992-03-27','Hamburg','2020-03-14',1,'nina.braun@mail.de',0.00),
(15,'Leon','Hofmann','1991-05-11','Köln','2021-01-01',1,'leon.hofmann@mail.de',0.00),
(16,'Emma','Keller','1998-07-15','Köln','2022-04-05',1,'emma.keller@mail.de',0.00),
(17,'Noah','Bauer','1987-12-04','Köln','2019-10-11',1,'noah.bauer@mail.de',0.00),
(18,'Mia','Richter','2001-02-18','Köln','2024-01-18',1,'mia.richter@mail.de',0.00),
(19,'Jonas','Klein','1994-09-30','Köln','2020-06-12',1,'jonas.klein@mail.de',0.00),
(20,'Lukas','Schröder','1990-04-16','München','2020-07-07',1,'lukas.schroeder@mail.de',0.00),
(21,'Lea','Schulz','1997-11-25','München','2023-03-14',1,'lea.schulz@mail.de',0.00),
(22,'David','Brandt','1988-08-09','München','2019-09-02',1,'david.brandt@mail.de',0.00),
(23,'Sarah','Voigt','1999-01-20','München','2022-12-01',1,'sarah.voigt@mail.de',0.00),
(24,'Moritz','Franke','1995-10-30','Leipzig','2021-06-16',1,'moritz.franke@mail.de',0.00),
(25,'Clara','Seidel','1993-07-07','Leipzig','2020-04-08',1,'clara.seidel@mail.de',0.00),
(26,'Finn','Jäger','1998-02-11','Leipzig','2022-02-22',1,'finn.jaeger@mail.de',0.00),
(27,'Hannah','Busch','2000-05-09','Leipzig','2023-11-04',1,'hannah.busch@mail.de',0.00),
(28,'Erik','Pohl','1991-03-14','Dresden','2020-10-01',1,'erik.pohl@mail.de',0.00),
(29,'Lisa','Krause','1996-12-06','Dresden','2022-01-09',1,'lisa.krause@mail.de',0.00),
(30,'Niklas','Lorenz','1994-06-18','Dresden','2021-05-05',1,'niklas.lorenz@mail.de',0.00),
(31,'Oliver','Huber','1989-03-11','Berlin','2022-04-01',TRUE,'oliver.huber@mail.de',0),
(32,'Jana','Eberhardt','1995-08-22','Hamburg','2021-07-15',TRUE,'jana.eberhardt@mail.de',0),
(33,'Stefan','Albrecht','1992-11-05','Köln','2020-02-18',TRUE,'stefan.albrecht@mail.de',0),
(34,'Kathrin','Dobler','1997-01-27','München','2023-05-20',TRUE,'kathrin.dobler@mail.de',0),
(35,'Tobias','Gruber','1994-06-09','Leipzig','2022-09-12',TRUE,'tobias.gruber@mail.de',0);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `fk_orderitems_order` (`order_id`),
  KEY `fk_orderitems_product` (`product_id`),
  CONSTRAINT `fk_orderitems_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_orderitems_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=301 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `order_items` VALUES
(1,1,21,1,40.00),
(2,2,22,2,135.00),
(3,3,31,3,10.00),
(4,4,32,4,60.00),
(5,5,77,1,3.99),
(6,6,78,2,27.99),
(7,7,21,3,40.00),
(8,8,22,4,135.00),
(9,9,31,1,10.00),
(10,10,32,2,60.00),
(11,11,77,3,3.99),
(12,12,78,4,27.99),
(13,13,21,1,40.00),
(14,14,22,2,135.00),
(15,15,31,3,10.00),
(16,16,32,4,60.00),
(17,17,77,1,3.99),
(18,18,78,2,27.99),
(19,19,21,3,40.00),
(20,20,22,4,135.00),
(21,21,31,1,10.00),
(22,22,32,2,60.00),
(23,23,77,3,3.99),
(24,24,78,4,27.99),
(25,25,21,1,40.00),
(26,26,22,2,135.00),
(27,27,31,3,10.00),
(28,28,32,4,60.00),
(29,29,77,1,3.99),
(30,30,78,2,27.99),
(31,31,21,3,40.00),
(32,32,22,4,135.00),
(33,33,31,1,10.00),
(34,34,32,2,60.00),
(35,35,77,3,3.99),
(36,36,78,4,27.99),
(37,37,21,1,40.00),
(38,38,22,2,135.00),
(39,39,31,3,10.00),
(40,40,32,4,60.00),
(41,41,77,1,3.99),
(42,42,78,2,27.99),
(43,43,21,3,40.00),
(44,44,22,4,135.00),
(45,45,31,1,10.00),
(46,46,32,2,60.00),
(47,47,77,3,3.99),
(48,48,78,4,27.99),
(49,49,21,1,40.00),
(50,50,22,2,135.00),
(51,51,31,3,10.00),
(52,52,32,4,60.00),
(53,53,77,1,3.99),
(54,54,78,2,27.99),
(55,55,21,3,40.00),
(56,56,22,4,135.00),
(57,57,31,1,10.00),
(58,58,32,2,60.00),
(59,59,77,3,3.99),
(60,60,78,4,27.99),
(61,61,21,1,40.00),
(62,62,22,2,135.00),
(63,63,31,3,10.00),
(64,64,32,4,60.00),
(65,65,77,1,3.99),
(66,66,78,2,27.99),
(67,67,21,3,40.00),
(68,68,22,4,135.00),
(69,69,31,1,10.00),
(70,70,32,2,60.00),
(71,71,77,3,3.99),
(72,72,78,4,27.99),
(73,73,21,1,40.00),
(74,74,22,2,135.00),
(75,75,31,3,10.00),
(76,76,32,4,60.00),
(77,77,77,1,3.99),
(78,78,78,2,27.99),
(79,79,21,3,40.00),
(80,80,22,4,135.00),
(81,81,31,1,10.00),
(82,82,32,2,60.00),
(83,83,77,3,3.99),
(84,84,78,4,27.99),
(85,85,21,1,40.00),
(86,86,22,2,135.00),
(87,87,31,3,10.00),
(88,88,32,4,60.00),
(89,89,77,1,3.99),
(90,90,78,2,27.99),
(91,91,21,3,40.00),
(92,92,22,4,135.00),
(93,93,31,1,10.00),
(94,94,32,2,60.00),
(95,95,77,3,3.99),
(96,96,78,4,27.99),
(97,97,21,1,40.00),
(98,98,22,2,135.00),
(99,99,31,3,10.00),
(100,100,32,4,60.00),
(101,1,77,1,3.99),
(102,2,78,2,27.99),
(103,3,21,3,40.00),
(104,4,22,4,135.00),
(105,5,31,1,10.00),
(106,6,32,2,60.00),
(107,7,77,3,3.99),
(108,8,78,4,27.99),
(109,9,21,1,40.00),
(110,10,22,2,135.00),
(111,11,31,3,10.00),
(112,12,32,4,60.00),
(113,13,77,1,3.99),
(114,14,78,2,27.99),
(115,15,21,3,40.00),
(116,16,22,4,135.00),
(117,17,31,1,10.00),
(118,18,32,2,60.00),
(119,19,77,3,3.99),
(120,20,78,4,27.99),
(121,21,21,1,40.00),
(122,22,22,2,135.00),
(123,23,31,3,10.00),
(124,24,32,4,60.00),
(125,25,77,1,3.99),
(126,26,78,2,27.99),
(127,27,21,3,40.00),
(128,28,22,4,135.00),
(129,29,31,1,10.00),
(130,30,32,2,60.00),
(131,31,77,3,3.99),
(132,32,78,4,27.99),
(133,33,21,1,40.00),
(134,34,22,2,135.00),
(135,35,31,3,10.00),
(136,36,32,4,60.00),
(137,37,77,1,3.99),
(138,38,78,2,27.99),
(139,39,21,3,40.00),
(140,40,22,4,135.00),
(141,41,31,1,10.00),
(142,42,32,2,60.00),
(143,43,77,3,3.99),
(144,44,78,4,27.99),
(145,45,21,1,40.00),
(146,46,22,2,135.00),
(147,47,31,3,10.00),
(148,48,32,4,60.00),
(149,49,77,1,3.99),
(150,50,78,2,27.99),
(151,51,21,3,40.00),
(152,52,22,4,135.00),
(153,53,31,1,10.00),
(154,54,32,2,60.00),
(155,55,77,3,3.99),
(156,56,78,4,27.99),
(157,57,21,1,40.00),
(158,58,22,2,135.00),
(159,59,31,3,10.00),
(160,60,32,4,60.00),
(161,61,77,1,3.99),
(162,62,78,2,27.99),
(163,63,21,3,40.00),
(164,64,22,4,135.00),
(165,65,31,1,10.00),
(166,66,32,2,60.00),
(167,67,77,3,3.99),
(168,68,78,4,27.99),
(169,69,21,1,40.00),
(170,70,22,2,135.00),
(171,71,31,3,10.00),
(172,72,32,4,60.00),
(173,73,77,1,3.99),
(174,74,78,2,27.99),
(175,75,21,3,40.00),
(176,76,22,4,135.00),
(177,77,31,1,10.00),
(178,78,32,2,60.00),
(179,79,77,3,3.99),
(180,80,78,4,27.99),
(181,81,1,1,50.00),
(182,82,2,2,95.00),
(183,83,3,3,90.00),
(184,84,4,1,75.00),
(185,85,5,2,110.00),
(186,86,6,3,25.00),
(187,87,7,1,120.00),
(188,88,8,2,160.00),
(189,89,9,3,150.00),
(190,90,10,1,180.00),
(191,91,11,2,60.00),
(192,92,12,3,140.00),
(193,93,13,1,80.00),
(194,94,14,2,120.00),
(195,95,15,3,300.00),
(196,96,16,1,65.00),
(197,97,17,2,150.00),
(198,98,18,3,110.00),
(199,99,19,1,600.00),
(200,100,20,2,45.00),
(201,1,21,3,40.00),
(202,2,22,1,135.00),
(203,3,23,2,15.00),
(204,4,24,3,18.00),
(205,5,25,1,20.00),
(206,6,26,2,20.00),
(207,7,27,3,22.00),
(208,8,28,1,30.00),
(209,9,29,2,32.00),
(210,10,30,3,21.00),
(211,11,31,1,10.00),
(212,12,32,2,60.00),
(213,13,33,3,1.99),
(214,14,34,1,2.49),
(215,15,35,2,3.99),
(216,16,36,3,5.99),
(217,17,37,1,8.99),
(218,18,38,2,9.99),
(219,19,39,3,6.99),
(220,20,40,1,7.99),
(221,21,41,2,6.49),
(222,22,42,3,5.49),
(223,23,43,1,50.00),
(224,24,44,2,50.00),
(225,25,45,3,60.00),
(226,26,46,1,90.00),
(227,27,47,2,150.00),
(228,28,48,3,15.00),
(229,29,49,1,75.00),
(230,30,50,2,120.00),
(231,31,51,3,35.00),
(232,32,52,1,25.00),
(233,33,53,2,45.00),
(234,34,54,3,30.00),
(235,35,55,1,28.00),
(236,36,56,2,32.00),
(237,37,57,3,22.00),
(238,38,58,1,18.00),
(239,39,59,2,49.99),
(240,40,60,3,19.99),
(241,41,1,1,50.00),
(242,42,2,2,95.00),
(243,43,3,3,90.00),
(244,44,4,1,75.00),
(245,45,5,2,110.00),
(246,46,6,3,25.00),
(247,47,7,1,120.00),
(248,48,8,2,160.00),
(249,49,9,3,150.00),
(250,50,10,1,180.00),
(251,51,11,2,60.00),
(252,52,12,3,140.00),
(253,53,13,1,80.00),
(254,54,14,2,120.00),
(255,55,15,3,300.00),
(256,56,16,1,65.00),
(257,57,17,2,150.00),
(258,58,18,3,110.00),
(259,59,19,1,600.00),
(260,60,20,2,45.00),
(261,61,21,3,40.00),
(262,62,22,1,135.00),
(263,63,23,2,15.00),
(264,64,24,3,18.00),
(265,65,25,1,20.00),
(266,66,26,2,20.00),
(267,67,27,3,22.00),
(268,68,28,1,30.00),
(269,69,29,2,32.00),
(270,70,30,3,21.00),
(271,71,31,1,10.00),
(272,72,32,2,60.00),
(273,73,33,3,1.99),
(274,74,34,1,2.49),
(275,75,35,2,3.99),
(276,76,36,3,5.99),
(277,77,37,1,8.99),
(278,78,38,2,9.99),
(279,79,39,3,6.99),
(280,80,40,1,7.99),
(281,81,71,1,29.99),
(282,82,72,1,4.99),
(283,83,75,1,39.99),
(284,84,76,1,24.99),
(285,85,71,1,29.99),
(286,86,72,1,4.99),
(287,87,75,1,39.99),
(288,88,76,1,24.99),
(289,89,71,1,29.99),
(290,90,72,1,4.99),
(291,91,75,1,39.99),
(292,92,76,1,24.99),
(293,93,71,1,29.99),
(294,94,72,1,4.99),
(295,95,75,1,39.99),
(296,96,76,1,24.99),
(297,97,71,1,29.99),
(298,98,72,1,4.99),
(299,99,75,1,39.99),
(300,100,76,1,24.99);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `order_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('OPEN','PAID','CANCELLED') DEFAULT 'OPEN',
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_customer` (`customer_id`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `orders` VALUES
(1,1,'2022-01-01',163.99,'PAID'),
(2,2,'2022-02-04',460.98,'PAID'),
(3,3,'2022-03-07',180.00,'PAID'),
(4,4,'2022-04-10',834.00,'PAID'),
(5,5,'2022-05-13',33.99,'PAID'),
(6,6,'2022-06-16',215.98,'PAID'),
(7,7,'2022-07-19',197.97,'PAID'),
(8,8,'2022-08-22',681.96,'PAID'),
(9,9,'2022-09-25',114.00,'PAID'),
(10,10,'2022-10-28',453.00,'PAID'),
(11,11,'2022-11-03',51.97,'PAID'),
(12,12,'2022-12-06',471.96,'PAID'),
(13,13,'2022-01-09',49.96,'PAID'),
(14,14,'2022-02-12',328.47,'PAID'),
(15,15,'2022-03-15',157.98,'PAID'),
(16,16,'2023-04-18',797.97,'PAID'),
(17,17,'2023-05-21',22.98,'PAID'),
(18,18,'2023-06-24',195.96,'PAID'),
(19,19,'2023-07-27',152.94,'PAID'),
(20,20,'2023-08-02',659.95,'PAID'),
(21,21,'2023-09-05',62.98,'PAID'),
(22,22,'2023-10-08',406.47,'PAID'),
(23,23,'2023-11-11',91.97,'PAID'),
(24,24,'2023-12-14',451.96,'PAID'),
(25,25,'2023-01-17',223.99,'PAID'),
(26,26,'2023-02-20',415.98,'PAID'),
(27,27,'2023-03-23',450.00,'PAID'),
(28,1,'2023-04-26',163.99,'PAID'),
(29,2,'2023-05-01',460.98,'PAID'),
(30,3,'2023-06-04',180.00,'PAID'),
(31,4,'2023-07-07',834.00,'PAID'),
(32,5,'2023-08-10',33.99,'PAID'),
(33,6,'2023-09-13',215.98,'PAID'),
(34,7,'2023-10-16',197.97,'PAID'),
(35,8,'2023-11-19',681.96,'PAID'),
(36,9,'2024-12-22',114.00,'PAID'),
(37,10,'2024-01-25',453.00,'PAID'),
(38,11,'2024-02-28',51.97,'PAID'),
(39,12,'2024-03-03',471.96,'PAID'),
(40,13,'2024-04-06',49.96,'PAID'),
(41,14,'2024-05-09',328.47,'PAID'),
(42,15,'2024-06-12',157.98,'PAID'),
(43,16,'2024-07-15',797.97,'PAID'),
(44,17,'2024-08-18',22.98,'PAID'),
(45,18,'2024-09-21',195.96,'PAID'),
(46,19,'2024-10-24',152.94,'PAID'),
(47,20,'2024-11-27',659.95,'PAID'),
(48,21,'2024-12-02',62.98,'PAID'),
(49,22,'2024-01-05',406.47,'PAID'),
(50,23,'2024-02-08',91.97,'PAID'),
(51,24,'2024-03-11',451.96,'PAID'),
(52,25,'2024-04-14',223.99,'PAID'),
(53,26,'2024-05-17',415.98,'PAID'),
(54,27,'2024-06-20',450.00,'PAID'),
(55,1,'2024-07-23',163.99,'PAID'),
(56,2,'2024-08-26',460.98,'PAID'),
(57,3,'2024-09-01',180.00,'PAID'),
(58,4,'2024-10-04',834.00,'PAID'),
(59,5,'2024-11-07',33.99,'PAID'),
(60,6,'2024-12-10',215.98,'PAID'),
(61,7,'2024-01-13',197.97,'PAID'),
(62,8,'2024-02-16',681.96,'PAID'),
(63,9,'2024-03-19',114.00,'PAID'),
(64,10,'2024-04-22',453.00,'PAID'),
(65,11,'2024-05-25',51.97,'PAID'),
(66,12,'2025-06-28',471.96,'PAID'),
(67,13,'2025-07-03',49.96,'PAID'),
(68,14,'2025-08-06',328.47,'PAID'),
(69,15,'2025-09-09',157.98,'PAID'),
(70,16,'2025-10-12',797.97,'PAID'),
(71,17,'2025-11-15',22.98,'PAID'),
(72,18,'2025-12-18',195.96,'PAID'),
(73,19,'2025-01-21',152.94,'PAID'),
(74,20,'2025-02-24',659.95,'PAID'),
(75,21,'2025-03-27',62.98,'PAID'),
(76,22,'2025-04-02',406.47,'PAID'),
(77,23,'2025-05-05',91.97,'PAID'),
(78,24,'2025-06-08',451.96,'PAID'),
(79,25,'2025-07-11',223.99,'PAID'),
(80,26,'2025-08-14',415.98,'PAID'),
(81,27,'2025-09-17',450.00,'OPEN'),
(82,1,'2025-10-20',163.99,'OPEN'),
(83,2,'2025-11-23',460.98,'OPEN'),
(84,3,'2025-12-26',180.00,'OPEN'),
(85,4,'2025-01-01',834.00,'OPEN'),
(86,5,'2025-02-04',33.99,'OPEN'),
(87,6,'2025-03-07',215.98,'OPEN'),
(88,7,'2025-04-10',197.97,'OPEN'),
(89,8,'2025-05-13',681.96,'OPEN'),
(90,9,'2025-06-16',114.00,'OPEN'),
(91,10,'2025-07-19',453.00,'OPEN'),
(92,11,'2025-08-22',51.97,'OPEN'),
(93,12,'2025-09-25',471.96,'OPEN'),
(94,13,'2025-10-28',49.96,'OPEN'),
(95,14,'2025-11-03',328.47,'OPEN'),
(96,15,'2025-12-06',157.98,'CANCELLED'),
(97,16,'2025-01-09',797.97,'CANCELLED'),
(98,17,'2025-02-12',22.98,'CANCELLED'),
(99,18,'2025-03-15',195.96,'CANCELLED'),
(100,19,'2025-04-18',152.94,'CANCELLED');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `purchase_price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `archived_at` date DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `fk_products_category` (`category_id`),
  KEY `fk_products_supplier` (`supplier_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `fk_products_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `products` VALUES
(1,'Iron Sword',1,1,25.00,50.00,1,NULL,15),
(2,'Steel Sword',1,1,50.00,95.00,1,NULL,8),
(3,'War Axe',1,1,45.00,90.00,1,NULL,6),
(4,'Long Bow',1,2,35.00,75.00,1,NULL,12),
(5,'Crossbow',1,2,55.00,110.00,1,NULL,7),
(6,'Dagger',1,1,10.00,25.00,1,NULL,30),
(7,'Battle Hammer',1,1,60.00,120.00,1,NULL,4),
(8,'Magic Staff',1,2,80.00,160.00,1,NULL,5),
(9,'Katana',1,2,75.00,150.00,1,NULL,9),
(10,'Greatsword',1,1,90.00,180.00,1,NULL,3),
(11,'Spear',1,1,30.00,60.00,1,NULL,10),
(12,'Halberd',1,1,70.00,140.00,1,NULL,4),
(13,'Leather Armor',2,1,40.00,80.00,1,NULL,12),
(14,'Chain Mail',2,1,60.00,120.00,1,NULL,8),
(15,'Knight Armor',2,1,150.00,300.00,1,NULL,3),
(16,'Steel Helmet',2,1,30.00,65.00,1,NULL,14),
(17,'Tower Shield',2,1,75.00,150.00,1,NULL,6),
(18,'Mage Robe',2,2,55.00,110.00,1,NULL,7),
(19,'Dragon Scale Armor',2,5,300.00,600.00,1,NULL,1),
(20,'Iron Boots',2,1,20.00,45.00,1,NULL,16),
(21,'Gauntlets',2,1,18.00,40.00,1,NULL,18),
(22,'Cloak of Protection',2,2,70.00,135.00,1,NULL,5),
(23,'Health Potion',3,2,3.00,15.00,1,NULL,120),
(24,'Mana Potion',3,2,4.00,18.00,1,NULL,95),
(25,'Strength Potion',3,2,5.00,20.00,1,NULL,60),
(26,'Speed Potion',3,2,5.00,20.00,1,NULL,45),
(27,'Defense Potion',3,2,5.00,22.00,1,NULL,38),
(28,'Healing Elixir',3,2,7.00,30.00,1,NULL,25),
(29,'Mana Elixir',3,2,8.00,32.00,1,NULL,20),
(30,'Stamina Potion',3,2,5.00,21.00,1,NULL,42),
(31,'Antidote',3,2,2.00,10.00,1,NULL,55),
(32,'Invisibility Potion',3,2,15.00,60.00,1,NULL,8),
(33,'Apple',4,3,0.50,1.99,1,NULL,200),
(34,'Banana',4,3,0.70,2.49,1,NULL,180),
(35,'Bread',4,3,1.00,3.99,1,NULL,140),
(36,'Cheese',4,3,2.00,5.99,1,NULL,90),
(37,'Fish',4,3,3.00,8.99,1,NULL,35),
(38,'Meat',4,3,4.00,9.99,1,NULL,60),
(39,'Honey',4,3,2.00,6.99,1,NULL,50),
(40,'Berry Pie',4,3,3.00,7.99,1,NULL,25),
(41,'Mushroom Soup',4,3,2.50,6.49,1,NULL,30),
(42,'Dried Meat',4,3,2.00,5.49,1,NULL,70),
(43,'Fire Scroll',5,2,20.00,50.00,1,NULL,20),
(44,'Ice Scroll',5,2,20.00,50.00,1,NULL,18),
(45,'Lightning Scroll',5,2,25.00,60.00,1,NULL,15),
(46,'Teleport Rune',5,2,35.00,90.00,1,NULL,6),
(47,'Summoning Crystal',5,5,60.00,150.00,1,NULL,3),
(48,'Magic Dust',5,2,5.00,15.00,1,NULL,40),
(49,'Mana Crystal',5,2,30.00,75.00,1,NULL,10),
(50,'Enchanted Gem',5,5,50.00,120.00,1,NULL,4),
(51,'Pickaxe',6,4,15.00,35.00,1,NULL,20),
(52,'Hammer',6,4,10.00,25.00,1,NULL,25),
(53,'Fishing Rod',6,4,18.00,45.00,1,NULL,10),
(54,'Shovel',6,4,12.00,30.00,1,NULL,15),
(55,'Saw',6,4,10.00,28.00,1,NULL,12),
(56,'Hatchet',6,4,12.00,32.00,1,NULL,9),
(57,'Lantern',6,4,8.00,22.00,1,NULL,18),
(58,'Repair Kit',6,4,6.00,18.00,1,NULL,30),
(59,'Lifting Belt',7,4,20.00,49.99,1,NULL,15),
(60,'Wrist Wraps',7,4,8.00,19.99,1,NULL,20),
(61,'Gym Towel',7,4,4.00,9.99,1,NULL,30),
(62,'Torch',7,4,2.00,7.99,1,NULL,40),
(63,'Rope',7,4,3.00,12.99,1,NULL,25),
(64,'Tent',7,4,25.00,69.99,1,NULL,8),
(65,'Dragon Orb',8,5,500.00,999.99,1,NULL,0),
(66,'Phoenix Feather',8,5,250.00,499.99,1,NULL,1),
(67,'Ancient Crown',8,5,400.00,799.99,0,'2024-05-01',0),
(68,'Crystal Skull',8,5,350.00,699.99,0,'2024-08-15',0),
(69,'Orb of Eternity',8,5,600.00,1299.99,1,NULL,0),
(70,'Ring of Kings',8,5,450.00,899.99,1,NULL,0),
(71,'Creatine',9,4,10.00,29.99,1,NULL,50),
(72,'Protein Shake',9,4,2.00,4.99,1,NULL,120),
(73,'Protein Bar',9,4,1.00,2.99,1,NULL,180),
(74,'Pre Workout',9,4,12.00,34.99,1,NULL,30),
(75,'Mass Gainer',9,4,15.00,39.99,1,NULL,20),
(76,'BCAA',9,4,8.00,24.99,1,NULL,35),
(77,'Electrolyte Drink',9,4,1.50,3.99,1,NULL,100),
(78,'Recovery Powder',9,4,10.00,27.99,1,NULL,18),
(79,'Casein Protein',9,4,14.00,36.99,1,NULL,22),
(80,'Energy Gel',9,4,0.80,2.49,1,NULL,140);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `supplier_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `suppliers` VALUES
(1,'Ironforge Supplies','Berlin','contact@ironforge.com'),
(2,'Arcane Imports','Hamburg','sales@arcane-imports.com'),
(3,'Golden Trade Company','Köln','info@goldentrade.com'),
(4,'Northern Traders','Leipzig','support@northerntraders.com'),
(5,'Dragon Merchants','München','orders@dragonmerchants.com');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-06-03 14:44:11
