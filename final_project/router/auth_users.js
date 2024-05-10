const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });

  if (usersWithSameName.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {

  let usersWithValidCredentials = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (usersWithValidCredentials.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      {
        username: username,
        password: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = { accessToken, username, password };
    return res.status(200).json({ message: "User logged in successfully" });
  } else {
    return res.status(400).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.query;

  if (!review) {
    return res.status(400).json({ message: "Please provide review" });
  }

  if (!books[isbn]) {
    return res.status(400).json({ message: "Book not found" });
  } else {
    if (books[isbn].reviews[req.user.username]) {
      books[isbn].reviews[req.user.username] = review;

      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      books[isbn].reviews[req.user.username] = review;

      return res.status(200).json({ message: "Review added successfully" });
    }
  }
});

// Deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Write your code here
  const { isbn } = req.params;

  if (!books[isbn]) {
    return res.status(400).json({ message: "Book not found" });
  } else {
    if (books[isbn].reviews[req.user.username]) {
      delete books[isbn].reviews[req.user.username];
      return res.status(200).json({ message: `Review for ${books[isbn].title} deleted successfully` });
    } else {
      return res.status(400).json({ message: "Review not found" });
    }
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
