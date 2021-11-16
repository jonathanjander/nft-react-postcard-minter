//from https://github.com/neha01/nft-demo/tree/master/scripts

const path = require('path');
const { pinFileFromConsoleWithStreams} = require('./pinFileToIPFS');
const { createMetadataFile } = require('./ipfsHelper.js');


// createMetadataFile(name,'testetstestst',filePath);
// const metadataPath = path.join(__dirname, '../public/data/'+name+'.json');

pinFileFromConsoleWithStreams();