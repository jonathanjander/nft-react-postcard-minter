import React, {Component} from "react";
// import {Table} from "semantic-ui-react";
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

class History extends Component {
    //https://rinkeby-api.opensea.io/api/v1/assets?owner=0xc7d2e073ed4aaf735ef12fffbf7afe752d1e2390
    constructor(props) {
        super(props)
        const web3 = this.props.web3;
        this.state = {
            account: this.props.account,
            contract: this.props.contract,
            web3: this.props.web3,
            transferHistory: [],
            networkId: null
        }
        this.getTimeStampOfTX = this.getTimeStampOfTX.bind(this);
        this.getRowData = this.getRowData.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.loadingDataMarkup = this.loadingDataMarkup.bind(this);
        this.loadDataAsync = this.loadDataAsync.bind(this);

    }
    componentDidMount = async () => {
        let options = {
            // address: this.state.account,
            filter: {
                value: [],
            },
            fromBlock: 0
        };
        // TODO maybe use subscribe/unsubscribe
        await this.state.contract.getPastEvents("Transfer",options).then(results => {
            results.map( async (transfer) => {
                let timestamp = await this.getTimeStampOfTX(transfer.transactionHash)

                let url = "https://testnets.opensea.io/assets/" + transfer.address + "/" + transfer.returnValues.tokenId

                let obj = {
                    tokenId: transfer.returnValues.tokenId,
                    txHash: transfer.transactionHash,
                    from: transfer.returnValues.from,
                    to: transfer.returnValues.to,
                    created: timestamp +" ago",
                    presentation: (<a href={url}>Opensea link</a>)
                }
                // await this.setState({
                //     transferHistory: [...this.state.transferHistory, obj]
                // });
                // this.setState({
                //     transferHistory: [...this.state.transferHistory, obj]
                // },()=>console.log(this.state.transferHistory));
                await this.loadDataAsync({transferHistory: [...this.state.transferHistory, obj]})


            });
                // console.log(this.state.transferHistory)
        }).catch(err =>
            console.log("something went wrong with showing the history: "+err));


        const networkId = await this.state.web3.eth.net.getId();
        this.setState({
            networkId: networkId
        })

    }
    componentWillUnmount = async () => {
    }

    loadDataAsync = async function(state){
        return new Promise((resolve) =>{
            this.setState(state,resolve)
            });
    }
    // https://medium.com/@subalerts/create-dynamic-table-from-json-in-react-js-1a4a7b1146ef
    getHeader = function(){
        if(this.state.transferHistory != null && this.state.transferHistory[0] != undefined){
            const keys = Object.keys(this.state.transferHistory[0])
            return keys.map((key, index)=>{
                return <th key={key} width="50">{key.toUpperCase()}</th>
            })
        }
    }
    getRowData = function(){
        if(this.state.transferHistory != null && this.state.transferHistory[0] != undefined){
            const items = this.state.transferHistory;
            // const items = Object.values(this.state.transferHistory);
            const keys = Object.keys(items[0])
            return items.map((row, index)=>{
                return <tr style={{textOverflow:"ellipsis"}} key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
            })
        }
    }

    loadingDataMarkup = function(){
        return (<h1>Loading Table...</h1>)
    }

    getTimeStampOfTX = async (txhash) =>{
        const blockNumber = (await this.state.web3.eth.getTransaction(txhash)).blockNumber;
        const timestamp = (await this.state.web3.eth.getBlock(blockNumber)).timestamp;
        const date = new Date(timestamp*1000);
        return date.getHours()+":"+("0"+date.getMinutes()).substr(-2) + ":"+ ("0"+date.getSeconds()).substr(-2);
        // this.state.web3.eth.getTransaction(txhash).then(async (tx) => {
        //     this.state.web3.eth.getBlock(tx.blockNumber).then((block) => {
        //         const date = new Date(block.timestamp*1000);
        //         return date.getHours()+":"+("0"+date.getMinutes()).substr(-2) + ":"+ ("0"+date.getSeconds()).substr(-2);
        //     });
        // });



    }

    render() {
        // network ids between 1 and 4 are the main- and testnets. anything after that might be local, where its not possible to render the history
        if(this.state.networkId > 4){
            console.log("test")
            return <h6 className="text-center" >The NFT History doesn't exist on a local blockchain</h6>
        }

        else if(this.state.transferHistory != null) {
            this.state.transferHistory.sort((a, b) =>{
                return b.tokenId-a.tokenId;
            })
            return (
                <div>
                    <Table striped bordered hover >
                        <thead>
                        <tr>
                            {this.getHeader()}
                        </tr>
                        </thead>
                        <tbody>
                        {this.getRowData()}
                        </tbody>
                    </Table>
                </div>
            )
        }
        else{
            return <h3>Loading Table...</h3>;
        }

    }

}
const RenderRow = (historyData) =>{
    if(historyData != null){
        return historyData.keys.map((key) =>{
            return <td key={historyData.data[key]}>{historyData.data[key]}</td>
        })
    }
}
export default History;