import React, { useState, useEffect, useRef } from "react";
import { Component } from 'react';
import style from './deck.module.css';

const maso = {palo:'copas', valor: '1'}

class Deck extends Component {
  render() {
    const {
      play
    } = this.props;
    return (
      <div className={style.card}>
        <div className={style.number}>
          {maso.valor}
        </div>
        {maso.palo === 'oro' && <div className={style.oro}></div>}
        {maso.palo === 'espada' && <div className={style.espada}></div>}
        {maso.palo === 'copas' && <div className={style.copa}></div>}
        {maso.palo === 'bastos' && <div className={style.basto}></div>}


        
        <div className={style.numberEnd}>
        {maso.valor}
        </div>
      </div>
    )
  }
}

export default Deck;
