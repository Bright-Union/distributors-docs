require('dotenv').config()
const DistributorsABI = require( '../../../abi/Distributors.json');
const BridgeDistributor = require( '../../../abi/BridgeDistributor.json');
const NexusDistributorWrapper = require( '../../../abi/NexusDistributorWrapper.json');
const walletPrivateKey = process.env.PRIVATE_KEY;
const Web3 = require('web3');

const web3_rinkeby = new Web3(`https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`);
const web3_kovan = new Web3(`https://kovan.infura.io/v3/${process.env.PROJECT_ID}`);

web3_rinkeby.eth.accounts.wallet.add(walletPrivateKey);
web3_kovan.eth.accounts.wallet.add(walletPrivateKey);

const myWalletAddress = web3_kovan.eth.accounts.wallet[0].address;

const distAddress_rinkeby = '0x6E174A2C3E61B5E4f13Cc7035F4cB46E63f214db';//'0x957Bec5094a18d99A8cD8DBef705edCA8c31c90a';
const distAddress_kovan = '0x2204d3bD0Dc119b75E3855cdA96E60E4642c2503';


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
      _cover.distributor      = _distributorName;
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
    if(distName === 'nexus')return new web3_kovan.eth.Contract(DistributorsABI.abi, distAddress_kovan);
    return new web3_rinkeby.eth.Contract(DistributorsABI.abi, distAddress_rinkeby);
  }



 (()=>{

/**
    address _bridgeProductAddress,
    address _interfaceCompliant1,
    uint256 _durationSeconds,
    uint16 _interfaceCompliant2,
    uint8 _interfaceCompliant3,
    uint256 _coverTokens,
    bytes calldata _interfaceCompliant4


        uint256 _bridgeEpochs,
        uint256 _amountInWei,
        address _interfaceCompliant3,
        address _bridgeProductAddress,
        address _interfaceCompliant4,
        bytes calldata _interfaceCompliant5
*/

    // _getDistributorsContract('bridge')
    //       .methods.buyCover(
    //                   '0xd0b97eefCD388a3D253c46317Cd092F4970067cE',
    //                   "0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2",
    //                   26, // 26
    //                   0,
    //                   0,
    //                   web3_rinkeby.utils.toBN(200000000000000000000), //"200000000000000000000"
    //                   data1
    //               ).call()
    //       .then((covers)  => { 
    //                console.log(covers);
    //       }).catch((error) => {
    //               console.error('[protocol-balance] error:', error);
    //       });



     
  
        //   uint256 _sumAssured,
        //   uint256 _coverPeriod,
        //   address _contractAddress,
        //   address _coverAsset,
        //   address _nexusCoverable,
        //   bytes calldata _data



        //   _getDistributorsContract('nexus')
        //   .methods.getQuote(
        //                 200,
        //                 180,
        //                 "0x0000000000000000000000000000000000000001",
        //                 "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        //                 "0x0000000000000000000000000000000000000001",
        //                 web3_rinkeby.utils.hexToBytes(web3_rinkeby.utils.numberToHex(500))
        //           ).call()
        //   .then((covers)  => { 
        //            console.log(covers);
        //   }).catch((error) => {
        //           console.error('[protocol-balance] error:', error);
        //   });;
  
   })()

  module.exports = {
      _formatCoverResponse,
      _getDistributorsContract,
      _getDistributorsContract
    };