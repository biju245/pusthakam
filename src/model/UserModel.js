const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Library',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(console.log("Mongo Connected"))
.catch(err => console.log(err));
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
