

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let axios = require("axios");

const prompt = require('prompt-sync')();

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
    return res.send(JSON.stringify(books))
});

async function getBooks(callback) {
    const response = await axios.get(TARGETURL);

    callback(JSON.stringify(response.data));
}

getBooks((storeBooks)=> {
    console.log(`Books available: ${storeBooks}`)
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books[req.params.isbn]))
});
function getBookByISBN(isbn) {
    axios.get(`${TARGETURL}/isbn/${isbn}`)
        .then((response)=> {
            console.log(JSON.stringify(response.data));
        });
}
getBookByISBN(1);

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  let filteredBooks = Object.values(books).filter((book)=> author === book.author);

  return res.send(JSON.stringify(filteredBooks));
});
async function getBooksByAuthor(author) {
    const response = await axios.get(`${TARGETURL}/author/${author}`);
    console.log(`Getting book with Author '${author}': ${JSON.stringify(response.data)}`);
}
getBooksByAuthor("Dante Alighieri");


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const title = req.params.title;

  let filteredBooks = Object.values(books).filter((book)=> book.title === title);

  return res.send(JSON.stringify(filteredBooks));
});
async function getBooksByTitle(title) {
    const response = await axios.get(`${TARGETURL}/title/${title}`);
    console.log(`Getting book details from title '${title}': ${JSON.stringify(response.data)}`);
}
getBooksByTitle("Pride and Prejudice");

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = Number(req.params.isbn);

  return res.send(JSON.stringify(books[isbn]["reviews"]))
});

module.exports.general = public_users;
