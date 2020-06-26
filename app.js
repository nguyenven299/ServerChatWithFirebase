var http = require('http')
var fs = require('fs');
var { google } = require('googleapis');
var PROJECT_ID = 'appchat-44456';
var HOST = 'fcm.googleapis.com';
var PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
var SCOPES = [MESSAGING_SCOPE];

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var request = require('request');
var port = 8003;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
router.post('/send', function (req, res) {
    getAccessToken().then(function (access_token) {
        var title = req.body.title;
        var body = req.body.body;
        var token = req.body.token;
        request.post({
            headers:
            {
                Authorization: 'Bearer ' + access_token
            },
            url: "https://" + HOST + PATH,
            body: JSON.stringify(
                {
                    "message": {
                        "topic": "aMQEp5TDrPbPiwN10LVVVNYRSUh1",
                        "notification": {
                            "title": title,
                            "body": body,
                        }
                    }
                }
            )
        }, function (error, response, body) {
            res.end(body);
            console.log(body);
        });

    });

});

app.use('/api', router);
app.listen(port, function () {
    console.log("server is listening" + port);
});

/**
 * Get a valid access token.
 */
// [START retrieve_access_token]

function getAccessToken() {
    return new Promise(function (resolve, reject) {
        var key = require('./services-account.json');
        var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}
