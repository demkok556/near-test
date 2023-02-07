const nearAPI  = require('near-api-js');
const sha256 = require('js-sha256');
const { connect, KeyPair, keyStores, utils, transactions } = nearAPI;
const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

//this is required if using a local .env file for private key
// require('dotenv').config();

const CREDENTIALS_DIR = ".near-credentials";

const sender = 'enoughplanet.testnet';
const senderPrivateKey = 'ed25519:4YV2h3ogdPgt969NqeCFaCqc2A5ubWsuP8tjtvw5yFgCs2TkhJQVLtw94ZEwJYDy5yQBKaXw2UmWThoSSzftZukT';
const receiver = 'meantthought.testnet';

const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

// converts NEAR amount into yoctoNEAR (10^-24) using a near-api-js utility
const amount = utils.format.parseNearAmount('1.5');

const networkId = 'testnet';

const config = {
    keyStore,
    networkId,
    nodeUrl: `https://rpc.${networkId}.near.org`,
    walletUrl: `https://wallet.${networkId}.near.org`,
    helperUrl: `https://helper.${networkId}.near.org`,
    explorerUrl: `https://explorer.${networkId}.near.org`
};

createTransaction();

async function createTransaction() {
    // connect to NEAR! :)
    const near = await connect(config);
    // create a NEAR account object
    const senderAccount = await near.account(sender);

    const keyPair = KeyPair.fromString(senderPrivateKey);
    const publicKey = keyPair.getPublicKey();

    const provider = near.connection.provider;

    const accessKey = await provider.query(
        `access_key/${senderAccount.accountId}/${publicKey.toString()}`,
        ""
    );
    const nonce = ++accessKey.nonce;

    const actions = [
        transactions.transfer(amount),
    ];

    const recentBlockHash = utils.serialize.base_decode(
        accessKey.block_hash
    );

    try {
        const transaction = transactions.createTransaction(
            senderAccount.accountId,
            publicKey,
            receiver,
            nonce,
            actions,
            recentBlockHash
        );
        console.log(transaction);

        const serializedTx = utils.serialize.serialize(
            nearAPI.transactions.SCHEMA,
            transaction
        );
        const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx));
        const signature = keyPair.sign(serializedTxHash);

        const signedTransaction = new transactions.SignedTransaction({
            transaction,
            signature: new nearAPI.transactions.Signature({
                keyType: transaction.publicKey.keyType,
                data: signature.signature,
            }),
        });
        console.log(signedTransaction);
        // encodes transaction to serialized Borsh (required for all transactions)
        const signedSerializedTx = signedTransaction.encode();
        console.log(signedSerializedTx.toString('base64')); // RAW FOR SEND
    } catch(error) {
        // return an error if unsuccessful
        console.log(error);
    }
}