import React, { useState, useEffect, useRef } from "react";
import styles from './modal.module.css';
import { Component } from 'react';
import Select from "react-dropdown-select";
import { to_Decrypt, to_Encrypt } from "../aes.js";
import styled from "@emotion/styled";


const pool_cards = [
  { palo: 'oro', valor: 1, desc: 'Uno de Oro' }, { palo: 'oro', valor: 2, desc: 'Dos de Oro' }, { palo: 'oro', valor: 3, desc: 'Tres de Oro' }, { palo: 'oro', valor: 4, desc: 'Cuatro de Oro' },
  { palo: 'oro', valor: 5, desc: 'Cinco de Oro' }, { palo: 'oro', valor: 6, desc: 'Seis de Oro' }, { palo: 'oro', valor: 7, desc: 'Siete de Oro' }, { palo: 'oro', valor: 8, desc: 'Ocho de Oro' },
  { palo: 'oro', valor: 9, desc: 'Nueve de Oro' }, { palo: 'oro', valor: 10, desc: 'Diez de Oro' }, { palo: 'oro', valor: 11, desc: 'Once de Oro' }, { palo: 'oro', valor: 12, desc: 'Doce de Oro' },

  { palo: 'copas', valor: 1, desc: 'Uno de Copas' }, { palo: 'copas', valor: 2, desc: 'Dos de Copas' }, { palo: 'copas', valor: 3, desc: 'Tres de Copas' }, { palo: 'copas', valor: 4, desc: 'Cuatro de Copas' },
  { palo: 'copas', valor: 5, desc: 'Cinco de Copas' }, { palo: 'copas', valor: 6, desc: 'Seis de Copas' }, { palo: 'copas', valor: 7, desc: 'Siete de Copas' }, { palo: 'copas', valor: 8, desc: 'Ocho de Copas' },
  { palo: 'copas', valor: 9, desc: 'Nueve de Copas' }, { palo: 'copas', valor: 10, desc: 'Diez de Copas' }, { palo: 'copas', valor: 11, desc: 'Once de Copas' }, { palo: 'copas', valor: 12, desc: 'Doce de Copas' },

  { palo: 'espadas', valor: 1, desc: 'Uno de Oro' }, { palo: 'espadas', valor: 2, desc: 'Dos de Espadas' }, { palo: 'espadas', valor: 3, desc: 'Tres de Espadas' }, { palo: 'espadas', valor: 4, desc: 'Cuatro de Espadas' },
  { palo: 'espadas', valor: 5, desc: 'Cinco de Oro' }, { palo: 'espadas', valor: 6, desc: 'Seis de Espadas' }, { palo: 'espadas', valor: 7, desc: 'Siete de Espadas' }, { palo: 'espadas', valor: 8, desc: 'Ocho de Espadas' },
  { palo: 'espadas', valor: 9, desc: 'Nueve de Oro' }, { palo: 'espadas', valor: 10, desc: 'Diez de Espadas' }, { palo: 'espadas', valor: 11, desc: 'Once de Espadas' }, { palo: 'espadas', valor: 12, desc: 'Doce de Espadas' },

  { palo: 'bastos', valor: 1, desc: 'Uno de Bastos' }, { palo: 'bastos', valor: 2, desc: 'Dos de Bastos' }, { palo: 'bastos', valor: 3, desc: 'Tres de Bastos' }, { palo: 'bastos', valor: 4, desc: 'Cuatro de Bastos' },
  { palo: 'bastos', valor: 5, desc: 'Cinco de Bastos' }, { palo: 'bastos', valor: 6, desc: 'Seis de Bastos' }, { palo: 'bastos', valor: 7, desc: 'Siete de Bastos' }, { palo: 'bastos', valor: 8, desc: 'Ocho de Bastos' },
  { palo: 'bastos', valor: 9, desc: 'Nueve de Bastos' }, { palo: 'bastos', valor: 10, desc: 'Diez de Bastos' }, { palo: 'bastos', valor: 11, desc: 'Once de Bastos' }, { palo: 'bastos', valor: 12, desc: 'Doce de Bastos' },
]


class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lie: [],
      play: [],
      onPlay: true,
      onLie: false,
      discardCard: [{ palo: '', valor: 0, desc: '' }],
      newDeck: [],
      multi: true,
      disabled: false,
      loading: false,
      contentRenderer: false,
      dropdownRenderer: false,
      inputRenderer: false,
      itemRenderer: false,
      optionRenderer: false,
      noDataRenderer: false,
      selectValues: [],
      selectValuesLie: [],
      //searchBy: "username",
      clearable: false,
      searchable: true,
      create: false,
      separator: false,
      forceOpen: false,
      handle: true,
      addPlaceholder: "+ click to add",
      //labelField: "username",
      //valueField: "email",
      color: "#0074D9",
      keepSelectedInList: true,
      closeOnSelect: false,
      dropdownPosition: "bottom",
      direction: "ltr",
      dropdownHeight: "300px"
    }
  }

  setValues = selectValues => this.setState({ selectValues });

  setValuesLie = selectValuesLie => this.setState({ selectValuesLie });

  sendMove = (socket, roomname) => {
    let r_cards = this.state.selectValues.map((card, idx) => {
      return {
        palo: card.palo,
        valor: card.valor,
        desc: card.desc,
      }
    })

    let lie = this.state.selectValuesLie.map((card, idx) => {
      return {
        palo: card.palo,
        valor: card.valor,
        desc: card.desc,
      }
    })

    let move = {
      room: roomname,
      r_cards: r_cards,
      lie: lie
    }
    //encrypt here
    const ans = to_Encrypt(JSON.stringify(move));
    socket.emit("move", ans);
  };

  componentDidMount = () => {
    let newDeck = this.props.deck.map((card, idx) => {
      return {
        palo: card.palo,
        valor: card.valor,
        label: card.desc,
        value: idx,
        desc: card.desc,
        enabled: false,
        id: idx
      }
    })

    let allCards = pool_cards.map((card, idx) => {
      return {
        palo: card.palo,
        valor: card.valor,
        label: card.desc,
        value: idx,
        desc: card.desc,
        enabled: false,
        id: idx
      }
    })

    this.setState({
      newDeck: newDeck,
      allCards: allCards
    })
  }

  render() {
    const {
      closeModal,
      socket,
      roomname,
      deck,
      saveChanges
    } = this.props;
    return (
      <div>
        {this.state.onLie === true &&
          <div className={styles.modal}>
            Select your cards for lie
            <hr></hr>
            <div className='row'>
              <div className="col col-md-8">
                <label className={styles.text}>All Cards: </label>
                <br />
                <Select
                  className={styles.option}
                  multi={true}
                  options={this.state.allCards}
                  onChange={(values) => this.setValuesLie(values)} />
                {/*<p>Los valores seleccionados son: {JSON.stringify(this.state.selectValuesLie, false, 2)}</p>*/}
              </div>
            </div>
            <br />
            <div class="modal-footer">
              {this.state.selectValues.length === this.state.selectValuesLie.length ?
                <button type="button" onClick={() => { this.sendMove(socket, roomname) }}>End Turn</button>
                :
                `Debes seleccionar unicamente ${this.state.selectValues.length} cartas`
              }
              <button type="button" onClick={() => { closeModal() }}>Close</button>
            </div>
          </div>}

        {this.state.onPlay === true &&
          <div className={styles.modal}>
            Select your cards for move
            <hr></hr>
            <div className='row'>
              <div className="col col-md-8">
                <label className={styles.text}>Your Deck</label>
                <br />
                <Select className={styles.option}
                  multi={true}
                  options={this.state.newDeck}
                  onChange={(values) => this.setValues(values)} />
                {/*<p>Los valores seleccionados son: {JSON.stringify(this.state.selectValues, false, 2)}</p>*/}

              </div>
            </div>
            <br />
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" onClick={() => {
                this.setState({
                  onPlay: false,
                  onLie: true
                })
              }}>Save changes</button>
              <button type="button" class="btn btn-light" onClick={() => { closeModal() }}>Close</button>
            </div>

          </div>}
      </div>
    )
  }
}

export default Modal;