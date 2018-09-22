Jugador = class{
  constructor(player_id, char_name){
    if(typeof(player_id) != "string")
      throw new Error("La ID del jugador debe ser una string");
    if(typeof(char_name) != "string")
      throw new Error("El nombre del jugador debe ser una string");
    this.playerId    = player_id;
    this.canonicName = char_name;
    this.findName    = char_name.toLowerCase();
  }
};

Partida = class {
  constructor(master_id){
    if(typeof(master_id) != "string")
      throw new Error("La ID del master debe ser una string");
    this.master  = master_id;
    this.players = new Array;
    this.playerMap = new Object;
  }
  addJugador(player){
    if(typeof(player) != "object" || player.playerId == undefined 
    || player.canonicName == undefined || player.findName == undefined)
      throw new Error("El parámetro de entrada debe ser un jugador.");
    if(this.playerMap[player.findName] != undefined)
      throw new Error("Ya existe el personaje en esta partida.");
    this.players.push(player);
    this.playerMap[player.findName] = player.playerId;
  }
};
