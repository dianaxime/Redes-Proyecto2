var omit = require('lodash/omit');
var shuffle = require('lodash/shuffle');
var remove = require('lodash/remove');
var isEqualWith = require('lodash/isEqualWith');
var isEqual = require('lodash/isEqual');

let c_users = {};
let c_rooms = {};

/* 
-------------------------------------------------------
                    LOGICA DEL JUEGO                   
-------------------------------------------------------                                   

Un usuario se veria asi:

{
  id: "valor",
  username: "nombre"
  room: "room_#",
  turno: 1,
  deck: []
}

Una mesa/room se veria algo asi

{
  room_name: "room_#",
  c_players: 3,
  turno_actual: 2,
  cartas_mesa: [],
  ultima_jugada: [],
  es_mentira: true,
  partida_iniciada: true,
}

*/

const pool_cards = [
  { palo: 'oro', valor: 1, desc: 'One of Coins' }, { palo: 'oro', valor: 2, desc: 'Two of Coins' }, { palo: 'oro', valor: 3, desc: 'Three of Coins' }, { palo: 'oro', valor: 4, desc: 'Four of Coins' },
  { palo: 'oro', valor: 5, desc: 'Five of Coins' }, { palo: 'oro', valor: 6, desc: 'Six of Coins' }, { palo: 'oro', valor: 7, desc: 'Seven of Coins' }, { palo: 'oro', valor: 8, desc: 'Eight of Coins' },
  { palo: 'oro', valor: 9, desc: 'Nine of Coins' }, { palo: 'oro', valor: 10, desc: 'Ten of Coins' }, { palo: 'oro', valor: 11, desc: 'Eleven of Coins' }, { palo: 'oro', valor: 12, desc: 'Twelve of Coins' },

  { palo: 'copas', valor: 1, desc: 'One of Cups' }, { palo: 'copas', valor: 2, desc: 'Two of Cups' }, { palo: 'copas', valor: 3, desc: 'Three of Cups' }, { palo: 'copas', valor: 4, desc: 'Four of Cups' },
  { palo: 'copas', valor: 5, desc: 'Five of Cups' }, { palo: 'copas', valor: 6, desc: 'Six of Cups' }, { palo: 'copas', valor: 7, desc: 'Seven of Cups' }, { palo: 'copas', valor: 8, desc: 'Eight of Cups' },
  { palo: 'copas', valor: 9, desc: 'Nine of Cups' }, { palo: 'copas', valor: 10, desc: 'Ten of Cups' }, { palo: 'copas', valor: 11, desc: 'Eleven of Cups' }, { palo: 'copas', valor: 12, desc: 'Twelve of Cups' },

  { palo: 'espadas', valor: 1, desc: 'One of Swords' }, { palo: 'espadas', valor: 2, desc: 'Two of Swords' }, { palo: 'espadas', valor: 3, desc: 'Three of Swords' }, { palo: 'espadas', valor: 4, desc: 'Four of Swords' },
  { palo: 'espadas', valor: 5, desc: 'Five of Swords' }, { palo: 'espadas', valor: 6, desc: 'Six of Swords' }, { palo: 'espadas', valor: 7, desc: 'Seven of Swords' }, { palo: 'espadas', valor: 8, desc: 'Eight of Swords' },
  { palo: 'espadas', valor: 9, desc: 'Nine of Swords' }, { palo: 'espadas', valor: 10, desc: 'Ten of Swords' }, { palo: 'espadas', valor: 11, desc: 'Eleven of Swords' }, { palo: 'espadas', valor: 12, desc: 'Twelve of Swords' },

  { palo: 'bastos', valor: 1, desc: 'One of Clubs' }, { palo: 'bastos', valor: 2, desc: 'Two of Clubs' }, { palo: 'bastos', valor: 3, desc: 'Three of Clubs' }, { palo: 'bastos', valor: 4, desc: 'Four of Clubs' },
  { palo: 'bastos', valor: 5, desc: 'Five of Clubs' }, { palo: 'bastos', valor: 6, desc: 'Six of Clubs' }, { palo: 'bastos', valor: 7, desc: 'Seven of Clubs' }, { palo: 'bastos', valor: 8, desc: 'Eight of Clubs' },
  { palo: 'bastos', valor: 9, desc: 'Nine of Clubs' }, { palo: 'bastos', valor: 10, desc: 'Ten of Clubs' }, { palo: 'bastos', valor: 11, desc: 'Eleven of Clubs' }, { palo: 'bastos', valor: 12, desc: 'Twelve of Clubs' },
]
// Inicializar a un jugador en un room especifico
function join_User(id, username, room) {
  const p_user = { id, username, room, turn: 'inactive', deck: []};

  c_users[id] = p_user;
  
  // Si no han hay ningun jugador el es el asignado como primer mentiroso
  if (c_rooms[room]['c_players'] == 0){
    p_user['turn'] = 'liar'
  }

  c_rooms[room]['c_players'] = c_rooms[room]['c_players'] + 1;
  c_rooms[room]['users'] = [...c_rooms[room]['users'], id];
  
  return p_user;
}

// Devuelve el usuario asociado con ese id
function get_Current_User(id) {
  return c_users[id];
}

// cuando un usuario se desconecta del juego y lo elimina
function user_Disconnect(id) {
  c_users = omit(c_users, id);
  return c_users;
}

// inicializar un room
function create_Room(room) {
  const p_room = { room, c_players: 0, turn: -1, c_table: [], last: {}, liar: false, p_started: false, users: []};

  c_rooms[room] = p_room;
}

// verifica si no existe un room con ese nombre
function check_Room(room) {
  return c_rooms.hasOwnProperty(room);
}

// verifica que no se haya iniciado la partida en ese room
function check_Started(room) {
  return c_rooms.hasOwnProperty(room) && c_rooms[room]['p_started'];
}

// hace una copia de ese arreglo
function copy_Deck(array) {
  for ( var i = 0, l = array.length, n_array = []; i < l; i++ ) {
    n_array[ i ] = array[ i ];
  }

  return n_array;
}

// verifica si hay tres o mas integrantes en el room
function can_Start(room) {
  return c_rooms[room]['c_players'] >= 3;
}

// Reparte las cartas entre los jugadores de ese room
function shuffle_Cards(room) {
  let players = [];
  let temp_cards = copy_Deck(pool_cards);
  temp_cards = shuffle(temp_cards);

  // Calcula cuantas cartas le corresponde a cada jugador
  const cantidad = Math.floor(48 / c_rooms[room]['c_players']);

  // Marca la partida como iniciada
  c_rooms[room]['p_started'] = true;

  // Reparte las cartas entre los jugadores del room
  for (var i of c_rooms[room]['users']){
    cartas_jugador = temp_cards.splice(0, cantidad)
    c_users[i]['deck'] = cartas_jugador
    players = [...players, c_users[i]];
  }

  // Inicializa los turnos y si hay cartas restantes las deja en la mesa
  c_rooms[room]['turn'] = 0;
  c_rooms[room]['c_table'] = temp_cards;

  return players;
}

function process_Move(room, userId, r_cards, lie) {
  let falsehood = '';

  var n_deck = c_users[userId]['deck'];

  // Elimina las cartas que el jugador tiro de su mazo
  for (var i of r_cards) {
    n_deck = remove(n_deck, function(n) {
      return !isEqual(n, i);
    });
  }

  /* 
    Arregla el formato de la mentira del jugador y arma el mensaje
    para los otros jugadores
  */
  for (var i of lie) {
    if (falsehood === ''){
      falsehood = falsehood + "" + i['desc'];
    } else {
      falsehood = falsehood + ", " + i['desc'];
    }
  }

  let players = [];
  let counter = 0;

  // verifica si la jugada es igual a la mentira
  for (var i of r_cards) {
    for (var j of lie) {
      if  (isEqual(i, j)) {
        counter = counter + 1;
      }
    }
  }

  if (counter < lie.length) {
    c_rooms[room]['liar'] = true;
  }

  // Le asigna al jugador su mazo actualizado y actualiza la mesa
  c_users[userId]['deck'] = n_deck;
  c_rooms[room]['c_table'] = [...c_rooms[room]['c_table'], ...r_cards]

  // Cambia el status del jugador actual a inactivo
  c_users[userId]['turn'] = 'inactive';
  players.push(c_users[userId]);

  // Actualiza el turno en la mesa
  c_rooms[room]['turn'] = (c_rooms[room]['turn'] + 1) % c_rooms[room]['c_players'];

  let a_userId;
  a_userId = c_rooms[room]['users'][c_rooms[room]['turn']];

  // Cambia el status del sig jugador
  c_users[a_userId]['turn'] = 'guesser';
  players.push(c_users[a_userId]);

  // Retorna el mensaje de mentira y el status actualizado de los jugadores
  let result = {lie_message: falsehood, players: players};

  return result;
}

function process_Choice(room, choice, userId) {
  let p_winner = {};
  let game_over = false;
  let players = [];
  let d_winner = '';
  
  // Obtiene el id del jugador del turno anterior
  let b_id = ((c_rooms[room]['turn'] - 1) % c_rooms[room]['c_players']);

  if (b_id < 0) {
    b_id = c_rooms[room]['c_players'] + b_id;
  }

  let b_userId = c_rooms[room]['users'][b_id];
  /* 
    Si adivina que el jugador miente el jugador previo 
    se lleva todas las cartas
  */
  if (c_rooms[room]['liar'] == choice && choice == true) {
    c_users[b_userId]['deck'] = [...c_users[b_userId]['deck'], ...c_rooms[room]['c_table']];
    c_rooms[room]['c_table'] = [];
    d_winner = c_users[userId]['username'];
  }
  
  // Si no adivina el se lleva las cartas
  if (c_rooms[room]['liar'] != choice) {
    c_users[userId]['deck'] = [...c_users[userId]['deck'], ...c_rooms[room]['c_table']];
    c_rooms[room]['c_table'] = [];
    d_winner = c_users[b_userId]['username'];
  }

  if (c_rooms[room]['liar'] == choice && choice == false) {
    d_winner = 'No one'
  }
  
  /*
   Si el jugador anterior ya dejo todas sus cartas, y gano la
   decision, ha ganado el juego
  */ 
  if (c_users[b_userId]['deck'].length == 0) {
    game_over = true;
    p_winner = c_users[b_userId];
  } else {
    c_users[userId]['turn'] = 'liar';
    
    players.push(c_users[userId]);
    players.push(c_users[b_userId]);
  }

  let result = {p_winner: p_winner, game_over: game_over, players: players, d_winner: d_winner};

  return result;
}

function define_Winner(room) {
  let n_cards = 48;
  let w_userId = '';
  let i_cards = 0;
  let n_winners = '';
  let q_w = 1;
  
  // Para jugador en la mesa
  for (var i of c_rooms[room]['users']) {
    i_cards = c_users[i]['deck'].length

    // Si tiene menos cartas que el anterior jugador con menos cartas
    if (i_cards < n_cards) {
      // Guardamos la info del nuevo jugador
      q_w = 1;
      n_cards = i_cards;
      w_userId = i;
      n_winners = c_users[i]['username'];
    } else if (i_cards == n_cards) {
      /*
        Si hay dos con igual numero de cartas es empate y se muestra el
        nombre de ambos y suma el numero de ganadores
      */
      n_winners = n_winners + " , " + c_users[i]['username'];
      q_w++;
    }
  }

  // Retorna el numero de ganadores y los nombres
  let result = {q_w: q_w, n_winners: n_winners};

  return result;
}

function remove_Room(room) {
  for (var i of c_rooms[room]['users']) {
    user_Disconnect(i);
  }

  c_rooms = omit(c_rooms, room);
}

module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
  create_Room,
  check_Room,
  shuffle_Cards,
  check_Started,
  process_Move,
  process_Choice,
  define_Winner,
  can_Start,
  remove_Room
};
