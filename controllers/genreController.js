const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const genreList = await Genre.find().sort({name: 1}).exec();

  // res.render("genre_list", {
  //   title: "Genre list",
  //   genre_list: genreList
  // })
  console.log(typeof genreList)
  res.status(200).json(genreList)

  // res.status(200).json(genreList)

});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(id).exec(),
    Book.find({ genre: id }, "title summary").exec(),
  ]);
  // console.log(booksInGenre)
  // res.render("genre_detail", {
  //   title: `${genre.name} Books`,
  //   genre: genre,
  //   books: booksInGenre
  // })
  
  const genreDetails = {
      genre: genre,
      books: booksInGenre
  }

  console.log(`Genre ${genreDetails.genre.name}`)
  console.log(genreDetails.books)

  res.status(200).json(genreDetails);

});

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", {
    title: "Create Genre"
  });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre must contain at least three (3) characters")
    .trim()
    .isLength({ min:3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({name: req.body.name});
    console.log(errors  )
    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;

    } else {
      const genreExists = await Genre.findOne({name: req.body.name})
        .collation({locale: 'en', strength: 2})
        .exec();

      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
]

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
