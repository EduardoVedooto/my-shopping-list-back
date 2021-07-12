import express from "express";
import cors from "cors";
import Joi from "joi";

import connection from "./database.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/items", async (req, res) => {

  try {
    const response = await connection.query("SELECT * FROM list;");
    res.send(response.rows);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }

});

app.post("/items", async (req, res) => {
  const schema = Joi.object({
    text: Joi.string().required()
  })
  if (schema.validate(req.body).error) return res.sendStatus(400);

  try {
    await connection.query("INSERT INTO list (text) VALUES ($1);", [req.body.text]);
    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default app;
