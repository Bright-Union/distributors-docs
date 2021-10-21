
  require('dotenv').config()
  const express = require('express');
  const bodyParser = require('body-parser');
  const swaggerUi = require('swagger-ui-express');
  const cors = require('cors');
  const {_formatCoverResponse, _getDistributorsContract} = require('./@brightunion/sdk')
  const swaggerDocument = require('../swagger.json');
  const testAddress = '0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2';


  const { 
    getInsuraceCovers,
    getNexusCovers,
    getCoverPremium,
    confirmCoverPremium
  } = require('./api/integration');
  
  const app = express();
  app.use(cors());
  const port = 8000;
  app.use('/protocol/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


/**
 * 
 *       BU PROTOCOL 
 */
app.route('/v1/protocol/getCovers').post((req, res) => { 
    let {DistributorName,OwnerAddress,ActiveCover,limit = 20, covers=[], coverFormat=[]} = req.body;
    _getDistributorsContract('insurace')
      .methods.getCovers('insurace',testAddress,true,limit).call()
        .then((covers)  => { 
          coverFormat = coverFormat.concat(_formatCoverResponse('insurace','rinkeby',covers)) })
     
      .then(() => { 
        _getDistributorsContract('bridge').methods.getCovers('bridge',testAddress,false,limit).call()
           .then((covers)  => { 
              coverFormat = coverFormat.concat(_formatCoverResponse('bridge','rinkeby',covers)) })
               
              .then(() => { 
                _getDistributorsContract('nexus').methods.getCovers('nexus',testAddress,false,limit).call()
                 .then((covers)  => { 
                   coverFormat = coverFormat.concat(_formatCoverResponse('nexus','kovan',covers)) })
                   
                   .then(()=>{ return res.send(coverFormat)  })  });

          }).catch((error) => {
            console.error('[protocol-balance] error:', error);
            return res.sendStatus(400);
      });
});

 app.route('/v1/protocol/getCoverQuote').post((req, res) => { 
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
      
 app.route('/v1/protocol/buyCover').post((req, res) => { 

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



app.route('/v1/protocol/getCoverCatalog').get((req, res) => {
  let formatCovers = [];
      new Promise(async resolve => {
          const covers = await getInsuraceCovers(); // insurace
          resolve(covers);
        }).then((insruaceCovers) => {
          formatCovers = formatCovers.concat(insruaceCovers);
        }).then(async () => {
          new Promise(async resolve => {
            const covers = await getNexusCovers(); // nexus
            resolve(covers);
        }).then((nexusCovers) => {
          formatCovers = formatCovers.concat(nexusCovers);
          return res.send(formatCovers);
        }).catch((error) => {
          console.error('[getRegistry] error:', error);
          return res.sendStatus(400);
        });
  });
});

/**
 * 
 *        INSURACE 
 */  
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
