const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("get ok");
  console.log("rota get acessada");
});

app.get("/teste", (req, res) => {
  res.send("get teste");
  console.log("rota get acessada");
});

app.post("/", (req, res) => {
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).send({ error: "Invalid data" });
  }

  res.send(`Rota post: ${JSON.stringify(data)}`);
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
