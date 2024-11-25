const express = require('express');
const Task = require('../models/task');
const router = express.Router();

router.post('/', async(req,res)=>{
    try{
        const {title, description, status, dueDate} = req.body;
        const task = await Task.create({title, description, status, dueDate});
        res.status(201).json(task);
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
});

router.get('/', async(req,res)=>{
    try{
        const {status} = req.query;
        const tasks = status ? await Task.find({status}) : await Task.find();
        res.status(200).json(tasks);
    }
    catch(error){
        res.status(500).json({message: 'Server Error'});
    }
});

router.get('/:id', async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id);
        if (!task){
            return res.status(404).json({message: 'Task Not Found'});
        }
        res.status(200).json(task);
    }
    catch(error){
        res.status(500).json({message: 'Server Error'});
    }
});

router.put('/:id', async(req,res)=>{
    try{
        const {title, description, status, dueDate} = req.body;
        const task = await Task.findByIdAndUpdate(req.params.id, {title, description, status, dueDate});
        if(!task){
            return res.status(404).json({message: 'Task Not Found'});
        }
        res.status(200).json(task);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

router.delete('/:id', async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task){
            return res.status(400).json({message: 'Task Not Found'});
        }
        res.status(200).json({message: 'Task Deleted Successfully'});
    }
    catch(error){
        res.status(500).json({message: 'Server Error'});
    }
});


router.patch('/:id', async(req,res)=>{
    try{
        const updates = req.body;
        const task  = await Task.findByIdAndUpdate(req.params.id, updates, {new:true, runValidators:true});
        if(!task){
            return res.status(404).json({message: 'Task Not Found'});
        }
        res.status(200).json(task);
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
});


router.head('/:id', async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).send();
        }
        res.status(200).send();
    }
    catch(error){
        res.status(500).send();
    }
});

router.options('/', async(req,res) =>{
    res.set('Allow', 'POST, GET, OPTIONS').send();
} );

router.options('/:id', async(req,res) =>{
    res.set('Allow', 'GET, POST, DELETE, PATCH, OPTIONS, HEAD').send();
} );

module.exports = router;

