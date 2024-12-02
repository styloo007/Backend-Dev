const ticket = require('../models/ticket');
const Ticket = require('../models/ticket');

exports.createTicket = async(req,res) =>{
    try{
        const ticket = new Ticket({ ...req.body, userID: req.user.id});
        await ticket.save();
        res.status(201).json(ticket);
    }
    catch(error){
        console.error(`Error Creating Ticket: ${error.message}`);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

exports.getTickets = async(req,res) =>{
    try{
        const tickets = req.user.role === 'Customer'
            ? await Ticket.find({userId: req.user.id})
            : await Ticket.find();
        return res.status(200).json(tickets);
    }
    catch(err){
        console.error(`Error Getting Tickets: ${err.message}`);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

exports.updateTicketStatus = async(req,res) =>{
    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket){
            return res.status(400).json({message: 'Ticket Not Found'});
        }

        ticket.status=req.body.status;
        await ticket.save();
        return res.status(200).json({message: 'Ticket Status Updated Successfully',ticket});
    }
    catch(err){
        console.error(`Error Updating Ticket Status`);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}