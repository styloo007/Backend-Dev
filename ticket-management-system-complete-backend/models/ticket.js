const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title:{type: String},
    description:{type:String},
    status:{type:String, enum: ['Active','Pending','Closed'], default:'Pending'},
    userID: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    createdAt: {type:Date, default: Date.now()},
});

module.exports = mongoose.model('Ticket', ticketSchema);