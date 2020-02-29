const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _MinecraftApi =  require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');
const blacklist = require("../../storage/blacklist.json");
const Discord = require("discord.js");

module.exports.run = async (bot,message,args,cmd) => {
    
    blacklist = require('../../storage/blacklist.json');

    let list = "";

    blacklist.forEach(val => {
        let player = _Player.getPlayerUuid(val.uuid);
        list += `${player.name} - Referee: ${val.referee} - Date: ${val.start_date}\n`;
    })

    if(blacklist.length == 0) return new _NoticeEmbed(Colors.ERROR, "There are currently no active blacklists").send(message.channel);

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setTitle("Blacklists")
        .setDescription(list);

    message.channel.send(embed);

}

module.exports.help = {
    name: "blacklists",
    aliases: ["list-blacklists", "listblacklists"],
    permission: Groups.DEFAULT,
    description: "Lists all the blacklists",
    usage: "blacklists"
}
