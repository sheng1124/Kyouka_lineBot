const linebot = require('linebot');
const msgHandler = require('./msgHandler');
const fs = require('./fileOperate');
process.env.TZ = 'Asia/Taipei';

main();

function main()
{
    fs.loadToJSON('./data/botId.json').then((botId)=>{
        const kyouka = linebot(botId);
        kyouka.on('message', (event)=>{
            new msgHandler.msgHandler(kyouka, botId).handle(event);
        });
        kyouka.listen('/', 8080, ()=>{
            console.log('line bot listen');
        });
    }).catch((err)=>{
        console.log(err);
    });
}

/*
let botId = {};
let kyouka;

console.log('\n~~~~~~~~~~~~~new~~~~~~~~~~~~~~~');

fileOperate.loadJSON('botId.json',botId,()=>{
    kyouka = linebot(botId);
    kyouka.on('message', (event)=>{
        msgHandler.msgHandler(event, kyouka, botId);
    });
    kyouka.listen('/', 8080, ()=>{
        console.log('happy');
    })
});
*/