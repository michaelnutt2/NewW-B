const mongoose = require('mongoose')

// ES6 promises
// mongoose.Promise = global.Promise

// Connect to the databe before tests run
before(function(done){
    // Connect to mongodb
    mongoose.connect('mongodb://newsDev:newB@10.125.187.72:9002/news', {
        useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false});

    mongoose.connection.once('open', function(){
        console.log('Connection has been made...');
        done();
    }).on('error',function(error){
        console.log('Connection error:', error);
    });

});

// Drop the user collection before each test

beforeEach(function(done){
    //Drop the collection
    mongoose.connection.collections.users.drop(function(){
        done();
    });
});
