const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const ranks = require('../../storage/ranks.json');
const _Player = require('../../util/Constructors/_Player');
const Discord = require('discord.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI');
const _Blacklist = require('../../util/Constructors/_Blacklist');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a player").send(message.channel);

    let playerName = args[0];

    let promise = _MinecraftApi.getUuid(playerName)

    promise.then(val => {

        if(val == false) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);
        
        if(val == undefined) return new _NoticeEmbed(Colors.ERROR, "Name update in progress.").send(message.channel);

        let player = _Player.getPlayer(val.name);

        if(player == null) player = _Player.addPlayer(val.name, val.id);

        var ranks = `${player.rank}`

        if(player.rank2 != undefined) if(player.rank2.toLowerCase() != "none") ranks += ` and ${player.rank2}`
        
        let blacklist = _Blacklist.getBlacklist(val.id);

        let embed = new Discord.RichEmbed()
            .setColor(Colors.INFO)
            .setTitle(`${val.name.replace(/_/g, "\\_")}'s Profile`)
            .addField("Team", player.team)
            .addField("Rank", ranks)
            .addField("UUID", val.id)
            .setThumbnail(`http://minotar.net/helm/${val.name}/64.png`)
            
        if(blacklist != null) embed.addField("Blacklist Status", "true");
        else embed.addField("Blacklist Status", "false");

        message.channel.send(embed);

    })

    return;

}

module.exports.help = {
    name: "player",
    aliases: [""],
    permission: Groups.DEFAULT,
    description: "Gets the profile of a player",
    usage: "player <name>"
}
