const Discord = require('discord.js');
const bot = new Discord.Client( );
bot.commands = new Discord.Collection( );
const fs = require('fs');
bot.mutes = require('./mutes.json');
let config = require('./botconfig.json');
let token = config.token;
let prefix = config.prefix;
let profile = require( './profile.json');
const rainbowconfig = require('./config.json');
 
const size = rainbowconfig.colors;
const rainbow =  new Array(size);
 
for( var i= 0; i< size; i++ ) {
  var red = sin_to_hex(i, 0  *  Math.PI *  2 / 3 );
  var blue = sin_to_hex(i, 1  *  Math.PI *  2 / 3 );
  var green = sin_to_hex(i, 2  *  Math.PI *  2 / 3 );
 
rainbow[ i] =  ' # ' + red + green + blue;
}
 
function sin_to_hex(i, phase) {
  var sin =  Math.sin(Math.PI / size *  2  * i + phase);
  var int =  Math.floor(sin *  127) +  128;
  var hex = int.toString(16 );
 
  return hex.length  ===  1  ? '0' + hex : hex;
}
 
let place =  0;
const servers = rainbowconfig.servers;
 
function changeColor() {
  for(let index =  0; index <  servers.length; ++ index) {
    bot.guilds.get(servers[index]).roles.find(role => role.name === rainbowconfig.roleName).setColor(rainbow[place])
 .catch(console.error);
       
    if(rainbowconfig.logging){
      console.log (`[ColorChanger] изменил цвет на ${ rainbow[place] } в server: ${ servers[index] } `);
    }
    if(place ==  (size - 1)){
 place =  0;
 } else{
 place++;
    }
  }
}
 
fs.readdir('./cmds/',(err,files)=>{
    if(err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <=0) console.log("Нет комманд для загрузки!!");
    console.log(`Загружено ${jsfiles.length} комманд`);
    jsfiles.forEach((f,i) =>{
        let props = require(`./cmds/${f}`);
        console.log(`${i+1}.${f} Загружен!`);
        bot.commands.set(props.help.name,props);
    });
});
 
bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link =>{
        console.log(link);
    });
    if(rainbowconfig.speed < 100){console.log("The minimum speed is 60.000, if this gets abused your bot might get IP-banned"); }
    bot.setInterval(() => {
        changeColor();
        }, rainbowconfig.speed);
    bot.setInterval(()=>{
        for(let i in bot.mutes){
            let time = bot.mutes[i].time;
            let guildid = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildid);
            let member = guild.members.get(i);
            let muteRole = member.guild.roles.find(r => r.name === "Muted");
            if(!muteRole) continue;
 
            if(Date.now()>= time){
                member.removeRole(muteRole);
                delete bot.mutes[i];
                fs.writeFile('./mutes.json',JSON.stringify(bot.mutes),(err)=>{
                    if(err) console.log(err);
                });
            }
        }
 
    },5000)
 
});
 
bot.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    let uid = message.author.id;
    bot.send = function (msg){
        message.channel.send(msg);
    };
    if(!profile[uid]){
        profile[uid] ={
            coins:10,
            warns:0,
            xp:0,
            lvl:1,
        };
    };
    let u = profile[uid];
 
    u.coins++;
    u.xp++;
 
    if(u.xp>= (u.lvl * 5)){
        u.xp = 0;
        u.lvl += 1;
    };
 
 
    fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{
        if(err) console.log(err);
    });
 
    let messageArray = message.content.split(" ");
    let command = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    if(!message.content.startsWith(prefix)) return;
    let cmd = bot.commands.get(command.slice(prefix.length));
    if(cmd) cmd.run(bot,message,args);
    bot.rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    bot.uId = message.author.id;
 
    bot.on('guildMemberAdd', member => {
        var channel = member.guild.channels.get('567993549719863296')
        channel.send(`Добро пожаловать на сервер, ${member}!`)
    })
});
const activities_list = [
    "Minecraft",
    "Minecraft",
    "Minecraft"
];
bot.on('ready', () => {
bot.user.setStatus('available')
setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        bot.user.setActivity("Minecraft", {type: "STREAMING", url:"https://www.twitch.tv/windlertv%22%7D"});
    }, 10000);
});  

bot.login("NTgxNTIwODc0NDkwODIyNjU4.XOlAlg.KGDanDkGYe8IsapG_idTqMMBF3E");