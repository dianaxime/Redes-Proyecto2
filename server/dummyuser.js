const c_users = [];
const c_rooms = [];

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
  mano: []
}

Una mesa/room se veria algo asi

{
  room_name: "room_#",
  cantidad_jugadores: 3,
  turno_actual: 2,
  cartas_mesa: [],
  ultima_jugada: []
}

*/

pool_cards = [
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
  const p_user = { id, username, room };

  c_users.push(p_user);
  console.log(c_users, "users");

  return p_user;
}

console.log("user out", c_users);

// Gets a particular user id to return the current user
function get_Current_User(id) {
  return c_users.find((p_user) => p_user.id === id);
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
  const index = c_users.findIndex((p_user) => p_user.id === id);

  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }
}

module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
};
