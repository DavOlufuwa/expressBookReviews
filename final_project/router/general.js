const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  const bookToGet = books[isbn];

  if (bookToGet) {
    res.send(bookToGet);
  } else {
    res.status(400).send("Unable to get book, isbn not found");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const { author } = req.params;

  let foundBooks = [];

  for (let key in books) {
    if (books[key].author.toLowerCase().includes(author.toLowerCase())) {
      foundBooks.push(books[key]);
    }
  }

  if (foundBooks.length > 0) {
    res.send(foundBooks);
  } else {
    res.status(400).send("Unable to get book, author not found");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const { title } = req.params;

  let foundBooks = [];

  for (let key in books) {
    if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
      foundBooks.push(books[key]);
    }
  }

  if (foundBooks.length > 0) {
    res.send(foundBooks);
  } else {
    res.status(400).send("Unable to get book, title not found");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;

  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(400).send("Unable to get book review, isbn not found");
  }
});

module.exports.general = public_users;
