const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const mongoDB ='mongodb+srv://admin_1:80vJPUZdbqvqTMrS@cluster0.ubcgjdy.mongodb.net/local_library?retryWrites=true&w=majority';

async function connectToDatabase() {
    await mongoose.connect(mongoDB)
}

main().catch((err) => console.log(err));
main().then(() => {
    console.log('database connected')

});
async function main() {
    await mongoose.connect(mongoDB);
}


module.exports = connectToDatabase;