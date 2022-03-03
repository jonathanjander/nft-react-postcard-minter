import SouvenirContract from "../abis/Souvenir.json";
import Web3 from "web3";
//  instantiates wallet and requests the user account from injected ethereum API
export const getWallet = async ()=> {
    if(window.ethereum) {
        try {
            // Get network provider and web3 instance.
            const web3 = await new Web3(window.ethereum);
            // reload page when chain or account changes
            window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
            window.ethereum.on('accountsChanged', function (_address) {window.location.reload()})

            // Use web3 to get the user's accounts.
            const accounts = await requestAccounts(web3);
            await requestNetwork();
            return {
                web3: web3,
                account: accounts[0]
            }
        } catch (error) {
            // alert(
            //     "Failed to connect to Wallet: " + error.message,
            // );
            console.error(error);
            return {
                web3: null,
                account: "",
            }
        }
    }
    // fallback to local blockchain (Ganache)
    else{
        try{
            const provider = new Web3.providers.HttpProvider(
                "http://127.0.0.1:7545"
            );
            const web3 = await new Web3(provider);
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            console.log("No web3 instance injected, using Local web3.");
            return {
                web3: web3,
                account: accounts[0]
            }
        }
        catch (error) {
            alert("No global or local web3 provider found. Please install MetaMask and follow the steps from the GitHub README to proceed.",);
            console.error(error);
            return {
                web3: null,
                account: ""
            }
        }
    }
}
// creates contract instance with web3
export const getContract = async (web3, networkId)=> {
        try {
            // networkId 4 is the rinkeby network
            if (typeof(networkId) == "undefined") {
                // current networkId
                networkId = await web3.eth.net.getId();
            }
            // Get the contract instance.
            const deployedNetwork = SouvenirContract.networks[networkId];
            const instance = new web3.eth.Contract(
                SouvenirContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            return {
                contract: instance
            };
        }
        catch (error) {
            // alert(
            //     "Failed to load contract",
            // );
            console.error(error);
            return {
                contract: null
            };
        }
}
// requests network switch to rinkeby
export const requestNetwork = async ()=> {
    try {
        const networkId= await window.ethereum.networkVersion;
        if(networkId!=4 && networkId!=5777)
        window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4' }],
        }).on();
    } catch (error) {
        console.error(error);
    }
}
// requests accounts
export const requestAccounts = async ()=> {
    try{
        // Use web3 to get the user's accounts.
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        return accounts;
    }
    catch (error) {
        console.error(error);
    }


}
