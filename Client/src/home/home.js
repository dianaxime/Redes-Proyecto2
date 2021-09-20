import React, { useState, useEffect } from "react";
import "./home.scss";
import { Link } from "react-router-dom";
import { to_Decrypt, to_Encrypt } from "../aes.js";

function Homepage({ socket }) {
  const [username, setusername] = useState("");
  const [roomname, setroomname] = useState("");
  const [full_room, setFullRoom] = useState([]);
  const [allowed_room, setAllowRoom] = useState([]);


  useEffect(() => {
    socket.on("full_room", (data) => {
      //decypt
      console.log('full_room', data);
      const ans = to_Decrypt(JSON.stringify(data));
      console.log('full_room', ans);
      setFullRoom({
        text: ans.text
      });
    });

    socket.on("allowed_room", (data) => {
      //decypt
      console.log('allowed_room', data);
      const ans = to_Decrypt(JSON.stringify(data));
      console.log('allowed_room', ans);
      setAllowRoom({
        text: ans.text
      });
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
              <h3 //className={styles.bodyFont}
              >{full_room.text} </h3>
              <Link to={`/`}>
                <button //className={styles.redbtn} onClick={() => hideModal()}
                >Ok
                </button>
              </Link>
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
      {allowed_room.text &&
        <Link to={`/chat/${roomname}/${username}`}>
          <button >Join Game</button>
        </Link>
      }
    </div>
  );
}

export default Homepage;
