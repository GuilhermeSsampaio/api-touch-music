const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("get ok");
  console.log("rota get acessada");
});

app.post("/", (req, res) => {
  const data = req.body;
  res.send(`Rota post: ${JSON.stringify(data)}`);
});

app.listen(port, () => {
  console.log(`Servidor rodando`);
});
