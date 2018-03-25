const RpcClient = require('./rpcclient');
const config = require('config');
const client = new RpcClient(config.get('btc'));
const createWallet = async (coin, account) => {
    const client = new RpcClient(config.get(coin));
    return await client.execute('z_getnewaddress');
}
const getBalance = async (coin, address) => {
    if (!address) throw new Error('Address name is required.');
    if (!coin) throw new Error('Coin is required.');
    const client = new RpcClient(config.get(coin));
    return await client.execute('getbalance');
};
const sendFrom = async (coin, address, options) => {
    if (!address) throw new Error('Address name is required.');
    if (!coin) throw new Error('Coin is required.');
    if (!options.address) throw new Error('Address is required.');
    if (!options.amount) throw new Error('Amount is required.');
    const client = new RpcClient(config.get(coin));
    return await client.execute('sendfrom', [address, options.address, options.amount]);
};
const transactionStatus = async (coin, opid) => {
    if (!coin) throw new Error('Coin is required.');
    if (!coin) throw new Error('Coin is required.');
    const client = new RpcClient(config.get(coin));
    return await client.execute('z_getoperationstatus', [opid]);
}
module.exports = { createWallet, getBalance, sendFrom, transactionStatus };