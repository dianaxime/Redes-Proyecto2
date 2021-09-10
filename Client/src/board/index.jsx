import React, { useState, useEffect, useRef } from "react";
import { Component } from 'react';
import style from './board.module.css'

class Board extends Component{

  render() {
    return (
      <div className={style.board}>
        <h4>Username: </h4>
        <h4>On turn: </h4>
        {/* carta del player*/}
        <div className = {style.gameboard}>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
        </div>

        {/* carta del player*/}
        <div className = {style.gameboard}>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
          <div className={style.box}></div>
        </div>
      </div>
    )
  }

}

export default  Board