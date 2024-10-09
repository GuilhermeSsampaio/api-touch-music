const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { SquareCloudBlob } = require("@squarecloud/blob");
const FormData = require("form-data");
const dotenv = require("dotenv");

dotenv.config();
const apiKey = process.env.SQUARECLOUD_API_KEY;
const blob = new SquareCloudBlob(apiKey);
const router = express.Router();

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

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo foi enviado." });
    }

    const fileName = req.query.name || "default-name";
    const fetch = (await import("node-fetch")).default;
    const formData = new FormData();
    const fileStream = fs.createReadStream(req.file.path);

    formData.append("file", fileStream, req.file.filename);

    const options = {
      method: "POST",
      headers: {
        Authorization: apiKey,
        ...formData.getHeaders(),
      },
      body: formData,
    };

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

router.delete("/delete_audio", async (req, res) => {
  try {
    const fileName = req.query.name;

    if (!fileName) {
      return res.status(400).json({ error: "O nome do arquivo é necessário." });
    }

    const urlParts = new URL(fileName).pathname.split("/").filter(Boolean);
    if (urlParts.length < 2) {
      return res.status(400).json({ error: "URL inválida." });
    }

    const id = urlParts[0];
    const objectName = urlParts[1];

    const objectToDelete = `${id}/${objectName}`;
    await blob.objects.delete([objectToDelete]);

    res.json({ message: "Áudio deletado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar o áudio");
  }
});

module.exports = router;
