const app = require("./config/server.js");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3001;

// Middlewares globais
app.use(helmet());
app.use(morgan("dev"));

// Configurar Content Security Policy
// Configurar Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://api-touch-music.squareweb.app; " +
      "style-src 'self' 'unsafe-inline'; " +
      "media-src 'self' blob: https://public-blob.squarecloud.dev https://api-touch-music.squareweb.app; " +
      "referrer no-referrer;"
  );
  next();
});

// Configurar Cross-Origin-Embedder-Policy
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
  next();
});

// Configurar rotas
const homeRoutes = require("./app/routes/home.js");
const musicRoutes = require("./app/routes/music.js");
const uploadRoutes = require("./app/routes/upload.js");

app.use("/", homeRoutes);
app.use("/musics", musicRoutes);
app.use("/upload", uploadRoutes);
// consign().include("app/routes").into(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
