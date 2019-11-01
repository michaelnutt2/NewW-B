var Article = require('../models/articles');
var Tags = require('../models/tags');
var myUsers = require('../modules/myUsers');

var myUsersInstance = new myUsers()
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var async = require('async');

function findTags(callback) {
    Tags.find()
    .sort([['tag', 'ascending']])
    .exec(callback);
}

exports.index = function(req, res, next) {
    async.parallel({
        tags: function(callback) {
            findTags(callback);
        },
        list_articles: function(callback) {
            Article.find()
            .exec(callback);
        }
    }, function(err, result) {
        if(err) { return next(err);}
        res.render('article_view', {title: 'NewW-B News Aggregator', tag_list: result.tags, article_list: result.list_articles, name: "/"})
    });
};

exports.tag_detail = function(req, res, next) {
    async.parallel({
        tag: function(callback) {
            Tags.findById(req.params.id)
            .exec(callback);
        },
        list_articles: function(callback) {
            var tag_promise = new Promise(function(resolve, reject) {
                Tags.findById(req.params.id)
                .exec(function(err, tag){
                    err
                        ? reject(err)
                        : resolve(tag);
                });
            });
            tag_promise.then(function(tag) {
                console.log(tag.tag);
                Article.find({tags: tag.tag})
                .exec(callback);
            });
        },
        list_tags: function(callback){
            findTags(callback);
        }
    }, function(err, results) {
        if(err) { return next(err);}
        if(results.tag == null) {
            var err = new Error('Tag not found');
            err.status = 404;
            return next(err);
        }
        res.render('article_view', {title: results.tag.tag, tag: results.tag, article_list: results.list_articles, tag_list: results.list_tags, name: results.tag.tag});
    });
};

exports.article_detail = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Display for individual article');
};

// Display login form on GET.
// exports.login_get = function(req, res, next) {       
//     res.render('login_form', { title: 'Login'});
// };

exports.login = [
    // validate fields
    body('username').isLength({ min: 1 }).trim().withMessage('username not specified')
    .isAlphanumeric().withMessage('username not valid'), 
    body('password').isLength({ min: 1 }).trim().withMessage('password not specified')
    .isAlphanumeric().withMessage('passwords not valid'),

    // Sanitize fields.
    sanitizeBody('user_name').escape(),
    sanitizeBody('passwords').escape(),
    (req, res, next) => {
        console.log(body)

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            // res.render('login_form', { title: 'Login', username: req.body, errors: errors.array() });
            res.render(errors.array());
            return;
        }
        else {
            // Data from form is valid.

            ///Create an user and password variable to verify login.
            var user = req.body.username;
            var password = req.body.password;

            myUsersInstance.verifyUser(user, password).then(function(valid){
                valid 
                    ? console.log('User Verified')
                    : console.log('User not verified')
            });

            myUsersInstance.verifyPassword(user, password).then(function(valid){
                valid 
                    ? console.log('Password Verified')
                    : console.log('Password not verified')
            });

        };
    }
];