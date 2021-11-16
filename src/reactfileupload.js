import React from 'react'
import axios, { post } from 'axios';
import {Readable} from "stream";
const FormData = require('form-data');
const streamToBlob = require('stream-to-blob')
//https://gist.github.com/AshikNesin/e44b1950f6a24cfcd85330ffc1713513

class SimpleReactFileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file:null
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }

    onFormSubmit(e){
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file).then((response)=>{
            console.log(response.data);
        })
    }

    async onChange(e) {
        this.setState({file:e.target.files[0]})
    }

    async fileUpload(file){
        const url = process.env.REACT_APP_PINATA_FILE_ENDPOINT;
        const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
        const pinataApiSecret = process.env.REACT_APP_PINATA_API_SECRET;
        const formData = new FormData();
        try{
            formData.append('file', file);
            const request = {
                method: 'post',
                url: url,
                maxContentLength: 'Infinity',
                headers: {
                    pinata_api_key: pinataApiKey,
                    pinata_secret_api_key: pinataApiSecret,
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                },
                data: formData,
            };
            return axios(request)
        }
        catch (e){
            console.log("error " + e)
        }

        // return  post(url, formData,config)
    }

    render() {
        return (
            <input type="file" onChange={this.onChange} />
        )
    }
}



export default SimpleReactFileUpload