
  require('dotenv').config()
  const express = require('express');
  const {_formatCoverResponse, _getDistributorsContract,data1} = require('./@brightunion/sdk')
  const bodyParser = require('body-parser');
  const swaggerUi = require('swagger-ui-express');
  const cors = require('cors');
  const swaggerDocument = require('../swagger.json');
  const testAddress = process.env.TEST_ACCOUNT;
  const Web3 = require('web3');
  const path = require('path')

  const web3_rinkeby = new Web3(`https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`);

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

  app.use('/sdk', express.static(path.join(__dirname + '/public')))

/**
 * 
 *       BU PROTOCOL 
 */
app.route('/v1/protocol/getCoversDemo').post((req, res) => { 
    let {DistributorName,OwnerAddress,ActiveCover,limit = 20, covers=[], coverFormat=[]} = req.body;
    _getDistributorsContract('insurace')
      .methods.getCovers('insurace',testAddress,true,limit).call()
        .then((covers)  => { 
          coverFormat = coverFormat.concat(_formatCoverResponse('insurace','rinkeby',covers)) })
     
      .then(() => { 
        _getDistributorsContract('bridge').methods.getCovers('bridge',testAddress,true,limit).call()
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

app.route('/v1/protocol/getCovers').post((req, res) => { 
  let {DistributorName,OwnerAddress,ActiveCover,limit = 20, coverFormat=[]} = req.body;
  let network = DistributorName == 'nexus'? 'kovan':'rinkeby';

  _getDistributorsContract(DistributorName)
    .methods.getCovers(DistributorName, OwnerAddress, ActiveCover, limit).call()
    .then((covers)  => {  
      coverFormat = coverFormat.concat(_formatCoverResponse(DistributorName,network,covers));
      return res.send(coverFormat);
          }).catch((error) => {
            console.error('[protocol-balance] error:', error);
            return res.sendStatus(400);
          });
  });

 app.route('/v1/protocol/getCoverQuote').post((req, res) => { 
  let {
       DistributorName,
       Period,
       AmountInWei,
       ProductAddress,
       InterfaceCompliant1,
       InterfaceCompliant2} = req.body;

    _getDistributorsContract('bridge')
      .methods.getQuote(
                    DistributorName,
                    Period,
                    web3_rinkeby.utils.toBN(AmountInWei),
                    ProductAddress,
                    InterfaceCompliant1,
                    InterfaceCompliant2,
                    web3_rinkeby.utils.hexToBytes(web3_rinkeby.utils.numberToHex(500))
              ).call()
        .then((q)  => { 
                let quote = {}
                quote.distributor = DistributorName;
                quote.period= Period;
                quote.price = q[1];
                quote.totalLiquidity = q[2];
                quote.totalCoverTokens = q[3];
                
                return res.send(quote);
        }).catch((error) => {
            console.error('[protocol-balance] error:', error);                      
     });
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

 app.listen(port, () => console.log(`API server running on port ${port}`));
