
  require('dotenv').config()
  const express = require('express');
  const bodyParser = require('body-parser');
  const Web3 = require('web3');
  const swaggerUi = require('swagger-ui-express');
  const cors = require('cors');

  const { 
    getInsuraceCovers,
    getNexusCovers,
    getCoverPremium,
    confirmCoverPremium
  } = require('./api/integration');

  const DistributorsABI = require( '../abi/Distributors.json');
  const swaggerDocument = require('../swagger.json');
  const walletPrivateKey = process.env.PRIVATE_KEY;
  const web3_rinkeby = new Web3(`https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`);
  const web3_kovan = new Web3(`https://kovan.infura.io/v3/${process.env.PROJECT_ID}`);
  
  web3_rinkeby.eth.accounts.wallet.add(walletPrivateKey);
  web3_kovan.eth.accounts.wallet.add(walletPrivateKey);

  const myWalletAddress = web3_kovan.eth.accounts.wallet[0].address;
  
  const distAddress_rinkeby = '0x9E8412DFcB3F9750B05a8583C234A130D8e7df25';
  const distAddress_kovan = '0xC3346d88d34d4458FEC83dFA111Ea780d1bd0c0D';
  
  
  const getDistributorsContract = (distName) => {
      if(distName === 'nexus'){
          return  new  web3_kovan.eth.Contract(DistributorsABI.abi, distAddress_kovan);
       }
      return   new  web3_rinkeby.eth.Contract(DistributorsABI.abi, distAddress_rinkeby);
    }
  
  const app = express();
  app.use(cors());
  const port = 80;
  app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.serve, 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
  const issue2options = {
    origin: true,
    methods: ["POST","GET"],
    credentials: true,
    maxAge: 3600
  };
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


/**
 * 
 *       BU PROTOCOL 
 */


app.route('/v1/brightUnion/getCovers', cors(issue2options)).post((req, res) => { 
    let {DistributorName,OwnerAddress,ActiveCover,limit = 20, covers=[], coverFormat=[]} = req.body;

    getDistributorsContract(DistributorName)
            .methods.getCovers(DistributorName,OwnerAddress,ActiveCover,limit)
            .call()
    .then((covers)  => { 

      covers.forEach(cover =>{
                      _cover = {}
                      _cover.coverId = cover[0],
                      _cover.coverType = cover[1],
                      _cover.productId = cover[3],
                      _cover.contractName = cover[2],
                      _cover.coverAmount = cover[4],
                      _cover.premium = cover[5]
                      coverFormat.push(_cover);
                  });
                  return res.send(covers);
          }).catch((error) => {
            console.error('[protocol-balance] error:', error);
            return res.sendStatus(400);
          });;
      });

 app.route('/v1/brightUnion/getCoverQuote').post((req, res) => { 
      let {
        _distributorName,
        _interfaceCompliant1,
        _interfaceCompliant2,
        _sumAssured,
        _coverPeriod,
        _contractAddress,
        _coverAsset,
        _nexusCoverable,
         _data
      } = req.body;
  
      getDistributorsContract(DistributorName)
              .methods.getQuote(
                            _distributorName,
                           _interfaceCompliant1,
                           _interfaceCompliant2,
                           _sumAssured,
                           _coverPeriod,
                           _contractAddress,
                           _coverAsset,
                           _nexusCoverable,
                            _data
                    )
              .call()
      .then((covers)  => { 
  
        covers.forEach(cover =>{
                        _cover = {}
                        _cover.coverId = cover[0],
                        _cover.coverType = cover[1],
                        _cover.productId = cover[2],
                        _cover.contractName = cover[3],
                        _cover.coverAmount = cover[4],
                        _cover.premium = cover[5]
                        coverFormat.push(_cover);
                    });
                    return res.send(covers);
            }).catch((error) => {
              console.error('[protocol-balance] error:', error);
              return res.sendStatus(400);
            });;
  });
      
 app.route('/v1/brightUnion/buyCover').post((req, res) => { 

        let { 
          DistributorName,
          productAddress,
              _interfaceCompliant1,
              duration,
              _interfaceCompliant2,
              _interfaceCompliant3,
              coverTokens,
            } = req.body;
    
        /*
            Buy Cover     BRIDGE
              address _bridgeProductAddress,
              address _interfaceCompliant1,
              uint256 _durationSeconds,
              uint16 _interfaceCompliant2,
              uint8 _interfaceCompliant3,
              uint256 _coverTokens,
              bytes calldata _interfaceCompliant4
        */

              const data1 = web3_rinkeby.eth.abi.encodeParameters(
                ['string'],
                [DistributorName]
          );
        //       const data = web3_rinkeby.eth.abi.encodeParameters(
        //               ['string',
        //               'address',
        //               'address',
        //               'uint256',
        //               'uint16',
        //               'uint8',
        //               'uint256',
        //               'bytes'],
        //               [
        //                 DistributorName,
        //                 productAddress,
        //                 "0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2",
        //                 duration, // 26
        //                 12,
        //                 12,
        //                 coverTokens, //"200000000000000000000"
        //                 data1
        //               ]
        //         );
        getDistributorsContract(DistributorName)
        .methods.buyCover(
                    DistributorName,
                    productAddress,
                    "0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2",
                    duration, // 26
                    12,
                    12,
                    coverTokens, //"200000000000000000000"
                    data1
                ).call()
                /**
                 *                address _bridgeProductAddress,
                                  address _interfaceCompliant1,
                                  uint256 _durationSeconds,
                                  uint16 _interfaceCompliant2,
                                  uint8 _interfaceCompliant3,
                                  uint256 _coverTokens,
                                  bytes calldata _interfaceCompliant4
                 */
        .then((covers)  => { 
                  return res.send(covers);
        }).catch((error) => {
                console.error('[protocol-balance] error:', error);
                return res.sendStatus(400);
        });;

         /*
            Buy Cover with decoded parameters      INSURACE  
        */
            // getDistributorsContract(DistributorName).methods.buyCoverDecode(DistributorName,OwnerAddress,ActiveCover,limit).call()
            // .then((covers)  => { 
            // TODO: logic buy insurace
            //           return res.send(covers);
            // }).catch((error) => {
            //         console.error('[protocol-balance] error:', error);
            //         return res.sendStatus(400);
            // });;
 });



/**
 * 
 *        INSURACE 
 */



app.route('/v1/insurace/getCoverCatalog').get((req, res) => {
      new Promise( async resolve => {
          const covers = await getInsuraceCovers();
          resolve(covers);
        }).then((result) => {
          return res.send(result);
        }).catch((error) => {
          console.error('[getRegistry] error:', error);
          return res.sendStatus(400);
        });
    });
  
app.route('/v1/insurace/getCoverPremium').post((req, res) => {
      new Promise( async resolve => {
          const covers = await getCoverPremium();
          resolve(covers);
        }).then((result) => {
          return res.send(result);
        }).catch((error) => {
          console.error('[getRegistry] error:', error);
          return res.sendStatus(400);
        });
    });
  
app.route('/v1/insurace/confirmCoverPremium').post((req, res) => {
  new Promise( async resolve => {
      const covers = await confirmCoverPremium();
      resolve(covers);
    }).then((result) => {
      return res.send(result);
    }).catch((error) => {
      console.error('[getRegistry] error:', error);
      return res.sendStatus(400);
    });
    });

/**
 * 
 *        NEXUS - Kovan
 */
  app.route('/v1/nexus/getNexusCovers').post((req, res) => {
  new Promise(async resolve => {
      const covers = await getNexusCovers();
      resolve(covers);
    }).then((result) => {
      return res.send(result);
    }).catch((error) => {
      console.error('[getRegistry] error:', error);
      return res.sendStatus(400);
    });
});

/**
 * 
 *        BRIDGE 
 */

  app.listen(port, () => console.log(`API server running on port ${port}`));
