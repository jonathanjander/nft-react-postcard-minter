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

This is a bachelors thesis project. You can mint NFTs for the Souvenir collection

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Testing it
1. In order to test the DApp, you need to have a web3 provider like [MetaMask](https://metamask.io/download/). It was only tested with the MetaMask browser extension, so preferably use that. 
2. Create a MetaMask account and sign up over the browser extension. It only works if you're logged in over the browser extension.
3. Open [Souvenir-Minter-DApp](https://jonathanjander.github.io/nft-react-postcard-minter/).
4. The site should tell you to change networks to the Rinkeby testnet. You might get a notification window from MetaMask asking you if you want to change networks to the Rinkeby testnetwork. Please accept that request. If there is no notification window popping up, please open the MetaMask browser extension over the browser. MetaMask should show you a blue 1 indicating that you have a notification.
![notification](https://user-images.githubusercontent.com/63592190/156237856-c59cab42-c01e-4137-8bf4-1ce6fe822c96.png)

The notification should look like this

![switchnetworks](https://user-images.githubusercontent.com/63592190/156238326-e14dfa72-8f5a-483d-b96d-dfdd5196fbe5.png)

5.

Once openened, sign up on MetaMask and connect an ethereum account with the website. Next to the account there is a status symbol which shows if you are connected or not. You can only connect to the website, if the website is open.

![image](https://user-images.githubusercontent.com/63592190/155850389-9c121324-868f-4d7e-8279-0d283a3b53d3.png)

You also need to switch to the Rinkeby Testnetwork. Click on the dropdown menu on top of the MetaMask interface. If you just installed MetaMask, it will say "Ethereum Mainnet". If you can't find the Rinkeby Testnetwork, turn on "show test networks" in the settings.

![image](https://user-images.githubusercontent.com/63592190/155850285-de898228-a0c1-46cd-b2cb-6039d8ed27c4.png)

Only if the ethereum account is connected to the website and the you're connected to the rinkeby testwork, only then will you be able to see and interact with the website.

![image](https://user-images.githubusercontent.com/63592190/155850346-954f22c8-5d48-4f6e-8c26-dc8d9d8ebf51.png)

The screenshot above shows how it should look.


In Order to mint (create) Souvenir-NFTs, you need to get some Rinkeby ETH. 
Use one of the following links or ask me to send some rinkeby ETH to you:

Paste your Ethereum account address into the field. You can find your account address on MetaMask or if you are already connected to the souvenir-minter-DApp, you can find it in the top right corner. 
* [rinkebyfaucet.com (only works once a day)](https://www.rinkebyfaucet.com/)
* [faucets.chain.link/rinkeby](https://faucets.chain.link/rinkeby)

The feature that only the owner of the smart contract can mint (create) NFTs was disabled for easier testing.

If the steps were followed correctly, then you should be able to mint NFTs.

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [Truffle Suite (Truffle, Ganache)](https://trufflesuite.com/)
* [React.js](https://reactjs.org/)
* [React Bootstrap](https://react-bootstrap.github.io/)
* [Node.js](https://nodejs.org/en/)
* [Chai.js](https://www.chaijs.com/)
* [OpenZeppelin Smart Contract Library](https://github.com/OpenZeppelin/openzeppelin-contracts)
* [erc2981 maybe](https://www.chaijs.com/)

<p align="right">(<a href="#top">back to top</a>)</p>





### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```
  npm install npm@latest -g
  ```
* [MetaMask](https://metamask.io/)
  ```
  you need to have MetaMask or another Web3 Provider extension for your browser
  (it was only tested with MetaMask)
  ```
* Rinkeby-Testnetwork
  ```
  you need Ether on the Rinkeby testnet in order to pay for the transactions.
  some possible solutions for that are:
    https://faucets.chain.link/rinkeby (recommended)
    https://faucet.rinkeby.io/
    https://rinkeby-faucet.com/
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

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

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

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


#.env file
pinata keys
pinata endpoints
mnemonic
infura client url
key of account