const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);


app.set('view engine', 'pug');
app.set('views', './views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const accountRoutes = require('./routes/account');



const errorController = require('./controllers/errors');

const User = require('./models/user');
const connectionString = "mongodb://localhost:27017/node-app";

var store = new mongoDbStore({
    uri: connectionString,
    collection: 'mySessions'
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    },
    store: store

}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            req.user = user
            next();
        })
        .catch(err => console.log(err));
})



app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);

app.use(errorController.get404Page);





mongoose.connect(connectionString)
    .then(() => {
        console.log('connected to mongodb');
        app.listen(3000);

    })
    .catch(err => console.log(err));

