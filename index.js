var linebot = require('linebot');
var express = require('express');
var schedule = require('node-schedule');
var {google} = require('googleapis');
var googleAuth = require('google-auth-library');

var handler = require('./handler');
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

//load(()=>{ exactive(()=>{ listen() ;}) ;}); 
fileOperate.loadJSON('botId.json',botId,()=>{
    kyouka = linebot(botId);
    kyouka.on('message', ()=>{
        msgHandle();
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

function msgHandler(event)
{
    if(event.message.type != 'text')
    {
        return;
    }

    var msg = event.message.text;
    var words = msg.split(' ');

    switch (words[0])
    {
        case '提醒我':
            var now = new Date();
            var remindTime = new Array(now.getMinutes(), now.getHours(), now.getDate(), now.getMonth() + 1, now.getFullYear(), now.getSeconds());
            
            if(words.length <= 2)
            {
                kyouka.push(botId.ownerId,"格式錯誤");
                return;
            }

            for(i = 0; i < words.length - 2; i++)
            {
                remindTime[i] = words[words.length - i - 1];
            }
              
            var tString = String(remindTime[4] + '-' + remindTime[3] + '-' + remindTime[2] + ' ' + remindTime[1] + ':' + remindTime[0] + ':' + remindTime[5] + ' +0800');
            remindTime = new Date(tString);
            
            if(now.getTime() >= remindTime.getTime())
            {
                kyouka.push(botId.ownerId,"時間錯誤 您輸入的時間為 " + tString);
                return;
            }
            
            var rs = parseInt((remindTime.getTime() - now.getTime()) / 1000), rm = parseInt(rs/60), rh = parseInt(rm/60), rd = parseInt(rh/24);
            schedule1 = schedule.scheduleJob(remindTime, function(){ kyouka.push(botId.ownerId,' 主人時間到了! '); });
            event.reply((rd).toString() + 'd ' + (rh % 24).toString() + 'hr ' +  (rm % 60).toString() + 'm ' +(rs % 60).toString() + 's ' + ' after, remind: ' + words[1]);
            break;
        
        case '系統時間?':
            var now2 = new Date();
            kyouka.push(botId.ownerId,now2.toString());
            break;
        
        case '現在時間?':
            var now3 = new Date();
            kyouka.push(botId.ownerId,now3.toLocaleString());
            break;
        
        case '取消提醒':
            kyouka.push(botId.ownerId, '提醒取消');
            schedule1.cancel();
            break;
        
        case '記住我說':
            said = words[1];
            kyouka.push(botId.ownerId, '我記住了: ' + words[1])
            break;

        case '我說過什麼?':
            kyouka.push(botId.ownerId, said);
            break;

        case '!help':
            kyouka.push(botId.ownerId, '提醒我\n系統時間?\n現在時間?\n取消提醒');
            break;
        
        default:
            event.reply('hi Master.');
            break;
    }
}




//kyouka.on('message', handler.msg);