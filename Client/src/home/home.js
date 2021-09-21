import React, { useState, useEffect } from "react";
import "./home.scss";
import { Link } from "react-router-dom";
import { to_Decrypt, to_Encrypt } from "../aes.js";

function Homepage({ socket }) {
  const [username, setusername] = useState("");
  const [roomname, setroomname] = useState("");
  const [full_room, setFullRoom] = useState([]);
  const [allowed_room, setAllowRoom] = useState([]);
  let co


  useEffect(() => {
    socket.on("full_room", (data) => {
      //decypt
      console.log('full_room', data);
      let ans = to_Decrypt(JSON.stringify(data));
      ans = JSON.parse(ans);
      console.log('full_room', ans);
      setFullRoom({
        text: ans.text
      });
    });

    socket.on("allowed_room", (data) => {
      //decypt
      console.log('allowed_room', data);
      let ans = to_Decrypt(JSON.stringify(data));
      ans = JSON.parse(ans);
      console.log('allowed_room', ans);
      setAllowRoom({
        text: ans.text
      });
      console.log('en func',allowed_room)
    });

  }, [socket]);

  const sendData = () => {
    if (username !== "" && roomname !== "") {
      const ans = to_Encrypt(JSON.stringify({ username, roomname }));
      socket.emit("joinRoom", ans);
    } else {
      alert("username and roomname are must !");
      window.location.reload();
    }
  };

  return (
    <div className="homepage">
      {full_room.text &&
        <div className={`modal fade show`} style={{ display: "block", backgroundColor: '#000000BF', transition: "all 0.5s ease-in" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <br />
              <h3> {full_room.text} </h3>
              <div className="modal-footer">
                <button  
                onClick={() => setFullRoom({text: undefined})}
                >Ok
                </button>
                </div>
            </div>
          </div>
        </div>
      }
      <h1>Cheat Game</h1>
      <input
        placeholder="Input your user name"
        value={username}
        onChange={(e) => setusername(e.target.value)}
      ></input>
      <input
        placeholder="Input the room name"
        value={roomname}
        onChange={(e) => setroomname(e.target.value)}
      ></input>
      <button onClick={sendData}>Validate Room</button>
      {
      allowed_room.text &&
        <Link to={`/chat/${roomname}/${username}`}>
          <button >Join Game</button>
        </Link>
      }
      {console.log('en div',allowed_room)}
    </div>
  );
}

export default Homepage;
