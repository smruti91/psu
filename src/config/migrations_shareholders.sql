-- Create table for PSU Share Holders
-- This table stores multiple share holders for each PSU profile

CREATE TABLE IF NOT EXISTS `tbl_psu_shareholders` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `profile_id` int NOT NULL,
  `shareholder_name` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`profile_id`) REFERENCES `tbl_psu_profile`(`id`) ON DELETE CASCADE,
  INDEX `idx_profile_id` (`profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Optional: Migrate existing single shareholder to the new table
-- This will copy the existing NameOf_Share_Holder values to the new table
INSERT IGNORE INTO `tbl_psu_shareholders` (`profile_id`, `shareholder_name`, `created_at`)
SELECT `id`, `NameOf_Share_Holder`, `created_at`
FROM `tbl_psu_profile`
WHERE `NameOf_Share_Holder` IS NOT NULL AND `NameOf_Share_Holder` != '';
