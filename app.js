import { PrismaClient } from "./generated/prisma/index.js"

//const {PrismaClient} = require("./generated/prisma/index.js")

//var jwt = require("jsonwebtoken");

import jwt from "jsonwebtoken";

//const bcrypt = require("bcrypt");
import bcrypt from "bcrypt"

const saltRounds = 10;

//const express = require('express');

import express from "express"

const app = express();

app.use(express.json());

const port = 3000;

const authMiddleware = (req, res, next) => {
  console.log("Je suis dans le middleware");
  console.log(req.headers);
  const authheader = req.headers["authorization"];
  const token =  authheader && authheader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, "lunick", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
  
};

//app.use(authMiddleware);

const prisma = new PrismaClient()

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email ?? ""
      }
    })

    if (!user || !bcrypt.compareSync(password, user.password)){
      res.status(400).json({ error: "Utilisateur introuvable" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, userName: user.name },
      'lunick',
      {expiresIn: '1h'}
    );

    //res.status(200).json(user);
    res.status(200).json({
      token
    });

});

app.post('/register', async (req, res) => {
    try {
      const { name, contact, email, password } = req.body;
      if (!name || !contact || !email || !password) {
        res.status(400).json({ "error": "Donnees invalid. Verifier les donnees..." });
        return;
      }
      const user_mail = await prisma.user.findUnique({
        where: {
          email: email
        }
      })

      if (user_mail !== null) {
        res.status(400).json({ error: "Email existant deja..." });
        return;
      }


      const user = await prisma.user.create({
        data: {
          name: name,
          contact: contact,
          email: email,
          password: bcrypt.hashSync(password, saltRounds),
        },
      });
      res.status(201).json(user);
    } catch (error) {
      //console.log(error);
      res.status(500).json({ "error": "Contacter l'admin" });
    }
});

app.get("/users", authMiddleware, async (req, res) => {
  const users = await prisma.user.findMany();
  //res.send("Get users Called");
  res.status(200).json(users);
});

app.get("/users/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json(user);
});

app.put("/users/:id", authMiddleware, async (req, res) => {
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


app.delete("/users/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).send(`Delete user Called with ID ${id}`);
});

app.listen(port, () => {
    console.log('Server started at http://localhost:3000');  
});