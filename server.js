//to view es6 capabilities see http://node.green/
//node v8-options es6 module syntax currently under development (2016/06/25)
let path = require('path');
let express = require('express');
let expressHbs = require('express-handlebars');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let routes = require('./routes/index');
let session = require('express-session')
let app = express();
let mongoose = require('mongoose');
let config = require('config');
mongoose.connect(config.get('dbConnection'));

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

//view engine & main template
app.engine('.hbs', expressHbs({
    defaultLayout: 'template',
    extname: '.hbs',
    helpers: {
        eq: function (val, val2, options) {
            if (val === val2) {
                return options.fn(this);
                // return block(this)
            }
        },
        amountInArray: function (arr, coin, options) {
            if(!arr || !Array.isArray(arr)) return 0;
            // console.log(arr, coin)
            arr.filter((item) => {
                console.log(item.coin_type === coin)
                item.coin_type === coin;
            });
            // console.log(coinArray)
            return arr[0] && arr[0].confirmed_amount || 0;
        }
    }
}));
app.set('view engine', '.hbs');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    cookie: {}
}));
app.use('/public', express.static('public'));

//router
app.use('/', routes);

//server
app.listen(app.get('port'), () => console.log('Listening on http://localhost:' + app.get('port')));
