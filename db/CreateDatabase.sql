-- CREATE DATABASE TOUCH_MUSIC
USE Music;

CREATE TABLE USERS(
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AUDIOS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT, 
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  size INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES USERS(id)
);

CREATE TABLE TRANSCRIPTIONS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  audio_id INT,
  transcription TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (audio_id) REFERENCES AUDIOS(id)
);

CREATE TABLE SONGS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  audio_id INT,
  title VARCHAR(255),
  chords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (audio_id) REFERENCES AUDIOS(id)
);

INSERT INTO USERS (username, email, password_hash)
VALUES ('gui_music', 'guilh@example.com', 'hashed_password_example');

-- Inserir um áudio associado ao usuário
INSERT INTO AUDIOS (user_id, file_name, file_path, size)
VALUES (1, 'audio_exemplo.mp3', '/uploads/audio_exemplo.mp3', 102400);

-- Inserir uma transcrição associada ao áudio
INSERT INTO TRANSCRIPTIONS (audio_id, transcription)
VALUES (1, 'Esta é uma transcrição de exemplo do áudio.');

-- Inserir uma música associada ao áudio
INSERT INTO SONGS (audio_id, title, chords)
VALUES (1, 'Música Exemplo', 'C G Am F');


-- drop database TOUCH_MUSIC;