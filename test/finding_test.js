const User = require('../models/users');
const assert = require('assert');

// Describe Tests
describe('Finding records', function(){

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
    it('Finds one record from the database', function(done){

        User.findOne({u_id:'crm'}).then(function(result){
            assert(result.u_id === 'crm');
            done();
        });
    });

    it('Finds one record by ID from the database', function(done){
        
        User.findOne({_id:user._id}).then(function(result){
            assert(result._id.toString() === user._id.toString());
            done();
        });
    });

});