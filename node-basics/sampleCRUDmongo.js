require('dotenv').config({path:'../.env'});

const mongoose = require('mongoose')
const PORT = process.env.PORT;

const mongo_URI = process.env.mongo_URI;

const express = require('express');

const Item = require('./models/item')

const fs =  require('fs');
const path = require('path');
const { json } = require('express/lib/response');
const { exit } = require('process');
const { connect } = require('http2');
const { captureRejectionSymbol } = require('events');

const app = express();

app.use(express.json());

const connectDB = async() =>{
    try{
        await mongoose.connect(mongo_URI);
        console.log("MongoDB Connected");
        app.listen(PORT, ()=>{
            console.log("Server Running on http://localhost:3000");
        });

    }
    catch(error){
        console.error(`MongoDB Connection Error - ${error.message}`);
        process.exit(1);
    }
};

connectDB();

app.post('/api/items', async(req,res)=>{
    try{
        const {itemName,price,description} = req.body;
        const newItem = new Item({itemName,price,description});
        await newItem.save();
        res.status(201).json(newItem);
    }
    catch(error){
        res.status(400).json({message: 'Invalid Request'});
    }
})



app.get('/api/items', async(req,res)=>{
    try{
        const items = await Item.find();
        res.status(200).json(items);

    }
    catch(error){
        res.status(500).json({message:'Server Error'});
    }
});


app.get('/api/items/:id', async(req,res) =>{
    try{
        const item = await Item.findById(req.params.id);
        if(!item){
            return res.status(400).json({message:'Item Not Found'});
        }
        res.status(200).json(item);
    }
    catch(error){
        res.status(500).json({message:'Server Error'});
    }
});


app.put('/api/items/:id', async(req,res)=>{
    try{
        const {itemName,price,description} = req.body;
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {itemName, price, description},
            {new:true, runValidators:true}
        );
        if(!updatedItem){
            return res.status(404).json({message: 'Item Not Found'});
        }
        else{
            return res.status(200).json(updatedItem);
        }
    }

    catch(error){
        res.status(500).json({message: 'Server Error'});
    }
    
});









