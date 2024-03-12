const fs = require('fs');
const mongoose = require('mongoose');
const Author = require('./models/author');
const Book = require('./models/book');
const BookInstance = require('./models/bookInstance');
const Genre = require('./models/genre');

const data = require('./data.json');
// Replace this with your MongoDB connection string
// const uri = add mongoDB connection string
async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error;
  }
}

async function populateDatabase() {
  try {
    // Clear existing data
    await Promise.all([Author.deleteMany(), Genre.deleteMany(), Book.deleteMany(), BookInstance.deleteMany()]);

    // Populate Authors
    const authors = await Author.create(data.authors);

    // Populate Genres
    const genres = await Genre.create(data.genres);

      for (const bookData of data.books) {
        // console.log(bookData)

        const author = await Author.find({
          $and: [{ first_name: data.authors[bookData.author].first_name }, { last_name: data.authors[bookData.author].last_name }],
        }).select('_id').exec();
        // console.log(author[0]._id);

        const authorId = author[0]._id;

        const genreIds = []
        for (const genre of bookData.genres) {
        
          try {
            const genreDocument = await Genre.findOne({ name: data.genres[genre].name }).select('_id').exec();
        
            if (genreDocument) {
              // console.log({ genreId: genreDocument._id });
              genreIds.push(genreDocument._id);
            } else {
              console.log('Genre not found in the database:', data.genres[genre].name);
            }
          } catch (error) {
            console.error('Error fetching genre from the database:', error);
          }
        }

        console.log('\n', genreIds);
        // const genres = await Genre.find({name: }).select('_id').exec();
        // console.log(author[0]._id);
        const book = {
          title: bookData.title,
          summary: bookData.summary,
          isbn: bookData.isbn,
          author: authorId,
          genre: genreIds
        }

        await Book.create(book);

      }

      for (const bookInstance of data.bookInstances) {
        console.log(bookInstance);

        try {

          const book = await Book.findOne({isbn: data.books[bookInstance.book].isbn}).select('_id').exec();
          if (book) {
            console.log(book);

            const bookInstanceDoc = {
              book: book,
              imprint: bookInstance.imprint,
              status: bookInstance.status,
              due_back: bookInstance.due_back
            }

            await BookInstance.create(bookInstanceDoc)

          } else {
            console.log('Book not found in the database:', data.books[bookInstance.book].title, ' : ', data.books[bookInstance.book].isbn)
          }
        } catch (error) {
          console.error('Error fetching book from the database:', error)
        }

      }

    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    // Close the connection after populating the database
    mongoose.connection.close();
  }
}

async function run() {
  try {
    await connectToDatabase();
    await populateDatabase();
  } catch (error) {
    console.error('Error during script execution:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('Connection closed.');
  }
}

run().then(() => {
  console.log('Script completed successfully.');
  process.exit(0);
}).catch(() => {
  console.log('Script failed.');
  process.exit(1);
});
