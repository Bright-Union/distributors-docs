require('dotenv').config()
const testNets = [
        {
            name:'rinkeby',
            contractAddress:'0x957Bec5094a18d99A8cD8DBef705edCA8c31c90a',
            clientNode:`https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`,
            distributors:['insurace','bridge']
        }, 
        // {
        //     name:'kovan',
        //     contractAddress:'0xf078531459eFfcc93acF7ff1a2fd26dfad0DadF6',
        //     clientNode:`https://kovan.infura.io/v3/${process.env.PROJECT_ID}`,
        //     distributors:['nexus']

        // },
        // {
        //     name:'mumbai',
        //     contractAddress:' ',
        //     clientNode:`wss://polygon-mumbai.infura.io/ws/v3/${process.env.PROJECT_ID}`,
        //     distributors:['insurace']
        // },
        // {
        //     name:'bsct',
        //     contractAddress:' ',
        //     clientNode:`https://bsc-dataseed1.binance.org`,
        //     distributors:['insurace']  
        // }   
    ];

    module.exports = {testNets};