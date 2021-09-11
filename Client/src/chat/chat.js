import "./chat.scss";
import { to_Decrypt, to_Encrypt } from "../aes.js";
import React, { useState, useEffect, useRef } from "react";
import Board from "../board";

function Chat({ username, roomname, socket }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [player, setPlayer] = useState({});

  useEffect(() => {
    socket.on("message", (data) => {
      //decypt
      let ans = to_Decrypt(JSON.stringify(data));
      ans = JSON.parse(ans);
      let temp = messages;
      temp.push({
        userId: ans.userId,
        username: ans.username,
        text: ans.text,
      });
      setMessages([...temp]);
    });

    socket.on("player", (data) => {
      //decypt
      let ans = to_Decrypt(JSON.stringify(data));
      ans = JSON.parse(ans);
      console.log('player', ans);
      setPlayer({
        userId: ans.userId,
        username: ans.username,
        turn: ans.turn,
        deck: ans.deck
      });
    });

    socket.on("full_room", (data) => {
      //decypt
      console.log('full_room', data);
      //const ans = to_Decrypt(data.text, data.username);
      //console.log('full_room',ans);
      /*let temp = messages;
      temp.push({
        userId: data.userId,
        username: data.username,
        text: ans,
      });
      setFullRoom([...temp]);*/
    });

  }, [socket]);

  const sendData = () => {
    if (text !== "") {
      //encrypt here
      const ans = to_Encrypt(text);
      socket.emit("chat", ans);
      setText("");
    }
  };
  const messagesEndRef = useRef(null);

  const startGame = () => {
    //encrypt here
    const ans = to_Encrypt(roomname);
    socket.emit("play", ans);
  }

  /* const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); */

  console.log(messages, "mess");

  return (
    <div className="row">
      <div className="col col-lg-8">
        {player.deck ?
          <Board
            username={'majo'}
            on_turn={'en turno'}
            deck={[{ palo: 'copas', valor: '1' }, { palo: 'oro', valor: '2' }, { palo: 'espada', valor: '3' },
            { palo: 'copas', valor: '4' }, { palo: 'bastos', valor: '5' }, { palo: 'espada', valor: '6' }]}
          /> :
          <><button onClick={startGame}>
            Iniciar partida</button>
            </>}
      </div>
      <div className="col col-lg-4">
        <div className="chat">
          <div className="user-name">
            <h2>
              {username} <span style={{ fontSize: "0.7rem" }}>in {roomname}</span>
            </h2>
          </div>
          <div className="chat-message">
            {messages.map((i) => {
              if (i.username === username) {
                return (
                  <div key={i.text} className="message">
                    <p>{i.text}</p>
                    <span>{i.username}</span>
                  </div>
                );
              } else {
                return (
                  <div key={i.text} className="message mess-right">
                    <p>{i.text} </p>
                    <span>{i.username}</span>
                  </div>
                );
              }
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="send">
            <input
              placeholder="enter your message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendData();
                }
              }}
            ></input>
            <button onClick={sendData}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Chat;
