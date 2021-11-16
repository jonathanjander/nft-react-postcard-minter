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
        console.log("contract: " + instance._address)
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


