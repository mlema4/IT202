//importing Twitter JS Client dependancy
module.exports = require('./lib/Twitter');


// VARIBALES
var express = require('express');
var OAuth2 = require('oauth').OAuth2; 
var https = require('https');
var app = express();
var bodyParser = require('body-parser');
var error = function (err, response, body) {
    console.log('ERROR [%s]', JSON.stringify(err));
};
var success = function (data) {
    console.log('Data [%s]', data);
};
var config = {
    "consumerKey": "XXX",
    "consumerSecret": "XXX",
    "accessToken": "XXX",
    "accessTokenSecret": "XXX"
};
var twitter = new module.exports.Twitter(config);
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server running on port ' + port);
});

//TWITTER AUTHENICATION
var token = null;
var oauth2 = new OAuth2(config.consumerKey, config.consumerSecret, 'https://api.twitter.com/', null, 'oauth2/token', null);
oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
  }, function (e, access_token) {
        token = access_token;
});


//APP CONFIG
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//public is the folder your angular application is in.
//This allows your angular app to handle routing when you hit the URL root (/)
app.use(express.static('public'));


//ENDPOINTS

//unauthenticated request
app.post('/twitter/user', function (req, res) {
    var username = req.body.username;
    var data = twitter.getUser({ screen_name: username}, function(error, response, body){
        res.send({
            "error" : error
        });
    }, function(data){
        res.send({
            result : {
                "userData" : data
            }
        });
    });

});

//authenticated request
app.post('/twitter/user/github', function (req, res) {
        var username = req.body.username;
        var options = {
            hostname: 'api.twitter.com',
                    //this path will search for tweets from specified user 
                    //with "github" mentioned in them
            path: '/1.1/search/tweets.json?q=github%3A' + username,
            headers: {
                Authorization: 'Bearer ' + token
            }
        };

        https.get(options, function(result){
          var buffer = '';
          result.setEncoding('utf8');
          result.on('data', function(data){
            buffer += data;
          });
          result.on('end', function(){
            var tweets = JSON.parse(buffer);
            res.send(tweets);
          });
        });

});