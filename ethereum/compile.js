const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname,'build');
fs.removeSync(buildPath);

//get campaign contract path
const campaignPath = path.resolve(__dirname,'contracts', 'Campaign.sol');

//Get campaign contract
const source = fs.readFileSync(campaignPath,'utf8');

//Compile campaign contract
const output = solc.compile(source,1).contracts;

//check and created build folder
fs.ensureDirSync(buildPath);

//Get each contract and write them to build
for(let contract in output){
    const fileName = `${contract.replace(':','')}.json`;
    fs.outputJsonSync(
        path.resolve(buildPath,fileName),
        output[contract]
    );
}