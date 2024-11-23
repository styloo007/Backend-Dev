const fs = require('fs').promises;
const path = require('path');

const inputFilePath = path.join(__dirname, 'input.txt');
const outputFilePath = path.join(__dirname, 'output.txt');

const processFile = async()=>{
    try{
        const data = await fs.readFile(inputFilePath, 'utf8');
        console.log("File Read Successfully", data);

        transformedData = data.toLowerCase();

        await  fs.writeFile(outputFilePath, transformedData);
        console.log("File Written Successfully");
        
    }
    catch(error) {
        console.error("An Error Occured; ", error.message);
    }
};


processFile();