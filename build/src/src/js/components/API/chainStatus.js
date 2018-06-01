import Web3 from 'Lib/web3.min'
import * as AppActions from 'Action'


// import the actual Api class
import Api from '@parity/api';


let ethchains = [
  {
    name: 'Mainnet',
    url: 'http://my.ethchain.dnp.dappnode.eth:8545'
  }
]

ethchains.forEach(function(ethchain) {
  console.log('ethchain.url',ethchain.url)

  let web3WatchLoop = setInterval(function(){
    try {

      // Web3
      const web3Provider = new Web3.providers.HttpProvider(ethchain.url)
      let web3 = new Web3(web3Provider);

      // @Parity, do the setup
      const parityProvider = new Api.Provider.Http('http://my.ethchain.dnp.dappnode.eth:8545');
      const api = new Api(parityProvider);

      api.eth.syncing()
      .then(function(isSyncing){
        if (isSyncing) {
          if (isSyncing.warpChunksAmount.c[0] == 0) {
            // Regular syncing
            const cB = isSyncing.currentBlock.c[0]
            const hB = isSyncing.highestBlock.c[0]
            log(ethchain.name, 'warning', 'Blocks synced: '+cB+' / '+hB+' ('+Math.floor(100*cB/hB)+'%)')
          } else {
            // From SNAPSHOT
            const cC = isSyncing.warpChunksProcessed.c[0]
            const hC = isSyncing.warpChunksAmount.c[0]
            log(ethchain.name, 'warning', 'Syncing from SNAPSHOT: '+cC+' / '+hC+' ('+Math.floor(100*cC/hC)+'%)')
          }
        } else {
          web3.eth.getBlockNumber()
          .then(function(blockNumber){
            log(ethchain.name, 'success', 'Syncronized, block: '+blockNumber)
          })
        }
      })
      .catch(function(e){
        log(ethchain.name, 'danger', 'Error: '+e.message)
      })

    } catch(e) {
      log(ethchain.name, 'danger', 'Error: '+e.message)
    }
  }, 1000);

})


function log(name, type, status) {
  if (status && status.includes('Invalid JSON RPC response')) {
    status = 'Can\'t connect to ETHCHAIN.'
  }
  // console.log(name, type, status)
  AppActions.updateChainStatus({
    name,
    type,
    status
  })
}
