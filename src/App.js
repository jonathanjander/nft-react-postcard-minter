import React, {Component} from "react";
import "./App.css";
import {uploadDataToIPFS, uploadJSONToIPFS} from "./utils/ipfsPinning";
import {getContract, getWallet, requestAccounts, requestNetwork} from "./utils/web3"
import History from "./History";
import Error from "./Error";
import {Container, Form, Button, Navbar, Row, Col, Alert} from "react-bootstrap";
import {isDisabled} from "bootstrap/js/src/util";

/*
Handles all the frontend logic
renders the site
 */
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            account: "",
            contract: null,
            web3: null,
            statusMessage: "",
            networkId: null,
            imageFile: null,
            metadata: null,
            rarity: "Rare",
            amountToMint: 1,
            royalty: 10,
            owner:"",
            isNetworkDisabled: false,
            isAccountDisabled: false,
        }

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFileChanged = this.onFileChanged.bind(this);
        this.getHistoryTable = this.getHistoryTable.bind(this);
        this.removeProperty = this.removeProperty.bind(this)
        this.renderProperties = this.renderProperties.bind(this)
        this.getStatusMessage = this.getStatusMessage.bind(this)
        this.requestNetworkButton = this.requestNetworkButton.bind(this)
    }
    /*
    initialise form data
     */
    initState = async () =>{
        let formJSON = {
            pinataMetadata: {
                name: ""
            },
            pinataContent: {
                name: "",
                description: "",
                image: "",
                attributes:[{
                    trait_type:"",
                    value:""
                }]
            }
        };
        let royalty = 10;
        let amountToMint = 1;
        let rarity = "Rare";
        this.setState({
            metadata: formJSON,
            royalty:royalty,
            amountToMint:amountToMint,
            rarity:rarity
        });
    }
    /*
    initialises wallet, account and contract
     */
    componentDidMount = async () => {
        try {
            await this.initState()
            const {web3, account} = await getWallet();
            this.setState({web3:web3,account: account})
            const {contract} = await getContract(web3);
            const networkId = await web3.eth.net.getId();
            const owner = await contract.methods.owner().call();
            this.setState({
                contract: contract,
                networkId: networkId,
                owner:owner
            });

        }
        catch (e) {
            console.log("error at initialising: "+e);
        }

    };
    /*
    calls "mint" method from smart contract
     */
    mintNFT = async (hash) => {
        this.state.contract.methods.mint(hash, this.state.amountToMint ,this.state.royalty*100).send({from: this.state.account}, async (error, transactionHash) => {
            if(this.state.networkId <= 4 && !error) {
                this.setState({statusMessage: "Please Wait"});
            }
        }).on('error', function (error) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log(error.message);

        }).on('receipt', async receipt =>{
            console.log(receipt);
            if(receipt!=null && this.state.networkId <= 4) { // doenst work for the local blockchain
                let url;
                if(this.state.amountToMint > 1){
                    url = "https://testnets.opensea.io/assets/" + this.state.contract._address + "/" + receipt.events.Transfer[0].returnValues.tokenId;
                }
                else {
                    url = "https://testnets.opensea.io/assets/" + this.state.contract._address + "/" + receipt.events.Transfer.returnValues.tokenId;
                }
                if(receipt.status){
                    let link = <a href={url} target="_blank" rel="noopener noreferrer">Opensea</a>
                    this.setState({statusMessage: <span>Minting successful. It might take some time until the NFT is visibile on {link}</span>})
                }
                else{
                    this.setState({statusMessage: "Something went wrong with minting the NFT. The transaction was reverted"});
                }
            }
        });
    }

    onFileChanged(e) {
        this.setState({imageFile: e.target.files[0]})
    }

    /*
    uploads asset file to IPFS
    uploads metadata file to IPFS
    calls mintNFT function
     */
    async onFormSubmit() {
        try {

            let metadata = this.state.metadata;
            const {hash: imageHash, status: imageStatus} = await uploadDataToIPFS(this.state.imageFile);
            metadata.pinataContent.image = "ipfs://"+imageHash;

            let arr =  Object.keys(metadata.pinataContent.attributes).map((key) =>
                metadata.pinataContent.attributes[key].trait_type
            );
            if (!arr.includes("Rarity")){
                metadata.pinataContent.attributes.push({trait_type: "Rarity", value: this.state.rarity })

            }
            this.setState({metadata: metadata});

            const {hash:metadataHash, status: metadataStatus} = await uploadJSONToIPFS(metadata);
            await this.mintNFT(metadataHash);
            if(metadataStatus != 200 || imageStatus != 200){
                this.setState({statusMessage: "There was a problem uploading the files to IPFS: "+ metadataStatus!=200? imageStatus : metadataStatus})
            }

        } catch (e) {
            console.log("something went wrong with creating your NFT: " + e);
            this.setState({statusMessage: "something went wrong when trying to submit: "+e.message})
        }
    }
    /*
    if network is not the local blockchain then render the history table component
     */
    getHistoryTable = () => {
        // network ids between 1 and 4 are the main- and testnets. anything after that might be local, where its not possible to render the history
        if(this.state.networkId > 4){
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

    requestNetworkButton = () => {
        return <Alert variant={"info"}> A request was sent to MetaMask. If the MetaMask notification window doesn't open automatically, please open the MetaMask extension manually.</Alert>
    }
    /*
    adapted from https://bapunawarsaddam.medium.com/add-and-remove-form-fields-dynamically-using-react-and-react-hooks-3b033c3c0bf5
    adds properties to metadata
     */
    addProperty(){
        let data = this.state.metadata;
        data.pinataContent.attributes.push({trait_type: "", value: "" })
        this.setState(({
            metadata: data
        }))

    }

    /*
    adapted from https://bapunawarsaddam.medium.com/add-and-remove-form-fields-dynamically-using-react-and-react-hooks-3b033c3c0bf5
    handles change of metadata properties
     */
    handleChange(i, e) {
        let data = this.state.metadata;
        data.pinataContent.attributes[i][e.target.name] = e.target.value;
        this.setState(({
            metadata: data
        }))
    }

    /*
    adapted from https://bapunawarsaddam.medium.com/add-and-remove-form-fields-dynamically-using-react-and-react-hooks-3b033c3c0bf5
    removes properties from metadata
     */
    removeProperty(index) {
        let data = this.state.metadata;
            data.pinataContent.attributes.splice(index,1);
            this.setState(({
                metadata: data
            }))
    }
    /*
    renders the form properties
     */
    renderProperties() {
        let properties = [];
        this.state.metadata.pinataContent.attributes.map((element, index) =>
        {
            if(element.trait_type!="Rarity") {
                properties.push(<Form.Group key={index} controlId="property" className="mt-2 mb-2">
                    <Button type="button" variant="danger" className="float-lg-end mt-2" size="sm"
                            onClick={() => this.removeProperty(index)}>
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
                </Form.Group>);
            }
        })
        return properties;
    }
    /*
   returns status Message
   only works for the rinkeby testnet
    */
    getStatusMessage(){
        if(this.state.statusMessage !== undefined && this.state.statusMessage !== "" ) {
            return (
                <Row>
                    <Alert className="mt-3 fw-bold">
                        <span className="text-center">{this.state.statusMessage}</span>
                    </Alert>
                </Row>
            )
        }
        // access restriction to "owner" is disabled for testing purposes, which is why this is commented out
        /*if(this.state.owner.toLowerCase()!=this.state.account.toLowerCase()){
            return (
                <Row>
                    <Alert variant="warning" className="mt-3 fw-bold">
                        <span className="text-center">You're not logged in with the owner account ({this.state.owner}). You wont be able to mint NFTs unless you use the owner account.</span>
                    </Alert>
                </Row>
            )
        }*/

    }
    /*
    renders site
    */
    render() {
        // waiting for web3. refresh the site to try again
        if (!this.state.web3) {
            return (
                <div>
                    <h4>Couldn't establish a connection to the Web3 provider</h4>
                    <br/>
                    <h4>If you haven't downloaded the MetaMask browser extension, please download it <a href="https://metamask.io/download/">here</a></h4>
                    <br/>
                    <h4>Please check if you're logged in to the MetaMask browser extension. If not, please do so!</h4>
                    <br/>
                    <h5>Press the button to connect your Ethereum account to the website.</h5>
                    <Button type="button" size="sm" className="" disabled={this.state.isAccountDisabled} onClick={async ()=> {
                        window.location.reload();
                        this.setState({isAccountDisabled: true})
                        await requestAccounts();
                        await requestNetwork();
                    }
                    }>
                        Connect Account
                    </Button>
                    {/*{this.state.isAccountDisabled && <Alert variant={"info"}> A request was sent to MetaMask. If the MetaMask notification window doesn't open automatically, please open the MetaMask extension manually.</Alert>}*/}

                </div>);
        }
        // returns message if currently connected network isnt rinkeby or the defined local blockchain
        else if(this.state.networkId !=4 &&  this.state.networkId !=5777){
            return (
                <div><h4>you're connected to an ethereum-network where the Souvenir-NFT wasn't deployed. The Souvenir-NFT only exists on the Rinkeby test network or locally.</h4>
                    <br/>
                    <h5>Please switch networks over MetaMask or click the button down below</h5>
                    <Button type="button" size="sm" className="mt-1" disabled={this.state.isNetworkDisabled} onClick={async ()=> {
                        this.setState({isNetworkDisabled: true})
                        await requestNetwork();
                    }
                    }>
                        Connect to Rinkeby
                    </Button>
                    {this.state.isNetworkDisabled && <Alert variant={"info"}> A request was sent to MetaMask. If the MetaMask notification window doesn't open automatically, please open the MetaMask extension manually.</Alert>}
                </div>
            );
        }
        // returns the contents site
        return (
            <Container fluid className="bg-light">
                <Navbar>
                    <Container fluid>
                        <Navbar.Text className="text-xl font-semibold text-black text-center">Contract Address: {this.state.contract._address}</Navbar.Text>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text className="text-xl font-semibold text-black text-center">
                                Signed in as: {this.state.account}
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Error>
                <Container fluid className="bg-light">
                    <Row>
                            <Form onSubmit={async (event) => {
                                event.preventDefault();
                                let data = this.state.metadata;
                                data.pinataContent.name = this.name.value;
                                data.pinataContent.description = this.description.value;
                                data.pinataMetadata.name = data.pinataContent.name.replace(/\s+/g, '-').toLowerCase() + ".json"
                                await this.setState({metadata:data, royalty: this.royalty.value})
                                await this.onFormSubmit();
                            }} className="shadow p-5 mb-4 bg-white rounded">
                                <Row>
                                    <h1 className="title text-center">Souvenir NFT Minter</h1>
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
                                    <Form.Control placeholder='e.g. 30??C in the Summer'
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
                                    <Row className="mt-5">
                                        <Col xs={3}>
                                            <Form.Group controlId="rarity">
                                                <Form.Label>Rarity</Form.Label>
                                                <Form.Select
                                                    required
                                                    onChange={(e) =>{
                                                        this.setState({rarity: e.target.value})
                                                        if(e.target.value !== "Rare"){
                                                            this.setState({amountToMint: 1})
                                                        }
                                                    }}
                                                >
                                                    <option value="Rare">Rare (1)</option>
                                                    <option value="Super Rare">Super Rare (2)</option>
                                                    <option value="Unique">Unique (3)</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Group controlId="amount">
                                                <Form.Label>Amount of Tokens to mint</Form.Label>
                                                <Form.Control
                                                              type="number"
                                                              min={1}
                                                              max={20}
                                                              placeholder="between 1 and 20"
                                                              value={this.state.amountToMint}
                                                              onChange={((e) => {
                                                                  let val = e.target.value
                                                                  this.setState({amountToMint: val})
                                                              })}
                                                              disabled = {(this.state.rarity==="Rare")? "" : "disabled"}
                                                              ref={(input) => {
                                                                  this.amount = input;
                                                              }}
                                                              required
                                                />
                                            </Form.Group>

                                        </Col>
                                        <Col xs={3} className="mx-sm-5">
                                            <Form.Group controlId="royalty">
                                                <Form.Label>Royalty fees in %</Form.Label>
                                                <Form.Control defaultValue="10"
                                                              type="number"
                                                              min={0}
                                                              max={30}
                                                              placeholder="between 0% and 30%"
                                                              ref={(input) => {
                                                                  this.royalty = input
                                                              }}
                                                              required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Row>
                                <Form.Group>
                                    <Button type="button" size="sm" className="mt-5" onClick={()=>this.addProperty()}>
                                        Add property
                                    </Button>
                                <Row xs={5} className="d-flex align-items-end mt-3" >
                                    {this.renderProperties()}
                                    </Row>

                                </Form.Group>
                                <Row>
                                <Button type="submit" variant="outline-primary" className="mt-5">
                                    Mint
                                </Button>
                                </Row>
                                {this.getStatusMessage()}
                            </Form>

                        <Container fluid className="pt-5">
                            {this.getHistoryTable()}
                        </Container>
                    </Row>
                </Container>
                </Error>
            </Container>
        );
    }
}

export default App;
