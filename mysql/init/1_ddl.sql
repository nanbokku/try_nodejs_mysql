CREATE DATABASE IF NOT EXISTS todo_database;
CREATE TABLE IF NOT EXISTS todo_table (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, contents TEXT, completed BOOL DEFAULT false);