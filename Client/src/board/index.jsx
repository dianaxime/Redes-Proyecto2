import React, { useState, useEffect, useRef } from "react";
import { Component } from 'react';
import Deck from '../Deck';
import style from './board.module.css'

class Board extends Component {

  render() {
    const {
      play
    } = this.props;
    return (
      <div className={style.board}>
        <div className="row">
          <div className="col col-md-3">
            <h4>Username:</h4> 
               </div>
               <div className="col col-md-3">
            <h4>{/*user.username ? user.username : '' */}</h4> 
               </div>
          <div className="col col-md-3">
          <h4>On turn:</h4> </div>
          <div className="col col-md-3">
            <h4>{/*play.on_turn ? play.on_turn: ''*/}</h4> 
               </div>
          {/* carta del player*/}
          <div className={style.gameboard}>
            {/*<div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
    <div className={style.box}></div>*/}
          </div>

          {/* carta del player*/}
          <div className={style.gameboard}>
            <Deck />
            {/*<div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
  <div className={style.box}></div>*/}
          </div>
        </div>
      </div>
    )
  }

}

export default Board