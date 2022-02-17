//adapted from https://github.com/neha01/nft-demo/tree/master/scripts

require('dotenv').config();
const axios = require('axios'); // promise based http client
const FormData = require('form-data'); // used to submit forms and file uploads

const pinataFileEndpoint = process.env.REACT_APP_PINATA_FILE_ENDPOINT;
const pinataJSONEndpoint = process.env.REACT_APP_PINATA_JSON_ENDPOINT;
const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataApiSecret = process.env.REACT_APP_PINATA_API_SECRET;

/*
uploads a JSON file to IPFS via Pinata's API
used for the NFT metadata
 */
export const uploadJSONToIPFS = async (JSONData) => {
    JSONData = formatJSON(JSONData);
    let result;
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
        console.log('Successfully pinned metadata to IPFS : ', response);
        result = {
            hash: response.data.IpfsHash,
            status: response.status
        }
    }
    catch (err) {
        console.log('Error occurred while pinning metadata to IPFS: ', err);
        result = {
            hash: "not-found",
            status:"Error occurred while pinning metadata to IPFS: " + err.message
        }
    }
    return result;
}

/*
uploads a file to IPFS via Pinata's API
used for the NFT asset
data must be a file or a blob otherwise it doesn't work
it uses the form data format in order to upload the file
 */
export const uploadDataToIPFS = async (data) => {
    const form_data = new FormData();
    let result;
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
        console.log('Successfully pinned image to IPFS : ', response);
        result = {
            hash: response.data.IpfsHash,
            status: response.status
        }
    }
    catch (err) {
        console.log('Error occurred while pinning the image to IPFS: ', err);
        result = {
            hash: "not-found",
            status:"Error occurred while pinning the image to IPFS: " + err.message
        }
    }
    return result;
}
/*
formats json data before uploading it to ipfs
removes empty attributes
 */
const formatJSON = (JSONData) => {
    const attributes = JSONData.pinataContent.attributes;
    for (let i = 0; i < attributes.length; i++) {
        if(attributes[i].trait_type === "" || attributes[i].value === ""){
            attributes.splice(i,1);
        }
    }
    return JSONData;
}
