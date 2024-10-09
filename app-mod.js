const app = require("./config/server.js");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const port = process.env.PORT || 3000;

// Middlewares globais
app.use(helmet());
app.use(morgan("dev"));

// Configurar rotas
const homeRoutes = require("./app/routes/home.js");
const musicRoutes = require("./app/routes/music.js");
const uploadRoutes = require("./app/routes/upload.js");

app.use("/", homeRoutes);
app.use("/musics", musicRoutes);
app.use("/upload", uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
