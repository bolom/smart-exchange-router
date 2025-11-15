/**
 * Deployment script for SmartExchangeRouter with swapExactOutput support
 * This is a redeployment to fix the _constructFeesSlice bug
 */

const SmartExchangeRouter = artifacts.require("SmartExchangeRouter");

// Nile testnet addresses
const NILE_CONFIG = {
  routerV2: 'TMn1qrmYUMSTXo9babrJLzepKZoPC7M6Sy',
  routerV1: 'TXFouUxm4Qs3c1VxfQtCo4xMxbpwE3aWDM',
  psmUsddToken: 'TWvPn9LWmNd1DMtt52yKHhNJazi7sDfcUq',
  routerV3: 'TFkswj6rUfK3cQtFGzungCkNXxD2UCpEVD',
  wtrxToken: 'TYsbWxNnyTgsZaTFaue9hqpxkU3Fkco94a'
};

module.exports = function (deployer, network) {
  console.log(`\n🚀 Redeploying SmartExchangeRouter (with swapExactOutput fix) to ${network}...`);

  if (network === 'nile') {
    console.log('📋 Constructor parameters:');
    console.log('   V2 Router:', NILE_CONFIG.routerV2);
    console.log('   V1 Factory:', NILE_CONFIG.routerV1);
    console.log('   PSM USDD:', NILE_CONFIG.psmUsddToken);
    console.log('   V3 Router:', NILE_CONFIG.routerV3);
    console.log('   WTRX:', NILE_CONFIG.wtrxToken);

    // Force redeployment with updated code
    return deployer.deploy(
      SmartExchangeRouter,
      NILE_CONFIG.routerV2,    // _v2Router
      NILE_CONFIG.routerV1,    // _v1Factory
      NILE_CONFIG.psmUsddToken, // _psmUsdd
      NILE_CONFIG.routerV3,    // _v3Router
      NILE_CONFIG.wtrxToken    // _wtrx
    ).then(function(instance) {
      console.log('✅ SmartExchangeRouter deployed successfully');
      console.log('📊 Instance object keys:', Object.keys(instance));
      console.log('📊 Instance type:', typeof instance);

      // Try different ways to get the address
      const address = instance.address || instance.contract?.address || instance._address;

      if (address) {
        console.log('🔗 New Contract Address:', address);
        console.log('🔗 View on NileScan: https://nile.tronscan.org/#/contract/' + address);
      } else {
        console.log('⚠️  Contract address not found in instance object');
        console.log('📊 Instance:', JSON.stringify(instance, null, 2).substring(0, 500));
      }

      console.log('💡 Make sure to update any references to the old contract address!');
      return instance;
    }).catch(function(error) {
      console.error('❌ Deployment failed:', error);
      throw error;
    });
  } else {
    console.log('⚠️  Network not configured. Skipping deployment.');
  }
};
