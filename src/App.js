import React, { Component } from "react";
import PostcardContract from "./abis/Postcard.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import { uploadDataToIPFS, uploadJSONtoIPFS } from "./pinFileToIPFS";
import axios from "axios";


//https://github.com/dappuniversity/nft
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      web3: null,
      totalSupply: 0,
      tokens: [],
      imageFile: null,
      metadata: null,
    }
      this.onFormSubmit = this.onFormSubmit.bind(this)
      this.onChange = this.onChange.bind(this)
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PostcardContract.networks[networkId];
      const instance = new web3.eth.Contract(
          PostcardContract.abi,
          deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account: accounts[0], contract: instance}, this.runExample);


        console.log("contract address: "+ this.state.contract._address);
        // console.log("totalSupply of minted NFTs: " + this.state.contract.methods.totalSupply())

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  mint = (hash) => {
    this.state.contract.methods.duplicateMint(hash).send({from: this.state.account})
        .once('receipt', (receipt) => {
          console.log("id: "+receipt.logs[0].topics[3]);
          this.setState({
            tokens: [...this.state.tokens, hash]
          })
        })
  }

  onChange(e) {
      this.setState({imageFile:e.target.files[0]})
  }

  async onFormSubmit(name,description){
      try{
          const imageHash = await uploadDataToIPFS(this.state.imageFile);

          const metadata =
              {
                  pinataMetadata: {
                    name: name+".json"
                  },
                  pinataContent: {
                      name: name,
                      description: description,
                      image: "https://ipfs.io/ipfs/" + imageHash
                  }
              };
          this.setState({metadata:metadata});
          const metadataHash = await uploadJSONToIPFS(metadata);
          this.mint(metadataHash);
          //if network id == 4 aka equals rinkeby testnets. otherwise do something else i guess
          const url = "https://testnets.opensea.io/assets/"+this.state.contract._address+"/1"

          // window.location.href = url;
      }
      catch (e){
          console.log("something went wrong with creating your NFT: "+e);
      }
  }
  addLinkToOpenSeaView(){

  }
    // https://codesandbox.io/s/react-eth-metamask-7vuy7?file=/src/App.js
    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
           <form className="m-4" onSubmit={ async (event) => {
                                    event.preventDefault();
                                    await this.onFormSubmit(this.name.value,this.description.value);
                                }}>
                                    <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
                                        <main className="mt-4 p-4">
                                        <h1 className="text-xl font-semibold text-gray-700 text-center">
                                            Mint Postcard NFT
                                        </h1>
                                        <div className="">
                                            <div className="my-3">
                                                <input
                                                    type='text'
                                                    className="input input-bordered block w-full focus:ring focus:outline-none"
                                                    placeholder='Name'
                                                    required
                                                    ref={(input) => {
                                                        this.name = input
                                                    }}
                                                />
                                            </div>
                                            <div className="my-3">
                                                <input
                                                    type='textarea'
                                                    className="input input-bordered block w-full focus:ring focus:outline-none"
                                                    placeholder='Description for your NFT'
                                                    required
                                                    ref={(input) => {
                                                        this.description = input
                                                    }}
                                                />
                                            </div>
                                            <div className="my-3">
                                                <input
                                                    type="file" onChange={this.onChange}
                                                    accept="image/png, image/jpeg"
                                                    required
                                                />

                                            </div>
                                        </div>
                                        </main>
                                        <footer className="p-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                                            >
                                                Mint
                                            </button>
                                        </footer>
                                    </div>
                                </form>
        );
    }
    oldRender() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white"><span id="account">{this.state.account}</span></small>
                        </li>
                    </ul>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <h1>Minting Postcards</h1>
                                <form onSubmit={ async (event) => {
                                    event.preventDefault();
                                    await this.onFormSubmit(this.name.value,this.description.value);
                                }}>
                                    <input
                                        type='text'
                                        className='form-control mb-1'
                                        placeholder='Name'
                                        required
                                        ref={(input) => {
                                            this.name = input
                                        }}
                                    />
                                    {/*<Form.TextArea*/}
                                    {/*label='Description'*/}
                                    {/*placeholder='Description of your NFT'*/}
                                    {/*ref={(input) => {*/}
                                    {/*    this.description = input*/}
                                    {/*}}*/}
                                    {/*required*/}
                                    {/*className='form-control mb-1'*/}
                                    {/*/>*/}
                                    <input
                                        type='text'
                                        className='form-control mb-1'
                                        placeholder='Description'
                                        required
                                        ref={(input) => {
                                            this.description = input
                                        }}
                                    />

                                    <input
                                        type="file" onChange={this.onChange}
                                        required
                                    />
                                    <input
                                        type='submit'
                                        className={'btn btn-block btn-primary'}
                                        value={'MINT'}
                                    />
                                </form>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="row text-center">
                </div>

            </div>
        );
    }
}



const getData=()=>{
    fetch('data/test.json'
        ,{
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )
        .then(function(response){
            console.log(response)
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        });
}
const testConnectionToPinata = async () => {
    const pinataEndpoint = "https://api.pinata.cloud/data/testAuthentication";
    const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
    const pinataApiSecret = process.env.REACT_APP_PINATA_API_SECRET;
    try {
        const request = {
            method: 'get',
            url: pinataEndpoint,
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataApiSecret
            }
        };
        const response = await axios(request);
        console.log("success: "+ response);
    }
    catch (e){
        console.log("error: "+ e)
    }

}

export default App;
