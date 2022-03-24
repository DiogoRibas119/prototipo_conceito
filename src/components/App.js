import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import hashTest from '../abis/hashTest.json';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: '172.31.3.80', port: 5001, protocol: 'http' }) 

class App extends Component {

  async componentDidMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      mainPic: '',
      account: null,
      contract: null,
      counter: null
    }
  }

  async loadWeb3() {  
    window.web3 = new Web3('http://172.31.3.84:7545')
  }

  async loadBlockchainData() {
      const web3 = window.web3  
      const privateKey = '0xdf775bbb3ec06667a23ae1a583c4a9e01bbd912887d8470766679f501509fe31' // Get PrivKey from ganache for now
      const accounts = web3.eth.accounts.privateKeyToAccount(privateKey)
      this.setState({ account: accounts.address})
      const netId =   await web3.eth.net.getId()  
      const netData = hashTest.networks[netId]
      if(netData) {
          const abi = hashTest.abi
          const address = netData.address 
          const contract = new web3.eth.Contract(abi, address)
          this.setState({contract})
          const mainPic = await contract.methods.get().call()
          this.setState({mainPic})
          
      } else {
        window.alert('Contract not deployed. Run truffle Migrate on console')
      }
      console.log(netId)
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log("submit")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("resultado", result)
      const mainPic = result[0].hash
      if(error) {
        console.error(error)
        return
      }
      this.state.contract.methods.set(mainPic).send({from: this.state.account}).then((r) => {
        this.setState({ mainPic })
      })
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <img src={`http://172.31.3.80:8080/ipfs/${this.state.mainPic}`} alt="Alt text" height={500}/>
          <p></p><p></p><p></p><p></p>
          <h2>Add File</h2>
          <form onSubmit={this.onSubmit} >
          <input type='file' onChange={this.captureFile} />
          <input type='submit' />
        </form>
        </header>
      </div>
    );
  }
}
export default App;
