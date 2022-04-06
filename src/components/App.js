import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import hashTest from '../abis/fileStorage.json';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: '172.31.3.80', port: 5001, protocol: 'http' }) 
//ganache-cli --port 7545 -h 172.31.3.84 -i 123456 -v
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
      counter: null,
      bufferInt: null
    }
  }

  async loadWeb3() {  
    window.web3 = new Web3('http://172.31.3.84:7545')
  }

  async loadBlockchainData() {
      const web3 = window.web3  
      const privateKey = '0xaeb0a9fd852815e58e6a70ac5ab9e30acebb55cbbace1bc4b74b83bc86dee3b5' // Get PrivKey from ganache for now
      const accounts = web3.eth.accounts.privateKeyToAccount(privateKey)
      this.setState({ account: accounts.address})
      const netId =   await web3.eth.net.getId()  
      const netData = hashTest.networks[netId]
      if(netData) {
          const abi = hashTest.abi
          const address = netData.address 
          const contract = new web3.eth.Contract(abi, address)
          this.setState({contract})
          const counter = await contract.methods.getCounter().call()
          console.log(counter)
          this.setState({counter})
          const mainPic = await contract.methods.get("1").call()
          this.setState({mainPic})
          
      } else {
        window.alert('Contract not deployed. Run truffle Migrate on console')
      }
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
      this.state.contract.methods.set(mainPic).send({from: this.state.account,  gas:800000 }).then((r) => {
        console.log('aight bet')
        this.setState({mainPic})
      })
      
    })
  } 

  imageSet = async (event) => {
    event.preventDefault()
    const idCounter = this.state.bufferInt
    const idHash = await this.state.contract.methods.get(idCounter).call()
    console.log(idHash)
    this.setState({mainPic: idHash})  
    const web3 = window.web3
    const temp = await web3.eth.getBalance(this.state.account)
    console.log(temp)
  }


  imageSetPrelude = (event) => {
    event.preventDefault()
    const _Id= event.target.value
    this.setState({bufferInt: _Id})
  }
  

  //<img src={`http://172.31.3.80:8080/ipfs/${this.state.mainPic}`} alt="Alt text" height={500}/>
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Add File</h2>
          <img src={`http://172.31.3.80:8080/ipfs/${this.state.mainPic}`} alt="Alt text" height={500}/>
          <form onSubmit={this.onSubmit} >
          <input type='file' onChange={this.captureFile} />
          <input type='submit' />
        </form>
        <form onSubmit={this.imageSet}>
        <input type="number" id="setId" name="setId" onChange={this.imageSetPrelude}/>
        <input type='submit'/>
        </form>
        </header>
      </div>
    );
  }
}
export default App;
