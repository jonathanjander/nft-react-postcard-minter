<!-- README TEMPLATE FROM https://github.com/othneildrew/Best-README-Template/blob/master/BLANK_README.md -->
<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[Souvenir-Minter-DApp](https://jonathanjander.github.io/nft-react-postcard-minter/)

This is a bachelors thesis project. A DApp which allows you to configure and mint Souvenir-NFTs.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Set up for testing
1. In order to test the DApp, you need to have a web3 provider like [MetaMask](https://metamask.io/download/). It was only tested with the MetaMask browser extension, so preferably use that. 
2. Create a MetaMask account and sign up over the browser extension. It only works if you're logged in over the browser extension.

   ![login](https://user-images.githubusercontent.com/63592190/156354768-2779a23a-97bb-4966-b533-d9f4080e1799.png)

3. Open the [Souvenir-Minter-DApp](https://jonathanjander.github.io/nft-react-postcard-minter/).
4. You should get a MetaMask notification to connect one of your Ethereum accounts to the website. 
 
   ![connect-account](https://user-images.githubusercontent.com/63592190/156241574-000869ec-0de8-4636-85b1-6dc21a581ea5.png)

5. After successfully connecting your Ethereum account to the website, you should get asked to switch networks to the Rinkbey test network because that is the only public network with a deployed Souvenir Smart Contract. You should get a MetaMask notification to connect one of your Ethereum accounts to the website. If not, press the "Connect to Rinkeby" button shown on the website.

   ![switchnetworks](https://user-images.githubusercontent.com/63592190/156238326-e14dfa72-8f5a-483d-b96d-dfdd5196fbe5.png)

6. You need ETH (Ether) on Rinkeby in order to pay for transactions.
   * [rinkebyfaucet.com](https://www.rinkebyfaucet.com/) (only works once a day)
   * [faucets.chain.link/rinkeby](https://faucets.chain.link/rinkeby) (you need to connect your Ethereum account to this site if you want to get Rinkeby ETH with this method)
   * ask me to send you some Rinkeby ETH (email: Jonathan.Jander@Student.HTW-Berlin.de)
7. If you see the Frontend of the website, then it worked! MetaMask should look like this:

   ![how-it-should-look](https://user-images.githubusercontent.com/63592190/156360738-7ca66bac-e8b5-49a9-b532-33a3d0b12c61.png)

8. Only follow this step if you want to test the DApp locally aswell (not recommended because some features are missing locally)
   * install [Ganache](https://trufflesuite.com/ganache/index.html)
   * create a new workspace with the Quickstart function on ganache
   * Add the local network to MetaMask (RPC-URL is HTTP://127.0.0.1:7545 and the Chain ID is 1337)


## Testing it
Fill out the form. Name, Description and Asset are required fields. 
In order to use the OpenSea representation, use one of the following supported file formats for the Asset File:
  gif, jpg, png, svg, mp4, mp3, WebM, wav, glb, ogg, gltf
  
The file can't be bigger than 100MB.

You can mint up to 20 token copies at a time.
The royalty fees can go between 0% and 30%
Add as many property fields as you like.

After pressing the "mint" button, wait for metamask to ask for your digital signature. It takes some time until the transaction is confirmed.

Once confirmed, you should see a status message telling you that the transaction was successful. 

![statusmessage](https://user-images.githubusercontent.com/63592190/156620470-5e50e702-f366-42f7-8b04-8875819ea275.png)

You might have to wait a bit until you're able to view the NFT on OpenSea. That is because of the IPFS network delay.

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [Truffle Suite (Truffle, Ganache)](https://trufflesuite.com/)
* [React.js](https://reactjs.org/)
* [React Bootstrap](https://react-bootstrap.github.io/)
* [Node.js](https://nodejs.org/en/)
* [Chai.js](https://www.chaijs.com/)
* [OpenZeppelin Smart Contract Library](https://github.com/OpenZeppelin/openzeppelin-contracts)

<p align="right">(<a href="#top">back to top</a>)</p>


### Installation
This is for if you want to try it out locally.

1. Get your free API Keys at [Pinata (IPFS)](https://www.pinata.cloud/)
2. Get your free API Keys at [Etherscan](https://etherscan.io/apis)
3. Create a Project (Endpoint=Rinkeby) and get your free API Keys at [Infura](https://infura.io/)
4. Get the [MetaMask](https://metamask.io/) browser Extension and create an account
6. Create an Ethereum Account on MetaMask and get your [Mnemonic](https://metamask.zendesk.com/hc/en-us/articles/360015290032-How-to-reveal-your-Secret-Recovery-Phrase), public and private key for later
7. Clone the repo
   ```sh
   git clone https://github.com/jonathanjander/bachelors-thesis.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `.env`
   ```js
   REACT_APP_PINATA_API_KEY="YOUR_PINATA_KEY"
   REACT_APP_PINATA_API_SECRET="YOUR_PINATA_SECRET"
   REACT_APP_PINATA_FILE_ENDPOINT="https://api.pinata.cloud/pinning/pinFileToIPFS"
   REACT_APP_PINATA_JSON_ENDPOINT="https://api.pinata.cloud/pinning/pinJSONToIPFS"
   
   REACT_APP_ETHERSCAN_API_KEY="YOUR_ETHERSCAN_KEY"
   REACT_APP_ETHERSCAN_ENDPOINT_PREFIX="https://api-rinkeby.etherscan.io/api"

   REACT_APP_MNEMONIC="YOUR_METAMASK_MNEMONIC"
   REACT_APP_ETH_CLIENT_URL="https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID"

   REACT_APP_PUBLIC_KEY = "YOUR_ETH_ACCOUNT_PUBLIC_KEY"
   REACT_APP_PRIVATE_KEY = "YOUR_ETH_PRIVATE_KEY"
   ```
4. To start the DApp locally
   ```sh
   npm run start 
   ```
   

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact
Jonathan Jander - Jonathan.Jander@Student.HTW-Berlin.de
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [GitHub Pages](https://pages.github.com)
* [Dapp University](https://www.dappuniversity.com/)
* [Dievardump](https://github.com/dievardump/EIP2981-implementation)



<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png

