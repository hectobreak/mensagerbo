/*
mensagerbo_credentials.js es un fichero de la siguiente forma:
* var Discord = require('discord.js');
* client = new Discord.Client();
* client.login(TOKEN)
* module.exports = client;
*/
client = require("../mensagerbo_credentials.js");

var clases = require("./clases.js");
var bd     = require("./bd.js");

var commands = require("./functions.js");

client.on('ready', () => {

});

var postfix = "/";

client.on('message', async msg => {
  /* msg.author.id       => Identificador de usuario.
   * msg.author.username => Nombre de usuario.
   * msg.content         => Contenido del mensaje.
   * msg.channel         => Canal por el que se ha enviado el mensaje.
   * Para más cosas, mirar la documentación de Discord.js.
   */
  if(msg.author.id == client.user.id) return; // Para que no se lea a él mismo.

  for(var i of commands.keys){
    if(msg.content.indexOf(i + postfix + " ") == 0) commands.func[i](msg);
  }
  
});