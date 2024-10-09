const express = require("express");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// Configurar o EJS e os arquivos estáticos
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../app/views"));
app.use(express.static(path.join(__dirname, "../public"))); // Pasta public
app.use(express.static(path.join(__dirname, "../node_modules/bootstrap/dist"))); // Bootstrap

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

module.exports = app;
