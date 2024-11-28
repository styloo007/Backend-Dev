const express = require('express');
const mongoose = require('mongoose');
const Ticket = require('../models/ticket');
const ticket = require('../models/ticket');
const router = express.Router();

router.post('/create', async(req,res) =>{
    const {title,description, customerName} = req.body;
    try{
        const ticket = new Ticket({
            ticketID: `T-${Date.now()}`,
            title,
            description,
            customerName,
        });

        await ticket.save();
        return res.status(201).json({message: 'Ticket Created Successfully', ticket});
    }
    catch(error){
        console.error(`Error Creating Ticket`);
        return res.status(500).json({message: 'Error Creating Ticket'});
    }
} );


router.get('/view', async(req,res) =>{
    try{
        const tickets = await Ticket.find().sort({lastUpdatedOn: -1});
        return res.status(200).json(tickets);
    }
    catch(err){
        return res.status(500).json({err: 'Failed to Fetch tickets'});
    }
} );


router.patch('/:id/status', async(req,res) =>{
    try{
        const {id} = req.params;
        const {status} = req.body;
        console.log(id);
        console.log(status);
        const ticket = await Ticket.findByIdAndUpdate(
            id, {status, lastUpdatedOn:Date.now()}, {new:true}  
        )
        
        if(!ticket) {
            return res.status(404).json({error: 'Ticket Not Found'});
        }
        return res.status(200).json(ticket);
    }
    catch(error){
        return res.status(500).json({error: 'Failed to Update Ticket Status'});
    }
} );

router.post('/:id/note', async(req,res) =>{
    try{
        const {id} = req.params;
        const {addedBy, message} = req.body;
        console.log(addedBy);
        console.log(message);
        const ticket = await Ticket.findByIdAndUpdate(
            id,
            {
                $push:{
                    notes: {addedBy, message},
                },
                lastUpdatedOn: Date.now(),
            },
            {new:true}
        );

        if(!ticket){
            return res.status(404).json({message: ' Ticket Not Found'});
        }
        return res.status(200).json(ticket);
    }

    catch(error){
        return res.status(500).json({error: 'Failed to Add Note to the ticket'});
    }

} );


router.get('/view_notes/:id', async(req,res) =>{
    const {id} = req.params;
    console.log(id);
    try{
        const notes = await Ticket.findById(id, 'notes');
        if(!notes){
            return res.status(404).json({message: 'Ticket Not Found'});
        }
        return res.status(200).json(notes);

    }
    catch(error){
        console.error(`Error Getting the notes`);
        res.status(500).json({error: 'Internal Server Error'});
    }
} );

module.exports = router;
