require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const tools = require("./tools");
const db = require("./db.js");
const urlModel = require("./UrlModel");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", async (req, res) => {
  const { url } = req.body;

  if (!tools.checkUrl(url)) return res.json({ error: "Invalid url" });

  try {
    const count = await urlModel.estimatedDocumentCount();

    const data = { original_url: url, short_url: count + 1 };
    const urlSave = new urlModel(data);
    await urlSave.save();

    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const { short_url } = req.params;

  try {
    const url = await urlModel.findOne({ short_url }).exec();

    if (!url) {
      res.json({ error: "No short URL found for the given input" });
    } else {
      res.redirect(url.original_url);
    }
  } catch (error) {
    res.json(error);
  }
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

db.connect();

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
