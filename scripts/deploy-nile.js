// Deployment script for SmartExchangeRouter on Nile testnet
// Run with: node scripts/deploy-nile.js

require('dotenv').config();
const { TronWeb } = require('tronweb');
const { nile } = require('./config.js');

// Load private key from environment variable
const privateKey = process.env.PRIVATE_KEY_NILE;

if (!privateKey) {
    console.error('❌ Error: PRIVATE_KEY_NILE environment variable not set');
    console.log('\nTo set it, run:');
    console.log('export PRIVATE_KEY_NILE="your_private_key_here"');
    process.exit(1);
}

// Initialize TronWeb
const tronWeb = new TronWeb({
    fullHost: nile.rpcURL,
    privateKey: privateKey
});

async function deploySmartExchangeRouter() {
    try {
        console.log('🚀 Deploying SmartExchangeRouter to Nile testnet...');
        console.log('📍 Network:', nile.rpcURL);

        const address = tronWeb.address.fromPrivateKey(privateKey);
        console.log('👤 Deploying from:', address);

        // Get account balance
        const balance = await tronWeb.trx.getBalance(address);
        console.log('💰 Balance:', tronWeb.fromSun(balance), 'TRX');

        if (balance < 1000000000) { // Less than 1000 TRX
            console.warn('⚠️  Warning: Low balance. You may need more TRX for deployment.');
        }

        // Load compiled contract
        const fs = require('fs');
        const path = require('path');
        const contractPath = path.join(__dirname, '../build/contracts/SmartExchangeRouter.json');

        if (!fs.existsSync(contractPath)) {
            console.error('❌ Contract not compiled. Run: tronbox compile');
            process.exit(1);
        }

        const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

        console.log('\n📝 Constructor parameters:');
        console.log('  V2 Router:', nile.routerV2);
        console.log('  V1 Factory:', nile.routerV1);
        console.log('  PSM USDD:', nile.psmUsddToken);
        console.log('  V3 Router:', nile.routerV3);
        console.log('  WTRX:', nile.wtrxToken);

        // Deploy contract
        console.log('\n⏳ Deploying contract...');
        const contract = await tronWeb.contract().new({
            abi: contractJson.abi,
            bytecode: contractJson.bytecode,
            feeLimit: 10000000000, // 10,000 TRX
            callValue: 0,
            userFeePercentage: 100,
            parameters: [
                nile.routerV2,
                nile.routerV1,
                nile.psmUsddToken,
                nile.routerV3,
                nile.wtrxToken
            ]
        });

        const deployedAddress = contract.address;
        console.log('\n✅ SmartExchangeRouter deployed successfully!');
        console.log('📍 Contract address:', deployedAddress);
        console.log('🔗 View on Nile Scan: https://nile.tronscan.org/#/contract/' + deployedAddress);

        // Verify contract is deployed
        const code = await tronWeb.trx.getContract(deployedAddress);
        if (code && code.bytecode) {
            console.log('✅ Contract bytecode verified on chain');
        }

        // Save deployment info
        const deploymentInfo = {
            network: 'nile',
            contractAddress: deployedAddress,
            deployedAt: new Date().toISOString(),
            deployedBy: address,
            constructorArgs: {
                routerV2: nile.routerV2,
                routerV1: nile.routerV1,
                psmUsdd: nile.psmUsddToken,
                routerV3: nile.routerV3,
                wtrx: nile.wtrxToken
            }
        };

        const deploymentPath = path.join(__dirname, '../deployments-nile.json');
        fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
        console.log('📄 Deployment info saved to:', deploymentPath);

        return deployedAddress;

    } catch (error) {
        console.error('\n❌ Deployment failed:', error.message);
        if (error.error) {
            console.error('Error details:', error.error);
        }
        throw error;
    }
}

// Run deployment
deploySmartExchangeRouter()
    .then(() => {
        console.log('\n🎉 Deployment complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Deployment error:', error);
        process.exit(1);
    });
