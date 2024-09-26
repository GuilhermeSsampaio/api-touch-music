const express = require("express"); // Importa o módulo Express
const helmet = require("helmet"); // Importa o módulo Helmet para segurança
const morgan = require("morgan"); // Importa o módulo Morgan para logging

const app = express(); // Cria uma instância do aplicativo Express
app.set("views-engine", "ejs");
app.set("views", "./app/views");
const port = process.env.PORT || 3000; // Define a porta do servidor, usando a variável de ambiente PORT ou 3000 como padrão

app.use(express.json()); // Middleware para parsear requisições com JSON
app.use(helmet()); // Middleware para adicionar cabeçalhos de segurança HTTP
app.use(morgan("dev")); // Middleware para logging de requisições HTTP no console

app.get("/", (req, res) => {
  res.render("home/home.ejs");
  console.log("acessando home"); // Loga no console que a rota GET foi acessada
});

app.get("/musics", (req, res) => {
  res.render("music/musics.ejs");
  console.log("acessando musicas");
});

app.get("/add_music", (req, res) => {
  res.render("music/music_form.ejs");
  console.log("form add music acessado");
});

app.post("/", (req, res) => {
  // Define uma rota POST para o caminho raiz
  const data = req.body; // Obtém os dados do corpo da requisição

  if (!data || typeof data !== "object") {
    // Verifica se os dados são válidos
    return res.status(400).send({ error: "Invalid data" }); // Responde com status 400 e mensagem de erro se os dados forem inválidos
  }

  res.send(`Rota post: ${JSON.stringify(data)}`); // Responde com os dados recebidos em formato JSON
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  // Middleware para capturar erros
  console.error(err.stack); // Loga o stack trace do erro no console
  res.status(500).send("Algo deu errado!"); // Responde com status 500 e mensagem de erro
});

app.listen(port, () => {
  // Inicia o servidor na porta definida
  console.log(`Servidor rodando na porta ${port}`); // Loga no console que o servidor está rodando
});
