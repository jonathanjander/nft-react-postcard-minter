// import getWeb3 from "../getWeb3";
import PostcardContract from "../abis/Postcard.json";
import Web3 from "web3";

//why do i have to export this but not pinFileToIPFS?
//TODO change methods to make sense. getWeb3 and getContract dont make sense
export const getWallet = async ()=> {
    if(window.ethereum) {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // reload page when chain or account changes
            // from: https://docs.metamask.io/guide/ethereum-provider.html#events
            window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
            window.ethereum.on('accountsChanged', function (_address) {window.location.reload()})

            // Use web3 to get the user's accounts.
            // const accounts = await web3.eth.getAccounts();
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            // Get the contract instance.
            // const networkId = await web3.eth.net.getId();
            // const deployedNetwork = PostcardContract.networks[networkId];
            // const instance = new web3.eth.Contract(
            //     PostcardContract.abi,
            //     deployedNetwork && deployedNetwork.address,
            // );

            return {
                web3: web3,
                account: accounts[0],
                statusMessage: "Mint your own Postcard-NFT"
            }
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                "Failed to load web3 or accounts.",
            );
            console.error(error);
            return {
                web3: null,
                account: "",
                statusMessage: "Failed to connect to Wallet: "+ error
            }
        }
    }
    else{
        return {
            web3: null,
            account: "",
            statusMessage: "Metamask is not installed"
        }
    }
}
export const getContract = async (web3, networkId)=> {
    try {
        // networkId 4 is the rinkeby network
        if (typeof(networkId) == "undefined") {
            // current networkId
            networkId = await web3.eth.net.getId();
        }



        // Get the contract instance.
        const deployedNetwork = PostcardContract.networks[networkId];
        const instance = new web3.eth.Contract(
            PostcardContract.abi,
            deployedNetwork && deployedNetwork.address,
        );

        return {
            contract: instance
        };

    }
    catch (e) {
        alert(
            "Failed to load contract or web3.",
        );
        return {
            contract: null
        };
    }
}
// from somewhere (i think dapp university)
const getWeb3 = () =>
    new Promise((resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener("load", async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    // await window.ethereum.enable();
                    await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });

                    // Accounts now exposed
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                // Use Mist/MetaMask's provider.
                const web3 = window.web3;
                console.log("Injected web3 detected.");
                resolve(web3);
            }
            // Fallback to localhost; use dev console port by default...
            else {
                const provider = new Web3.providers.HttpProvider(
                    "http://127.0.0.1:8545"
                );
                const web3 = new Web3(provider);
                console.log("No web3 instance injected, using Local web3.");
                resolve(web3);
            }
        });
    });
export const getNetwork = async (web3) => {
    const networkId = await web3.eth.net.getId();
    if(networkId==4)
        return "Rinkeby Testnetwork"
    else if (networkId == 0)
        return "Ganache local Blockchain"

}
// from alchemy web3
export async function mintNFT(tokenHash) {
    const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
    const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = PostcardContract.networks[networkId];
    const contractAddress = deployedNetwork && deployedNetwork.address;
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
    const nftContract = new web3.eth.Contract(PostcardContract.abi, contractAddress)




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


