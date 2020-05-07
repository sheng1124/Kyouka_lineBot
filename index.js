var linebot = require('linebot');
var express = require('express');
var schedule = require('node-schedule');
var {google} = require('googleapis');
var googleAuth = require('google-auth-library');

var msgHandler = require('./msgHandler');
var fileOperate = require('./fileOperate');

var myClientSecret = fileOperate.loadJSONSync('client_secret.json');
var sheetsapi = fileOperate.loadJSONSync('sheetsapi.json');
var oauth2Client = new google.auth.OAuth2(myClientSecret.installed.client_id, myClientSecret.installed.client_secret, myClientSecret.installed.redirect_uris[0]);

process.env.TZ = 'Asia/Taipei';

var botId = {};
var kyouka;
var schedule1;
var said;

console.log();
console.log('~~~~~~~~~~~~~new~~~~~~~~~~~~~~~');

fileOperate.loadJSON('botId.json',botId,()=>{
    kyouka = linebot(botId);
    kyouka.on('message', (event)=>{
        msgHandler.msgHandler(event, kyouka, botId);
    });
    kyouka.listen('/', 8080, ()=>{
        console.log('happy');
    })
});

/*
const app = express();
const linebotParser = kyouka.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PROT || 8080, function(){
    var port = server.address().port;
    console.log('port is : ', port);
});
*/