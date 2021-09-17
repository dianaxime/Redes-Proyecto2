import React, { useState, useEffect, useRef } from "react";
import { Component } from 'react';
import style from './deck.module.css';

class Deck extends Component {
  render() {
    const {
      mass,
      value
    } = this.props;
    return (
      <div className={style.card}>
        <div className={style.number}>
          {value}
        </div>
        {mass === 'oro' && <div className={style.oro}></div>}
        {mass === 'espadas' && <div className={style.espada}></div>}
        {mass === 'copas' && <div className={style.copa}></div>}
        {mass === 'bastos' && <div className={style.basto}></div>}   
        <div className={style.numberEnd}>
        {value}
        </div>
      </div>
    )
  }
}

export default Deck;
