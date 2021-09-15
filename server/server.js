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
  process_Choice 
} = require("./dummyuser");

const {
  to_Encrypt,
  to_Decrypt
} = require("./aes")

app.use(express());

const port = 8000;

app.use(cors());

var server = app.listen(
  port,
  console.log(
    `Server is running on the port no: ${(port)} `
      .green
  )
);

const io = socket(server);

//initializing the socket io connection 
io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", (data) => {
    data = to_Decrypt(data);
    data = JSON.parse(data);
    const { username, roomname } = data;

    //Verificar si ya inicio la partida
    if (check_Started(roomname)){
      socket.emit("full_room", to_Encrypt(JSON.stringify({
        userId: socket.id,
        username: username,
        text: `Lo sentimos la partida ya ha iniciado`,
      })));
    } else {
      // Verificar si ya existe el room y si no lo crea
      if (!check_Room(roomname)){
        create_Room(roomname);
      }
  
      //* create user
      const p_user = join_User(socket.id, username, roomname);
      console.log(socket.id, "=id");
      socket.join(p_user.room);
  
      //display a welcome message to the user who have joined a room
      socket.emit("message", to_Encrypt(JSON.stringify({
        userId: p_user.id,
        username: p_user.username,
        text: `Bienvenid@ ${p_user.username}`,
        flag: `message`,
      })));
  
      //displays a joined room message to all other room users except that particular user
      socket.broadcast.to(p_user.room).emit("message", to_Encrypt(JSON.stringify({
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} se ha unido al juego`,
        flag: `message`,
      })));
    }
  });

  //user sending message
  socket.on("chat", (text) => {
    text = to_Decrypt(text);
    //gets the room user and the message sent
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
    players = shuffle_Cards(room);
    
    // Envia la informacion de su turno y sus cartas a los jugadores de un room
    for (var p_user of players){
      io.to(p_user.id).emit("player", to_Encrypt(JSON.stringify({
        userId: p_user.id,
        username: p_user.username,
        turn: p_user.turn,
        deck: p_user.deck,
      })));
    }
  });

  // Recibar la movida del jugador y actualizar
  socket.on("move", (data) => {
    data = to_Decrypt(data);
    data = JSON.parse(data);
    const { room, r_cards, lie, userId, username } = data;

    const {players, lie_message } = process_Move(room, userId, r_cards, lie);
    
    // Envia la informacion de su turno actualizado
    for (var p_user of players){
      io.to(p_user.id).emit("change_turn", to_Encrypt(JSON.stringify({
        userId: p_user.id,
        username: p_user.username,
        turn: p_user.turn,
      })));
    }

    io.to(room).emit("message", to_Encrypt(JSON.stringify({
      userId: userId,
      username: username,
      text: lie_message,
      flag: `broadcast`,
    })));
  });

  // Recibar si el jugador se cree la mentira o no
  socket.on("guesser_choice", (data) => {
    data = to_Decrypt(data);
    data = JSON.parse(data);
    const {room, choice, userId } = data;

    const { game_over, p_winner, players } = process_Choice(room, choice, userId);


    if (game_over) {
      socket.broadcast.to(room).emit("winner", to_Encrypt(JSON.stringify({
        text: `El ganador es ${p_winner.username}`,
      })));
    } else {
      // Envia la informacion de quien gano si el que miente o el que adivine
      for (var p_user of players){
        io.to(p_user.id).emit("turn_winner", to_Encrypt(JSON.stringify({
          userId: p_user.id,
          username: p_user.username,
          turn: p_user.turn,
          deck: p_user.deck
        })));
      }
    }
    
  });

  // Terminar la partida
  socket.on("finish", (room) => {
    // Enviar a todos quien fue el ganador
    // Remplazar room con username del ganador
    socket.broadcast.to(room).emit("winner", to_Encrypt(JSON.stringify({
      text: `El ganador es ${room}`,
    })));
  });

  //when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", to_Encrypt(JSON.stringify({
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} ha dejado el chat`,
      })));
    }
  });
});