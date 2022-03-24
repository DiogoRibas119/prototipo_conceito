module.exports = {
  networks: {
    development: {
      host: "172.31.3.84",
      port: 7545,
      network_id: "123456" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.13",
      version: "0.5.15",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
