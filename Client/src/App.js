import Chat from "./chat/chat";
import Process from "./process/process";
import Home from "./home/home";
import DropDown from "./Dropdown";
//import Board from "./board";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import React from "react";
import io from "socket.io-client";

const socket = io.connect('http://18.119.19.242:8000');
function Appmain(props) {
  return (
    <React.Fragment>
      {/*<div className="col-lg-8 col-md-6" >
        <Board />
      </div>*/}
      <div className="col-lg-12 col-md-12" >
      <Chat
          username={props.match.params.username}
          roomname={props.match.params.roomname}
          socket={socket}
        />
        <Process />
  </div>
    </React.Fragment>
  );
}
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <Home socket={socket} />
          </Route>
          <Route path="/chat/:roomname/:username" component={Appmain} />
          <Route path="/modal" component={DropDown} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
