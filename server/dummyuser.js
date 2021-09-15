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

let pool_cards = [
  { palo: 'oro', valor: 1, desc: 'Uno de Oro'}, { palo: 'oro', valor: 2, desc: 'Dos de Oro'}, { palo: 'oro', valor: 3, desc: 'Tres de Oro'}, { palo: 'oro', valor: 4, desc: 'Cuatro de Oro'},
  { palo: 'oro', valor: 5, desc: 'Cinco de Oro'}, { palo: 'oro', valor: 6, desc: 'Seis de Oro'}, { palo: 'oro', valor: 7, desc: 'Siete de Oro'}, { palo: 'oro', valor: 8, desc: 'Ocho de Oro'},
  { palo: 'oro', valor: 9, desc: 'Nueve de Oro'}, { palo: 'oro', valor: 10, desc: 'Diez de Oro'}, { palo: 'oro', valor: 11, desc: 'Once de Oro'}, { palo: 'oro', valor: 12, desc: 'Doce de Oro'},

  { palo: 'copas', valor: 1, desc: 'Uno de Copas'}, { palo: 'copas', valor: 2, desc: 'Dos de Copas'}, { palo: 'copas', valor: 3, desc: 'Tres de Copas'}, { palo: 'copas', valor: 4, desc: 'Cuatro de Copas'},
  { palo: 'copas', valor: 5, desc: 'Cinco de Copas'}, { palo: 'copas', valor: 6, desc: 'Seis de Copas'}, { palo: 'copas', valor: 7, desc: 'Siete de Copas'}, { palo: 'copas', valor: 8, desc: 'Ocho de Copas'},
  { palo: 'copas', valor: 9, desc: 'Nueve de Copas'}, { palo: 'copas', valor: 10, desc: 'Diez de Copas'}, { palo: 'copas', valor: 11, desc: 'Once de Copas'}, { palo: 'copas', valor: 12, desc: 'Doce de Copas'},

  { palo: 'espadas', valor: 1, desc: 'Uno de Oro'}, { palo: 'espadas', valor: 2, desc: 'Dos de Espadas'}, { palo: 'espadas', valor: 3, desc: 'Tres de Espadas'}, { palo: 'espadas', valor: 4, desc: 'Cuatro de Espadas'},
  { palo: 'espadas', valor: 5, desc: 'Cinco de Oro'}, { palo: 'espadas', valor: 6, desc: 'Seis de Espadas'}, { palo: 'espadas', valor: 7, desc: 'Siete de Espadas'}, { palo: 'espadas', valor: 8, desc: 'Ocho de Espadas'},
  { palo: 'espadas', valor: 9, desc: 'Nueve de Oro'}, { palo: 'espadas', valor: 10, desc: 'Diez de Espadas'}, { palo: 'espadas', valor: 11, desc: 'Once de Espadas'}, { palo: 'espadas', valor: 12, desc: 'Doce de Espadas'},

  { palo: 'bastos', valor: 1, desc: 'Uno de Bastos'}, { palo: 'bastos', valor: 2, desc: 'Dos de Bastos'}, { palo: 'bastos', valor: 3, desc: 'Tres de Bastos'}, { palo: 'bastos', valor: 4, desc: 'Cuatro de Bastos'},
  { palo: 'bastos', valor: 5, desc: 'Cinco de Bastos'}, { palo: 'bastos', valor: 6, desc: 'Seis de Bastos'}, { palo: 'bastos', valor: 7, desc: 'Siete de Bastos'}, { palo: 'bastos', valor: 8, desc: 'Ocho de Bastos'},
  { palo: 'bastos', valor: 9, desc: 'Nueve de Bastos'}, { palo: 'bastos', valor: 10, desc: 'Diez de Bastos'}, { palo: 'bastos', valor: 11, desc: 'Once de Bastos'}, { palo: 'bastos', valor: 12, desc: 'Doce de Bastos'},
]

// joins the user to the specific chatroom
function join_User(id, username, room) {
  const p_user = { id, username, room, turn: 'inactive', deck: []};

  c_users[id] = p_user;
  console.log(c_users, "users");
  
  if (c_rooms[room]['c_players'] == 0){
    p_user['turn'] = 'liar'
  }

  c_rooms[room]['c_players'] = c_rooms[room]['c_players'] + 1;
  c_rooms[room]['users'] = [...c_rooms[room]['users'], id];
  console.log(c_rooms, "rooms desde join user");

  return p_user;
}

console.log("user out", c_users);

// Gets a particular user id to return the current user
function get_Current_User(id) {
  return c_users[id];
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
  c_users = omit(c_users, id);
  return c_users;
}

function create_Room(room) {
  const p_room = { room, c_players: 0, turn: -1, c_table: [], last: {}, liar: false, p_started: false, users: []};

  c_rooms[room] = p_room;
  console.log(c_rooms, "rooms desde create");
}

function check_Room(room) {
  return c_rooms.hasOwnProperty(room);
}

function check_Started(room) {
  return c_rooms.hasOwnProperty(room) && c_rooms[room]['p_started'];
}

function copy_Deck(array) {
  for ( var i = 0, l = array.length, n_array = []; i < l; i++ ) {
    n_array[ i ] = array[ i ];
  }

  return n_array;
}

function shuffle_Cards(room) {
  let players = [];
  let temp_cards = copy_Deck(pool_cards);
  temp_cards = shuffle(temp_cards);
  const cantidad = Math.floor(48 / c_rooms[room]['c_players']);

  c_rooms[room]['p_started'] = true;

  for (var i of c_rooms[room]['users']){
    cartas_jugador = temp_cards.splice(0, cantidad)
    console.log(c_users[i])
    console.log(cartas_jugador)
    c_users[i]['deck'] = cartas_jugador
    players = [...players, c_users[i]];
  }

  c_rooms[room]['turn'] = 0;
  c_rooms[room]['c_table'] = temp_cards;

  return players;
}

function process_Move(room, userId, r_cards, lie) {
  let lies = [];
  let falsehood = '';

  var n_deck = c_users[userId]['deck'];

  for (var i of r_cards) {
    n_deck = remove(n_deck, function(n) {
      return !isEqual(n, i);
    });
  }

  for (var i of lie) {
    for (var n = 0; n < i['quantity']; n++) {
      lies.push({
        palo: i['palo'],
        valor: i['valor']
      })
    }
    falsehood = falsehood + " , " + i['quantity'].toString() + " " + i['desc'];
  }

  function customizer(objValue, othValue) {
      if (isEqual(objValue, othValue)) {
        return true;
      }
  }
  
  let players = [];
  
  if (isEqualWith(r_cards, lies, customizer)) {
    c_rooms[room]['liar'] = true;
  }

  c_users[userId]['deck'] = n_deck;
  c_rooms[room]['c_table'] = [...c_rooms[room]['c_table'], ...r_cards]

  c_users[userId]['turn'] = 'inactive';
  players.push(c_users[userId]);

  c_rooms[room]['turn'] = (c_rooms[room]['turn'] + 1) % c_rooms[room]['c_players'];

  let a_userId;
  a_userId = c_rooms[room]['users'][c_rooms[room]['turn']]['userId'];

  c_users[a_userId]['turn'] = 'guesser';
  players.push(c_users[a_userId]);


  let result = {lie_message: falsehood, players: players};

  return result;
}

function process_Choice(room, choice, userId) {
  let p_winner = {};
  let game_over = false;
  let players = [];
  let b_userId = c_users[c_rooms[room]['users'][((c_rooms[room]['turn'] - 1) % c_rooms[room]['c_players'])]]['userId'];
  
  if (c_rooms[room]['liar'] == choice && choice == true) {
    c_users[b_userId]['deck'] = [...c_users[b_userId]['deck'], ...c_rooms[room]['c_table']];
    c_rooms[room]['c_table'] = [];
  }
  
  if (c_rooms[room]['liar'] != choice) {
    c_users[userId]['deck'] = [...c_users[userId]['deck'], ...c_rooms[room]['c_table']];
    c_rooms[room]['c_table'] = [];
  }
  
  if (c_users[b_userId]['deck'].length == 0) {
    game_over = true;
    p_winner = c_users[b_userId];
  } else {
    c_users[userId]['turn'] = 'liar';
    
    players.push(c_users[userId]);
    players.push(c_users[b_userId]);
  }
  
  let result = {p_winner: p_winner, game_over: game_over, players: players};

  return result;
}

function define_Winner(room) {
  let n_cards = 48;
  let w_userId = '';
  let i_cards = 0;
  let n_winners = '';
  let q_w = 1;
  
  for (var i of c_rooms[room]['users']) {
    i_cards = c_users[i]['deck'].length
    if (i_cards < n_cards) {
      q_w = 1;
      n_cards = i_cards;
      w_userId = i;
      n_winners = c_users[i]['username'];
    } else if (i_cards == n_cards) {
      n_winners = n_winners + " , " + c_users[i]['username'];
      q_w++;
    }
  }

  let result = {q_w: q_w, n_winners: n_winners};

  return result;
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
  define_Winner
};
