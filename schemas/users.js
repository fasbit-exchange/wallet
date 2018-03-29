const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('config');
const moment = require('moment');
const Schema = mongoose.Schema;


var tableSchema = new Schema({
    first_name: {
        type: String,
        // required: [true, 'name is required.']
    },
    last_name: String,
    password: String,
    email: {
        type: String,
        unique: [true, 'Email is already exists.'],
        required: [true, 'Email is required.']
    },
    phone: String,
    access_token: [{
        token: String,
        expiry: Date,
        platform: {
            type: String,
            enum: ['android', 'ios', 'web']
        }
    }],
    roles:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    country_code: String,
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

//descrypt password
// tableSchema.virtual('password').set(function (password) {
//     this.password = this.encryptPassword(password, this.makeSalt(config.get('bcryptSaltRounds')));
// });
tableSchema.pre('save', function (next) {
    try {
        if (this.name) {
            let explodes = this.name.split(' ');
            this.first_name = explodes[0];
            this.last_name = explodes[1] ? explodes[1] : '';
        }
        if (this.password)
            this.password = this.encryptPassword(this.password, this.makeSalt(config.get('bcryptSaltRounds')));
        this.access_token = [this.getAccessTokenObject(this.platform)];
        next();
    }
    catch (ex) {
        next(ex);
    }

});
tableSchema.virtual('name').get(function () {
    return [this.first_name, this.last_name].join(' ');
});
tableSchema.method('makeSalt', bcrypt.genSaltSync);
tableSchema.method('encryptPassword', bcrypt.hashSync);
tableSchema.method('getAccessTokenObject', function (platform) {
    let token = this.encryptPassword(new Date().toISOString(), this.makeSalt(config.get('bcryptSaltRounds')));
    let expiry = moment().add(1, 'hours').toDate();
    return { token, expiry, platform };
});
tableSchema.method('compareSync', function (password) {
    return bcrypt.compareSync(password, this.password)
})
tableSchema.static('loginUser', async function (data,role) {
    let user = await this.findOne({ 'email': data.email,'is_deleted': false,'roles':role });
    if (!user) throw new Error('Invalid email ID.');
    if (!user.compareSync(data.password)) throw new Error('Invalid Password.');
    return user;
});
tableSchema.static('getUserAndWallets', async function () {
    let user = await this
        .aggregate()
        .match({ 'is_deleted': false, 'roles': { '$ne':'admin'} })
        .lookup({ 'from': 'wallets', 'localField': '_id', 'foreignField': 'user', 'as': 'wallets' })
        .exec();
    return user;
});
module.exports = mongoose.model('User', tableSchema);

