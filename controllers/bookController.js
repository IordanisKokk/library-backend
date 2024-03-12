const Book = require("../models/book");
const Author = require("../models/author");
const BookInstance = require("../models/bookinstance");
const Genre = require("../models/genre");

const mongoose = require("mongoose");

const asyncHandler = require("express-async-handler");

async function getBookStatus(book) {
  const bookInstances = await BookInstance.find({$and:[{"book": book._id},{"status": "Available"}]}).exec();
  
  let status = 'Unavailable';
  if (bookInstances.length > 0) {
    status = 'Available';
  }
  return status;
}

exports.index = asyncHandler(async (req, res, next) => {
    console.log("asfsajbfijhasbfasf")
    console.log(`Mongoose connection state: ${mongoose.connection.readyState}`);

    const [ 
        numBooks,
        numBookInstances, 
        numAvailableBookInstances, 
        numAuthors, 
        numGenres,
     ] = await Promise.all([
        Book.countDocuments({}).exec(),
        BookInstance.countDocuments({}).exec(),
        BookInstance.countDocuments({status: "Available"}).exec(),
        Author.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
     ])

     res.status(200).json({
        title: "Local Library",
        book_count: numBooks,
        book_instance_count: numBookInstances,
        available_book_instance_count: numAvailableBookInstances,
        authors_count: numAuthors,
        genres_count: numGenres,
     });
});

// Display list of all books.
exports.book_list = asyncHandler(async (req, res, next) => {
  
  const allBooks = await Book.find({}, "title author isbn summary")
    .sort({title: 1})
    .populate("author")
    .exec();

    const statuses = await Promise.all(allBooks.map(async (book) => {
      console.log(`TITLE: ${book.title}, AUTHOR: ${book.author.first_name} ${book.author.last_name}, ISBN: ${book.isbn}`);
      const status = getBookStatus(book)
      console.log(book.title, status);
      return status;
    }));  

  // res.render("book_list", { title: "Book List", book_list: allBooks, statuses: statuses});
  res.status(200).json(allBooks)

});

// Display detail page for a specific book.
exports.book_detail = asyncHandler(async (req, res, next) => {
  
   // Get details of books, book instances for specific book
   const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (book === null) {
    // No results.
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  res.render("book_detail", {
    title: book.title,
    book: book,
    book_instances: bookInstances,
  });

});

// Display book create form on GET.
exports.book_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create GET");
});

// Handle book create on POST.
exports.book_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create POST");
});

// Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

// Handle book delete on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

// Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

// Handle book update on POST.
exports.book_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});
