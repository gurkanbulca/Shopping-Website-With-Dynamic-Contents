let _db;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://localhost/node-app',{ useNewUrlParser: true })
        .then(client => {
            console.log('connected');
            _db = client.db();
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
}
const getdb = () =>{
    if(_db){
        return _db;
    }
    throw 'No Database';
}

exports.mongoConnect =  mongoConnect;
exports.getdb = getdb;