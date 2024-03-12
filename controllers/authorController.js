const Author = require("../models/author");
const Book = require("../models/book");

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator')

// Display list of all authors
exports.author_list = asyncHandler(async (req, res, next) => {
    const authorList = await Author.find().sort({ last_name: 1}).exec();

    // res.render("author_list", {
    //   title: 'Author List',
    //   author_list: authorList
    // })

    res.status(200).json(authorList);

})

// Display detail page for a specific Author.
exports.author_detail = asyncHandler(async (req, res, next) => {
    console.log(req.params.id)
    const [author, booksByAuthor] = await Promise.all([
      Author.findOne({_id: req.params.id}).exec(),
      Book.find({author: req.params.id}, "title summary").exec()
    ])

    if (author === null) {
      const err = new Error("Author not Found");
      err.status = 404;
      return next(err);
    }

    const author_details = {
      title: author.name,
      author: author,
      author_books: booksByAuthor,
    }
    console.log('AUTHOR DETAILS')
    console.log(author_details)

    res.status(200).json(author_details);

  });
  
  // Display Author create form on GET.
  exports.author_create_get = asyncHandler(async (req, res, next) => {
    res.render("author_form", {
      title: "Create Author"
    })
  });
  
  // Handle Author create on POST.
  exports.author_create_post = [
    body("first_name")
      .trim()
      .isLength({min: 1})
      .escape()
      .withMessage("First name must be specified")
      .isAlphanumeric()
      .withMessage("First name has non-alphanumeric characters"),
    
    body("last_name")
      .trim()
      .isLength({min: 1})
      .escape()
      .withMessage("Last name must be specified")
      .isAlphanumeric()
      .withMessage("Last name has non-alphanumeric characters"),
    
      body("birth-date", "Invalid Date of Birth")
      .optional({values: "falsy"})
      .isISO8601()
      .toDate(),

    body("death-date", "Invalid Date of Death")
      .optional({values: "falsy"})
      .isISO8601()
      .toDate(),

      asyncHandler (async (req, res, next) => {
        const errors = validationResult(req);

        const author = new Author({
          first_name: req.body.first_name,
          last_name: req.body.last_name, 
          date_of_birth: req.body.birth_date,
          date_of_death: req.body.death_date
        })

        if (!errors.isEmpty()) {
          res.render("author_form", {
            title: "Create Author",
            errors: errors.array()
          })
          return;
        } else {
          await author.save();
          res.redirect(author.url);
        }

      })
  ];
  
  // Display Author delete form on GET.
  exports.author_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete GET");
  });
  
  // Handle Author delete on POST.
  exports.author_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete POST");
  });
  
  // Display Author update form on GET.
  exports.author_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update GET");
  });
  
  // Handle Author update on POST.
  exports.author_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update POST");
  });