/*
mensagerbo_credentials.js es un fichero de la siguiente forma:
* var Discord = require('discord.js');
* client = new Discord.Client();
* client.login(TOKEN)
* module.exports = client;
*/
var client = require("../mensagerbo_credentials.js");


client.on('ready', () => {

});
client.on('message', async msg => {
  /* msg.author.id       => Identificador de usuario.
   * msg.author.username => Nombre de usuario.
   * msg.content         => Contenido del mensaje.
   * msg.channel         => Canal por el que se ha enviado el mensaje.
   * Para más cosas, mirar la documentación de Discord.js.
   */
  if(msg.author.id == client.user.id) return; // Para que no se lea a él mismo.
  msg.channel.send("Esto es una prueba.");
});