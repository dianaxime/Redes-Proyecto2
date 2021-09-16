import "./chat.scss";
import { to_Decrypt, to_Encrypt } from "../aes.js";
import React, { useState, useEffect, useRef } from "react";
import Board from "../board";
import { useDispatch } from "react-redux";

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
      let ans = to_Decrypt(JSON.stringify(data));
      ans = JSON.parse(ans);
      let temp = messages;
      temp.push({
        userId: ans.userId,
        username: ans.username,
        text: ans.text,
        flag: ans.flag
      });
      setMessages([...temp]);
    });

    socket.on("player", (data) => {
      //decypt
      console.log(data)
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
    console.log(roomname)
    const ans = to_Encrypt(roomname);
    console.log(ans)
    socket.emit("play", ans);
  }

  /* const scrollToBottom = () =>   {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); */

  console.log(messages, "mess");

  return (
    <div className="row">
      <div className="col col-lg-8">
        {player.deck ?
          <Board
            username={player.username}
            on_turn={player.turn}
            deck={player.deck}
            socket={socket}
            roomname={roomname}
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
                if (i.flag === 'message') {
                  return (
                    <div key={i.text} className="message mess-right">
                      <p>{i.text} </p>
                      <span>{i.username}</span>
                    </div>
                  );
                }
                else {
                  return (
                    /*este es el brodcast hay que cambiarle color*/
                    <div key={i.text} className="message mess-right">
                      <p>{i.text} </p>
                      <span>{i.username}</span>
                    </div>
                  )
                }
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
