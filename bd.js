// FICHERO TEMPORAL

require("./clases.js");

var partidas  = new Object;


function addPlayer(user, name, game){
  partidas[game].addJugador( new Jugador(user, name) );
}

//Cundert es el master de esta campaña.
partidas["Herdalis"] = new Partida("298029759785336832");

//Hectobreak es Aredhel.
addPlayer("161176433027186688", "Aredhel", "Herdalis"); 

//MonTheKat es Rhia
addPlayer("277403333017337857", "Rhia",    "Herdalis");

//Cundert lleva a Gerbo
addPlayer("298029759785336832", "Gerbo",   "Herdalis");

module.exports = new Object;
module.exports.partidas = partidas;