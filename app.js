const express = require("express");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// console.log(process.env.GEMINI_API_KEY);

const app = express();
const port = 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from gemini");
});

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({ message: "no prompt entered" });
  }

  try {
    const result = await model.generateContent(prompt);
    const resp = result.response;
    const text = resp.text();

    res.status(200).json(text);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "failed to communicate with gemini" });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
