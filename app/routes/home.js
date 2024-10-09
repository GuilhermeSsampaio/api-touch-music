const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const apiKey = process.env.SQUARECLOUD_API_KEY;

router.get("/", async (req, res) => {
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

module.exports = router;
