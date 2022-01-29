import React, {Component} from "react";
import Table from 'react-bootstrap/Table';
import {FileEarmarkCode} from 'react-bootstrap-icons';
import {getLatestERC721Tx} from "./utils/etherscan";

class History extends Component {
    //https://rinkeby-api.opensea.io/api/v1/assets?owner=0xc7d2e073ed4aaf735ef12fffbf7afe752d1e2390
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
        // this.getTimeStampOfTX = this.getTimeStampOfTX.bind(this);
        this.getRowData = this.getRowData.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.loadingDataMarkup = this.loadingDataMarkup.bind(this);
        this.loadDataAsync = this.loadDataAsync.bind(this);
        this.timeDifference = this.timeDifference.bind(this);
        this.loadTxData = this.loadTxData.bind(this);
        // this.loadTxDatatest = this.loadTxDatatest.bind(this);
        this.getTimeDiff = this.getTimeDiff.bind(this);

    }
    componentDidMount = async () => {
        let options = {
            // address: this.state.account,
            filter: {
                value: [],
            },
            fromBlock: 0
        };
        const entries = await getLatestERC721Tx(this.state.contract._address, this.state.account, 30);
        for (const entry of entries.data.result) {
            await this.loadTxData(entry);
        }



        // listens to tx
        // try {
        // this.state.contract.events.Transfer(options)
        //     .on('data', async transfer => {
        //         await this.loadTxData(transfer);
        //     })
        //     .on('changed', async changed => {
        //         console.log("does this shit even work")
        //         await this.loadTxData(changed);
        //     })
        //     .on('error', err =>  console.log(err))
        // }
        // catch (e) {
        //     this.setState({errorMessage: "something went wrong: "+e.message})
        // }


    }

    loadTxData = async function(tx){
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
        // await this.loadDataAsync({transferHistory: [...this.state.transferHistory, obj]})
    }
    // loadTxData = async function(tx){
    //     // TODO ADD HISTORY CAP (AROUND 15 MAYBE)
    //     // TODO SORT CUZ SORTING IS KINDA FUCKED
    //     // TODO REMOVE HARDCODED "RINKEBY" AND "TESTNETS"
    //     // TODO USE https://rinkeby.etherscan.io/token/0xf88825da14E802eb5ca4834C450000f598EA3863 FOR SOMETHING
    //
    //     const etherScanAddressPrefix = "https://rinkeby.etherscan.io/address/";
    //     const etherScanTxPrefix = "https://rinkeby.etherscan.io/tx/";
    //     let timestamp = await this.getTimeStampOfTX(tx.transactionHash);
    //
    //     const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    //     let from = (tx.returnValues.from === ZERO_ADDRESS) ? tx.address : tx.returnValues.from;
    //     let osUrl = "https://testnets.opensea.io/assets/" + tx.address + "/" + tx.returnValues.tokenId;
    //     let fromUrl = etherScanAddressPrefix + from;
    //     let toUrl = etherScanAddressPrefix + tx.returnValues.to;
    //     let transUrl = etherScanTxPrefix + tx.transactionHash;
    //
    //     let icon = null;
    //     if (from === tx.address) {
    //         icon = <FileEarmarkCode className="d-inline mb-1 me-1"/>;
    //     }
    //     this.state.contract.get
    //     let entry = {
    //         tokenId: tx.returnValues.tokenId,
    //         transaction: <a href={transUrl} target="_blank"
    //                         rel="noopener noreferrer">{tx.transactionHash.substr(2, 10)}</a>,
    //         from: <span>
    //                         {icon}
    //             <a href={fromUrl} target="_blank" rel="noopener noreferrer">{from.substr(2, 10)}</a></span>,
    //         to: <a href={toUrl} target="_blank"
    //                rel="noopener noreferrer">{tx.returnValues.to.substr(2, 10)}</a>,
    //         created: timestamp + " ago",
    //         opensea: <a href={osUrl} target="_blank" rel="noopener noreferrer">Opensea</a>
    //     }
    //     this.setState({transferHistory: [...this.state.transferHistory, entry]})
    //     // await this.loadDataAsync({transferHistory: [...this.state.transferHistory, obj]})
    // }

    loadDataAsync = async function(state){
        return new Promise((resolve) =>{
            this.setState(state,resolve)
            });
    }

    // from https://medium.com/@subalerts/create-dynamic-table-from-json-in-react-js-1a4a7b1146ef
    getHeader = function(){
        if(this.state.transferHistory != null && this.state.transferHistory[0] !== undefined){
            const keys = Object.keys(this.state.transferHistory[0])
            return keys.map((key, index)=>{
                // return <th className="text-black text-center" key={key} width="50">{key.toUpperCase()}</th>
                return <th className="text-black text-center" key={key} width="50">{key.toUpperCase()}</th>
            })
        }
    }
    getRowData = function(){
        if(this.state.transferHistory != null && this.state.transferHistory[0] !== undefined){
            const items = this.state.transferHistory;
            // const items = Object.values(this.state.transferHistory);
            const keys = Object.keys(items[0])
            return items.map((row, index)=>{
                // console.log(index +" at row: "+ row)
                return <tr className="text-truncate" key={index}><RenderRow data={row} keys={keys}/></tr>
                // return <tr className="text-truncate"><RenderRow data={row} key={index} keys={keys}/></tr>
            })
        }
    }

    loadingDataMarkup = function(){
        return (<h6>Loading Table...</h6>)
    }

    // getTimeStampOfTX = async (txhash) =>{
    //     const blockNumber = (await this.state.web3.eth.getTransaction(txhash)).blockNumber;
    //     const timestamp = (await this.state.web3.eth.getBlock(blockNumber)).timestamp;
    //     const date = new Date(timestamp*1000);
    //     return this.timeDifference(new Date(Date.now()), date);
    //
    // }

    getTimeDiff = async (timestamp) =>{
        const date = new Date(timestamp*1000);
        return this.timeDifference(new Date(Date.now()), date);

    }

    //from https://pretagteam.com/question/how-to-calculate-difference-between-two-timestamps-using-javascript
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
    render() {
        // if(this.state.errorMessage!==""){
        //     return <h3>{this.state.errorMessage}</h3>;
        // }
        if(this.state.transferHistory != null) {
            this.state.transferHistory.sort((a, b) =>{
                return b.tokenId-a.tokenId;
            })
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
// from https://medium.com/@subalerts/create-dynamic-table-from-json-in-react-js-1a4a7b1146ef
const RenderRow = (historyData) =>{
    if(historyData != null){
        return historyData.keys.map((key) =>{
            return <td key={key}>{historyData.data[key]}</td>
        })
    }
}
export default History;