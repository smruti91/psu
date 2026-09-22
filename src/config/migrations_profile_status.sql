-- Align tbl_psu_profile statuses with the 0-5 approval chain:
--   0 Draft, 1 Pending at FA, 2 Rejected by FA,
--   3 Pending at SEC, 4 Rejected by SEC, 5 Approved
-- Legacy values produced by older code:
--   6 (sent for approval)      -> 1 Pending at FA
--   8 (approved by dept stage) -> 3 Pending at SEC
--   3 (old rejection value)    -> 2 Rejected by FA
-- Run once: mysql -u <user> -p <db> < src/config/migrations_profile_status.sql

-- ORDER MATTERS: remap old 3 (rejections) before moving 8 -> 3.
-- In older code the ONLY writer of status 3 was the reject endpoint,
-- so every status-3 row is an old rejection -> 2 Rejected by FA.
UPDATE `tbl_psu_profile` SET `status` = 2 WHERE `status` = 3;
UPDATE `tbl_psu_profile` SET `status` = 1 WHERE `status` = 6;
UPDATE `tbl_psu_profile` SET `status` = 3 WHERE `status` = 8;
