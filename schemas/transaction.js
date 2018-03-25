const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('config');
const moment = require('moment');
const Schema = mongoose.Schema;
var tableSchema = new Schema({
    amount: Number,
    to_address: String,
    from_address: String,
    coin_type: {
        type: String,
        default: 'btc',
        enum: config.get('cryptocoins')
    },
    user: {
        Ref: 'User',
        type: Schema.Types.ObjectId
    },
    tx: String,
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

module.exports = mongoose.model('Transaction', tableSchema);

