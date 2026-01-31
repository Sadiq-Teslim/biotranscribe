-- In TiDB Cloud (Serverless), the default database is often named 'test'.
-- We will use that instead of creating a new one to avoid permission errors.

USE test;

-- Create History Records Table
CREATE TABLE IF NOT EXISTS history_records (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(10) NOT NULL,
    input_sequence TEXT NOT NULL,
    rna_sequence TEXT NOT NULL,
    protein_sequence TEXT NOT NULL,
    ai_analysis TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User Table (Optional)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);