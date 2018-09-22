/*
mensagerbo_credentials.js es un fichero de la siguiente forma:
* var Discord = require('discord.js');
* client = new Discord.Client();
* client.login(TOKEN)
* module.exports = client;
*/
var client = require("../mensagerbo_credentials.js");
var clases = require("./clases.js");
var bd     = require("./bd.js");

client.on('ready', () => {

});

var serverSet = new Object;
var  lastChat = new Object;
var lastMsgSt = new Object;

client.on('message', async msg => {
  /* msg.author.id       => Identificador de usuario.
   * msg.author.username => Nombre de usuario.
   * msg.content         => Contenido del mensaje.
   * msg.channel         => Canal por el que se ha enviado el mensaje.
   * Para más cosas, mirar la documentación de Discord.js.
   */
  if(msg.author.id == client.user.id) return; // Para que no se lea a él mismo.
  //Primer comando: Set server.
  if(msg.content.indexOf("s/ ") == 0)
    serverSet[msg.author.id] = msg.content.slice(3);
  //Segundo comando: Enviar un mensaje
  if(msg.content.indexOf("g/ ") == 0) {
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
      } else {
        var TSObj = new Object;
        for(var i of to){
          if(theGame.playerMap[i.toLowerCase()] == undefined){
            msg.channel.send("No existe el personaje llamado **"+i+"** en la partida **" + serverSet[msg.author.id] + "**.");
            return;
          } else TSObj[theGame.playerMap[i.toLowerCase()]] = true;
        }
        for(var i of Object.keys(TSObj)){
          lastMsgSt[msg.author.id] = {f: from, t: to, s: serverSet[msg.author.id]};
          msg.guild.members.get(i).send(from + " -> [" + to + "]: \n```\n" + send + "\n```\n");
        }         
      }
    }
  }
});