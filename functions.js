var bd = require("./bd.js");

var commandKeys = new Array;
var commandFunc = new Object;
var commandDesc = new Object;

var serverSet = new Object;
var  lastChat = new Object;
var lastMsgSt = new Object;

var botUsers = new Object;

function addCommand(key, desc, func){
  if(commandKeys.indexOf(key) > -1)
    throw new Error ("El comando " + key + " ya existe.");
  commandKeys.push(key);
  commandFunc[key] = func;
  commandDesc[key] = desc;
}

addCommand("s", "Establece el juego con el que te quieres comunicar.", msg => {
  serverSet[msg.author.id] = msg.content.slice(3);
});

addCommand("g", "Envía un mensaje.", msg => {
  var msg1 = msg.content.slice(3);
  var from = "", to = new Array, send = "", tempUsr = "";
  var status = 0;
  for(var i of msg1){
    switch(status){
      case 0: //Esperando el nombre del que envía.
        if(i == "-") status = 0.5;
        else if(i != " ") from += i;
        break;
      case 0.5: //Comprobando si es una flecha o solo un guión.
        if(i == ">") status = 1;
        else {
          from += "-";
          if(i != " ") from += i;
        }
        break;
      case 1: //Esperando a la llave.
        if(i == "[") status = 2;
        else if(i != " ") { tempUsr += i; status = 5; }
        break;
      case 2: //Sacando a quien enviar.
        if(i == "," && tempUsr != "") { to.push(tempUsr); tempUsr = ""; }
        else if(i == "]"){
          status = 3;
          if(tempUsr != "") { to.push(tempUsr); tempUsr = ""; }
        } else if(i != " ") tempUsr += i;
        break;
      case 3: //Esperando mensaje
        if(i == ":") status = 4;
        break;
      case 5:
        if(i == ":") { to.push(tempUsr); status = 4; }
        else if(i != " ") tempUsr += i;
        break;
      default: //Coger mensaje
        send += i;
    }
  }
  
  msg.delete();
  if(status != 4){
    msg.channel.send("USO:\n```\ng/ De -> [A1, A2, An]: mensaje\n```\n");
  } else if(serverSet[msg.author.id] == undefined){
    msg.channel.send("No has especificado en qué juego estás. Para hacerlo, ejecuta el comando:\n```\ns/ **NombreDelJuego**\n```");
  } else {
    var theGame = bd.partidas[serverSet[msg.author.id]];
    if(msg.author.id != theGame.master && theGame.playerMap[from.toLowerCase()] != msg.author.id){
      msg.channel.send("No tienes ningún personaje en la partida **" + serverSet[msg.author.id] + "** llamado **" + from + "**.");
    } else sendMessage(msg, from, to, serverSet[msg.author.id], send);
  }
});

addCommand("r", "Envía un mensaje al último destinatario al que has enviado.", msg => {
  msg.delete();
  if(lastMsgSt[msg.author.id] == undefined) msg.reply("No has enviado ningún mensaje desde que he sido iniciado.");
  else sendMessage(msg, lastMsgSt[msg.author.id].f, lastMsgSt[msg.author.id].t, lastMsgSt[msg.author.id].s, msg.content.slice(3));
});

function sendMessage(msg, from, to, myServer, send){
  var theGame = bd.partidas[myServer];
  var TSObj = new Object;
  TSObj[theGame.master] = true;

  if(to.indexOf(from) < 0) to.push(from);
  for(var i of to){
    if(theGame.playerMap[i.toLowerCase()] == undefined){
      msg.channel.send("No existe el personaje llamado **"+i+"** en la partida **" + myServer + "**.");
      return;
    } else TSObj[theGame.playerMap[i.toLowerCase()]] = true;
  }
  for(var i of Object.keys(TSObj)){
    lastMsgSt[msg.author.id] = {f: from, t: to, s: myServer};
    if(botUsers[i] == undefined){
      if(client.users.get(i) == undefined) msg.channel.send("No he podido enviar el mensaje a <@" + i + ">.");
      else {
        client.users.get(i).send(from + " -> [" + to + "]: \n```\n" + send + "\n```\n");
        botUsers[i] = msg.guild.members.get(i);
      }
    } else botUsers[i].send(from + " -> [" + to + "]: \n```\n" + send + "\n```\n");
  }         
}

module.exports = new Object;
module.exports.keys = commandKeys;
module.exports.func = commandFunc;
module.exports.desc = commandDesc;