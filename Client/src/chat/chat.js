import "./chat.scss";
import { to_Decrypt, to_Encrypt } from "../aes.js";
import React, { useState, useEffect, useRef } from "react";
import Board from "../board";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Instructive from '../assets/instrucciones.pdf';

function Chat({ username, roomname, socket }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [player, setPlayer] = useState([]);
  const [winner, setWinner] = useState([]);
  const [start, setStart] = useState([]);
  const [reload, setReload] = useState(false);


  /*const dispatch = useDispatch();

  const dispatchProcess = (encrypt, msg, cipher) => {
    dispatch(process(encrypt, msg, cipher));
  };*/

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

    /*Funciones que escuchan*/
    socket.on("player", (data) => {
      //decypt
      let ans = to_Decrypt(JSON.stringify(data));
      ans = JSON.parse(ans);
      setPlayer({
        userId: ans.userId,
        username: ans.username,
        turn: ans.turn,
        deck: ans.deck
      });
    });

    socket.on("change_turn", (data) => {
      //decypt
      let ans = to_Decrypt(JSON.stringify(data));
      ans = JSON.parse(ans);
      setPlayer({
        userId: ans.userId,
        username: ans.username,
        turn: ans.turn,
        deck: ans.deck
      });
    });

    socket.on("turn_winner", (data) => {
      //decypt
      let ans = to_Decrypt(JSON.stringify(data));
      ans = JSON.parse(ans);
      setPlayer({
        userId: ans.userId,
        username: ans.username,
        turn: ans.turn,
        deck: ans.deck
      });
    });

    socket.on("winner", (data) => {
      //decypt
      let ans = to_Decrypt(JSON.stringify(data));
      ans = JSON.parse(ans);
      setWinner({
        text: ans.text
      });
    });

    socket.on("cant_start", (data) => {
      //decypt
      let ans = to_Decrypt(JSON.stringify(data));
      ans = JSON.parse(ans);
      setStart({
        text: ans.text
      });
    });


  }, [socket]);

  /*enviar informacion*/
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

  const userJoined = () => {
    if (reload === false) {
      const ans = to_Encrypt(roomname);
      socket.emit("user_joined", ans);
      setReload(true);
    }
  }

  const endGame = () => {
    //encrypt here
    const ans = to_Encrypt(roomname);
    socket.emit("finish", ans);
  }

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);


  return (
    <div className="row" >
      {userJoined()}
      {winner.text &&
        <div className={`modal fade show`} style={{ display: "block", backgroundColor: '#000000BF', transition: "all 0.5s ease-in" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <br />
              <h3>{winner.text} </h3>
              <div className="modal-footer">
                <Link to={`/`}>
                  <button className="btn btn-outline-secondary">
                    Ok
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
      {start.text &&
        <div className={`modal fade show`} style={{ display: "block", backgroundColor: '#000000BF', transition: "all 0.5s ease-in" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <br />
              <h3>{start.text} </h3>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => { setStart({ text: undefined }) }}>
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      <div className="col col-lg-8">
        {player.deck ?
          <Board
            username={player.username}
            on_turn={player.turn}
            deck={player.deck}
            socket={socket}
            roomname={roomname}
          /> :
          <><button
            className="btn btn-light" onClick={startGame}>
            Start Game</button>
          </>}
      </div>
      <div className="col col-lg-4">
        <div className="chat">
          <div className="user-name">
            <div className="row">
            <div className="col">
            <h2>
              {username} <span style={{ fontSize: "0.7rem" }}>in {roomname}</span>
                 </h2>
                 </div>
                 <div className="col col-md-2">
              <span style={{ alignSelf: "end" }}><button data-toggle="tooltip" data-placement="top" title="Finish Game" className="btn btn-danger" onClick={() => {endGame()}}> X </button></span></div>
              <div className="col col-md-2">
              <span style={{ alignSelf: "end" }}><a data-toggle="tooltip" data-placement="top" title="Download Manual" className="btn btn-warning" href={`${Instructive}`} download> ? </a></span>
              </div></div>
          </div>
          <div className="chat-message">

            {messages.map((i) => {
              if (i.username === username) {
                if (i.flag === 'message') {
                  return (
                    <div key={i.text} className="message">
                      <span>{i.username}</span>
                      <p>{i.text}</p>
                    </div>
                  );
                } else {
                  return (
                    /*este es el brodcast hay que cambiarle color*/
                    <div key={i.text} className="message mess-brodcast">
                      <span>Brodcast</span>
                      <p>{i.text} </p>
                    </div>
                  )
                }
              } else {
                if (i.flag === 'message') {
                  return (
                    <div key={i.text} className="message mess-right">
                      <span>{i.username}</span>
                      <p>{i.text} </p>
                    </div>
                  );
                }
                else {
                  return (
                    /*este es el brodcast hay que cambiarle color*/
                    <div key={i.text} className="message mess-brodcast">
                      <span>Brodcast</span>
                      <p>{i.text} </p>
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
