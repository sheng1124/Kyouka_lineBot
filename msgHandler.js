const ShOp = require('./sheetOperate'); 

class EventHandler{
    constructor(_bot, _botId) {
        this.bot = _bot;
        this.botId = _botId;
    }

    handle(_event) {
        this.event = _event;
        this.eventType = _event.message.type;
        let selectTypeFunc = this[this.eventType];
        if(typeof(selectTypeFunc) === 'function'){
            this[this.eventType]();
            this.command();
        }
        else{
            console.error('handler type error');
            return;
        }
    }

    text() {
        const words = this.event.message.text.split(' ');
        this.command = new CommandList()[words[0]];
        if(typeof(this.command) !== 'function'){
            this.command = new TextHandler().defaultCommand;
        }
    }
}

class TextHandler {
    defaultCommand(){
        this.event.reply('你好');
    }
}

class CommandList{
    constructor(){
        this['系統時間?'] = function(){
            this.event.reply(new Date().toString());
            //this.bot.push(this.botId.ownerId, now.toString());
        }

        this['現在時間?'] = function(){
            this.event.reply(new Date().toLocaleString());
        }

        this['提醒我'] = function(){
            //
        }

        this['列出所有命令'] = function(){
            const allCommand = new CommandList();
            let commandList = '';
            for(let key in allCommand){
                if(typeof(allCommand[key]) === 'function'){
                    commandList = commandList.concat(String(key),'\n');
                }
            }
            console.log(commandList);
            this.event.reply(commandList);
        }
    }
}

function msgHandler(event, bot, botId)
{
    if(event.message.type != 'text')
    {
        return;
    }   

    var pack =
    {
        _botId : botId,
        _bot : bot
    };

    new Handler(event, pack).execute();
}

function Handler(event, pack)
{
    this.words = event.message.text.split(" ");
    this.bot = pack._bot;
    this.botId = pack._botId;

    this.execute = function()
    {
        var command = this.words[0];
        if(this[command])
        {
            this[command]();
        }
        else
        {
            this.defaultAction();
        }
    }

    this.defaultAction = function()
    {
        event.reply('hi Master.');
    }

    this['提醒我'] = function()
    {
        var now = new Date();
        var remindTime = new Array(now.getMinutes(), now.getHours(), now.getDate(), now.getMonth() + 1, now.getFullYear(), now.getSeconds());
        if(this.words.length <= 2)
        {
            this.bot.push(this.botId.ownerId,"格式錯誤");
            return;
        }

        for(i = 0; i < this.words.length - 2; i++)
        {
            remindTime[i] = this.words[words.length - i - 1];
        }
              
        var tString = String(remindTime[4] + '-' + remindTime[3] + '-' + remindTime[2] + ' ' + remindTime[1] + ':' + remindTime[0] + ':' + remindTime[5] + ' +0800');
        remindTime = new Date(tString);
            
        if(now.getTime() >= remindTime.getTime())
        {
            this.bot.push(this.botId.ownerId,"時間錯誤 您輸入的時間為 " + tString);
            return;
        }
            
        var rs = parseInt((remindTime.getTime() - now.getTime()) / 1000), rm = parseInt(rs/60), rh = parseInt(rm/60), rd = parseInt(rh/24);
        //schedule1 = schedule.scheduleJob(remindTime, function(){ kyouka.push(botId.ownerId,' 主人時間到了! '); });
        event.reply((rd).toString() + 'd ' + (rh % 24).toString() + 'hr ' +  (rm % 60).toString() + 'm ' +(rs % 60).toString() + 's ' + ' after, remind: ' + this.words[1]);
    }

    this['系統時間?'] = function()
    {
        var now = new Date();
        this.bot.push(this.botId.ownerId,now.toString());
    }

    this['現在時間?'] = function()
    {
        var now = new Date();
        this.bot.push(this.botId.ownerId,now.toLocaleString());
    }

    this['列出所有命令'] = function()
    {
        var s = '';
        for(var keys in this)
        {
            if(typeof(this[keys]) == "function" && keys !== "execute" && keys != "defaultAction")
            {
                s = s.concat(String(keys),'\n');
            }
        }
        event.reply(s);
    }
}

module.exports.msgHandler = EventHandler;

/*
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
*/