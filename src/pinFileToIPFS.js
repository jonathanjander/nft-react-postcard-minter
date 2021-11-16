//from https://github.com/neha01/nft-demo/tree/master/scripts

require('dotenv').config();
const axios = require('axios'); // promise based http client
const FormData = require('form-data'); // used to submit forms and file uploads
const pinataFileEndpoint = process.env.REACT_APP_PINATA_FILE_ENDPOINT;
const pinataJSONEndpoint = process.env.REACT_APP_PINATA_JSON_ENDPOINT;
const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataApiSecret = process.env.REACT_APP_PINATA_API_SECRET;

const uploadJSONToIPFS = async (JSONData) => {
    try {
        const request = {
            method: 'post',
            url: pinataJSONEndpoint,
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataApiSecret,
            },
            data: JSONData,
        };
        const response = await axios(request)
        console.log('Successfully pinned file to IPFS : ', response);
        return response.data.IpfsHash;
    }
    catch (err) {
        console.log('Error occurred while pinning file to IPFS: ', err);
    }
}
// data must be a file or a blob otherwise it doesn't work
const uploadDataToIPFS = async (data) => {
    const form_data = new FormData();
    try {
        form_data.append('file', data)
        const request = {
            method: 'post',
            url: pinataFileEndpoint,
            maxContentLength: 'Infinity',
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataApiSecret,
                'Content-Type': `multipart/form-data; boundary=${form_data._boundary}`,
            },
            data: form_data,
        };
        const response = await axios(request);
        console.log('Successfully pinned file to IPFS : ', response);
        return response.data.IpfsHash;
    }
    catch (err) {
        console.log('Error occurred while pinning file to IPFS: ', err);
    }
}


module.exports = {
    uploadDataToIPFS,
    uploadJSONToIPFS
}