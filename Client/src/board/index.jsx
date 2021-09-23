import React, { useState, useEffect, useRef } from "react";
import { Component } from 'react';
import Deck from '../Deck';
import style from './board.module.css';
import Modal from '../Modals';

class Board extends Component {
  constructor() {
    super()
    this.state = {
      lieModal: false,
      guessModal: false,
      //lenghtD: [1, 2]
      //guess: undefined
    }
  }

  formLie = () => {
    this.setState({
      lieModal: !this.state.lieModal
    });
  }

  formGuess = () => {
    this.setState({
      guessModal: !this.state.guessModal
    });
  }

  sendLie = (lie) => {
    console.log(lie)
  }

  render() {
    const {
      username,
      on_turn,
      deck,
      socket,
      roomname

    } = this.props;
    return (
      <div className={style.board}>

        <div className="row">
          <div className="col col-md-3">
            <h4 className={style.h4}>Username:</h4>
          </div>
          <div className="col col-md-2">
            <h4 className={style.h4Changetext}>{username ? username : ''}</h4>
          </div>
          <div className="col col-md-2">
            <h4 className={style.h4}>On turn:</h4> </div>
          <div className="col col-md-2">
            <h4 className={style.h4Changetext}>{on_turn ? on_turn : ''}</h4>
          </div>
          <div className="col col-md-2">
            {on_turn &&
              <>
              <br />
                {on_turn === 'liar' ?
                  <span>
                    <button
                      className="btn btn-outline-light"
                      onClick={() => { this.formLie() }}
                    >Select lie
                    </button>
                  </span> :
                  ''}
              </>}
            {on_turn && <>{on_turn === 'guesser' ?
              <span>
                <button
                  className="btn btn-outline-light"
                  onClick={() => { this.formGuess() }}
                > Decide
                </button>
              </span> :
              ''}
            </>}
          </div>
          
          <div className="col col-md-12">
            {/* aqui llamamos a los forms de movimiento y mentira o verdad */}
            <br />
          
            {this.state.lieModal === true &&
              <Modal
                type={'lie'}
                closeModal={this.formLie}
                socket={socket}
                roomname={roomname}
                deck={deck}
              />
            }
            {this.state.guessModal === true &&
              <Modal
                type={'guesser'}
                closeModal={this.formGuess}
                deck={deck}
                socket={socket}
                roomname={roomname}
              />}
          </div>
          {/* cartas del player*/}
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