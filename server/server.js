const express = require("express");
const app = express();
const socket = require("socket.io");
const color = require("colors");
const cors = require("cors");
const { 
  get_Current_User, 
  user_Disconnect, 
  join_User,
  create_Room,
  check_Room,
  shuffle_Cards,
  check_Started,
  process_Move,
  process_Choice,
  define_Winner,
  can_Start,
  remove_Room 
} = require("./bullsh");

const {
  to_Encrypt,
  to_Decrypt
} = require("./aes")

app.use(express());

const port = 8000;

app.use(cors({origin: '*'}));

var server = app.listen(
  port,
  console.log(
    `Server is running on the port no: ${(port)} `
      .green
  )
);

const io = socket(server);

// Inicializar la conexionn 
io.on("connection", (socket) => {
  // Cuando un usuario quiere unirse a un room
  socket.on("joinRoom", (data) => {
    data = to_Decrypt(data);
    data = JSON.parse(data);
    const { username, roomname } = data;

    //Verificar si ya inicio la partida
    if (check_Started(roomname)){
      socket.emit("full_room", to_Encrypt(JSON.stringify({
        userId: socket.id,
        username: username,
        text: `Sorry, the game has already started.`,
      })));
    } else {
      // Verificar si ya existe el room y si no lo crea
      if (!check_Room(roomname)){
        create_Room(roomname);
      }
  
      // Crea un usuario
      const p_user = join_User(socket.id, username, roomname);
      socket.join(p_user.room);

      socket.emit("allowed_room", to_Encrypt(JSON.stringify({
        userId: socket.id,
        username: username,
        text: `Allowed.`,
      })));
  
      // Muestra un mensaje a los jugadores del room que alguien se ha unido
      socket.broadcast.to(p_user.room).emit("message", to_Encrypt(JSON.stringify({
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has joined the game!`,
        flag: `message`,
      })));
    }
  });

  // Envio de mensaje de welcome
  socket.on("user_joined", () => {
    const p_user = get_Current_User(socket.id);

    // Muestra un mensaje de bienvenida
    socket.emit("message", to_Encrypt(JSON.stringify({
      userId: p_user.id,
      username: p_user.username,
      text: `Welcome ${p_user.username}`,
      flag: `message`,
    })));
  });

  // Envio de mensajes por el chat
  socket.on("chat", (text) => {
    text = to_Decrypt(text);
    const p_user = get_Current_User(socket.id);

    io.to(p_user.room).emit("message", to_Encrypt(JSON.stringify({
      userId: p_user.id,
      username: p_user.username,
      text: text,
      flag: `message`,
    })));
  });

  // Inicio de partida y repartir cartas a los jugadores
  socket.on("play", (room) => {
    room = to_Decrypt(room);
    const p_user = get_Current_User(socket.id);

    // Primero verificamos que existan tres participantes o mas en el room
    if (can_Start(room)) {
      players = shuffle_Cards(room);
      
      // Envia la informacion de su turno y sus cartas a los jugadores de un room
      for (var user of players){
        io.to(user.id).emit("player", to_Encrypt(JSON.stringify({
          userId: user.id,
          username: user.username,
          turn: user.turn,
          deck: user.deck,
        })));
  
        if (user.turn === 'liar') {
          // Envia a los jugadores del room el cambio de turno
          io.to(room).emit("message", to_Encrypt(JSON.stringify({
            userId: user.id,
            username: user.username,
            text: `The game has started. The player on turn is ${user.username}. Good luck!`,
            flag: `broadcast`,
          })));
        }
      }
    } else {
      socket.emit("cant_start", to_Encrypt(JSON.stringify({
        userId: p_user.id,
        username: p_user.username,
        text: `You need three or more players.`,
      })));
    }

  });

  // Recibar la movida del jugador y actualizar
  socket.on("move", (data) => {
    data = to_Decrypt(data);
    data = JSON.parse(data);
    const { room, r_cards, lie } = data;
    
    const p_user = get_Current_User(socket.id);

    const {players, lie_message } = process_Move(room, p_user.id, r_cards, lie);
    
    // Envia la informacion de su turno actualizado
    for (var user of players){
      io.to(user.id).emit("change_turn", to_Encrypt(JSON.stringify({
        userId: user.id,
        username: user.username,
        turn: user.turn,
        deck: user.deck,
      })));

      if (user.turn === 'guesser') {
        // Envia a los jugadores del room el cambio de turno
        io.to(room).emit("message", to_Encrypt(JSON.stringify({
          userId: user.id,
          username: user.username,
          text: `${user.username} change to ${user.turn}.`,
          flag: `broadcast`,
        })));
      }
    }

    // Envia a los jugadores del room cual fue la mentira
    io.to(room).emit("message", to_Encrypt(JSON.stringify({
      userId: p_user.id,
      username: p_user.username,
      text: lie_message,
      flag: `broadcast`,
    })));
  });

  // Recibar si el jugador se cree la mentira o no
  socket.on("guesser_choice", (data) => {
    data = to_Decrypt(data);
    data = JSON.parse(data);
    const {room, choice } = data;

    const p_user = get_Current_User(socket.id);
    
    const { game_over, p_winner, players, d_winner } = process_Choice(room, choice, p_user.id);

    // Envia a los jugadores del room quien gano la decision
    io.to(room).emit("message", to_Encrypt(JSON.stringify({
      userId: p_user.id,
      username: p_user.username,
      text: `${d_winner} won the decision.`,
      flag: `broadcast`,
    })));

    // Si ya hay un ganador envia la informacion y termina el juego
    if (game_over) {
      io.to(room).emit("winner", to_Encrypt(JSON.stringify({
        text: `The winner is ${p_winner.username}`,
      })));

      // Eliminar los jugadores y el room
      remove_Room(room);
    } else {
      /*
       Envia la informacion actualizada de los turnos y del mazo 
       de los usuarios
      */
      for (var user of players){
        io.to(user.id).emit("turn_winner", to_Encrypt(JSON.stringify({
          userId: user.id,
          username: user.username,
          turn: user.turn,
          deck: user.deck
        })));

        if (user.turn === 'liar') {
          // Envia a los jugadores del room el cambio de turno
          io.to(room).emit("message", to_Encrypt(JSON.stringify({
            userId: user.id,
            username: user.username,
            text: `${user.username} change to ${user.turn}.`,
            flag: `broadcast`,
          })));
        }
      }
    }
    
  });

  // Terminar la partida
  socket.on("finish", (room) => {
    room = to_Decrypt(room);
    const { q_w, n_winners } = define_Winner(room);
    
    /* 
      Enviar a todos quien fue el ganador, si hay mas 
      de un ganador envia que hubo un empate
    */
    if (q_w > 1) {
      io.to(room).emit("winner", to_Encrypt(JSON.stringify({
        text: `There was a tie between ${n_winners}`,
      })));
    } else {
      io.to(room).emit("winner", to_Encrypt(JSON.stringify({
        text: `The winner is ${n_winners}`,
      })));
    }

    // Elimina los jugadores y el room
    remove_Room(room);
  });

  // Cuando el usuario se desconecta del juego se envia un mensaje por el chat
  socket.on("disconnect", () => {
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", to_Encrypt(JSON.stringify({
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the chat.`,
      })));
    }
  });
});