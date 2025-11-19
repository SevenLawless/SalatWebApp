-- Migration script for existing databases
-- Run this if you already have a database with the old schema

USE salatchecker;

-- Update phoneNumber column to support country codes (if needed)
ALTER TABLE users MODIFY COLUMN phoneNumber VARCHAR(25) NOT NULL;

-- Verify the change
DESCRIBE users;

