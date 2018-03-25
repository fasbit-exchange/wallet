const RpcClient = require('./rpcclient');
const config = require('config');

const createWallet = async (coin) => {
    if (!coin) throw new Error('Coin is required.');
    const client = new RpcClient(config.get(coin));
    return await client.execute('getnewaddress');
};
const createMultiSigWallet = async (coin, account) => {
    if (!account) throw new Error('Account name is required.');
    if (!coin) throw new Error('Coin is required.');
    const client = new RpcClient(config.get(coin));
    let keys = [];
    keys.push(await createWallet(coin));
    keys.push(await createWallet(coin));
    // client.execute('setaccount', [account, keys[0]])
    // client.execute('setaccount', [account, keys[1]])
    return await client.execute('addmultisigaddress', [2, keys, account]);
};
const getBalance = async (coin, account) => {
    if (!account) throw new Error('Account name is required.');
    if (!coin) throw new Error('Coin is required.');
    const client = new RpcClient(config.get(coin));
    return await client.execute('getreceivedbyaccount', [account]);
};
const sendFrom = async (coin, account, options) => {
    if (!account) throw new Error('Account name is required.');
    if (!coin) throw new Error('Coin is required.');
    if (!options.address) throw new Error('Address is required.');
    if (!options.amount) throw new Error('Amount is required.');
    const client = new RpcClient(config.get(coin));
    console.log([account, options.address, options.amount])
    return await client.execute('sendfrom', [account, options.address, options.amount]);
}
module.exports = { createWallet, getBalance, sendFrom, createMultiSigWallet };