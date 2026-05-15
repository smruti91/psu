-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: May 15, 2026 at 07:43 AM
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
(54, 4, 'yP17_Ff8j3Xv42pPc29J408rYXwzAk-G', '::1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '::1', '2026-02-27 10:14:14', '2026-02-27 10:24:18', 1),
(57, 5, 'HiqCeVtcExW_EkwoXrGiwmQrWdWUw-4H', '::1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '::1', '2026-02-27 12:00:11', '2026-02-27 12:09:51', 1),
(66, 2, 't3KZ0KQJ9crEWwU1Cjc5YKXCFXI0Dodq', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.18.0.1', '2026-05-12 09:24:34', '2026-05-13 01:56:55', 0),
(68, 2, 'pTpwuXSb74TYC7Ce5vDQvrLqy6OlK1mn', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.18.0.1', '2026-05-13 01:56:55', '2026-05-13 02:35:00', 0),
(71, 2, 'r_Jj3pBbDnZAploPVaNucIaPjlfupmrT', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.18.0.1', '2026-05-13 02:35:00', '2026-05-13 06:46:50', 0),
(73, 2, 'M91MsC9i0dCrP1b-mwYfLVakgInPj27k', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.18.0.1', '2026-05-13 06:46:50', '2026-05-13 07:06:20', 0),
(74, 2, 'bfgCI5fHT_UXAdWLo5DKgNxWEm-mb5dK', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.18.0.1', '2026-05-13 07:06:20', '2026-05-13 07:25:09', 0),
(76, 2, 'BJB1gEmYSSVPCdyd2JI4USWcQvNXsO2T', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.18.0.1', '2026-05-13 07:25:09', '2026-05-13 07:28:22', 0),
(77, 2, 'h4nUB1uCXgUgJOmZ9hb15NEXNn59mVVm', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', '172.18.0.1', '2026-05-13 07:28:22', '2026-05-13 07:52:21', 0),
(78, 2, 'oLcGUs8UKXyozz7hJBchFByCS5Gy3hz1', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', '172.18.0.1', '2026-05-13 07:52:21', '2026-05-13 07:55:01', 0),
(80, 2, 'GpNcRNQ5i7Gw3pOMmC8HEJhapELnmEcz', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', '172.18.0.1', '2026-05-13 07:55:15', '2026-05-13 09:14:16', 0),
(81, 2, 'K2egTvwhLtVVCdmgYfikLtgFyarwbhvK', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.18.0.1', '2026-05-13 09:14:16', '2026-05-13 09:57:46', 0),
(83, 2, 'NMwmfyhpV_tvCArd1-5AT9fImN-0IDN3', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.18.0.1', '2026-05-13 09:57:46', '2026-05-13 09:58:12', 1);

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
(59, 'Psu_Gridco', '::ffff:172.18.0.1', '2026-04-24 06:01:26', 1),
(60, 'Psu_Gridco', '::ffff:172.18.0.1', '2026-04-29 12:16:06', 1),
(61, 'Psu_Gridco', '172.18.0.1', '2026-05-12 06:49:17', 1),
(62, 'Psu_Gridco', '172.18.0.1', '2026-05-12 06:49:28', 1),
(63, 'Psu_Gridco', '172.18.0.1', '2026-05-12 07:06:52', 1),
(64, 'Psu_Gridco', '172.18.0.1', '2026-05-12 07:31:25', 1),
(65, 'Psu_Gridco', '172.18.0.1', '2026-05-12 07:31:40', 1),
(66, 'Psu_Gridco', '172.18.0.1', '2026-05-12 08:06:31', 1),
(67, 'Psu_Gridco', '172.18.0.1', '2026-05-12 09:24:34', 1),
(68, 'Psu_Gridco', '172.18.0.1', '2026-05-12 09:24:55', 1),
(69, 'Psu_Gridco', '172.18.0.1', '2026-05-13 01:56:55', 1),
(70, 'Psu_Gridco', '172.18.0.1', '2026-05-13 01:57:12', 1),
(71, 'Psu_Gridco', '172.18.0.1', '2026-05-13 02:08:57', 1),
(72, 'Psu_Gridco', '172.18.0.1', '2026-05-13 02:35:00', 1),
(73, 'Psu_Gridco', '172.18.0.1', '2026-05-13 02:35:15', 1),
(74, 'Psu_Gridco', '172.18.0.1', '2026-05-13 06:46:50', 1),
(75, 'Psu_Gridco', '172.18.0.1', '2026-05-13 07:06:20', 1),
(76, 'Psu_Gridco', '172.18.0.1', '2026-05-13 07:06:37', 1),
(77, 'Psu_Gridco', '172.18.0.1', '2026-05-13 07:25:09', 1),
(78, 'Psu_Gridco', '172.18.0.1', '2026-05-13 07:28:22', 1),
(79, 'Psu_Gridco', '172.18.0.1', '2026-05-13 07:52:21', 1),
(80, 'Psu_Gridco', '172.18.0.1', '2026-05-13 07:52:35', 1),
(81, 'Psu_Gridco', '172.18.0.1', '2026-05-13 07:55:15', 1),
(82, 'Psu_Gridco', '172.18.0.1', '2026-05-13 09:14:16', 1),
(83, 'Psu_Gridco', '172.18.0.1', '2026-05-13 09:14:31', 1),
(84, 'Psu_Gridco', '172.18.0.1', '2026-05-13 09:57:46', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('NMwmfyhpV_tvCArd1-5AT9fImN-0IDN3', 1778667193, '{\"cookie\":{\"originalMaxAge\":900000,\"expires\":\"2026-05-13T10:12:46.451Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"ACBqP273mytOMmwEUUwUPKVK\",\"user\":{\"id\":2,\"role\":\"3\",\"dmdNo\":\"30\",\"Psu_Name\":\"Gridco\",\"psu_id\":5}}');

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
(2, 7, 453, 234, 32, 32, 453, 345, 345, 4353, 345, '2026-05-13 02:17:47', '2026-05-13 02:17:47');

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
-- Table structure for table `tbl_psu_yearwise_mstr`
--

CREATE TABLE `tbl_psu_yearwise_mstr` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `DmdNo` varchar(255) NOT NULL,
  `Psu_Name` varchar(255) NOT NULL,
  `Auth_Share_Capital` int NOT NULL,
  `Sub_Share_Capital` int NOT NULL,
  `Paid_Share_Capital` int NOT NULL,
  `Govt_Contri_Amt` int NOT NULL,
  `Govt_Contri_Percent` varchar(255) NOT NULL,
  `NameOf_Share_Holder` varchar(255) NOT NULL,
  `profit_loss_type` varchar(150) NOT NULL,
  `Profit_Loss` decimal(15,2) NOT NULL DEFAULT '0.00',
  `PAT` int NOT NULL,
  `Dividend_Payable` int NOT NULL,
  `Dividend_Paid` int NOT NULL,
  `FinYr` varchar(255) DEFAULT NULL,
  `chaln_recipt` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '0' COMMENT '0-draft,1-pending,2-reject,3-approve',
  `reject_message` text,
  `Submitted_At` datetime DEFAULT NULL,
  `Created_Dt` datetime DEFAULT NULL,
  `Modifed_Dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_psu_yearwise_mstr`
--

INSERT INTO `tbl_psu_yearwise_mstr` (`id`, `user_id`, `DmdNo`, `Psu_Name`, `Auth_Share_Capital`, `Sub_Share_Capital`, `Paid_Share_Capital`, `Govt_Contri_Amt`, `Govt_Contri_Percent`, `NameOf_Share_Holder`, `profit_loss_type`, `Profit_Loss`, `PAT`, `Dividend_Payable`, `Dividend_Paid`, `FinYr`, `chaln_recipt`, `status`, `reject_message`, `Submitted_At`, `Created_Dt`, `Modifed_Dt`) VALUES
(8, 2, '30', 'Gridco', 342, 3432, 342, 234, '324', 'tew', 'profit', 4353.00, 345, 435, 43, '2021-22', 'public/uploads/challan-receipts/1778663938546_motp_certificate (5).pdf', 0, NULL, NULL, '2026-05-13 09:18:58', '2026-05-13 09:18:58'),
(9, 2, '30', 'Gridco', 456, 343, 354, 345, '345', 'testing', 'loss', 678.00, 324, 434, 3432, '2020-21', 'public/uploads/challan-receipts/1778664015945_motp_certificate (5).pdf', 0, NULL, NULL, '2026-05-13 09:20:15', '2026-05-13 09:20:15');

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
(1, 0, '', '', 'pass@gmail.com45', '$2b$10$DUknjm0ybT.7sVmIPcWMIO72AuYIkurhDtTorjp2y5sVRoGA3RrvO', '1', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, NULL, NULL, NULL),
(2, 5, '30', 'Gridco', 'Psu_Gridco', '$2b$10$j5qvW92pXgfaZwe4Hrghv.kWiat6BK2K.JkQKe6IsKm0kryQzDyNa', '3', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, NULL, '172.18.0.1', '172.18.0.1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),
(3, 11, '01', 'OSPHSC', 'Psu_Osphsc', '$2b$10$j5qvW92pXgfaZwe4Hrghv.kWiat6BK2K.JkQKe6IsKm0kryQzDyNa', '3', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, NULL, NULL, NULL),
(4, 0, '30', 'Energy', 'PSU_30', '$2b$10$j5qvW92pXgfaZwe4Hrghv.kWiat6BK2K.JkQKe6IsKm0kryQzDyNa', '2', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, NULL, '::1', '::1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'),
(5, 0, '0', 'Finance Department', 'PSU_FIN', '$2b$10$j5qvW92pXgfaZwe4Hrghv.kWiat6BK2K.JkQKe6IsKm0kryQzDyNa', '4', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, NULL, '::1', '::1::Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_role`
--

CREATE TABLE `tbl_user_role` (
  `id` int NOT NULL,
  `Role_Type` enum('1','2','3','4') NOT NULL COMMENT '1-admin,2-Dept_PSU,3-PSU,4-Finance',
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
-- Indexes for table `tbl_psu_yearwise_mstr`
--
ALTER TABLE `tbl_psu_yearwise_mstr`
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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `captcha_cache`
--
ALTER TABLE `captcha_cache`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `tbl_anual_report`
--
ALTER TABLE `tbl_anual_report`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_balancesheet_indicator`
--
ALTER TABLE `tbl_balancesheet_indicator`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_department`
--
ALTER TABLE `tbl_department`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tbl_govt_relation`
--
ALTER TABLE `tbl_govt_relation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_income_sheet_indicator`
--
ALTER TABLE `tbl_income_sheet_indicator`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `tbl_psu_yearwise_mstr`
--
ALTER TABLE `tbl_psu_yearwise_mstr`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
