const axios = require('axios');
require('dotenv').config()

// covers on Rinkeby
module.exports.getInsuraceCovers = () => {
        return axios.post(
            `https://insurace-sl-microservice.azurewebsites.net/getProductList?code=${process.env.INSURACE_API_KEY}`, {
            chain: 'ETH'
        }).then((response) => {
            return response.data;
        });
}

// covers on Kovan

module.exports.getNexusCovers = () =>{
        return axios.get(`https://api.nexusmutual.io/coverables/contracts.json`)
            .then((response) => {
                return response.data;
            });
    }


module.exports.getCoverPremium = (owner) => {
        return axios.post(
            `https://insurace-sl-microservice.azurewebsites.net/getCoverPremium?code=${encodeURIComponent(process.env.INSURACE_API_KEY)}`, {
            chain: 'ETH',
            coverCurrency: `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`,
            productIds: [83],
            coverDays: [180],
            coverAmounts: [100000],
            owner: owner,
            referralCode: '982107115070280393099561761653261738634756834311'
        })
        .then((response) => {
            return response.data;
        });
    }

module.exports.confirmCoverPremium = (state, params) => {
        return axios.post(
            `https://insurace-sl-microservice.azurewebsites.net/confirmCoverPremium?code=${encodeURIComponent(process.env.INSURACE_API_KEY)}`
            , {
            chain: 'ETH',
            params: params
        }).then((response) => {
                return response.data;
            });
    }
