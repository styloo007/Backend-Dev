const fs = require('fs');
const path = require('path');

const inputFilePath=path.join(__dirname, 'input.txt')
const outputFilePath=path.join(__dirname, 'output.txt')

fs.readFile(inputFilePath, 'utf8', (err,data)=>{
    if(err){
        console.error("Error Reading the File", err.message);
        return;
    }
    console.log("File Read Successful",data);


    const transformedData = data.toLowerCase();


    fs.writeFile(outputFilePath, transformedData, (err,transformedData)=>{
        if(err){
            console.err("Error Writing to the File",err.message)
            return;
        }
        console.log("Transformed Data Written to File Successfully", transformedData);   
    })
})  