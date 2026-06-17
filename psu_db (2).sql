-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Jun 17, 2026 at 01:46 AM
-- Server version: 8.0.43
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `psu_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `active_sessions`
--

CREATE TABLE `active_sessions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `device_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `active_sessions`
--

INSERT INTO `active_sessions` (`id`, `user_id`, `session_id`, `device_info`, `ip_address`, `created_at`, `last_activity`, `is_active`) VALUES
(57, 5, 'HiqCeVtcExW_EkwoXrGiwmQrWdWUw-4H', '::1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '::1', '2026-02-27 12:00:11', '2026-02-27 12:09:51', 1),
(127, 1, 'ghMKlSG3dQ0L0-1Gq6ne5E51mmoH6a-Z', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', '172.18.0.1', '2026-06-05 05:07:42', '2026-06-05 05:07:46', 1),
(235, 4, 'L-_iqjYJJaZCqtXjKIF4ZNity-rAImqX', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '172.18.0.1', '2026-06-16 06:29:40', '2026-06-16 09:51:54', 0),
(236, 4, 'btk5V6RyTp2q8J09OkYaJeHnLzUiHP25', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '172.18.0.1', '2026-06-16 09:51:54', '2026-06-16 10:20:18', 0),
(238, 4, 'b54lL1fEG1QEkS1MJDvW09Z4h6FaHJhy', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '172.18.0.1', '2026-06-16 10:20:18', '2026-06-16 11:12:04', 0),
(240, 4, '4Z2cSAn-QKtG7qKyjQVGxVF6oPblNlJw', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '172.18.0.1', '2026-06-16 11:12:04', '2026-06-16 12:25:14', 0),
(242, 4, 'YqRKBeT9bdh6rdzuAnNLTAoUFPtWdEei', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '172.18.0.1', '2026-06-16 12:25:14', '2026-06-16 14:02:41', 0),
(244, 4, 'LBEE2q1e1cVTowrGdi3wdEEVXBynLfY4', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '172.18.0.1', '2026-06-16 14:02:41', '2026-06-16 16:04:49', 0),
(246, 6, 'hp5gkJ5ZiHtXJ2F-gQfXpNpQqr0a5-Vy', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '172.18.0.1', '2026-06-16 14:48:16', '2026-06-16 15:33:40', 0),
(248, 6, 'rV_IVtCcPoAzUh8Q5eMcyrusOrp7v3hT', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '172.18.0.1', '2026-06-16 15:33:40', '2026-06-16 16:08:31', 0),
(250, 4, 'D4hQP4Nt65hwqPoNAXKuCY0x3jIT50D0', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '172.18.0.1', '2026-06-16 16:04:49', '2026-06-16 16:07:56', 0),
(252, 6, '8CK1NdH8efKV1R--ek8fAvYLlh5je2zl', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '172.18.0.1', '2026-06-16 16:08:32', '2026-06-16 16:25:41', 1);

-- --------------------------------------------------------

--
-- Table structure for table `captcha_cache`
--

CREATE TABLE `captcha_cache` (
  `id` int NOT NULL,
  `session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `captcha_text` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  `attempt_count` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `attempt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `success` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_attempts`
--

INSERT INTO `login_attempts` (`id`, `username`, `ip_address`, `attempt_time`, `success`) VALUES
(85, 'psu_admin', '172.18.0.1', '2026-05-21 09:41:39', 1),
(86, 'admin_psu', '172.18.0.1', '2026-05-21 10:12:49', 0),
(87, 'psu_admin', '172.18.0.1', '2026-05-21 10:13:23', 1),
(88, 'psu_admin', '172.18.0.1', '2026-05-21 10:14:04', 1),
(89, 'psu_admin', '172.18.0.1', '2026-05-21 10:23:28', 1),
(90, 'psu_admin', '172.18.0.1', '2026-05-21 10:23:58', 1),
(91, 'psu_admin', '172.18.0.1', '2026-05-21 10:29:03', 1),
(92, 'psu_admin', '172.18.0.1', '2026-05-21 10:29:56', 1),
(93, 'psu_admin', '172.18.0.1', '2026-05-21 10:42:12', 0),
(94, 'psu_admin', '172.18.0.1', '2026-05-21 10:43:00', 1),
(95, 'psu_admin', '172.18.0.1', '2026-05-21 10:43:29', 1),
(96, 'psu_admin', '172.18.0.1', '2026-05-21 10:45:27', 1),
(97, 'psu_admin', '172.18.0.1', '2026-05-21 10:45:42', 1),
(98, 'psu_admin', '172.18.0.1', '2026-05-21 10:47:15', 1),
(99, 'psu_admin', '172.18.0.1', '2026-05-21 10:47:28', 1),
(100, 'psu_admin', '172.18.0.1', '2026-05-21 10:52:28', 1),
(101, 'psu_admin', '172.18.0.1', '2026-05-21 10:52:43', 1),
(102, 'psu_admin', '172.18.0.1', '2026-05-21 11:13:57', 1),
(103, 'psu_admin', '172.18.0.1', '2026-05-22 05:43:36', 1),
(104, 'psu_admin', '172.18.0.1', '2026-05-22 05:43:51', 1),
(105, 'psu_admin', '172.18.0.1', '2026-05-22 07:12:57', 1),
(106, 'psu_admin', '172.18.0.1', '2026-05-22 07:13:20', 1),
(107, 'psu_admin', '172.18.0.1', '2026-05-22 07:15:59', 1),
(108, 'psu_admin', '172.18.0.1', '2026-05-22 07:16:11', 1),
(109, 'psu_admin', '172.18.0.1', '2026-05-22 07:31:40', 1),
(110, 'psu_admin', '172.18.0.1', '2026-05-22 07:32:24', 1),
(111, 'psu_admin', '172.18.0.1', '2026-05-22 09:40:29', 1),
(112, 'psu_admin', '172.18.0.1', '2026-05-22 09:41:23', 1),
(113, 'psu_admin', '172.18.0.1', '2026-05-25 06:37:07', 1),
(114, 'psu_admiin', '172.18.0.1', '2026-05-25 06:54:55', 0),
(115, 'psu_admin', '172.18.0.1', '2026-05-25 06:55:08', 1),
(116, 'psu_admin', '172.18.0.1', '2026-05-25 06:55:27', 1),
(117, 'psu_admin', '172.18.0.1', '2026-05-25 07:17:00', 1),
(118, 'psu_admin', '172.18.0.1', '2026-05-25 07:17:17', 1),
(119, 'psu_admin', '172.18.0.1', '2026-05-25 07:33:31', 1),
(120, 'psu_admin', '172.18.0.1', '2026-05-25 07:33:48', 1),
(121, 'psu_admin', '172.18.0.1', '2026-05-25 10:29:36', 1),
(122, 'psu_admin', '172.18.0.1', '2026-05-25 10:30:05', 1),
(123, 'psu_admin', '172.18.0.1', '2026-05-25 11:00:08', 1),
(124, 'psu_admin', '172.18.0.1', '2026-05-25 11:00:20', 1),
(125, 'Psu_Gridco', '172.18.0.1', '2026-05-25 11:07:38', 1),
(126, 'Psu_Gridco', '172.18.0.1', '2026-05-25 11:07:58', 1),
(127, 'Psu_Gridco', '172.18.0.1', '2026-05-25 12:33:49', 1),
(128, 'Psu_Gridco', '172.18.0.1', '2026-06-04 11:53:11', 1),
(129, 'Psu_Gridco', '172.18.0.1', '2026-06-05 05:06:33', 1),
(130, 'Psu_Gridco', '172.18.0.1', '2026-06-05 05:06:52', 1),
(131, 'psu_admin', '172.18.0.1', '2026-06-05 05:07:42', 1),
(132, 'Psu_Gridco', '172.18.0.1', '2026-06-05 05:23:40', 1),
(133, 'Psu_Gridco', '172.18.0.1', '2026-06-05 05:23:57', 1),
(134, 'Psu_Gridco', '172.18.0.1', '2026-06-05 05:46:36', 1),
(135, 'Psu_Gridco', '172.18.0.1', '2026-06-05 05:46:51', 1),
(136, 'Psu_Gridco', '172.18.0.1', '2026-06-05 09:21:41', 1),
(137, 'Psu_Gridco', '172.18.0.1', '2026-06-05 09:21:59', 1),
(138, 'Psu_Gridco', '172.18.0.1', '2026-06-05 09:39:40', 1),
(139, 'Psu_Gridco', '172.18.0.1', '2026-06-05 09:39:54', 1),
(140, 'Psu_Gridco', '172.18.0.1', '2026-06-05 09:56:51', 1),
(141, 'Psu_Gridco', '172.18.0.1', '2026-06-05 09:57:04', 1),
(142, 'Psu_Gridco', '172.18.0.1', '2026-06-05 10:19:06', 1),
(143, 'Psu_Gridco', '172.18.0.1', '2026-06-05 10:19:33', 1),
(144, 'Psu_Gridco', '172.18.0.1', '2026-06-05 10:38:11', 1),
(145, 'Psu_Gridco', '172.18.0.1', '2026-06-05 10:38:30', 1),
(146, 'Psu_Gridco', '172.18.0.1', '2026-06-05 10:54:56', 1),
(147, 'Psu_Gridco', '172.18.0.1', '2026-06-05 10:55:08', 1),
(148, 'Psu_Gridco', '172.18.0.1', '2026-06-05 12:40:55', 1),
(149, 'Psu_Gridco', '172.18.0.1', '2026-06-05 12:41:18', 1),
(150, 'Psu_Gridco', '172.18.0.1', '2026-06-05 14:43:16', 1),
(151, 'Psu_Gridco', '172.18.0.1', '2026-06-05 14:43:30', 1),
(152, 'Psu_Gridco', '172.18.0.1', '2026-06-05 15:06:18', 1),
(153, 'Psu_Gridco', '172.18.0.1', '2026-06-05 15:06:31', 1),
(154, 'Psu_Gridco', '172.18.0.1', '2026-06-05 15:31:41', 1),
(155, 'Psu_Gridco', '172.18.0.1', '2026-06-05 15:31:54', 1),
(156, 'Psu_Gridco', '172.18.0.1', '2026-06-05 15:52:00', 1),
(157, 'Psu_Gridco', '172.18.0.1', '2026-06-05 15:52:12', 1),
(158, 'PSU_30', '172.18.0.1', '2026-06-05 16:13:34', 1),
(159, 'PSU_30', '172.18.0.1', '2026-06-05 16:13:47', 1),
(160, 'PSU_30', '172.18.0.1', '2026-06-05 16:53:15', 1),
(161, 'PSU_30', '172.18.0.1', '2026-06-05 16:53:25', 1),
(162, 'PSU_30', '172.18.0.1', '2026-06-05 17:11:19', 1),
(163, 'PSU_30', '172.18.0.1', '2026-06-05 17:11:32', 1),
(164, 'PSU_30', '172.18.0.1', '2026-06-05 17:30:30', 1),
(165, 'PSU_30', '172.18.0.1', '2026-06-05 17:30:43', 1),
(166, 'Psu_Gridco', '172.18.0.1', '2026-06-06 01:29:21', 1),
(167, 'Psu_Gridco', '172.18.0.1', '2026-06-06 01:29:34', 1),
(168, 'PSU_30', '172.18.0.1', '2026-06-06 01:32:24', 1),
(169, 'PSU_30', '172.18.0.1', '2026-06-06 01:32:38', 1),
(170, 'PSU_30', '172.18.0.1', '2026-06-06 02:37:56', 1),
(171, 'PSU_30', '172.18.0.1', '2026-06-06 02:38:09', 1),
(172, 'PSU_30', '172.18.0.1', '2026-06-06 03:05:03', 1),
(173, 'PSU_30', '172.18.0.1', '2026-06-06 03:05:47', 1),
(174, 'Psu_Gridco', '172.18.0.1', '2026-06-06 04:52:10', 1),
(175, 'Psu_Gridco', '172.18.0.1', '2026-06-06 04:52:38', 1),
(176, 'Psu_Gridco', '172.18.0.1', '2026-06-06 05:08:38', 0),
(177, 'Psu_Gridco', '172.18.0.1', '2026-06-06 05:08:50', 1),
(178, 'Psu_Gridco', '172.18.0.1', '2026-06-06 05:09:02', 1),
(179, 'Psu_Gridco', '172.18.0.1', '2026-06-06 05:29:04', 1),
(180, 'Psu_Gridco', '172.18.0.1', '2026-06-06 05:29:24', 1),
(181, 'Psu_Gridco', '172.18.0.1', '2026-06-06 05:55:04', 1),
(182, 'Psu_Gridco', '172.18.0.1', '2026-06-06 05:55:24', 1),
(183, 'Psu_Gridco', '172.18.0.1', '2026-06-06 07:12:15', 1),
(184, 'Psu_Gridco', '172.18.0.1', '2026-06-06 07:12:34', 1),
(185, 'Psu_Gridco', '172.18.0.1', '2026-06-06 07:30:01', 1),
(186, 'Psu_Gridco', '172.18.0.1', '2026-06-06 07:30:15', 1),
(187, 'Psu_Gridco', '172.18.0.1', '2026-06-06 07:55:11', 1),
(188, 'Psu_Gridco', '172.18.0.1', '2026-06-06 07:55:24', 1),
(189, 'Psu_Gridco', '172.18.0.1', '2026-06-06 14:11:52', 1),
(190, 'Psu_Gridco', '172.18.0.1', '2026-06-06 14:12:12', 1),
(191, 'Psu_Gridco', '172.18.0.1', '2026-06-06 17:13:31', 1),
(192, 'Psu_Gridco', '172.18.0.1', '2026-06-06 17:32:58', 1),
(193, 'Psu_Gridco', '172.18.0.1', '2026-06-06 17:33:10', 1),
(194, 'Psu_Gridco', '172.18.0.1', '2026-06-06 18:14:15', 1),
(195, 'Psu_Gridco', '172.18.0.1', '2026-06-06 18:14:42', 1),
(196, 'yearWiseData', '172.18.0.1', '2026-06-06 18:29:42', 0),
(197, 'Psu_Gridco', '172.18.0.1', '2026-06-06 18:30:04', 1),
(198, 'Psu_Gridco', '172.18.0.1', '2026-06-06 18:30:16', 1),
(199, 'Psu_Gridco', '172.18.0.1', '2026-06-07 02:09:15', 1),
(200, 'Psu_Gridco', '172.18.0.1', '2026-06-07 02:29:34', 1),
(201, 'Psu_Gridco', '172.18.0.1', '2026-06-07 02:29:47', 1),
(202, 'Psu_Gridco', '172.18.0.1', '2026-06-09 07:00:10', 1),
(203, 'Psu_Gridco', '172.18.0.1', '2026-06-09 07:28:04', 1),
(204, 'Psu_Gridco', '172.18.0.1', '2026-06-10 06:17:27', 1),
(205, 'Psu_Gridco', '172.18.0.1', '2026-06-10 06:38:41', 1),
(206, 'Psu_Gridco', '172.18.0.1', '2026-06-10 06:38:54', 1),
(207, 'Psu_Gridco', '172.18.0.1', '2026-06-10 07:02:40', 1),
(208, 'Psu_Gridco', '172.18.0.1', '2026-06-10 07:02:55', 1),
(209, 'Psu_Gridco', '172.18.0.1', '2026-06-10 07:18:41', 1),
(210, 'PSU_30', '172.18.0.1', '2026-06-10 07:30:05', 1),
(211, 'PSU_30', '172.18.0.1', '2026-06-10 09:44:58', 1),
(212, 'PSU_30', '172.18.0.1', '2026-06-10 09:52:25', 1),
(213, 'PSU_30', '172.18.0.1', '2026-06-10 10:07:00', 1),
(214, 'PSU_30', '172.18.0.1', '2026-06-10 10:22:47', 1),
(215, 'PSU_30', '172.18.0.1', '2026-06-10 10:23:02', 1),
(216, 'PSU_30', '172.18.0.1', '2026-06-10 12:30:21', 1),
(217, 'PSU_30', '172.18.0.1', '2026-06-10 12:30:35', 1),
(218, 'PSU_30', '172.18.0.1', '2026-06-10 14:21:13', 1),
(219, 'PSU_30', '172.18.0.1', '2026-06-10 14:21:37', 1),
(220, 'PSU_30', '172.18.0.1', '2026-06-10 15:13:07', 1),
(221, 'PSU_30', '172.18.0.1', '2026-06-10 15:13:25', 1),
(222, 'PSU_30', '172.18.0.1', '2026-06-10 15:50:31', 1),
(223, 'PSU_30', '172.18.0.1', '2026-06-10 15:51:03', 1),
(224, 'PSU_30', '172.18.0.1', '2026-06-10 16:26:56', 1),
(225, 'PSU_30', '172.18.0.1', '2026-06-10 16:27:13', 1),
(226, 'PSU_30', '172.18.0.1', '2026-06-10 17:11:15', 1),
(227, 'PSU_30', '172.18.0.1', '2026-06-10 17:11:27', 1),
(228, 'Psu_Gridco', '172.18.0.1', '2026-06-10 17:38:27', 1),
(229, 'Psu_Gridco', '172.18.0.1', '2026-06-10 17:38:41', 1),
(230, 'PSU_30', '172.18.0.1', '2026-06-10 17:39:23', 1),
(231, 'PSU_30', '172.18.0.1', '2026-06-10 17:39:38', 1),
(232, 'PSU_30', '172.18.0.1', '2026-06-11 02:03:14', 1),
(233, 'PSU_30', '172.18.0.1', '2026-06-11 02:03:36', 1),
(234, 'PSU_30', '172.18.0.1', '2026-06-11 05:58:19', 1),
(235, 'PSU_30', '172.18.0.1', '2026-06-11 05:58:45', 1),
(236, 'PSU_30', '172.18.0.1', '2026-06-11 06:40:13', 1),
(237, 'PSU_30', '172.18.0.1', '2026-06-11 06:40:25', 1),
(238, 'Psu_Gridco', '172.18.0.1', '2026-06-11 08:58:11', 1),
(239, 'Psu_Gridco', '172.18.0.1', '2026-06-11 08:58:24', 1),
(240, 'PSU_30', '172.18.0.1', '2026-06-11 09:14:52', 1),
(241, 'PSU_30', '172.18.0.1', '2026-06-16 06:29:40', 1),
(242, 'PSU_30', '172.18.0.1', '2026-06-16 09:51:54', 1),
(243, 'PSU_30', '172.18.0.1', '2026-06-16 09:52:09', 1),
(244, 'PSU_30', '172.18.0.1', '2026-06-16 10:20:18', 1),
(245, 'PSU_30', '172.18.0.1', '2026-06-16 10:20:32', 1),
(246, 'PSU_30', '172.18.0.1', '2026-06-16 11:12:04', 1),
(247, 'PSU_30', '172.18.0.1', '2026-06-16 11:12:19', 1),
(248, 'PSU_30', '172.18.0.1', '2026-06-16 12:25:14', 1),
(249, 'PSU_30', '172.18.0.1', '2026-06-16 12:25:26', 1),
(250, 'PSU_30', '172.18.0.1', '2026-06-16 14:02:41', 1),
(251, 'PSU_30', '172.18.0.1', '2026-06-16 14:03:12', 1),
(252, 'SEC_30', '172.18.0.1', '2026-06-16 14:48:16', 1),
(253, 'SEC_30', '172.18.0.1', '2026-06-16 14:48:29', 1),
(254, 'SEC_30', '172.18.0.1', '2026-06-16 15:33:40', 1),
(255, 'SEC_30', '172.18.0.1', '2026-06-16 15:33:53', 1),
(256, 'PSU_30', '172.18.0.1', '2026-06-16 16:04:49', 1),
(257, 'PSU_30', '172.18.0.1', '2026-06-16 16:05:01', 1),
(258, 'SEC_30', '172.18.0.1', '2026-06-16 16:08:31', 1),
(259, 'SEC_30', '172.18.0.1', '2026-06-16 16:08:46', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_anual_report`
--

CREATE TABLE `tbl_anual_report` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `psu_id` int NOT NULL,
  `DmdNo` int NOT NULL,
  `psu_mstr_id` int NOT NULL,
  `annual_report` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_anual_report`
--

INSERT INTO `tbl_anual_report` (`id`, `user_id`, `psu_id`, `DmdNo`, `psu_mstr_id`, `annual_report`, `created_at`, `updated_at`) VALUES
(4, 2, 5, 30, 11, 'public/uploads/annual-reports/1780988894968_motp_certificate (8).pdf', '2026-06-09 07:08:15', '2026-06-09 07:08:15');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_balancesheet_indicator`
--

CREATE TABLE `tbl_balancesheet_indicator` (
  `id` int NOT NULL,
  `psu_mstr_id` int NOT NULL,
  `tot_asset` int NOT NULL,
  `tot_curr_asset` int NOT NULL,
  `tot_liabilities` int NOT NULL,
  `tot_curr_liabilities` int NOT NULL,
  `tot_longterm_debt` int NOT NULL,
  `tot_equity` int NOT NULL,
  `inventory` int NOT NULL,
  `acc_receivable` int NOT NULL,
  `acc_payble` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_balancesheet_indicator`
--

INSERT INTO `tbl_balancesheet_indicator` (`id`, `psu_mstr_id`, `tot_asset`, `tot_curr_asset`, `tot_liabilities`, `tot_curr_liabilities`, `tot_longterm_debt`, `tot_equity`, `inventory`, `acc_receivable`, `acc_payble`, `created_at`, `updated_at`) VALUES
(3, 11, 4570, 34563, 3453, 455, 454, 3453, 3534, 453, 3453, '2026-06-06 14:23:20', '2026-06-06 14:23:20');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_department`
--

CREATE TABLE `tbl_department` (
  `id` int NOT NULL,
  `DmdNo` varchar(2) NOT NULL,
  `DeptName` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_department`
--

INSERT INTO `tbl_department` (`id`, `DmdNo`, `DeptName`) VALUES
(1, '24', 'Steel & Mines'),
(2, '30', 'Energy'),
(3, '23', 'Agriculture & FE'),
(4, '26', 'Excise'),
(5, '01', 'Home'),
(6, '34', 'Cooperation'),
(7, '22', 'Forest & Environment'),
(8, '32', 'Tourism'),
(9, '07', 'Works'),
(10, '20', 'Water Resources'),
(11, '40', 'MSME'),
(12, '12', 'Health & FW'),
(13, '21', 'C& T (Transport)'),
(14, '33', 'Fisheries & ARD'),
(15, '19', 'Industries'),
(16, '09', 'Food Supply & CW'),
(17, '13', 'H & UD'),
(18, '05', 'Finance'),
(19, '31', 'Handlooms, Textiles & Handicrafts');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_govt_relation`
--

CREATE TABLE `tbl_govt_relation` (
  `id` int NOT NULL,
  `psu_mstr_id` int NOT NULL,
  `direct_bud_subsidies` int NOT NULL,
  `tax_and_state_dues` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_govt_relation`
--

INSERT INTO `tbl_govt_relation` (`id`, `psu_mstr_id`, `direct_bud_subsidies`, `tax_and_state_dues`, `created_at`, `updated_at`) VALUES
(1, 11, 300, 300, '2026-06-09 07:01:13', '2026-06-09 07:01:13');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_income_sheet_indicator`
--

CREATE TABLE `tbl_income_sheet_indicator` (
  `id` int NOT NULL,
  `psu_mstr_id` int NOT NULL,
  `tot_revenue` int NOT NULL,
  `cost_ofgoods_sold` int NOT NULL,
  `operating_expenses` int NOT NULL,
  `tot_expenses` int NOT NULL,
  `ebitda` int NOT NULL,
  `depreciation` int NOT NULL,
  `ebit_operating` int NOT NULL,
  `int_expenses` int NOT NULL,
  `tax_expenses` int NOT NULL,
  `any_other_expenses` int NOT NULL,
  `net_income` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_income_sheet_indicator`
--

INSERT INTO `tbl_income_sheet_indicator` (`id`, `psu_mstr_id`, `tot_revenue`, `cost_ofgoods_sold`, `operating_expenses`, `tot_expenses`, `ebitda`, `depreciation`, `ebit_operating`, `int_expenses`, `tax_expenses`, `any_other_expenses`, `net_income`, `created_at`, `updated_at`) VALUES
(1, 11, 580, 45, 3423, 343, 423, 343, 34, 4, 42, 4, 345, '2026-06-06 14:22:24', '2026-06-06 18:23:51');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_psu_name`
--

CREATE TABLE `tbl_psu_name` (
  `id` int NOT NULL,
  `DmdNo` varchar(2) DEFAULT NULL,
  `Psu_Name` varchar(75) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `tbl_psu_name`
--

INSERT INTO `tbl_psu_name` (`id`, `DmdNo`, `Psu_Name`) VALUES
(1, '24', 'ODISHA MINING CORPORATION (OMC)'),
(2, '30', 'ODISHA HYDRO POWER CORPORATION (OHPC)'),
(3, '30', 'ODISHA POWER GENERATION CORPORATION (OPGC)'),
(4, '30', 'ODISHA POWER TRANSMISSION CORPORATION (OPTCL)'),
(5, '30', 'GRID CORPORATION OF ODISHA (GRIDCO)'),
(6, '23', 'ODISHA AGRO INDUSTRIES CORPORATION  (OAIC)'),
(7, '23', 'ODISHA STATE CASHEW DEV. CORPORATION (OSCDC)'),
(8, '23', 'AGRICULTURAL PROMOTION AND INVESTMENT CORPORATION OF ODISHA LIMITED(APICOL)'),
(9, '23', 'ODISHA STATE SEEDS CORPORATION (OSSC)'),
(10, '26', 'ODISHA STATE BEVERAGES CORPORATION (OSBC)'),
(11, '01', 'ODISHA STATE POLICE HOUSING & WELFARE CORPORATION (OSPHSC)'),
(12, '34', 'ODISHA STATE WAREHOUSING CORPORATION (OSWC)'),
(13, '22', 'ODISHA FOREST DEVELOPMENT CORPORATION (OFDC)'),
(14, '32', 'ODISHA TOURISM DEVELOPMENT CORPORATION (OTDC)'),
(15, '07', 'ODISHA BRIDGE & CONSTRUCTION CORPORATION (OBCC)'),
(16, '20', 'ODISHA CONSTRUCTION CORPORATION LIMITED (OCCL)'),
(17, '20', 'ODISHA LIFT IRRIGATION CORPORATION (OLIC)'),
(18, '40', 'ODISHA SMALL INDUSTRIES CORPORATION (OSIC)'),
(19, '05', 'ODISHA STATE FINANCIAL CORPORATION (OSFC)'),
(20, '12', 'ODISHA STATE MEDICAL CORPORATION (OSMC)'),
(21, '21', 'ODISHA STATE ROAD TRANSPORT CORPORATION (OSRTC)'),
(22, '21', 'HARIDASPUR PARADIP RAILWAY COMPANY LIMITED (HPRCL)'),
(23, '21', 'ANGUL SUKINDA RAILWAY LIMITED (ASRL)'),
(24, '21', 'BRAHMANI RAILWAY LIMITED (BRL)'),
(25, '21', 'ODISHA RAIL INFRASTRUCTURE DEVELOPMENT LIMITED (ORIDL)'),
(26, '33', 'ODISHA PISCICULTURE DEVELOPMENT CORPORATION (OPDC)'),
(27, '19', 'ODISHA INDUSTRIAL INFRASTRCTURE DEVELOPMENT CORPORATION (IDCO)'),
(28, '19', 'INDUSTRIAL PROMOTION AND INVESTMENT CORPORATION OF ODISHA LIMTED (IPICOL)'),
(29, '19', 'ODISHA FILM DEVELOPMENT CORPORATION (OFDC)'),
(30, '09', 'ODISHA STATE CIVIL SUPPLIES CORPORATION (OSCSC)'),
(31, '13', 'ODISHA RURAL HOUSING & DEVELOPMENT CORPORATION\n(ORHDC)'),
(32, '13', 'WATER CORPORATION OF ODISHA LTD(WATCO)'),
(33, '5', 'UTKAL GRAMEEN BANK (UGB)'),
(34, '5', 'ODISHA GRAMYA BANK (OGB)'),
(35, '31', 'ODISHA COOPERATIVE TASSAR SILK FEDERATION LIMITED (SERIFED)');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_psu_name bk`
--

CREATE TABLE `tbl_psu_name bk` (
  `id` int NOT NULL,
  `DmdNo` varchar(2) NOT NULL,
  `Psu_Name` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_psu_profile`
--

CREATE TABLE `tbl_psu_profile` (
  `id` int NOT NULL,
  `dmd_no` int NOT NULL,
  `psu_id` int NOT NULL,
  `Auth_Share_Capital` int NOT NULL,
  `Sub_Share_Capital` int NOT NULL,
  `Paid_Share_Capital` int NOT NULL,
  `Govt_Contri_Amt` decimal(10,0) NOT NULL,
  `Govt_Contri_Percent` varchar(255) NOT NULL,
  `NameOf_Share_Holder` varchar(255) NOT NULL,
  `roc_document` varchar(255) DEFAULT NULL,
  `remark` text,
  `fin_year` varchar(100) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_psu_profile`
--

INSERT INTO `tbl_psu_profile` (`id`, `dmd_no`, `psu_id`, `Auth_Share_Capital`, `Sub_Share_Capital`, `Paid_Share_Capital`, `Govt_Contri_Amt`, `Govt_Contri_Percent`, `NameOf_Share_Holder`, `roc_document`, `remark`, `fin_year`, `status`, `created_at`, `updated_at`) VALUES
(4, 30, 5, 400, 567, 453, 543, '453', 'test', 'public/uploads/roc-document/1780663910433_motp_certificate (9).pdf', NULL, NULL, 8, '2026-06-05 12:51:50', '2026-06-05 12:51:50');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_psu_profit_loss`
--

CREATE TABLE `tbl_psu_profit_loss` (
  `id` int NOT NULL,
  `psu_mstr_id` int NOT NULL,
  `profit_loss_type` varchar(150) NOT NULL,
  `Profit_Loss` decimal(15,2) NOT NULL,
  `PAT` int NOT NULL,
  `Dividend_Payable` int NOT NULL,
  `Dividend_Paid` int NOT NULL,
  `chaln_recipt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_psu_profit_loss`
--

INSERT INTO `tbl_psu_profit_loss` (`id`, `psu_mstr_id`, `profit_loss_type`, `Profit_Loss`, `PAT`, `Dividend_Payable`, `Dividend_Paid`, `chaln_recipt`, `created_at`, `updated_at`) VALUES
(1, 11, 'profit', 170.00, 270, 365, 548, 'public/uploads/challan-receipts/1780799563708_motp_certificate (8).pdf', '2026-06-07 02:32:43', '2026-06-07 02:32:43');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_psu_yearwise_mstr`
--

CREATE TABLE `tbl_psu_yearwise_mstr` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `DmdNo` varchar(255) NOT NULL,
  `profile_id` int DEFAULT NULL,
  `Psu_Name` varchar(255) NOT NULL,
  `Auth_Share_Capital` int NOT NULL,
  `Sub_Share_Capital` int NOT NULL,
  `Paid_Share_Capital` int NOT NULL,
  `Govt_Contri_Amt` int NOT NULL,
  `Govt_Contri_Percent` varchar(255) NOT NULL,
  `NameOf_Share_Holder` varchar(255) NOT NULL,
  `FinYr` varchar(255) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0' COMMENT '0-draft,1-pending,2-reject,3-approve',
  `reject_message` text,
  `Submitted_At` datetime DEFAULT NULL,
  `Created_Dt` datetime DEFAULT NULL,
  `Modifed_Dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_psu_yearwise_mstr`
--

INSERT INTO `tbl_psu_yearwise_mstr` (`id`, `user_id`, `DmdNo`, `profile_id`, `Psu_Name`, `Auth_Share_Capital`, `Sub_Share_Capital`, `Paid_Share_Capital`, `Govt_Contri_Amt`, `Govt_Contri_Percent`, `NameOf_Share_Holder`, `FinYr`, `status`, `reject_message`, `Submitted_At`, `Created_Dt`, `Modifed_Dt`) VALUES
(11, 2, '30', 4, 'Gridco', 400, 567, 453, 543, '453', 'test', '2020-21', 5, NULL, '2026-06-10 07:29:19', '2026-06-06 14:19:07', '2026-06-06 14:19:07');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_t_data_log`
--

CREATE TABLE `tbl_t_data_log` (
  `id` bigint NOT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `psu_mstr_id` bigint DEFAULT NULL,
  `record_id` bigint DEFAULT NULL,
  `field_name` varchar(100) DEFAULT NULL,
  `old_value` text,
  `new_value` text,
  `changed_by` bigint DEFAULT NULL,
  `changed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(50) DEFAULT NULL,
  `remarks` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_t_data_log`
--

INSERT INTO `tbl_t_data_log` (`id`, `table_name`, `psu_mstr_id`, `record_id`, `field_name`, `old_value`, `new_value`, `changed_by`, `changed_at`, `ip_address`, `remarks`) VALUES
(4, 'tbl_income_sheet_indicator', 11, 1, 'tot_revenue', '570', '580', 4, '2026-06-16 10:20:47', '172.18.0.1', NULL),
(5, 'tbl_balancesheet_indicator', 11, 3, 'tot_asset', '4558', '4570', 4, '2026-06-16 11:12:40', '172.18.0.1', NULL),
(6, 'tbl_psu_profit_loss', 11, 1, 'PAT', '250', '270', 4, '2026-06-16 11:12:59', '172.18.0.1', NULL),
(7, 'tbl_govt_relation', 11, 1, 'direct_bud_subsidies', '200', '300', 4, '2026-06-16 11:13:16', '172.18.0.1', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` int NOT NULL,
  `Psu_id` int NOT NULL,
  `DmdNo` varchar(2) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` varchar(20) NOT NULL,
  `Status` int NOT NULL,
  `Create_dt` datetime NOT NULL,
  `Modified_dt` datetime NOT NULL,
  `failed_login_attempts` int DEFAULT '0',
  `locked_until` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `last_login_device` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `Psu_id`, `DmdNo`, `Name`, `user_name`, `Password`, `Role`, `Status`, `Create_dt`, `Modified_dt`, `failed_login_attempts`, `locked_until`, `last_login_ip`, `last_login_device`) VALUES
(1, 0, '', 'Admin', 'psu_admin', '$2b$10$DUknjm0ybT.7sVmIPcWMIO72AuYIkurhDtTorjp2y5sVRoGA3RrvO', '1', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, NULL, '172.18.0.1', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0'),
(2, 5, '30', 'Gridco', 'Psu_Gridco', '$2b$10$j5qvW92pXgfaZwe4Hrghv.kWiat6BK2K.JkQKe6IsKm0kryQzDyNa', '3', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, NULL, '172.18.0.1', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),
(3, 11, '01', 'OSPHSC', 'Psu_Osphsc', '$2b$10$j5qvW92pXgfaZwe4Hrghv.kWiat6BK2K.JkQKe6IsKm0kryQzDyNa', '3', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, NULL, NULL, NULL),
(4, 0, '30', 'FA Energy', 'PSU_30', '$2b$10$j5qvW92pXgfaZwe4Hrghv.kWiat6BK2K.JkQKe6IsKm0kryQzDyNa', '2', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, NULL, '172.18.0.1', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'),
(5, 0, '0', 'Finance Department', 'PSU_FIN', '$2b$10$j5qvW92pXgfaZwe4Hrghv.kWiat6BK2K.JkQKe6IsKm0kryQzDyNa', '4', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, NULL, '::1', '::1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'),
(6, 0, '30', 'SEC Energy', 'SEC_30', '$2b$10$j5qvW92pXgfaZwe4Hrghv.kWiat6BK2K.JkQKe6IsKm0kryQzDyNa', '5', 0, '2026-06-05 21:39:44', '2026-06-05 21:39:44', 0, NULL, '172.18.0.1', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_role`
--

CREATE TABLE `tbl_user_role` (
  `id` int NOT NULL,
  `Role_Type` enum('1','2','3','4','5') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT '1-admin,2-FA_PSU,3-PSU,4-Finance,5-SEC_FA',
  `Role_Name` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_user_role`
--

INSERT INTO `tbl_user_role` (`id`, `Role_Type`, `Role_Name`) VALUES
(1, '1', 'Admin'),
(2, '2', 'Dept_PSU'),
(3, '3', 'PSU'),
(4, '4', 'Finance');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `active_sessions`
--
ALTER TABLE `active_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id` (`session_id`),
  ADD KEY `idx_user_active` (`user_id`,`is_active`),
  ADD KEY `idx_session_id` (`session_id`);

--
-- Indexes for table `captcha_cache`
--
ALTER TABLE `captcha_cache`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id` (`session_id`),
  ADD KEY `idx_session` (`session_id`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_username_time` (`username`,`attempt_time`),
  ADD KEY `idx_ip_time` (`ip_address`,`attempt_time`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `tbl_anual_report`
--
ALTER TABLE `tbl_anual_report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_balancesheet_indicator`
--
ALTER TABLE `tbl_balancesheet_indicator`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_department`
--
ALTER TABLE `tbl_department`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_govt_relation`
--
ALTER TABLE `tbl_govt_relation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_income_sheet_indicator`
--
ALTER TABLE `tbl_income_sheet_indicator`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_psu_name`
--
ALTER TABLE `tbl_psu_name`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_psu_name bk`
--
ALTER TABLE `tbl_psu_name bk`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_psu_profile`
--
ALTER TABLE `tbl_psu_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_psu_profit_loss`
--
ALTER TABLE `tbl_psu_profit_loss`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_psu_yearwise_mstr`
--
ALTER TABLE `tbl_psu_yearwise_mstr`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_t_data_log`
--
ALTER TABLE `tbl_t_data_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user_role`
--
ALTER TABLE `tbl_user_role`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `active_sessions`
--
ALTER TABLE `active_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=254;

--
-- AUTO_INCREMENT for table `captcha_cache`
--
ALTER TABLE `captcha_cache`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=380;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=260;

--
-- AUTO_INCREMENT for table `tbl_anual_report`
--
ALTER TABLE `tbl_anual_report`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_balancesheet_indicator`
--
ALTER TABLE `tbl_balancesheet_indicator`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_department`
--
ALTER TABLE `tbl_department`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tbl_govt_relation`
--
ALTER TABLE `tbl_govt_relation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_income_sheet_indicator`
--
ALTER TABLE `tbl_income_sheet_indicator`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_psu_name`
--
ALTER TABLE `tbl_psu_name`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `tbl_psu_name bk`
--
ALTER TABLE `tbl_psu_name bk`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_psu_profile`
--
ALTER TABLE `tbl_psu_profile`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_psu_profit_loss`
--
ALTER TABLE `tbl_psu_profit_loss`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_psu_yearwise_mstr`
--
ALTER TABLE `tbl_psu_yearwise_mstr`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbl_t_data_log`
--
ALTER TABLE `tbl_t_data_log`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_user_role`
--
ALTER TABLE `tbl_user_role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `active_sessions`
--
ALTER TABLE `active_sessions`
  ADD CONSTRAINT `active_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
