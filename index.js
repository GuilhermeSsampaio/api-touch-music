const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
app.engine("ejs", require("ejs").__express);
app.set("views", "./app/views");
app.set("view engine", "ejs");
app.use(express.static("./public")); // Certifique-se de que a pasta 'public' é acessível

const port = process.env.PORT || 3000;

// Configurar o armazenamento do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Servir arquivos estáticos do Bootstrap
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Configurar Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src 'self' https://public-blob.squarecloud.dev"
  );
  next();
});

// Configurar Cross-Origin-Embedder-Policy
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
  next();
});

const apiKey = process.env.SQUARECLOUD_API_KEY;

app.get("/", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const options = {
      method: "GET",
      headers: {
        Authorization: apiKey,
      },
    };

    const response = await fetch(
      "https://blob.squarecloud.app/v1/objects",
      options
    );
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    const data = await response.json();

    res.render("home/home.ejs", { data, apiKey });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar dados da API");
  }
});

const FormData = require("form-data"); // Importar o pacote form-data

app.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo foi enviado." });
    }

    const fileName = req.query.name || "default-name"; // Capturar o nome do arquivo da query

    const fetch = (await import("node-fetch")).default;
    const formData = new FormData(); // Usar o FormData do pacote form-data
    const fileStream = fs.createReadStream(req.file.path);

    // Anexar o arquivo ao formData
    formData.append("file", fileStream, req.file.filename);

    const options = {
      method: "POST",
      headers: {
        Authorization: apiKey,
        ...formData.getHeaders(),
      },
      body: formData,
    };

    // Usar o nome dinâmico do arquivo na URL
    const response = await fetch(
      `https://blob.squarecloud.app/v1/objects?name=${encodeURIComponent(
        fileName
      )}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({ message: "Áudio enviado com sucesso!", data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao enviar o áudio");
  }
});

app.get("/musics", (req, res) => {
  const mysql = require("mysql");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "touch_music",
  });

  connection.query("select * from songs", (error, result) => {
    res.render("music/musics.ejs", { songs: result });
    // res.send(result);
  });
});

app.get("/add_music", (req, res) => {
  res.render("music/music_form.ejs");
});

app.post("/", (req, res) => {
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).send({ error: "Invalid data" });
  }

  res.send(`Rota post: ${JSON.stringify(data)}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
