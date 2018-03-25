const RpcClient = require('./rpcclient');
const config = require('config');
const client = new RpcClient(config.get('bch'));

const createWallet = async (account) => {
    if (!account) throw new Error('Account name is required.');
    return await client.execute('getaccountaddress', [account]);
};

module.exports = { createWallet };