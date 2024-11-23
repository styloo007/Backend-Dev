const express = require('express')
const app = express()
const port = 3000

let items = []

app.use(express.json())

app.post('/api/items', (req,res) => {
    const {name, desc} = req.body;
    if(!name || !desc ){
        return res.status(400).json({error:'Name and Description are required'});
    }

    const newItem = {id: items.length+1, name, desc};
    items.push(newItem);
    res.status(201).json(newItem);

} );

app.get('/api/items', (req,res) => {
    res.json(items);
} )

app.get('/api/items/:id', (req,res)=>{
    const item = items.find(i=>i.id ===parseInt(req.params.id));
    if(!item){
        return res.status(400).json({error: 'Item Not Found'});
    }

    res.json(item)
})  

app.put('/api/items/:id', (req,res) =>{
    const {name, desc} = req.body;
    const item = items.find(i => i.id === parseInt(req.params.id));
    if(!item){
        return res.status(400).json({error: 'Item Not Found'})
    }

    item.name = name || item.name;
    item.desc = desc || item.desc;
    res.json(item);
} );

app.delete('/api/items/:id', (req,res) =>{
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if(index==-1){
        return res.status(404).json({error: 'Index Not Found'})
    }

    items.splice(index, 1);
    res.status(204).send();

} );


app.listen(port, () => {
    console.log("Server Running on http://localhost:3000")
})