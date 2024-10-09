const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const dbConnection = require("../../config/dbConnection");
const connection = dbConnection;

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL");
});

router.get("/", (req, res) => {
  connection.query("SELECT * FROM SONGS", (error, results) => {
    if (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).send("Erro ao executar a consulta");
    }
    res.render("music/musics.ejs", { songs: results });
  });
});

router.get("/add", (req, res) => {
  res.render("music/music_form.ejs");
});

module.exports = router;
