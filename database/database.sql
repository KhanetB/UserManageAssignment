CREATE DATABASE IF NOT EXISTS user_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE user_management;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  INDEX idx_users_name (name)
) ENGINE=InnoDB;

INSERT IGNORE INTO users (name, phone, email) VALUES
  ('Anan Srisuk', '0812345678', 'anan.srisuk@example.com'),
  ('Mali Jaidee', '0891234567', 'mali.jaidee@example.com'),
  ('Narin Wongsa', '0865551234', 'narin.wongsa@example.com'),
  ('Suda Chaiyo', '0927654321', 'suda.chaiyo@example.com'),
  ('Krit Phromma', '0954443322', 'krit.phromma@example.com');
