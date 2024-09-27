const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
app.engine("ejs", require("ejs").__express);
app.set("views", "./app/views");
app.set("view engine", "ejs");
const port = process.env.PORT || 3000;

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

const apiKey = process.env.SQUARE_API_KEY;

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

app.get("/musics", (req, res) => {
  res.render("music/musics.ejs");
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
