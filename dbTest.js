const fs = require('fs');
const mongoose = require('mongoose');
const Author = require('./models/author');
const Book = require('./models/book');
const BookInstance = require('./models/bookInstance');
const Genre = require('./models/genre');

const data = require('./data.json');
// Replace this with your MongoDB connection string
const uri =
'mongodb+srv://admin_1:80vJPUZdbqvqTMrS@cluster0.ubcgjdy.mongodb.net/local_library?retryWrites=true&w=majority';
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

    
    // const authorIds = data.books.forEach(async (book) => {
    //   // console.log(book)
    //   // console.log(book.author)
    //   console.log(data.authors[book.author].first_name)
    //   console.log(data.authors[book.author].last_name)
    //   const authors = await Author.find(
    //     {$and:
    //       [
    //         { first_name: data.authors[book.author].first_name },
    //         { last_name: data.authors[book.author].last_name }
    //       ]
    //     }).exec();
    //     console.log(authors['_id']);
    //     return authorIds;
    //   });

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

    // // // Populate Books
    // const books = data.books.map(book => ({
    //   title: book.title,
    //   summary: book.summary,
    //   isbn: book.isbn,
    //   author: authorIds[data.authors.findIndex(a => a.first_name === book.author.first_name && a.last_name === book.author.last_name)],
    //   genres: book.genres.map(genreName => genreIds[data.genres.findIndex(g => g.name === genreName)]),
    // }));

    // books.forEach((book) => {
    //   console.log(book)
    // })
    // await Book.create(books);

    // // Populate BookInstances
    // const bookInstances = data.bookInstances.map(instance => ({
    //   book: books.find(book => book.title === data.books.find(b => b.title === instance.book.title).title)._id,
    //   imprint: instance.imprint,
    //   status: instance.status,
    //   due_back: instance.due_back,
    // }));
    // await BookInstance.create(bookInstances);

    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    // Close the connection after populating the database
    mongoose.connection.close();
  }
}




// async function populateDatabase() {
//   try {
//     const rawData = fs.readFileSync('data.json');
//     const data = JSON.parse(rawData);
//     // Create authors
//     for (const authorData of data.authors) {
//       const author = new Author(authorData);
//       await author.save();
//     }
//     // Create genres
//     for (const genreData of data.genres) {
//       const genre = new Genre(genreData);
//       await genre.save();
//     }
    
//     console.log(data.genres[3])

//     // Create books and book instances
//     for (const bookData of data.books) {
//       if (mongoose.connection.readyState !== 1) {
//         console.error('MongoDB connection is not open');
//         return;
//       }
      
//       try {
//         console.log('CREATING BOOK')
//         console.log(data.authors[bookData.author].first_name)
//         console.log(data.authors[bookData.author].last_name)
//         console.log(data.genres[bookData.genres[0]].name)
//         let authorId = '';
//         const authors = await Author.find({
//           $and: [{ first_name: data.authors[bookData.author].first_name }, { last_name: data.authors[bookData.author].last_name }],
//         }).select('_id');

//         const genres = [];
//         for (const genreIndex of bookData.genres) {
//           console.log(genreIndex)
//           const genreId = await Genre.findOne({ name: `${data.genres[genreIndex]}` }).exec();
//           console.log(genreId._id)
//           if (genreId.length > 0) {
//             genres.push(genreId[0]._id);
//           }

          
//         }
//           console.log(genres)
  
//         if (authors.length > 0 && genres.length > 0) {
//           authorId = authors[0]._id;
    
//           const book = new Book({
//             title: bookData.title,
//             summary: bookData.summary,
//             isbn: bookData.isbn,
//             author: authorId,
//             genre: genres,
//           });
          
//           await book.save();

//         } else {
//           console.log('Author not found.');
//         }
//       } catch (error) {
//         console.error('Error creating book:', error.message);
//       }

//     }
//       console.log('Database populated successfully.');
//       for ( const bookInstanceData of data.bookInstances) {
//         if (mongoose.connection.readyState !== 1) {
//           console.error('MongoDB connection is not open');
//           return;
//         }

//         try {
//           // console.log('CREATING BOOKINSTANCE')
//           // console.log(data.books[bookInstanceData.book])

//           const book = await Book.find(
//             { isbn: data.books[bookInstanceData.book].isbn }
//           ).select('_id');
          
//           if (book.length > 0) {
//             const bookId = book[0]._id;
      

//           // console.log({book})

//           const bookInstance = new BookInstance({
//             book: bookId, 
//             imprint: bookInstanceData.imprint,
//             status: bookInstanceData.status,
//             due_back: bookInstanceData.due_back
//           })

//           // console.log(bookInstance);

//           await bookInstance.save();
//         } else {
//           console.log('Book not found.');
//         }
//         } catch (error) {
//           console.error('Error creating book:', error.message);
//         }
//       }

//   } catch (error) {
//     console.error('Error populating the database:', error.message);
//     throw error;
//   }
// }

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
