const { connect, transactions, keyStores } = require("near-api-js");
const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

const CREDENTIALS_DIR = ".near-credentials";
const ACCOUNT = 'enoughplanet.testnet';
const RECEIVER = 'meantthought.testnet';

const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
};

sendTransactions();

async function sendTransactions() {
    const near = await connect({ ...config, keyStore });
    const account = await near.account(ACCOUNT);

    const balanceBefore = await account.getAccountBalance();
    console.log("Balance before:", balanceBefore);

    const result = await account.signAndSendTransaction({
        receiverId: RECEIVER,
        actions: [
            transactions.transfer('1000000000000000000000'),
        ],
    });

    console.log(result);

    const balanceAfter = await account.getAccountBalance();
    console.log("Balance after:", balanceAfter);
}