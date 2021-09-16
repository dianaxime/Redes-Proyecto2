import React, { useState, useEffect, useRef } from "react";
import { Component } from 'react';
import Deck from '../Deck';
import style from './board.module.css';
import  Modal  from '../Modals';

class Board extends Component {
  constructor() {
    super()
    this.state = {
      lieModal: false,
      playModal: false,
      //lenghtD: [1, 2]
      //guess: undefined
    }
  }

  formLie = () => {
    this.setState({
      lieModal: !this.state.lieModal
    });
    console.log(this.state.lieModal)
  }

  formPlay = () => {
    this.setState({
      playModal: !this.state.playModal
    });
    console.log(this.state.playModal)
  }

  sendLie = (lie) => {
    console.log(lie)
  }

  render() {
    const {
      username,
      on_turn,
      deck,

    } = this.props;
    return (
      <div className={style.board}>

        <div className="row">
          <div className="col col-md-2">
            <h4>Username:</h4>
          </div>
          <div className="col col-md-2">
            <h4>{username ? username : ''}</h4>
          </div>
          <div className="col col-md-2">
            <h4>On turn:</h4> </div>
          <div className="col col-md-2">
            <h4>{on_turn ? on_turn : ''}</h4>
          </div>
          <div className="col col-md-2">
            {on_turn &&
              <>
                {on_turn === 'liar' ?
                  <span>
                    <button
                      onClick={() => { this.formLie() }}
                    >Select lie
                    </button>
                  </span> :
                  ''}
              </>}
            {on_turn &&
              <>
                {on_turn === 'liar' ?
                  <span>
                    <button
                      onClick={() => { this.formPlay() }}
                    >select cads</button>
                  </span> :
                  ''}
              </>}
            {on_turn && <>{on_turn === 'guesser' ?
              <span><button>Decidir</button></span> : ''}</>}
          </div>
          <br />
          <div className="col col-md-12">
            hola
            {/* aqui llamamos a los forms de */}
            {this.state.lieModal === true &&
              <Modal
                type={'lie'}
                closeModal={this.formLie}
                saveChanges={this.sendLie}
                deck={deck}
                lenghtD={[1,2]}
              />
            }
            {/*this.state.playModal === true &&
              <Modal
                type={'play'}
                closeModal={this.formPlay}
                saveChanges={'hola'}
                deck={deck}
            />*/}
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