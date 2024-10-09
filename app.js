// const express = require("express");
const app = require("./config/server.js");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const dotenv = require("dotenv");
const mysql = require("mysql");
const path = require("path");
const fs = require("fs");
const { SquareCloudBlob } = require("@squarecloud/blob");
// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
//chave
const apiKey = process.env.SQUARECLOUD_API_KEY;

const blob = new SquareCloudBlob(apiKey); // Mova a inicialização do blob para o escopo do app

// const app = express();
//coisa do gpt isso ai
// app.engine("ejs", require("ejs").__express);
// app.set("views", "./app/views");
// app.set("view engine", "ejs");
// app.use(express.static("./public")); // Certifique-se de que a pasta 'public' é acessível
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

// // Servir arquivos estáticos do Bootstrap
// app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));

// app.use(express.json());
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

// Configurar a conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // port: 3307,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL");
});

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

app.delete("/delete_audio", async (req, res) => {
  try {
    const fileName = req.query.name; // Captura o nome do arquivo da query string

    if (!fileName) {
      return res.status(400).json({ error: "O nome do arquivo é necessário." });
    }

    // Extrair ID e nome do objeto da URL
    const urlParts = new URL(fileName).pathname.split("/").filter(Boolean);

    // Verifique se a estrutura da URL é válida
    if (urlParts.length < 2) {
      return res.status(400).json({ error: "URL inválida." });
    }

    const id = urlParts[0]; // ID do objeto
    const objectName = urlParts[1]; // Nome do objeto (neste caso, o prefixo está incluído no nome)

    // Formatar a string do objeto para exclusão
    const objectToDelete = `${id}/${objectName}`; // Formato esperado pelo SDK
    console.log("ID:", id);
    console.log("Object Name:", objectName);
    console.log("Object to delete:", objectToDelete);
    // Chamar o método de exclusão
    await blob.objects.delete([objectToDelete]);

    res.json({ message: "Áudio deletado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar o áudio");
  }
});

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
  connection.query("SELECT * FROM SONGS", (error, results) => {
    if (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).send("Erro ao executar a consulta");
    }

    res.render("music/musics.ejs", { songs: results });
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
