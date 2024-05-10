const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  } else {
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User registered successfully." });
    } else {
      return res.status(400).json({ message: "Username already exists" });
    }
  }
});


public_users.get("/", function (req, res) {

  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((listOfBooks) => {
    res.send(JSON.stringify(listOfBooks, null, 4));
  });
});


public_users.get("/isbn/:isbn", function (req, res) {

  const { isbn } = req.params;

  new Promise((resolve, reject) => {
    const bookToGet = books[isbn];

    if (bookToGet) {
      resolve(bookToGet);
    } else {
      reject("Unable to get book, ISBN not found");
    }
  })
  .then((book) => {
    res.send(book);
  })
  .catch((error) => {
    res.status(400).send(error);
  });
});


public_users.get("/author/:author", function (req, res) {

  const { author } = req.params;

  new Promise((resolve, reject) => {
    let foundBooks = [];
    for (let key in books) {
      if (books[key].author.toLowerCase().includes(author.toLowerCase())) {
        foundBooks.push(books[key]);
      }
    }
    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      reject("Unable to get book, author not found");
    }
  })
  .then((booksByAuthor) => {
    res.send(booksByAuthor);
  })
  .catch((error) => {
    res.status(400).send(error);
  });

});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const { title } = req.params;

  new Promise((resolve, reject) => {
    let foundBooks = [];
    for (let key in books) {
      if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
        foundBooks.push(books[key]);
      }
    }

    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      reject("Unable to get book, title not found");
    }
  })
  .then((booksByTitle) => {
    res.send(booksByTitle);
  })
  .catch((error) => {
    res.status(400).send(error);
  });
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
