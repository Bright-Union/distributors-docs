const DistributorsABI = require( '../../../abi/Distributors.json');

/**
 * @summary  Returns a formatted array of covers
 * @readonly web3 read tx
 * @param    String : Distributor Name
 * @param    Array of non-formatted covers "protocol's response"
 * @returns  Array of formatted covers
 */
const getContract = (address, web3) =>  new web3.eth.Contract(abi.abi, address);

const _getDistributorsContract = (address, web3) => getContract(DistributorsABI, address, web3);


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

  module.exports = {
      _formatCoverResponse,
      _getDistributorsContract
    };