import React, {Component} from "react";
import "./App.css";
import {uploadDataToIPFS, uploadJSONToIPFS} from "./utils/ipfsPinning";
import axios from "axios";
import {getContract, getNetwork, getWallet, mintNFT} from "./utils/web3"
import History from "./History";
import {Container, Form, Button, Navbar, Row, Col} from "react-bootstrap";


// https://github.com/dappuniversity/nft
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            account: "",
            contract: null,
            web3: null,
            totalSupply: 0,
            tokens: [],
            imageFile: null,
            metadata: null,
            statusMessage: "",
            networkId: null
        }


        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFileChanged = this.onFileChanged.bind(this);
        this.getHistoryTable = this.getHistoryTable.bind(this);
    }

    componentDidMount = async () => {
        const {web3, account, statusMessage } = await getWallet();
        const {contract} = await getContract(web3);
        this.setState({
            web3: web3,
            account: account,
            statusMessage: statusMessage,
            contract: contract
            });

        const networkId = await this.state.web3.eth.net.getId();
        this.setState({
            networkId: networkId
        });

    };
    mint = async (hash) => {
        // await mintNFT(hash)
        this.state.contract.methods.duplicateMint(hash).send({from: this.state.account})
            .once('receipt', (receipt) => {
                console.log("id: " + receipt.logs[0].topics[3]);
                this.setState({
                    tokens: [...this.state.tokens, hash]
                })
            })
    }

    onFileChanged(e) {
        this.setState({imageFile: e.target.files[0]})
    }
    async onFormSubmit(name, description) {
        try {
            const imageHash = await uploadDataToIPFS(this.state.imageFile);

            const metadata =
                {
                    pinataMetadata: {
                        name: name.replace(/\s+/g, '-').toLowerCase() + ".json" // from https://stackoverflow.com/a/1983661
                        // name: name+".json"
                    },
                    pinataContent: {
                        name: name,
                        description: description,
                        image: "https://ipfs.io/ipfs/" + imageHash
                    }
                };

            this.setState({metadata: metadata});
            const metadataHash = await uploadJSONToIPFS(metadata);
            await this.mint(metadataHash);
            //if network id == 4 aka equals rinkeby testnets. otherwise do something else i guess
            const url = "https://testnets.opensea.io/assets/" + this.state.contract._address + "/1"

            // window.location.href = url;
        } catch (e) {
            console.log("something went wrong with creating your NFT: " + e);
        }
    }

    getHistoryTable = () => {

        // network ids between 1 and 4 are the main- and testnets. anything after that might be local, where its not possible to render the history
        if(this.state.networkId > 4){
            console.log("ganache network (local)")
            return <h6 className="text-center" >The NFT History doesn't exist on a local blockchain</h6>
        }
        else{
            return(
                <History
                    web3={this.state.web3}
                    account={this.state.account}
                    contract={this.state.contract}
                />
            )
        }
    }


    // https://codesandbox.io/s/react-eth-metamask-7vuy7?file=/src/App.js
    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <Container fluid>
                <Navbar>
                    <Container fluid>
                        <Navbar.Text className="text-xl font-semibold text-gray-700 text-center">Contract Address: {this.state.contract._address}</Navbar.Text>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text className="text-xl font-semibold text-gray-700 text-center">
                                Signed in as: {this.state.account}
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

            {/*<div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">*/}
                <Container>
                    <Row>
                        {/*<Col>*/}
                            <Form onSubmit={async (event) => {
                                event.preventDefault();
                                await this.onFormSubmit(this.name.value, this.description.value);
                            }} className="shadow p-5 mb-4 bg-white rounded">
                                <Row>
                                    <h1 className="title">Postcard NFT Minter</h1>
                                <Col>

                                <Form.Group controlId="formName" >
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control placeholder='e.g. Bora Bora Beach In The Afternoon'
                                                  required
                                                  ref={(input) => {

                                                      this.name = input

                                                  }}/>
                                </Form.Group>
                                </Col>
                                <Col xs={5}>
                                <Form.Group controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control placeholder='e.g. 30°C in the Summer'
                                                  // as="textarea"
                                                  required
                                                  ref={(input) => {

                                                      this.description = input

                                                  }}  />
                                </Form.Group>
                                </Col>
                                <Col xs={3}>
                                <Form.Group controlId="formFile">
                                    <Form.Label>Asset File</Form.Label>
                                    <Form.Control type="file" onChange={this.onFileChanged}
                                                  accept="image/*, video/*, audio/*"
                                                  required

                                    />
                                </Form.Group>
                                </Col>
                                <Button type="submit" variant="outline-primary" className="mt-5">
                                    Mint
                                </Button>
                                </Row>
                            </Form>

                        <Container fluid className="pt-5">
                            {this.getHistoryTable()}
                        </Container>
                    </Row>
                </Container>
            {/*</div>*/}
            </Container>
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
