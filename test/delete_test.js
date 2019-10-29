const User = require('../models/users');
const assert = require('assert');

// Describe Tests
describe('Deleting records', function(){

    var user

    beforeEach(function(done){
        user = new User({
            u_id : 'crm',
            pw : 'crm123'
        });

        user.save().then(function(){
            done();
        });

    });

    // create tests
    it('Find and remove one record from the database', function(done){

        User.findOneAndRemove({u_id:'crm'}).then(function(){
            User.findOne({u_id:'crm'}).then(function(result){
                assert(result === null);
                done();
            });
        });
    });
});