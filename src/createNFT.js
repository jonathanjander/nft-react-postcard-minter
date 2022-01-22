// from https://ethereum.org/en/developers/tutorials/how-to-mint-an-nft/#install-web3

require('dotenv').config();
const API_URL = process.env.REACT_APP_ETH_CLIENT_URL;
const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)
// const web3 = require("web3")
const contract = require("../abis/Souvenir.json")

// const contractAddress = "0x5A9D4601C976FaB853fF9Bce33e32399257eC1Cd"
// const nftContract = new web3.eth.Contract(contract.abi, contractAddress)


async function mintNFT(tokenHash, contractAddress) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
    const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 6721975,
        'data': nftContract.methods.mint(tokenHash).encodeABI()
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise
        .then((signedTx) => {
            web3.eth.sendSignedTransaction(
                signedTx.rawTransaction,
                function (err, hash) {
                    if (!err) {
                        console.log(
                            "The hash of your transaction is: ",
                            hash,
                            "\nCheck Alchemy's Mempool to view the status of your transaction!"
                        )
                    } else {
                        console.log(
                            "Something went wrong when submitting your transaction:",
                            err
                        )
                    }
                }
            )
        })
        .catch((err) => {
            console.log(" Promise failed:", err)
        })
}
// mintNFT("QmeRYsJWfViNjUCzf9ACuzYjf7nmcK4QarZKayTErhqTKs").then(data => console.log(data));
module.exports = {
    mintNFT
};
