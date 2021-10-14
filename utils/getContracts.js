const DistributorsABI = require( '../abi/Distributors.json');

const getContract = (abi, address, web3) =>
    new Promise((resolve, reject) => {
        const contractInstance = new web3.eth.Contract(abi.abi, address);
        if (contractInstance) {
            resolve(contractInstance);
        } else {
            reject('Can\'t get contact');
        }
    });

module.exports.getDistributorsContract = (address, web3) => getContract(DistributorsABI, address, web3);