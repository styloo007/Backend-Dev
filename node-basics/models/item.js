const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },

    price:{
        type: Number,
        required:true,
    },

    description: {
        type: String,
        default: "No Description Provided",
    },


}, {timestamps:true}  );

module.exports = mongoose.model('Item', ItemSchema);