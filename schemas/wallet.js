const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('config');
const moment = require('moment');
const Schema = mongoose.Schema;
var tableSchema = new Schema({
    type: {
        type: String,
        default: 'normal',
        enum: config.get('wallettypes')
    },
    redeemScript: String,
    user: {
        Ref: 'User',
        type: Schema.Types.ObjectId
    },
    name: String,
    main_address: String,
    addresses: [String],
    coin_type: {
        type: String,
        default: 'btc',
        enum: config.get('cryptocoins')
    },
    confirmed_amount: {
        default: 0,
        type: Number
    },
    unconfirmed_amount: {
        default: 0,
        type: Number
    },
    created_at: { type: Date, default: Date.now, index: true },
    updated_at: { type: Date, default: Date.now, index: true },
}, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toObject: {
            virtuals: true
        }
        , toJSON: {
            virtuals: true
        }
    });

module.exports = mongoose.model('Wallet', tableSchema);

