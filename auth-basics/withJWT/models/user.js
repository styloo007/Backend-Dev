const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:['Admin','User'],
        default:'User'
    }
});

module.exports = mongoose.model('User', clientSchema);