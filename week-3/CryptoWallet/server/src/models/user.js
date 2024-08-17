const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true,
    },
    walletSecret : {
        type : String,
        default : "",
    },
    accounts : {
        type : [{
            privateKey : String,
            publicKey : String, 
        }],
        default : [] 
    },
    transactions : {
        type : [{
            to : String,
            from : String,
            crypto : String,
            amt : Number
        }],
        default : [],
    }
},
{
    timestamps : true
});

const User = mongoose.model("User",userSchema);

module.exports = User;