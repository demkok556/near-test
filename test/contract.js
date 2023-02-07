const nearAPI  = require('near-api-js');
const { connect, keyStores } = nearAPI;
const path = require("path");
const homedir = require("os").homedir();

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
    contractName: 'dev-1675672622393-86258776777523'
};

createTransaction();

async function createTransaction() {
    // connect to NEAR! :)
    const near = await connect(config);
    // create a NEAR account object
    const account = await near.account(nearAccount);

    const contract = new nearAPI.Contract(
        account, // the account object that is connecting
        config.contractName,
        {
            // name of contract you're connecting to
            viewMethods: ["get_greeting"], // view methods do not change state but usually return a value
            changeMethods: ["set_greeting"], // change methods modify state
        }
    );

    console.log('View method');
    let response = await contract.get_greeting();
    console.log(response);

    try {
        console.log('Change method');
        await contract.set_greeting({greeting: 'test-test'}, 300000000000000);
        console.log('Check change value');
        response = await contract.get_greeting();
        console.log(response);
    } catch (err) {
        console.log('Error on change', err);
        throw err
    }
}