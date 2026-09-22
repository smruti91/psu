-- Fix: code reads/writes `shareholder_percent` but the original
-- migrations_shareholders.sql created the table without that column,
-- which causes "Unknown column 'shareholder_percent' in 'field list'"
-- on PSU profile add/update. Also creates the profile/shareholder
-- history tables used by the edit-history feature (no CREATE existed).
-- Run once: mysql -u <user> -p <db> < src/config/migrations_shareholder_percent.sql

-- 1) Missing column on the shareholders table
ALTER TABLE `tbl_psu_shareholders`
  ADD COLUMN `shareholder_percent` DECIMAL(5,2) NOT NULL DEFAULT 0;

-- 2) History tables (safe to re-run)
CREATE TABLE IF NOT EXISTS `tbl_psu_profile_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `profile_id` INT NOT NULL,
  `snapshot` LONGTEXT NOT NULL,
  `changed_by` INT NULL,
  `action` VARCHAR(20) NOT NULL DEFAULT 'UPDATE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_profile_id` (`profile_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `tbl_psu_shareholder_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `profile_id` INT NOT NULL,
  `snapshot` LONGTEXT NOT NULL,
  `changed_by` INT NULL,
  `action` VARCHAR(20) NOT NULL DEFAULT 'UPDATE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_profile_id` (`profile_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
