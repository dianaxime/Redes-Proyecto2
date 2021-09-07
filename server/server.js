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
  check_Started 
} = require("./dummyuser");

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
  socket.on("joinRoom", ({ username, roomname }) => {
    //Verificar si ya inicio la partida
    if (check_Started(roomname)){
      socket.emit("full_room", {
        userId: socket.id,
        username: username,
        text: `Lo sentimos la partida ya ha iniciado`,
      });
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
      socket.emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `Welcome ${p_user.username}`,
      });
  
      //displays a joined room message to all other room users except that particular user
      socket.broadcast.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} se ha unido al juego`,
      });
    }
  });

  //user sending message
  socket.on("chat", (text) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);

    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text,
    });
  });

  // Inicio de partida y repartir cartas a los jugadores
  socket.on("play", (room) => {
    players = shuffle_Cards(room);
    
    // Envia la informacion de su turno y sus cartas a los jugadores de un room
    for (var p_user of players){
      io.to(p_user.room).emit("player", {
        userId: p_user.id,
        username: p_user.username,
        turn: p_user.turn,
        deck: p_user.deck,
      });
    }
  });

  //when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} ha dejado el chat`,
      });
    }
  });
});