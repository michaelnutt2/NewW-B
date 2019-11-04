var myUsers = require('../modules/myUsers');
var myUsersInstance = new myUsers()
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


// Display login form on GET.
exports.login_get = function(req, res, next) {       
  res.render('navbar', {title: "Login Form"});
};

// Evalute login details
exports.login_post = [
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
           res.render('navbar', { title: 'Login Form', errors: errors.array() });
           return;
       }
       else {
           // Data from form is valid.

           ///Create an user and password variable to verify login.
           var user = req.body.username;
           var password = req.body.password;

           myUsersInstance.verifyUser(user, password).then(function(user_check){
                if (user_check){
                    myUsersInstance.verifyPassword(user, password).then(function(pass_check){
                    if (pass_check){
                        //? res.send({title: "Login Form", user: 'Hello ' + user})
                        myUsersInstance.getUserName(user).then(function(f_name){
                            console.log(f_name)
                            res.cookie('userData', f_name);
                            res.redirect('/');
                        });
                    }else{
                        res.send('Password not verified')
                    }
                    });
                } else{
                    res.send('User not verified')
                };
            });
       };

   }
];

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