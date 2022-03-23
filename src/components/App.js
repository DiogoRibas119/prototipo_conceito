import React, { Component } from 'react';
import './App.css';
//import { create } from 'ipfs-http-client'
//const ipfs = create(new URL('http://172.31.3.80:5001'))

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: '172.31.3.80', port: 5001, protocol: 'http' }) 


class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      buffer: null,
      mainPic: ''
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
      this.setState({mainPic: result[0].hash})
      if(error) {
        console.error(error)
        return
      }
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