const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filteredUsers = users.filter(user=> user.username === username);

    return filteredUsers.length>0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let filteredUsers = users.filter(user=> user.username === username && user.password === password);

    return filteredUsers.length>0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Failed to login!"});
  }

  if (authenticatedUser(username, password)) {
    token = jwt.sign({
        data: password
    }, "access", { expiresIn: 60 * 60 });

    req.session.authorization = {
        token, username
    };

    return res.status(200).json({message: "Succeessfully logged in!"});
  } else {
    return res.status(404).json({message: "Invalid login: check Username and Password and try again."})
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = Number(req.params.isbn);
  const review = req.body.review;

  const username = req.session.authorization.username;

  const bookTitle = books[isbn].title;

  if (review && bookTitle) {
    const bookReviewByUser = books[isbn].reviews[username];

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: (bookReviewByUser? "Succcessfully made changes" : "Successfully added review") +  ` for book ${bookTitle}.`
    })
  } else {
    return res.status(400).json({message: "Failed to add/modify review: please provided a review body."})
  }
});

regd_users.delete("/auth/review/:isbn", (req, res)=> {
    
    const isbn = Number(req.params.isbn);
    const username = req.session.authorization.username;

    const message = books[isbn].reviews[username]? "Successfully deleted review!" : "No review on this book by user.";

    delete books[isbn].reviews[username];

    return res.send(message);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
