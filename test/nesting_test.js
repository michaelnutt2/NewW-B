const User  = require('../models/users');
const assert =  require('assert');
const mongoose = require('mongoose');

// Describe tests

describe('Nesting records', function(){

    // create tests

    this.beforeEach(function(done){
        mongoose.connection.collections.users.drop(function(){
            done();
        });
    });

    it('Creates a user with sub-documents', function(done){

        var robin = new User({
            f_name : 'Robin', 
            favorites : [{title:'test article', author:'john doe'}] 
        });

        robin.save().then(function(){
            User.findOne({f_name:'Robin'}).then(function(record){
                //console.log(record)
                assert(record.favorites.length === 1);
                done();
            });
        });
    });

    it('Add an article to a users favorites', function(done){

        var robin = new User({
            f_name : 'Robin', 
            favorites : [{title:'test article', author:'john doe'}] 
        });

        robin.save().then(function(){
            User.findOne({f_name:'Robin'}).then(function(record){
                // add an article to the favorites array
                record.favorites.push({title:'test article 2', author:'jane doe'});
                record.save().then(function(){
                    User.findOne({f_name:'Robin'}).then(function(result){
                        assert(result.favorites.length == 2);
                        done();
                    });
                });
            });
        });
    });
});