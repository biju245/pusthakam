const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Portfolio');
const Schema = mongoose.Schema;

var NewTestimonySchema = new Schema({    
    guest : String,
    profession : String,    
    comment : String
});

var Testimonydata = mongoose.model('usercomments', NewTestimonySchema); 

module.exports = Testimonydata;