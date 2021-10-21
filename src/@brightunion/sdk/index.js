require('dotenv').config()
const DistributorsABI = require( '../../../abi/Distributors.json');
const walletPrivateKey = process.env.PRIVATE_KEY;
const Web3 = require('web3');

const web3_rinkeby = new Web3(`https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`);
const web3_kovan = new Web3(`https://kovan.infura.io/v3/${process.env.PROJECT_ID}`);

web3_rinkeby.eth.accounts.wallet.add(walletPrivateKey);
web3_kovan.eth.accounts.wallet.add(walletPrivateKey);

const myWalletAddress = web3_kovan.eth.accounts.wallet[0].address;


const distAddress_rinkeby = '0x957Bec5094a18d99A8cD8DBef705edCA8c31c90a';
const distAddress_kovan = '0xC3346d88d34d4458FEC83dFA111Ea780d1bd0c0D';


/**
 * @summary  Returns a formatted array of covers
 * @readonly web3 read tx
 * @param    String : Distributor Name
 * @param    Array of non-formatted covers "protocol's response"
 * @returns  Array of formatted covers
 */
const _formatCoverResponse = (_distributorName,_chainId,_covers) => {
    let coverFormat = [];
    _covers.forEach(cover =>{
      _cover = {};
      _cover.Distributor      = _distributorName;
      _cover.chain            = _chainId;
      _cover.coverType        = cover[0];
      _cover.productId        = cover[1];
      _cover.contractName     = cover[2];
      _cover.coverAmount      = cover[3];
      _cover.premium          = cover[4];
      _cover.currency         = cover[5];
      _cover.contractAddress  = cover[6];
      _cover.expiration       = cover[7];
      _cover.status           = cover[8];
      _cover.refAddress       = cover[9];
      coverFormat.push(_cover);
    });
    return coverFormat;
  }


  

  const _getDistributorsContract = (distName) => {
    if(distName === 'nexus'){
        return  new  web3_kovan.eth.Contract(DistributorsABI.abi, distAddress_kovan);
     }
    return   new  web3_rinkeby.eth.Contract(DistributorsABI.abi, distAddress_rinkeby);
  }
  module.exports = {
      _formatCoverResponse,
      _getDistributorsContract,
      _getDistributorsContract
    };