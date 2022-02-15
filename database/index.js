const mongoose = require('mongoose');

const { dbHost, dbName, dbPort } = require('../app/config');

mongoose.connect(`mongodb+srv://root:root1234@cluster0.wdqom.mongodb.net/center_service_career?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;
module.exports = db;