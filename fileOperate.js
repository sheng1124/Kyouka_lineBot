var path = require('path');
var fs = require('fs');

async function loadToJSON(path)
{
    return new Promise((resolve, reject)=>{
        fs.readFile(path, (err, data)=>{
            if(err){
                console.log('Error loading file:', path);
                reject(err);
            }else{
                resolve(JSON.parse(data));
            }
        });
    });
}


async function writeToJSON(path, data)
{
    return new Promise((resolve, reject)=>{
        fs.write(path, JSON.stringify(data), (err)=>{
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
}

function loadJSON(filename, data_, callback)
{
    if(!data_)
    {
        console.log('error! parameter_2 is undefined, please set {}');
        return;
    }
    for(var e in data_)
    {
        delete data_[e];
    }

    var file = path.join(__dirname,'data/' ,filename);
    
    fs.readFile(file, 'utf-8',(err, data)=>{
        if(err)
        {
            console.log(err);
        }
        else if(data)
        {
            //console.log('data_parse');
            JSON.parse(data,(a,b)=>{
                if(a)
                {
                    data_[a.toString()] = b;
                }
           });
        }
        setTimeout(()=>{
            //console.log('callback');
            if(callback)
            {
                callback();
            }
        },0);
    });
}

function loadWriteJSON(filename, data_, callback)
{
    var file = path.join(__dirname,'data/' ,filename);
    var temp = {};

    loadJSON(filename, temp, ()=>{
        addJSON(temp, data_);
        fs.writeFile(file, JSON.stringify(temp), ()=>{
            if(callback)
            {
                callback();
            }
        });
    });
}

function addJSON(data_, input)
{
    for(var e in input)
    {
        data_[e] = input[e];
    }
}

function loadJSONSync(filename)
{
    var file = path.join(__dirname,'data/' ,filename);
    
    var data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
}

function writeDataSync(filename, text, _flag)
{
    var file = path.join(__dirname, 'data/', filename);
    console.log('write path:', file);

    fs.writeFileSync(file, text, { flag : _flag });

    if(text[text.length - 1] != '\n')
    {
        fs.writeFileSync(file, '\n', { flag : 'a+' });
    }
}

function writeJSONSync(filename, text)
{
    var file = path.join(__dirname, 'data/', filename);
    console.log('write path:', file);

    fs.writeFileSync(file, JSON.stringify(text), { flag : 'w' });
}

function printJ(item)
{
    for(var i in item)
    {
        console.log('key:', i ,', context:', item[i]);
    }
}

function itemCMP(itemA, itemB)
{
    //console.log(itemA);
    //console.log(itemB);

    if(Object.keys(itemA).length !== Object.keys(itemB).length)
    {
        console.log('length not same',Object.keys(itemA).length,Object.keys(itemB).length);
        console.log(Object.keys(itemA));
        return false;
    }

    var ca = 0;   
    for(var i in itemA)
    {
        var cb = 0;
        for(var j in itemB)
        {
            if(ca === cb && (i !== j || itemA[i] !== itemB[j]))
            {
                console.log('A[', i , '] =', itemA[i], '!= B[',j,'] =',itemB[j] );
                return false;
            }
            else if(ca === cb && (i === j && itemA[i] === itemB[j]))
            {
                 console.log('A[', i , '] =', itemA[i], '== B[',j,'] =',itemB[j] );
            }
            else if(cb > ca)
            {
                break;
            }
            cb = cb + 1;
        }
        ca = ca + 1; 
    }
    return true;
}

module.exports.loadToJSON = loadToJSON;
module.exports.loadJSON = loadJSON;
module.exports.loadJSONSync = loadJSONSync;
module.exports.printJ = printJ;
module.exports.itemCMP = itemCMP;
module.exports.loadWriteJSON = loadWriteJSON;
module.exports.writeDataSync = writeDataSync;
module.exports.writeJSONSync = writeJSONSync;
module.exports.addJSON = addJSON;