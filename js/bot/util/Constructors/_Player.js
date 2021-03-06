var players = require("../../storage/players.json");
const fs = require("fs");
const Discord = require("discord.js")
const _MinecaftAPI = require("./_MinecraftAPI")

module.exports = class _Player {

    /**
     * 
     * @param {String} name 
     * @param {JSON} val 
     */

    constructor(val){
      
        players = require("../../storage/players.json");
      
        this.val = val;
        this.uuid = val.uuid;
        this.rank = val.rank;
        this.team = val.team;
        this.name = val.name;
        this.rank2 = val.rank2;

    }

    /**
     * 
     * @param {String} team 
     * @returns {Array<JSON>}
     */

    static filterMembers(team){
        if(players.length > 0) var outcome = players.filter(val => val.team == team || val.nick == team);
        else return null;
        return outcome;
    }

    /**
     * 
     * @param {String} rank 
     * @returns {_Player}
     */

    setRank(rank){
        let index = players.indexOf(this.val);
        players[index].rank = rank;
        fs.writeFile('./js/bot/storage/players.json', JSON.stringify(players), (err) => {
            if(err) console.log(err);
        })
        this.rank = rank;
        this.val.rank = rank;
        return this;
    }

    /**
     * 
     * @param {String} rank 
     * @returns {_Player}
     */

    setRank2(rank){
        let index = players.indexOf(this.val);
        players[index].rank2 = rank;
        fs.writeFile('./js/bot/storage/players.json', JSON.stringify(players), (err) => {
            if(err) console.log(err);
        })
        this.rank2 = rank;
        this.val.rank2 = rank;
        return this;
    }

    /**
     * @returns {_Player}
     */

    remRank(){
        return this.setRank("Member")  
    }

    /**
     * 
     * @param {String} team 
     * @returns {_Player}
     */

    setTeam(team){
        let index = players.indexOf(this.val);
        players[index].team = team;
        fs.writeFile('./js/bot/storage/players.json', JSON.stringify(players), (err) => {
            if(err) console.log(err);
        })
        this.team = team;
        this.val.team = team
        return this;
    }

    /**
     * @returns {_Player}
     */

    remTeam(){
        return this.setTeam("None");
    }

    /**
     * 
     * @param {String} name
     * @returns {JSON}
     */

    static exists(name){
        if(players.length > 0) var filtered = players.filter(val => val.name.toLowerCase() == name.toLowerCase());
        else return null;
        
        return filtered.pop();
    }
    
    static existsUuid(uuid){
        if(players.length > 0) var filtered = players.filter(val => val.uuid == uuid);
        else return null;
        
        return filtered.pop();
    }

    /**
     * 
     * @param {String} name
     * @param {String} uuid 
     */

    static addPlayer(name, uuid){
        let json = {"name": name, "uuid": uuid, "rank": "Member", team: "None", rank2: "None"}
        players.push(json);
        fs.writeFile('./js/bot/storage/players.json', JSON.stringify(players), (err) => {
            if(err) console.log(err);
        })
        return new _Player(json);
    }

    static getPlayer(name){
        let val = this.exists(name)
        if(val == null) return null;
        return new _Player(val);
    }
    
    static getPlayerUuid(uuid){
        let val = this.existsUuid(uuid)
        if(val == null) return null;
        return new _Player(val);
    }

    static getPlayerObj(){ return players; }

    static updateNames(){
        players.forEach(json => {
            _MinecaftAPI.getUuid(json.name).then(val2 => {
                if(val2 == undefined || val2.id != json.uuid){
                    _MinecaftAPI.getName(json.uuid).then(val => {
                        console.log(`${json.name} -> ${val}`);
                        var json2 = json;
                        json2.name = val;
                        players = players.filter(it => it.name != json.name)
                        players.push(json2);
                        fs.writeFile('./js/bot/storage/players.json', JSON.stringify(players), (err) => {
                            if(err) console.log(err);
                        })
                    })
                }
            })
        })
    }

}
