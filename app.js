//import { PrismaClient } from "./generated/prisma/index.js"

const {PrismaClient} = require("./generated/prisma/index.js")

const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

const prisma = new PrismaClient()

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        password: password
      }
    })

    if(user){
      return res.status(200).json(user);
    }
    return res.status(404).json({ error: "Utilisateur introuvable" });

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

app.get("/users/:id", async (req, res) => {
    const id = req.params.id
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json(user);
});

app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const { name, contact, email, password } = req.body;
  const user = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: name,
      contact: contact,
      email: email,
      password: password,
    },
  });
  res.status(200).json(user);
});


app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.delete({
    where: {
      id : parseInt(id),
    }
  })
  res.status(200).send(`Delete user Called with ID ${id}`);
});

app.listen(port, () => {
    console.log('Server started at http://localhost:3000');  
});