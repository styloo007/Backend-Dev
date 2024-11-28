const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketID: {
        type:String,
        required: true,
        unique: true
    },
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
    },
    status:{
        type: String,
        enum: ['Active','Pending','Closed'],
        default: 'Pending',

    },
    customerName:{
        type:String,
        required:true,
    },
    notes: [
        {
            addedBy: {type: String, required: true},
            message: {type: String, required:true},
            timestamp:{type:Date, default: Date.now}
        }
    ],
    lastUpdatedOn: {type: Date, default: Date.now }
})

module.exports = mongoose.model('Ticket',ticketSchema);


