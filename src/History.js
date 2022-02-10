import React, {Component} from "react";
import Table from 'react-bootstrap/Table';
import {FileEarmarkCode} from 'react-bootstrap-icons';
import {getLatestERC721Tx} from "./utils/etherscan";

/*
History component
it shows the last 30 transactions made via the Souvenir Smart Contract
it doesn't work for the local blockchain
it currently only works on the rinkeby testnet
 */
class History extends Component {
    constructor(props) {
        super(props)
        this.state = {
            account: this.props.account,
            contract: this.props.contract,
            web3: this.props.web3,
            transferHistory: [],
            networkId: null,
            errorMessage: this.props.errorMessage
        }

        this.getRowData = this.getRowData.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.timeDifference = this.timeDifference.bind(this);
        this.loadTxData = this.loadTxData.bind(this);
        this.getTimeDiff = this.getTimeDiff.bind(this);

    }
    /*
    initialises the data from the etherscan api
    max amount of entries shown is 30
     */
    componentDidMount = async () => {
        const entries = await getLatestERC721Tx(this.state.contract._address, 30);
        // calls loadTxData for every transaction
        for (const entry of entries.data.result) {
            await this.loadTxData(entry);
        }
    }
    /*
    takes a transaction and formats it into an expected table entry
    data entry is being added into the transferHistory state array
     */
    loadTxData = async function(tx){
        //hard coded rinkeby links
        const etherScanAddressPrefix = "https://rinkeby.etherscan.io/address/";
        const etherScanTxPrefix = "https://rinkeby.etherscan.io/tx/";

        let timestamp = await this.getTimeDiff(tx.timeStamp);
        const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
        let from = (tx.from === ZERO_ADDRESS) ? tx.contractAddress : tx.from;
        let osUrl = "https://testnets.opensea.io/assets/" + tx.contractAddress + "/" + tx.tokenID;
        let fromUrl = etherScanAddressPrefix + from;
        let toUrl = etherScanAddressPrefix + tx.to;
        let transUrl = etherScanTxPrefix + tx.hash;

        let icon = null;
        if (from === tx.contractAddress) {
            icon = <FileEarmarkCode className="d-inline mb-1 me-1"/>;
        }
        this.state.contract.get
        let entry = {
            tokenID: tx.tokenID,
            transaction: <a href={transUrl} target="_blank"
                            rel="noopener noreferrer">{tx.hash.substr(2, 10)}</a>,
            from: <span>
                            {icon}
                <a href={fromUrl} target="_blank" rel="noopener noreferrer">{from.substr(2, 10)}</a></span>,
            to: <a href={toUrl} target="_blank"
                   rel="noopener noreferrer">{tx.to.substr(2, 10)}</a>,
            created: timestamp + " ago",
            opensea: <a href={osUrl} target="_blank" rel="noopener noreferrer">Opensea</a>
        }
        this.setState({transferHistory: [...this.state.transferHistory, entry]})
    }
    /*
     adapted from https://medium.com/@subalerts/create-dynamic-table-from-json-in-react-js-1a4a7b1146ef
     renders table header
     */
    getHeader = function(){
        if(this.state.transferHistory != null && this.state.transferHistory[0] !== undefined){
            const keys = Object.keys(this.state.transferHistory[0])
            return keys.map((key)=>{
                return <th className="text-black text-center" key={key} width="50">{key.toUpperCase()}</th>
            })
        }
    }
    /*
    renders table row
     */
    getRowData = function(){
        if(this.state.transferHistory != null && this.state.transferHistory[0] !== undefined){
            const items = this.state.transferHistory;
            const keys = Object.keys(items[0])
            return items.map((row, index)=>{
                return <tr className="text-truncate" key={index}><RenderRow data={row} keys={keys}/></tr>
            })
        }
    }
    /*
    getter for the time difference
    returns time difference between the transaction timestamp and now
     */
    getTimeDiff = async (timestamp) =>{
        const date = new Date(timestamp*1000);
        return this.timeDifference(new Date(Date.now()), date);

    }

    /*
    adapted from https://pretagteam.com/question/how-to-calculate-difference-between-two-timestamps-using-javascript
    returns time difference between two dates in wanted preferred format
     */
    timeDifference(date1, date2) {
        let difference = date1.getTime() - date2.getTime();


        let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        if(daysDifference!=0){
            if(daysDifference==1)
                return daysDifference+" day ";
            return daysDifference+" days ";
        }

        let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
        if(hoursDifference!=0){
            if(hoursDifference==1)
                return hoursDifference+" hour ";
            return hoursDifference+" hours ";
        }

        let minutesDifference = Math.floor(difference / 1000 / 60);
        if(minutesDifference!=0){
            if(minutesDifference==1)
                return minutesDifference+" minute ";
            return minutesDifference+" minutes ";
        }
        else{
            return "less than a minute ";
        }

    }
    /*
    renders result
     */
    render() {
        if(this.state.transferHistory != null) {
            return (
                <div>
                    <Table bordered hover>
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

/*
adapted from https://medium.com/@subalerts/create-dynamic-table-from-json-in-react-js-1a4a7b1146ef
renders row
 */
const RenderRow = (historyData) =>{
    if(historyData != null){
        return historyData.keys.map((key) =>{
            return <td key={key}>{historyData.data[key]}</td>
        })
    }
}

export default History;