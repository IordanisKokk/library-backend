const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const { format } = require('morgan');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date}
})

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case
    let fullname = "";
    (this.first_name && this.last_name) ? fullname = `${this.last_name}, ${this.first_name}`: fullname=''; 

    return fullname;
});

AuthorSchema.virtual("url").get( function () {
    return `/catalog/author/${this._id}`;
})

AuthorSchema.virtual("formatted_date").get(function () {

    const formatted_date = this.date_of_death ?
        DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) + ' - '
        + DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : 
        DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) + ' - Present' 
    return formatted_date
})

module.exports = mongoose.model("Author", AuthorSchema);