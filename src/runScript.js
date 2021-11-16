//from https://github.com/neha01/nft-demo/tree/master/scripts

const path = require('path');
const { pinFileToIPFS } = require('./pinFileToIPFS');
const { createMetadataFile } = require('./ipfsHelper.js');

// saves image from assets folder as ipfs
const filePath = path.join(__dirname, '../assets/Logo-init-ag.png');
// const filePath = path.join(__dirname, '../nft-data/postcard.json');

pinFileToIPFS(filePath);

let name = 'test';
createMetadataFile(name,'testetstestst',filePath);
const metadataPath = path.join(__dirname, '../public/data/'+name+'.json');
pinFileToIPFS(metadataPath);