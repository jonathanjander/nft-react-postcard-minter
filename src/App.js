import React, {Component} from "react";
import "./App.css";
import {uploadDataToIPFS, uploadJSONToIPFS} from "./utils/ipfsPinning";
import axios from "axios";
import {getContract, getNetwork, getWallet, mintNFT} from "./utils/web3"
import History from "./History";
import {Container, Form, Button, Navbar, Row, Col, Card, Alert} from "react-bootstrap";


// https://github.com/dappuniversity/nft
class App extends Component {
    constructor(props) {
        super(props)
        let formJSON = {
            "pinataMetadata": {
                "name": ""
            },
            "pinataContent": {
                "name": "",
                "description": "",
                "image": "",
                "attributes":[{
                    "trait_type":"",
                    "value":""
                }]
            }
        };
        this.state = {
            account: "",
            contract: null,
            web3: null,
            totalSupply: 0,
            tokens: [],
            statusMessage: "",
            networkId: null,
            imageFile: null,
            metadata: formJSON
        }


        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFileChanged = this.onFileChanged.bind(this);
        this.getHistoryTable = this.getHistoryTable.bind(this);
        this.removeProperty = this.removeProperty.bind(this)
        this.setStatus = this.setStatus.bind(this)
    }

    componentDidMount = async () => {
        const {web3, account, statusMessage} = await getWallet();
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
        this.state.contract.methods.duplicateMint(hash,1).send({from: this.state.account}, (error, transactionHash) =>{
            this.setStatus(transactionHash);
            console.log(transactionHash);

        }).on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log("status: e" + receipt.status);
            this.setState({statusMessage: "couldn't mint the NFT: "+ error})
        });
        // this.state.contract.methods.duplicateMint(hash,1).send({from: this.state.account})
        //     .on('receipt', (receipt) => {
        //         console.log("id: " + receipt.logs[0].topics[3]);
        //         console.log("status: " + receipt.status);
        //         this.setState({
        //             tokens: [...this.state.tokens, hash]
        //         })
        //     })
        //     .on('confirmation', function(confirmationNumber, receipt){
        //         console.log("status: " + confirmationNumber);
        //     })
        //     .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        //         console.log("status: e" + receipt.status);
        //     });
    }

    onFileChanged(e) {
        this.setState({imageFile: e.target.files[0]})
    }

    async onFormSubmit() {
        try {
            // const imageHash = await uploadDataToIPFS(this.state.imageFile);
            const {hash: imageHash, status: imageStatus} = await uploadDataToIPFS(this.state.imageFile);
            let metadata = this.state.metadata;
            metadata.pinataContent.image = "ipfs.io/ipfs/" + imageHash;
            const attributes = metadata.pinataContent.attributes;
            for (let i = 0; i < attributes.length; i++) {
                if(attributes[i].trait_type === "" || attributes[i].value === ""){
                    this.removeProperty(i)
                }
            }
            this.setState({metadata: metadata});


            // const metadataHash = await uploadJSONToIPFS(metadata);
            const {hash:metadataHash, status: metadataStatus} = await uploadJSONToIPFS(metadata);
            await this.mint(metadataHash);
            console.log(imageStatus+ "   ",metadataStatus)
            if(metadataStatus != 200 || imageStatus != 200){
                this.setState({statusMessage: "There was a problem uploading the files to IPFS: "+ metadataStatus!=200? metadataStatus : imageStatus})
            }
            // const metadata =
            //     {
            //         pinataMetadata: {
            //             name: name.replace(/\s+/g, '-').toLowerCase() + ".json" // from https://stackoverflow.com/a/1983661 //formats name into lower-case.json
            //             // name: name+".json"
            //         },
            //         pinataContent: {
            //             name: name,
            //             description: description,
            //             image: "https://ipfs.io/ipfs/" + imageHash
            //         }
            //     };

            // console.log("string: "+ JSON.stringify(metadata))
            // console.log(JSON.stringify(metadata))

            //if network id == 4 aka equals rinkeby testnets. otherwise do something else i guess
            // const url = "https://testnets.opensea.io/assets/" + this.state.contract._address + "/1"

            // window.location.href = url;
        } catch (e) {
            console.log("something went wrong with creating your NFT: " + e);
            this.setState({statusMessage: "something went wrong (error at submit)"})
        }
    }

    getHistoryTable = () => {

        // network ids between 1 and 4 are the main- and testnets. anything after that might be local, where its not possible to render the history
        if(this.state.networkId > 4){
            // console.log("ganache network (local)")
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
    // from https://bapunawarsaddam.medium.com/add-and-remove-form-fields-dynamically-using-react-and-react-hooks-3b033c3c0bf5
    async addProperty(){
        let data = this.state.metadata;
        data.pinataContent.attributes.push({trait_type: "", value: "" })
        await this.setState(({
            metadata: data
        }))

    }

    // from https://bapunawarsaddam.medium.com/add-and-remove-form-fields-dynamically-using-react-and-react-hooks-3b033c3c0bf5
    handleChange(i, e) {
        let data = this.state.metadata;

        data.pinataContent.attributes[i][e.target.name] = e.target.value;
        this.setState(({
            metadata: data
        }))
    }

    // from https://bapunawarsaddam.medium.com/add-and-remove-form-fields-dynamically-using-react-and-react-hooks-3b033c3c0bf5
    removeProperty(index) {
        let data = this.state.metadata;
            data.pinataContent.attributes.splice(index,1);
            this.setState(({
                metadata: data
            }))
    }
    // WIP
     async setStatus(hash){
        const variant="";
        await this.state.web3.eth.getTransactionReceipt(hash, function (error, result) {
                if(error){
                    // this.setState(({
                    //     statusMessage: "ERROR"
                    // }));
                }
                if(result != null){
                    console.log("receipt "+ result.status);
                    this.setState(({statusMessage: "YES"}));

                    // latestTx = null;

                }
            });


    }
    // WIP
    getStatusMessage = async (variant) =>{
        return (
            <Row>
                <Alert variant={variant} className="mt-3 fw-bold">
                    <span className="text-center">{this.state.statusMessage}</span>
                </Alert>
            </Row>
        )
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
                <Container fluid>
                    <Row>
                        {/*<Col>*/}
                            <Form onSubmit={async (event) => {
                                event.preventDefault();
                                let data = this.state.metadata;
                                data.pinataContent.name = this.name.value;
                                data.pinataContent.description = this.description.value;
                                data.pinataMetadata.name = data.pinataContent.name.replace(/\s+/g, '-').toLowerCase() + ".json"
                                await this.setState({metadata:data})
                                await this.onFormSubmit();
                            }} className="shadow p-5 mb-4 bg-white rounded">
                                <Row>
                                    <h1 className="title text-center">Postcard NFT Minter</h1>
                                <Col xs={3}>
                                <Form.Group controlId="formName">
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
                                <Col xs={4}>
                                <Form.Group controlId="formFile">
                                    <Form.Label>Asset File</Form.Label>
                                    <Form.Control type="file" onChange={this.onFileChanged}
                                                  accept="image/*, video/*, audio/*"
                                                  required

                                    />
                                </Form.Group>

                                </Col>
                                </Row>
                                <Form.Group>
                                {/*<Card className="mt-5">*/}
                                {/*    <Card.Header className="text-center">*/}
                                {/*        */}
                                {/*        <h5 className="fw-bold mt-1">Properties</h5>*/}

                                {/*    </Card.Header>*/}
                                {/*    <Card.Body body className="m-1">*/}

                                    <Button type="button" size="sm" className="mt-5" onClick={()=>this.addProperty()}>
                                        Add property
                                    </Button>
                                <Row xs={5} className="d-flex align-items-end mt-3" >
                                        {this.state.metadata.pinataContent.attributes.map((element, index) => (
                                                    // <Card body className="m-1">
                                                    <Form.Group key={index} controlId="property" className="mt-2 mb-2">
                                                        <Button type="button" variant="danger" className="float-lg-end mt-2" size="sm" onClick={()=>this.removeProperty(index)}>
                                                            remove
                                                        </Button>
                                                        <Form.Label className="mt-2">Trait type</Form.Label>
                                                        <Form.Control
                                                            placeholder='Region'
                                                            value={element.trait_type}
                                                            name="trait_type"
                                                            onChange={e => this.handleChange(index, e)}
                                                        />
                                                        <Form.Label className="mt-2">Trait value</Form.Label>
                                                        <Form.Control
                                                            placeholder='French polynesia'
                                                            value={element.value}
                                                            name="value"
                                                            onChange={e => this.handleChange(index, e)}
                                                        />
                                                    </Form.Group>
                                                    // </Card>
                                        ))}

                                    </Row>
                                {/*    </Card.Body>*/}
                                {/*</Card>*/}
                                </Form.Group>
                                <Row>

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
