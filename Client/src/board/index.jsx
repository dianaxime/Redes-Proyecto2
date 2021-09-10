import React, { useState, useEffect, useRef } from "react";
import { Component } from 'react';
import Deck from '../Deck';
import style from './board.module.css'

class Board extends Component {

  render() {
    const {
      username,
      on_turn,
      deck,
    } = this.props;
    return (
      <div className={style.board}>
        <div className="row">
          <div className="col col-md-3">
            <h4>Username:</h4>
          </div>
          <div className="col col-md-3">
            <h4>{username ? username : ''}</h4>
          </div>
          <div className="col col-md-3">
            <h4>On turn:</h4> </div>
          <div className="col col-md-3">
            <h4>{on_turn ? on_turn : ''}</h4>
          </div>

          {/* carta del player*/}
          <div className={style.gameboard}>
            <div className="row">
              {deck.lenght !== 0 ? deck.map((data) => (
                <div className="col col-lg-2"> <Deck
                  mass={data.palo}
                  value={data.valor} />
                </div>
              )) : <>play to start</>}
            </div>

          </div>
        </div>
      </div>
    )
  }

}

export default Board