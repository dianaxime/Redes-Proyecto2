import "./chat.scss";
import { to_Decrypt, to_Encrypt } from "../aes.js";
import { process } from "../store/action/index";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Board from "../board";

function Chat({ username, roomname, socket }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [player, setPlayer] = useState([]);
  //const [player, setPlayer] = useState({});


  const dispatch = useDispatch();

  const dispatchProcess = (encrypt, msg, cipher) => {
    dispatch(process(encrypt, msg, cipher));
  };

  useEffect(() => {
    socket.on("message", (data) => {
      //decypt
      const ans = to_Decrypt(data.text, data.username);
      dispatchProcess(false, ans, data.text);
      //console.log('MESSAGE',ans);
      let temp = messages;
      temp.push({
        userId: data.userId,
        username: data.username,
        text: ans,
      });
      setMessages([...temp]);
    });

    socket.on("player", (data) => {
      //decypt
      console.log('player sin decrypt', data);
      const ans = to_Decrypt(JSON.stringify(data), data.username);
      //const ans = to_Decrypt(data.username, data.deck);
      dispatchProcess(false, ans, data.deck);
      console.log('player', ans);
      let temp = player;
      temp.push({
        userId: data.userId,
        username: data.username,
        turn: ans,
      });
      setPlayer([...temp]);
    });

    socket.on("full_room", (data) => {
      //decypt
      console.log('full_room', data);
      //const ans = to_Decrypt(data.text, data.username);
      //dispatchProcess(false, ans, data.text);
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
    if (text !== "") {
      //encrypt here
      console.log("lo que les mandamos en play sin encriptar",roomname )
      const ans = to_Encrypt(roomname);
      console.log('en play encriptado', ans)
      socket.emit("play", ans);
      setText("");
    }
  }

  const scrollToBottom = () =>
   {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  console.log(messages, "mess");

  return (
    <div className="row">
      <div className="col col-lg-8">
        {player.turn ?
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
                  <div className="message">
                    <p>{i.text}</p>
                    <span>{i.username}</span>
                  </div>
                );
              } else {
                return (
                  <div className="message mess-right">
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
