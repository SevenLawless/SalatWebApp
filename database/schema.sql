-- SalatChecker Database Schema

CREATE DATABASE IF NOT EXISTS salatchecker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE salatchecker;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  phoneNumber VARCHAR(25) NOT NULL UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_phone (phoneNumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prayer records table
CREATE TABLE IF NOT EXISTS prayer_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  date DATE NOT NULL,
  fajr ENUM('not_prayed', 'prayed', 'missed') DEFAULT 'not_prayed',
  dhuhr ENUM('not_prayed', 'prayed', 'missed') DEFAULT 'not_prayed',
  asr ENUM('not_prayed', 'prayed', 'missed') DEFAULT 'not_prayed',
  maghrib ENUM('not_prayed', 'prayed', 'missed') DEFAULT 'not_prayed',
  isha ENUM('not_prayed', 'prayed', 'missed') DEFAULT 'not_prayed',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_date (userId, date),
  INDEX idx_user_date (userId, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

