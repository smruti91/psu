-- Table for tracking failed login attempts
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45),
  `attempt_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `success` BOOLEAN DEFAULT FALSE,
  KEY `idx_username_time` (`username`, `attempt_time`),
  KEY `idx_ip_time` (`ip_address`, `attempt_time`)
);

-- Table for tracking active sessions per device
CREATE TABLE IF NOT EXISTS `active_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `session_id` VARCHAR(255) UNIQUE NOT NULL,
  `device_info` TEXT,
  `ip_address` VARCHAR(45),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_activity` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (`user_id`) REFERENCES `tbl_user`(`id`) ON DELETE CASCADE,
  KEY `idx_user_active` (`user_id`, `is_active`),
  KEY `idx_session_id` (`session_id`)
);

-- Table for CAPTCHA storage
CREATE TABLE IF NOT EXISTS `captcha_cache` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_id` VARCHAR(255) UNIQUE NOT NULL,
  `captcha_text` VARCHAR(10) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NULL,
  `attempt_count` INT DEFAULT 0,
  KEY `idx_session` (`session_id`),
  KEY `idx_expires` (`expires_at`)
);

-- Add columns to tbl_user for tracking login attempts
ALTER TABLE `tbl_user` ADD COLUMN IF NOT EXISTS `failed_login_attempts` INT DEFAULT 0;
ALTER TABLE `tbl_user` ADD COLUMN IF NOT EXISTS `locked_until` TIMESTAMP NULL;
ALTER TABLE `tbl_user` ADD COLUMN IF NOT EXISTS `last_login_ip` VARCHAR(45);
ALTER TABLE `tbl_user` ADD COLUMN IF NOT EXISTS `last_login_device` TEXT;
-- Add challan receipt column to tbl_psu_yearwise_mstr
ALTER TABLE `tbl_psu_yearwise_mstr` ADD COLUMN IF NOT EXISTS `chaln_recipt` VARCHAR(500);