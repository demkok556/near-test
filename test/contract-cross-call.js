const nearAPI  = require('near-api-js');
const { connect, keyStores } = nearAPI;
const path = require("path");
const homedir = require("os").homedir();
const {Base64} = require('js-base64');

//this is required if using a local .env file for private key
// require('dotenv').config();

const CREDENTIALS_DIR = ".near-credentials";

const nearAccount = 'enoughplanet.testnet';
const nearAccountPrivateKey = 'ed25519:4YV2h3ogdPgt969NqeCFaCqc2A5ubWsuP8tjtvw5yFgCs2TkhJQVLtw94ZEwJYDy5yQBKaXw2UmWThoSSzftZukT';

const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const networkId = 'testnet';

const config = {
    keyStore,
    networkId,
    nodeUrl: `https://rpc.${networkId}.near.org`,
    walletUrl: `https://wallet.${networkId}.near.org`,
    helperUrl: `https://helper.${networkId}.near.org`,
    explorerUrl: `https://explorer.${networkId}.near.org`,
    contractName: 'dev-1675678046801-59135248179293'
};

contractCrossCall();

async function contractCrossCall() {
    // connect to NEAR! :)
    const near = await connect(config);
    // create a NEAR account object
    const account = await near.account(nearAccount);

    console.log('View method');
    let response = await account.functionCall({ contractId: config.contractName, methodName: "query_greeting", args: {}, gas: "300000000000000", attachedDeposit: "0" });
    console.log(Base64.decode(response.status.SuccessValue));

    try {
        console.log('Change method');
        await account.functionCall({ contractId: config.contractName, methodName: "change_greeting", args: {new_greeting: 'test-test-2'}, gas: "300000000000000", attachedDeposit: "0" });
        console.log('Check change value');
        response = await account.functionCall({ contractId: config.contractName, methodName: "query_greeting", args: {}, gas: "300000000000000", attachedDeposit: "0" });
        console.log(Base64.decode(response.status.SuccessValue));
    } catch (err) {
        console.log('Error on change', err);
        throw err
    }
}