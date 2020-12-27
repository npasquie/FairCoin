module.exports = {
  compilers: {
    solc:{
      version :'0.7.0'
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};