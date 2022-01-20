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
        // let formJSON = {
        //     pinataMetadata: {
        //         name: ""
        //     },
        //     pinataContent: {
        //         name: "",
        //         description: "",
        //         image: "",
        //         attributes:[{
        //             trait_type:"",
        //             value:""
        //         }]
        //     }
        // };
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
        }


        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFileChanged = this.onFileChanged.bind(this);
        this.getHistoryTable = this.getHistoryTable.bind(this);
        this.removeProperty = this.removeProperty.bind(this)
        this.setStatus = this.setStatus.bind(this)
        this.renderProperties = this.renderProperties.bind(this)
    }
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
    componentDidMount = async () => {
        await this.initState()
        const {web3, account, statusMessage} = await getWallet();
        const {contract} = await getContract(web3);
        const networkId = await web3.eth.net.getId();
        this.setState({
            web3: web3,
            account: account,
            statusMessage: statusMessage,
            contract: contract,
            networkId: networkId
            });

    };
    mint = async (hash) => {
        // await mintNFT(hash)
        if(this.state.amountToMint === 1) {
            this.state.contract.methods.mint(hash, this.state.royalty).send({from: this.state.account}, (error, transactionHash) => {
                console.log(transactionHash);

            }).on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                console.log("status: e" + receipt.status);
                this.setState({statusMessage: "couldn't mint the NFT: " + error})
            });
        }
        else{
            this.state.contract.methods.mintBatch(hash, this.state.amountToMint ,this.state.royalty*100).send({from: this.state.account}, (error, transactionHash) => {
                // this.setStatus(transactionHash);
                console.log(transactionHash);

            }).on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                console.log("status: e" + receipt.status);
                this.setState({statusMessage: "couldn't mint the NFT: " + error})
            });
        }
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
            console.log(this.state.amountToMint+" amount");
            console.log(this.state.rarity+" rarity");
            console.log(this.state.royalty+" royalty");

            // const imageHash = await uploadDataToIPFS(this.state.imageFile);
            // const {hash: imageHash, status: imageStatus} = await uploadDataToIPFS(this.state.imageFile);
            let metadata = this.state.metadata;

            // metadata.pinataContent.image = "ipfs://" + imageHash;
            // metadata.pinataContent.image = "https://ipfs.io/ipfs/" + imageHash;
            // const attributes = metadata.pinataContent.attributes;
            // for (let i = 0; i < attributes.length; i++) {
            //     if(attributes[i].trait_type === "" || attributes[i].value === ""){
            //         this.removeProperty(i)
            //     }
            // }

            this.setState({metadata: metadata});
            // used on purpose after setting the state
            metadata.pinataContent.attributes.push({trait_type: "Rarity", value: this.state.rarity })
            console.log(JSON.stringify(metadata, null, 2))


            // const metadataHash = await uploadJSONToIPFS(metadata);
            // const {hash:metadataHash, status: metadataStatus} = await uploadJSONToIPFS(metadata);
            // await this.mint(metadataHash);
            // console.log(imageStatus+ "   ",metadataStatus)
            if(metadataStatus != 200 || imageStatus != 200){
                this.setState({statusMessage: "There was a problem uploading the files to IPFS: "+ metadataStatus!=200? metadataStatus : imageStatus})
            }

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
    addProperty(){
        let data = this.state.metadata;
        data.pinataContent.attributes.push({trait_type: "", value: "" })
        this.setState(({
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
    renderProperties(element, index) {
        // if(element.trait_type!="Rarity") {
            return (<Form.Group key={index} controlId="property" className="mt-2 mb-2">
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
            </Form.Group>)
        // }
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

                <Container fluid>
                    <Row>
                            <Form onSubmit={async (event) => {
                                event.preventDefault();
                                let data = this.state.metadata;
                                data.pinataContent.name = this.name.value;
                                data.pinataContent.description = this.description.value;
                                data.pinataMetadata.name = data.pinataContent.name.replace(/\s+/g, '-').toLowerCase() + ".json"
                                // await this.setState({metadata:data, amountToMint: this.amount.value, royalty: this.royalty.value})
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
                                    <Form.Control placeholder='e.g. 30°C in the Summer'
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
                                                              max={100}
                                                              placeholder="between 1 and 100"
                                                              value={this.state.amountToMint}
                                                              onChange={((e) => {
                                                                  let val = e.target.value
                                                                  this.setState({amountToMint: val})
                                                              })}
                                                              disabled = {(this.state.rarity==="Rare")? "" : "disabled"}
                                                              // ref={(input) => {
                                                              //     this.amount = input;
                                                              // }}
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
                                                              ref={(input) => {
                                                                  this.royalty = input
                                                              }}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Row>
                                <Form.Group>
                                    <Button type="button" size="sm" className="mt-5" onClick={()=>this.addProperty()}>
                                        Add property
                                    </Button>
                                <Row xs={5} className="d-flex align-items-end mt-3" >
                                        {this.state.metadata.pinataContent.attributes.map((element, index) =>
                                                this.renderProperties(element,index)
                                        //         (
                                        //             <Form.Group key={index} controlId="property" className="mt-2 mb-2">
                                        //                 <Button type="button" variant="danger" className="float-lg-end mt-2" size="sm" onClick={()=>this.removeProperty(index)}>
                                        //                     remove
                                        //                 </Button>
                                        //                 <Form.Label className="mt-2">Trait type</Form.Label>
                                        //                 <Form.Control
                                        //                     placeholder='Region'
                                        //                     value={element.trait_type}
                                        //                     name="trait_type"
                                        //                     onChange={e => this.handleChange(index, e)}
                                        //                 />
                                        //                 <Form.Label className="mt-2">Trait value</Form.Label>
                                        //                 <Form.Control
                                        //                     placeholder='French polynesia'
                                        //                     value={element.value}
                                        //                     name="value"
                                        //                     onChange={e => this.handleChange(index, e)}
                                        //                 />
                                        //             </Form.Group>
                                        // )
                                        )}
                                    </Row>
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
            </Container>
        );
    }
}

export default App;
