-- Inserir um usuário
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


select * from users, audios, transcriptions, songs;