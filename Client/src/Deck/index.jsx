import React, { useState, useEffect, useRef } from "react";
import { Component } from 'react';
import style from './deck.module.css';

class Deck extends Component {
  render() {
    const {
      play
    } = this.props;
    return (
      <div className={style.card}>
        <div className={style.number}>
          7
        </div>
        <div className={style.oro}>
          hola

        </div>

        <div className={style.numberEnd}>
          7
        </div>

      </div>
    )
}
}

export default Deck;
