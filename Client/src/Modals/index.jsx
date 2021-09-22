import React, { useState, useEffect, useRef } from "react";
import styles from './modal.module.css';
import { Component } from 'react';
import Select from "react-dropdown-select";
import { to_Decrypt, to_Encrypt } from "../aes.js";
import styled from "@emotion/styled";


const pool_cards = [
  { palo: 'oro', valor: 1, desc: 'One of Coins' }, { palo: 'oro', valor: 2, desc: 'Two of Coins' }, { palo: 'oro', valor: 3, desc: 'Three of Coins' }, { palo: 'oro', valor: 4, desc: 'Four of Coins' },
  { palo: 'oro', valor: 5, desc: 'Five of Coins' }, { palo: 'oro', valor: 6, desc: 'Six of Coins' }, { palo: 'oro', valor: 7, desc: 'Seven of Coins' }, { palo: 'oro', valor: 8, desc: 'Eight of Coins' },
  { palo: 'oro', valor: 9, desc: 'Nine of Coins' }, { palo: 'oro', valor: 10, desc: 'Ten of Coins' }, { palo: 'oro', valor: 11, desc: 'Eleven of Coins' }, { palo: 'oro', valor: 12, desc: 'Twelve of Coins' },

  { palo: 'copas', valor: 1, desc: 'One of Cups' }, { palo: 'copas', valor: 2, desc: 'Two of Cups' }, { palo: 'copas', valor: 3, desc: 'Three of Cups' }, { palo: 'copas', valor: 4, desc: 'Four of Cups' },
  { palo: 'copas', valor: 5, desc: 'Five of Cups' }, { palo: 'copas', valor: 6, desc: 'Six of Cups' }, { palo: 'copas', valor: 7, desc: 'Seven of Cups' }, { palo: 'copas', valor: 8, desc: 'Eight of Cups' },
  { palo: 'copas', valor: 9, desc: 'Nine of Cups' }, { palo: 'copas', valor: 10, desc: 'Ten of Cups' }, { palo: 'copas', valor: 11, desc: 'Eleven of Cups' }, { palo: 'copas', valor: 12, desc: 'Twelve of Cups' },

  { palo: 'espadas', valor: 1, desc: 'One of Swords' }, { palo: 'espadas', valor: 2, desc: 'Two of Swords' }, { palo: 'espadas', valor: 3, desc: 'Three of Swords' }, { palo: 'espadas', valor: 4, desc: 'Four of Swords' },
  { palo: 'espadas', valor: 5, desc: 'Five of Swords' }, { palo: 'espadas', valor: 6, desc: 'Six of Swords' }, { palo: 'espadas', valor: 7, desc: 'Seven of Swords' }, { palo: 'espadas', valor: 8, desc: 'Eight of Swords' },
  { palo: 'espadas', valor: 9, desc: 'Nine of Swords' }, { palo: 'espadas', valor: 10, desc: 'Ten of Swords' }, { palo: 'espadas', valor: 11, desc: 'Eleven of Swords' }, { palo: 'espadas', valor: 12, desc: 'Twelve of Swords' },

  { palo: 'bastos', valor: 1, desc: 'One of Clubs' }, { palo: 'bastos', valor: 2, desc: 'Two of Clubs' }, { palo: 'bastos', valor: 3, desc: 'Three of Clubs' }, { palo: 'bastos', valor: 4, desc: 'Four of Clubs' },
  { palo: 'bastos', valor: 5, desc: 'Five of Clubs' }, { palo: 'bastos', valor: 6, desc: 'Six of Clubs' }, { palo: 'bastos', valor: 7, desc: 'Seven of Clubs' }, { palo: 'bastos', valor: 8, desc: 'Eight of Clubs' },
  { palo: 'bastos', valor: 9, desc: 'Nine of Clubs' }, { palo: 'bastos', valor: 10, desc: 'Ten of Clubs' }, { palo: 'bastos', valor: 11, desc: 'Eleven of Clubs' }, { palo: 'bastos', valor: 12, desc: 'Twelve of Clubs' },
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
    let r_cards = this.state.selectValues.map((card) => {
      return {
        palo: card.palo,
        valor: card.valor,
        desc: card.desc,
      }
    })

    let lie = this.state.selectValuesLie.map((card) => {
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

  sendChoice = (choice, socket, roomname) => {
    let guesser_choice = {
      room: roomname,
      choice: choice
    }
    const ans = to_Encrypt(JSON.stringify(guesser_choice));
    socket.emit("guesser_choice", ans);
  }

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
      type,
      closeModal,
      socket,
      roomname,
      deck,
      saveChanges
    } = this.props;
    return (
      <div>
        {type === 'lie' &&
          <>
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
                    {/*<p>Los valores seleccionaTwo son: {JSON.stringify(this.state.selectValuesLie, false, 2)}</p>*/}
                  </div>
                </div>
                <br />
                <div class="modal-footer">
                  {this.state.selectValues.length === this.state.selectValuesLie.length ?
                    <button type="button" className="btn btn-outline-primary" onClick={() => { this.sendMove(socket, roomname); closeModal();}}>End Turn</button>
                    :
                    `You must select ${this.state.selectValues.length} cards`
                  }
                  <button type="button" className="btn btn-outline-secondary" onClick={() => { closeModal() }}>Close</button>
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
                    {/*<p>Los valores seleccionaTwo son: {JSON.stringify(this.state.selectValues, false, 2)}</p>*/}

                  </div>
                </div>
                <br />
                <div class="modal-footer">
                  <button type="button" className="btn btn-outline-primary" onClick={() => {
                    this.setState({
                      onPlay: false,
                      onLie: true
                    })
                  }}>Save changes</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => { closeModal() }}>Close</button>
                </div>
              </div>
            }
          </>
        }
        {type === 'guesser' &&
          <div className={styles.modal}>

            You think this was a lie?
            <hr></hr>
            <div className='row'>
              <div className="col col-md-3">
              <button type="button" className="btn btn-danger" onClick={() => {this.sendChoice(true, socket, roomname); closeModal(); }}>It`s Lie!</button>
              </div>
              <div className="col col-md-3">
                <button type="button" className="btn btn-success" onClick={() => {this.sendChoice(false, socket, roomname); closeModal(); }}>It`s True!</button>
              </div>
            </div>
          <br />
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" onClick={() => { closeModal() }}>Close</button>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Modal;