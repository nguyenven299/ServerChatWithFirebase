var { google } = require('googleapis')
var MESSAGING_SCOPE = "'https://www.googleapis.com/auth/firebase.messaging"
var SCOPES = [MESSAGING_SCOPE];
var http = require('http')

// function getAccessToken() {
//     return new Promise(function (resolve, reject) {
//         var key = require("./services-account.json")
//         var jwtClient = new google.auth.JWT(
//             key.client_email,
//             null,
//             key.private_key,
//             SCOPES,
//             null
//         );
//         jwtClient.authorize(function (err, token) {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(token.access_token)
//         });

//     });
// }

// getAccessToken().then(function (access_token) {
//     console.log(access_token);
// })
// const http = require('http');


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
                        "token": token,
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
})

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
// // exports.api = functions.http.onRequest(app);
// getAccessToken().then(function (access_token) {
//         console.log(access_token);
//     }); 
//     // test token

// http.createServer(function(req, res) {
//     getAccessToken().then(function (access_token) {
//         res.end(access_token);
//     });
// }).listen(8003); 
// // test local host

console.log("server start")

// function sendFcmMessage(fcmMessage) {
//     getAccessToken().then(function (accessToken) {
//         var options = {
//             hostname: HOST,
//             path: PATH,
//             method: 'POST',
//             // [START use_access_token]
//             headers: {
//                 'Authorization': 'Bearer ' + accessToken
//             }
//             // [END use_access_token]
//         };

//         var request = https.request(options, function (resp) {
//             resp.setEncoding('utf8');
//             resp.on('data', function (data) {
//                 console.log('Message sent to Firebase for delivery, response:');
//                 console.log(data);

//             });

//             request.on('error', function (err) {
//                 console.log('Unable to send message to Firebase');
//                 console.log(err);
//             });

//             request.write(JSON.stringify(fcmMessage));
//             request.end();
//         });
//     });
// }

