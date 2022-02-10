import axios from "axios";
require('dotenv').config();
const etherScanKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
const etherScanPrefix = process.env.REACT_APP_ETHERSCAN_ENDPOINT_PREFIX;

/*
sends a get request to etherscan
returns x amount of entries for given smart contract
 */
export const getLatestERC721Tx = async (contractAddress, amountOfEntries) => {
    try {
        const url = etherScanPrefix+
            "?module=account"+
            "&action=tokennfttx"+
            "&contractaddress="+contractAddress+
            "&page=1"+
            "&offset="+amountOfEntries+
            "&startblock=0"+
            "&endblock=99999999"+
            "&sort=desc"+
            "&apikey="+etherScanKey
        const request = {
            method: 'get',
            url: url,
        };
        const response = await axios(request);
        return response;
    }
    catch (e) {
        console.log("something went wrong fetching the history data")
    }
}