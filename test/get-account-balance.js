const { connect, keyStores } = require("near-api-js");
const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

const CREDENTIALS_DIR = ".near-credentials";
const ACCOUNT = 'enoughplanet.testnet';

const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
};

getBalance();

async function getBalance() {
    const near = await connect({ ...config, keyStore });
    const account = await near.account(ACCOUNT);

    const result = await account.getAccountBalance();
    console.log(result);
}