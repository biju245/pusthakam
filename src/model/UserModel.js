const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    uid : {
        type: String,
        required: true,
        index: {unique:true}
    },    
    pwd: {
        type: String,
        required: true
    }
});

const userdata = mongoose.model('userdatas',UserSchema);

module.exports = userdata;
