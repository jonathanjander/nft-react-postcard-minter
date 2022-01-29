import axios from "axios";
require('dotenv').config();
const etherScanKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
const etherScanPrefix = process.env.REACT_APP_ETHERSCAN_ENDPOINT_PREFIX;

export const getLatestERC721Tx = async (contractAddress, accountAddress, amountOfEntries) => {
    try {
        const url = etherScanPrefix+
            "?module=account"+
            "&action=tokennfttx"+
            "&contractaddress="+contractAddress+
            "&address="+accountAddress+
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
        // console.log("url "+url)
        const response = await axios(request);
        // console.log(response);
        return response;
    }
    catch (e) {
        console.log("something went wrong fetching the history data")
    }
}
export const getTxStatus = async (txHash) => {
    try {
        const url = etherScanPrefix+
            "?module=transaction"+
            "&action=gettxreceiptstatus"+
            "&txhash="+txHash+
            "&apikey="+etherScanKey
        const request = {
            method: 'get',
            url: url,
        };
        // console.log("url "+url)
        const response = await axios(request);
        // console.log(response);
        return response;
    }
    catch (e) {
        console.log("something went wrong fetching transaction status")
    }
}