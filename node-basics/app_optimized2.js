const fs = require('fs').promises;
const path = require('path');

const inputFilePath = process.argv[2] || path.join(__dirname, 'input.txt')
const outputFilePath = process.argv[3] || path.join(__dirname, 'output.txt')

const checkFileExists = async(filePath) => {
    try{
        await fs.access(filePath);
        return true;
    }
    catch{
        return false;
    }
};  

const processFile = async() =>{
    try{
        const inputExists = await checkFileExists(inputFilePath);
        const outputExists = await checkFileExists(outputFilePath);
        if(!inputExists){
            console.error(`Input File doesnt exist ${inputFilePath}`);
            return;
        }

        if(!outputExists){
            console.error(`Output File doesnt exist ${outputFilePath}`);
            return
        }
        

        const data=await fs.readFile(inputFilePath, 'utf8');
        console.log("File Read Successful", data);


        transformedData = data.toLowerCase();


        await fs.writeFile(outputFilePath, transformedData);
        console.log("File Write Successful")

    }

    catch(error){
        console.error(`An Error occured ${error.message}`);
    }
};

processFile()