const assert = require('assert');
const User = require('../models/users');

// Describe Tests
describe('Saving Records', function(){

    // Create tests
    it('saves a user record to the database', function(done){
        var user = new User({
            u_id : 'crm'
        });

        user.save().then(function(){
            assert(user.isNew === false);
            done();
        });

    });

});