const fs = require('fs');
const path = require('path');
const readline = require('readline');

const inputFilePath =  path.join(__dirname, 'input.txt');
const outputFilePath = path.join(__dirname, 'output.txt');

const checkFileExists = async(filepath) =>{
    try{
        await fs.promises.access(filepath);
        return true;
    }
    catch{
        return false;
    }
};

const processFileWithStreams = async() => {
    try{
        const inputExists = await checkFileExists(inputFilePath);
        const outputExists =await checkFileExists(outputFilePath);
    
        if(!inputExists){
            console.error(`Input File at ${inputFilePath} doesn't exist`);
            return;
        }
        
        if(!outputExists){
            console.error(`Output File at ${outputFilePath} doesnt exist`);
            return;
        }
    
        const inputStream = fs.createReadStream(inputFilePath, 'utf8');
    
        const outputStream = fs.createWriteStream(outputFilePath);
    
        const rl = readline.createInterface({
            input:inputStream,
            output:outputStream,
            terminal:false
        });
    
        rl.on('line', (line) =>{
            const transformedline = line.toLowerCase();
            outputStream.write(transformedline + '\n');
        } );
        
        rl.on('close', () => {
            console.log("File Read and Write Successful");
        } )
    }
    catch(error){
        console.error(`An Error Occured ${error.message}`)
    }

};


processFileWithStreams()
