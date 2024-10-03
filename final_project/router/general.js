import axios from 'axios';

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const TARGETURL = "https://ibrahimmn006-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai";

public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    
    if (!isValid(username)) {
        users.push({"username": username, "password": password});

        return res.status(200).json({"message": `Successfully registered user with username ${username}!`});
    } else {
        return res.status(404).json({"message": "User alraady exists!"})
    }
  }

  return res.status(404).json({"message": "Please make sure you've provided a username and password."})
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here

//   result = await axios.get(TARGETURL);
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books[req.params.isbn]))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const author = req.params.author;

  let filteredBooks = Object.values(books).filter((book)=> author === book.author);

  return res.send(JSON.stringify(filteredBooks));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const title = req.params.title;

  let filteredBooks = Object.values(books).filter((book)=> book.title === title);

  return res.send(JSON.stringify(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = Number(req.params.isbn);

  return res.send(JSON.stringify(books[isbn]["reviews"]))
});

module.exports.general = public_users;
