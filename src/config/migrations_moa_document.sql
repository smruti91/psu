-- Optional MOA document for PSU profile
-- Run once: mysql -u <user> -p <db> < src/config/migrations_moa_document.sql
ALTER TABLE `tbl_psu_profile` ADD COLUMN IF NOT EXISTS `moa_document` VARCHAR(255) DEFAULT NULL;
