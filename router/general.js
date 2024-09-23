const express = require('express');
let books = require("./booksdb.js");
let {fetchBooks} = require("./booksdbAsync.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

const doesExist  = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(books);
});

// Get the book list available in the shop using Promise callbacks (Task 10)
public_users.get('/', function (req, res) {
  fetchBooks()
    .then(books => {
      return res.status(200).send(books); // Send the fetched books
    })
    .catch(error => {
      return res.status(500).send({ error: 'Error fetching books: ' + error }); // Handle errors
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn]);
});

// Get book details based on ISBN using Promise callbacks (Task 11)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  fetchBooks()
      .then(books => {
          const bookDetails = books[isbn];

          // Check if the book exists
          if (bookDetails) {
              return res.status(200).json(bookDetails); // Return the book details with a 200 status
          } else {
              return res.status(404).json({ message: 'Book not found.' }); // Return a 404 status if not found
          }
      })
      .catch(error => {
          return res.status(500).json({ error: 'Error fetching books: ' + error }); // Handle errors
      });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
     // Filter books to get matched ones with id, title, and reviews
     const booksByAuthor = Object.entries(books)
     .filter(([key, book]) => book.author.toLowerCase() === author)
     .map(([key, book]) => ({
         isbn: key,
         title: book.title,
         reviews: book.reviews
     }));

 // Check if any books were found
 if (booksByAuthor.length > 0) {
     res.json({
      booksByAuthor
     });
 } else {
     res.status(404).json({ message: 'No books found for this author.' });
 }
});

// Get book details based on author using Promise callbacks (Task 12)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  fetchBooks()
      .then(books => {
          // Filter books to get matched ones with id, title, and reviews
          const booksByAuthor = Object.entries(books)
              .filter(([key, book]) => book.author.toLowerCase() === author)
              .map(([key, book]) => ({
                  isbn: key,
                  title: book.title,
                  reviews: book.reviews
              }));

          // Check if any books were found
          if (booksByAuthor.length > 0) {
              res.json({ booksByAuthor });
          } else {
              res.status(404).json({ message: 'No books found for this author.' });
          }
      })
      .catch(error => {
          res.status(500).json({ error: 'Error fetching books: ' + error });
      });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  // Filter books to get matched ones with id, title, and reviews
  const booksByTitle = Object.entries(books)
    .filter(([key, book]) => book.title.toLowerCase() === title)
    .map(([key, book]) => ({
      isbn: key,
      title: book.title,
      reviews: book.reviews
    }));
  console.log("booksByTitle ", booksByTitle);

  // Check if any books were found
  if (booksByTitle.length > 0) {
    res.json({
      booksByTitle
    });
  } else {
    res.status(404).json({ message: 'No books found for this title.' });
  }
});

// Get book details based on title using Promise callbacks (Task 12)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  fetchBooks()
      .then(books => {
          // Filter books to get matched ones with id, title, and reviews
          const booksByTitle = Object.entries(books)
              .filter(([key, book]) => book.title.toLowerCase() === title)
              .map(([key, book]) => ({
                  isbn: key,
                  title: book.title,
                  reviews: book.reviews
              }));

          console.log("booksByTitle ", booksByTitle);

          // Check if any books were found
          if (booksByTitle.length > 0) {
              res.json({ booksByTitle });
          } else {
              res.status(404).json({ message: 'No books found for this title.' });
          }
      })
      .catch(error => {
          res.status(500).json({ error: 'Error fetching books: ' + error }); // Handle errors
      });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  console.log(books[isbn])
  const reviews = books[isbn].reviews;

  // Check if any books were found
  return res.send(reviews);
});

module.exports.general = public_users;
