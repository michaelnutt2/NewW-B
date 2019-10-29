const User = require('../models/users');
const assert = require('assert');

// Describe Tests
describe('Update records', function(){

    var user

    beforeEach(function(done){
        user = new User({
            u_id : 'crm',
            pw : 'crm123',
            rank : 10
        });

        user.save().then(function(){
            done();
        });

    });

    // create tests
    it('Find and update one record from the database', function(done){

        User.findOneAndUpdate({u_id:'crm'}, {u_id:'crmV'}).then(function(){
            User.findOne({_id:user._id}).then(function(result){
                assert(result.u_id === 'crmV');
                done();
            });
        });
    });

    it('Find and update rank by 1', function(done){

        User.updateMany({}, {$inc:{rank: 1}}).then(function(){
            User.findOne({u_id:'crm'}).then(function(result){
                assert(result.rank === 11);
                done();
            });
        });
    });
});