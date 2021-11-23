import React, {Component} from "react";
import Table from 'react-bootstrap/Table';
import ToolTip from "react-tooltip";

class History extends Component {
    //https://rinkeby-api.opensea.io/api/v1/assets?owner=0xc7d2e073ed4aaf735ef12fffbf7afe752d1e2390
    constructor(props) {
        super(props)
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
        this.timeDifference = this.timeDifference.bind(this);

    }
    componentDidMount = async () => {
        let options = {
            // address: this.state.account,
            filter: {
                value: [],
            },
            fromBlock: 0
        };

        // TODO ADD HISTORY CAP (AROUND 15 MAYBE)
        // listens to minted NFTs
        this.state.contract.events.Transfer(options)
            .on('data', async transfer => {

                    let timestamp = await this.getTimeStampOfTX(transfer.transactionHash)

                    let url = "https://testnets.opensea.io/assets/" + transfer.address + "/" + transfer.returnValues.tokenId

                    let obj = {
                        tokenId: transfer.returnValues.tokenId,
                        transaction: transfer.transactionHash,
                        from: transfer.returnValues.from,
                        to: transfer.returnValues.to,
                        created: timestamp +" ago",
                        opensea: (<a href={url}>Opensea link</a>)
                    }
                    await this.loadDataAsync({transferHistory: [...this.state.transferHistory, obj]})



            })
            .on('error', err =>  console.log(err))



    }
    componentWillUnmount = async () => {
    }

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
                return <th key={key} width="50">{key.toUpperCase()}</th>
            })
        }
    }
    getRowData = function(){
        if(this.state.transferHistory != null && this.state.transferHistory[0] !== undefined){
            const items = this.state.transferHistory;
            // const items = Object.values(this.state.transferHistory);
            const keys = Object.keys(items[0])
            return items.map((row, index)=>{
                return <tr style={{textOverflow:"ellipsis"}} key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
            })
        }
    }

    loadingDataMarkup = function(){
        return (<h6>Loading Table...</h6>)
    }

    getTimeStampOfTX = async (txhash) =>{
        const blockNumber = (await this.state.web3.eth.getTransaction(txhash)).blockNumber;
        const timestamp = (await this.state.web3.eth.getBlock(blockNumber)).timestamp;
        const date = new Date(timestamp*1000);
        return this.timeDifference(new Date(Date.now()), date);
        // console.log("diff: "+ diff.toTimeString())
        // return date.getHours()+":"+("0"+date.getMinutes()).substr(-2) + ":"+ ("0"+date.getSeconds()).substr(-2);

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
        if(this.state.transferHistory != null) {
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
// from https://medium.com/@subalerts/create-dynamic-table-from-json-in-react-js-1a4a7b1146ef
const RenderRow = (historyData) =>{
    if(historyData != null){
        return historyData.keys.map((key) =>{
            return <td data-tip data-for='tt' key={historyData.data[key]}>{historyData.data[key]}</td>

        })
    }
}
export default History;