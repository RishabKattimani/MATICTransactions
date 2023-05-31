const express = require('express');
const Web3 = require('web3');
const fs = require('fs');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const indexHTML = fs.readFileSync('index.html', 'utf8');

app.get('/', (req, res) => {
    res.send(indexHTML)
});

const providerURL = 'https://polygon-rpc.com';
const web3 = new Web3(new Web3.providers.HttpProvider(providerURL));


async function sendMaticAndLog(recipientAccountAddress) {
    try {

        const amountInMatic = 0.01;
        const amountInWei = web3.utils.toWei(amountInMatic.toString(), 'ether')

        const rootAccount = web3.eth.accounts.privateKeyToAccount('PRIVATE_KEY')

        web3.eth.accounts.wallet.add(rootAccount);
        web3.eth.defaultAccount = rootAccount.address;

        const transactionObject = {
            from: rootAccount.address,
            to: recipientAccountAddress,
            value: amountInWei,
            gas: 21000
        };

        const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, 'PRIVATE_KEY_HERE');
        const transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        console.log('Transaction was successful', transactionReceipt);
--
    } catch (error){
        console.error('error sending the transaction', error)
    }
}

app.post('/send-matic', express.urlencoded({extended: false}), (req, res) => {
    const recipientAccountAddress = req.body.recipientAddress;
    sendMaticAndLog(recipientAccountAddress)
})



app.listen(port, () => {
    console.log(`Server successfully running on http://localhost:${port}`)
})