//import { PrismaClient } from "./generated/prisma/index.js"

const {PrismaClient} = require("./generated/prisma/index.js")

const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

const prisma = new PrismaClient()

app.post('/login', (req, res) => {
    res.send("Login Called");
});

app.post('/register', async (req, res) => {
    const {name, contact, email, password} = req.body;
    const user = await prisma.user.create({
      data: {
        name: name,
        contact: contact,
        email: email,
        password: password,
      },
    });
    res.send("Register Called");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  //res.send("Get users Called");
  res.status(200).json(users);
});

app.get("/users/:id", (req, res) => {
    const id = req.params.id
    res.send(`Get user Called with ID ${id}`);
});
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  res.send(`Delete user Called with ID ${id}`);
});

app.listen(port, () => {
    console.log('Server started at http://localhost:3000');  
});