var omit = require('lodash/omit');
var shuffle = require('lodash/shuffle');

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
  { palo: 'oro', valor: 1}, { palo: 'oro', valor: 2}, { palo: 'oro', valor: 3}, { palo: 'oro', valor: 4},
  { palo: 'oro', valor: 5}, { palo: 'oro', valor: 6}, { palo: 'oro', valor: 7}, { palo: 'oro', valor: 8},
  { palo: 'oro', valor: 9}, { palo: 'oro', valor: 10}, { palo: 'oro', valor: 11}, { palo: 'oro', valor: 12},

  { palo: 'copas', valor: 1}, { palo: 'copas', valor: 2}, { palo: 'copas', valor: 3}, { palo: 'copas', valor: 4},
  { palo: 'copas', valor: 5}, { palo: 'copas', valor: 6}, { palo: 'copas', valor: 7}, { palo: 'copas', valor: 8},
  { palo: 'copas', valor: 9}, { palo: 'copas', valor: 10}, { palo: 'copas', valor: 11}, { palo: 'copas', valor: 12},

  { palo: 'espadas', valor: 1}, { palo: 'espadas', valor: 2}, { palo: 'espadas', valor: 3}, { palo: 'espadas', valor: 4},
  { palo: 'espadas', valor: 5}, { palo: 'espadas', valor: 6}, { palo: 'espadas', valor: 7}, { palo: 'espadas', valor: 8},
  { palo: 'espadas', valor: 9}, { palo: 'espadas', valor: 10}, { palo: 'espadas', valor: 11}, { palo: 'espadas', valor: 12},

  { palo: 'bastos', valor: 1}, { palo: 'bastos', valor: 2}, { palo: 'bastos', valor: 3}, { palo: 'bastos', valor: 4},
  { palo: 'bastos', valor: 5}, { palo: 'bastos', valor: 6}, { palo: 'bastos', valor: 7}, { palo: 'bastos', valor: 8},
  { palo: 'bastos', valor: 9}, { palo: 'bastos', valor: 10}, { palo: 'bastos', valor: 11}, { palo: 'bastos', valor: 12},
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
  const p_room = { room, c_players: 0, turn: -1, c_table: {}, last: {}, liar: false, p_started: false, users: []};

  c_rooms[room] = p_room;
  console.log(c_rooms, "rooms desde create");
}

function check_Room(room) {
  return c_rooms.hasOwnProperty(room);
}

function check_Started(room) {
  return c_rooms.hasOwnProperty(room) && c_rooms[room]['p_started'];
}

function shuffle_Cards(room) {
  let players = [];
  pool_cards = shuffle(pool_cards);
  const cantidad = Math.floor(48 / c_rooms[room]['c_players']);

  if (c_rooms[room]['c_players'] >= 3){
    c_rooms[room]['p_started'] = true;
    for (var i of c_rooms[room]['users']){
      cartas_jugador = pool_cards.splice(0, cantidad)
      console.log(c_users[i])
      console.log(cartas_jugador)
      c_users[i]['deck'] = cartas_jugador
      players = [...players, c_users[i]];
    }
  }
  return players;
}

module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
  create_Room,
  check_Room,
  shuffle_Cards,
  check_Started
};
