
//Referencing Mongoose
let mongoose = require('mongoose')

//Defining the Schema
let userSchema = new mongoose.Schema({
    name: String,
    password: String,
});

//   Exporting  Models
//   console.log(module.exports)
module.exports = mongoose.model('userModel', userSchema)
