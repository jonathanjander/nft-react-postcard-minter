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
            transferHistory: []
        }
        this.getTimeStampOfTX = this.getTimeStampOfTX.bind(this);
        this.createHistoryTable = this.createHistoryTable.bind(this);
        this.getRowData = this.getRowData.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.loadingData = this.loadingData.bind(this);
    }
    componentDidMount = async () => {
        let options = {
            // address: this.state.account,
            filter: {
                value: [],
            },
            fromBlock: 0
        };

        //TODO make this async
        await this.state.contract.events.Transfer(options)
            .on('data', event => {
                // console.log(event)
                const transfer = {
                    txHash: event.transactionHash,
                    from: event.returnValues.from,
                    to: event.returnValues.to,
                    time: this.getTimeStampOfTX(event.transactionHash),
                    tokenId: event.returnValues.tokenId,
                    presentation: "https://testnets.opensea.io/assets/" + event.address + "/" + event.returnValues.tokenId
                }

                this.setState({
                    transferHistory: [...this.state.transferHistory, transfer]
                })

                // this.createHistoryTable(transfers)
                // console.log(transfers)
                // console.log(Object.keys(transfers))
            })
            .on('changed', changed => console.log("event changed: "+changed))
            .on('error', err =>  console.log("event error: "+err))
            .on('connected', str => console.log("event connected: "+str));
    }
    createHistoryTable = function(data){
        return (
            <table>
                <thead>
                <tr>

                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        )
    }
    // https://medium.com/@subalerts/create-dynamic-table-from-json-in-react-js-1a4a7b1146ef
    getHeader = function(){
        if(this.state.transferHistory != null){
            const keys = Object.keys(this.state.transferHistory)
            return keys.map((key, index)=>{
                return <th key={key}>{key.toUpperCase()}</th>
            })
        }
        // return keys.map((key, index) =>{
        //     return <th key={key}>{key.toUpperCase()}</th>
        // })
    }
    getRowData = function(){
        if(this.state.transferHistory != null){
            const items = this.state.transferHistory;
            // const items = Object.values(this.state.transferHistory);
            const keys = Object.keys(items)
            return items.map((row, index)=>{
                return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
            })
        }
    }
    loadingData = function(){
        return (<td>Loading Table...</td>)
    }
    getTimeStampOfTX = async (txhash) =>{
        const blockNumber = (await this.state.web3.eth.getTransaction(txhash)).blockNumber;
        const timestamp = (await this.state.web3.eth.getBlock(blockNumber)).timestamp;
        const date = new Date(timestamp*1000)
        // console.log(date.getHours()+":"+("0"+date.getMinutes()).substr(-2) + ":"+ ("0"+date.getSeconds()).substr(-2))
        return date.getHours()+":"+("0"+date.getMinutes()).substr(-2) + ":"+ ("0"+date.getSeconds()).substr(-2);

    }

    render() {
        if(this.state.transferHistory != null) {
            return (
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 text-center">Account
                        address: {this.state.account}</h2>
                    <h2 className="text-xl font-semibold text-gray-700 text-center">Contract
                        address: {this.state.contract._address}</h2>
                    {/*{this.createHistoyryTable()}*/}
                    {/*<table>*/}
                    {/*<thead>*/}
                    {/*<tr>*/}
                    {/*<th></th>*/}
                    {/*<th></th>*/}
                    {/*</tr>*/}
                    {/*</thead>*/}
                    {/*<tbody>*/}
                    {/*<tr>*/}
                    {/*<td>Wallet address</td>*/}
                    {/*<td>{this.state.account}</td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                    {/*<td>Contract address</td>*/}
                    {/*<td>{this.state.contract._address}</td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                    {/*<td>Amount of Postcards minted</td>*/}
                    {/*<td>{}</td>*/}
                    {/*</tr>*/}
                    {/*</tbody>*/}
                    {/*</table>*/}

                    <table>
                        <thead>
                        <tr>
                            {this.getHeader()}
                        </tr>
                        </thead>
                        <tbody>
                        {this.getRowData()}
                        </tbody>
                    </table>
                </div>
            )
        }
        else{
            return this.loadingData;
        }
    }

}
const RenderRow = (historyData) =>{
        if(historyData != null){
            console.log(historyData )
            return historyData.keys.map((key,index) =>{
                return <td key={historyData.data[key]}>{historyData.data[key]}</td>
            })
        }
}
export default History;