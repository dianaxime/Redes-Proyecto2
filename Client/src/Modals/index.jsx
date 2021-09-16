//import "./chat.scss";
//import { to_Decrypt, to_Encrypt } from "../aes.js";
import React, { useState, useEffect, useRef } from "react";
import styles from './modal.module.css';
import { Component } from 'react';
//import Board from "../board";
//import { useDispatch } from "react-redux";

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

const palo = [
  { value: 'oro', label: 'oro' },
  { value: 'copas', label: 'copas' },
  { value: 'espadas', label: 'espadas' },
  { value: 'bastos', label: 'bastos' }
]

const nums = [
  { value: 1, label: 'Uno' },
  { value: 2, label: 'Dos' },
  { value: 2, label: 'Tres' },
  { value: 4, label: 'Cuatro' },
  { value: 5, label: 'Cinco' },
  { value: 6, label: 'Seis' },
  { value: 7, label: 'Siete' },
  { value: 8, label: 'Ocho' },
  { value: 9, label: 'Nueve' },
  { value: 10, label: 'Diez' },
  { value: 11, label: 'Once' },
  { value: 12, label: 'Doce' }
]

class Modal extends Component {
  constructor() {
    super()
    this.state = {
      lie: [],
      play: [],
      onPlay: true,
      onLie: false,
      discardCard: [{ palo: '', valor: 0, desc: '' }],
      newDeck: []
    }
  }

  addElement = () => {
    let items = [...this.state.lie];
    items.push({ palo: '', valor: 0 })
    console.log('items', items)
    this.setState({
      lie: items
    })
    console.log('hola', this.state.lie)
  }

  addMass = (mass, id) => {
    console.log(this.state.lie)
    console.log('maso', mass, id)
    let items = [...this.state.lie];
    let editableProcess = items[id];
    editableProcess = {
      palo: mass,
      //value: (editableProcess.value ? editableProcess.value : '')
    }
    console.log('process', editableProcess)
    /*this.setState({
      //...this.state.selectedPO,
      lie: items,
    })
    console.log('maso actualizado', this.state.lie)*/

  }

  addDiscardCard = () => {
    let cards = [...this.state.discardCard]
    console.log('estado actual', cards)
    cards.push({ palo: '', valor: 0 })
    this.setState({
      discardCard: cards
    })
    console.log('discard card', this.state.discardCard)
  }

  removeCard = (id, deck, idxCard) => {
    let cards = [...this.state.discardCard]
    let newCard = deck[id]
    console.log('antes', newCard)

    if (cards[idxCard].valor !== 0) {
      let updateId = cards[idxCard].id
  
      /*Ponemos el valor de la carta como enabled*/
      let updateDeckOld = [...this.state.newDeck]
      console.log('deck ANTES',updateDeckOld)

      //console.log('elemnto a actualizar',updateDeckOld[updateId])
      updateDeckOld[updateId] = {
        palo: updateDeckOld[updateId].palo,
        valor: updateDeckOld[updateId].valor,
        desc: updateDeckOld[updateId].desc,
        enabled: false,
        id: updateDeckOld[updateId].id
      }
      console.log('Elemento Actualizado',updateDeckOld[updateId])
      console.log('deck selecciondo',updateDeckOld)
      
      this.setState({
        newDeck: updateDeckOld
      })
      console.log('updateddeck',this.state.newDeck)

      /*se modifica la carda agregandola al deck*/
      cards[idxCard] = newCard
      this.setState({
        discardCard: cards
      })

      /*Se cambia el valor de la carta seleccionada en el deck*/
      let updateDeck = [...this.state.newDeck]
      updateDeck[id] = {
        palo: updateDeck[id].palo,
        valor: updateDeck[id].valor,
        desc: updateDeck[id].desc,
        enabled: true,
        id: updateDeck[id].id
      }
      this.setState({
        newDeck: updateDeck
      })
      console.log('deckfinal IF ',this.state.newDeck, this.state.discardCard)
    }
    else {
      cards[idxCard] = newCard
      console.log('remove Card', cards)
      this.setState({
        discardCard: cards
      })

      /*Changes on deck*/
      let updateDeck = [...this.state.newDeck]
      updateDeck[id] = {
        palo: updateDeck[id].palo,
        valor: updateDeck[id].valor,
        desc: updateDeck[id].desc,
        enabled: true,
        id: updateDeck[id].id
      }
      this.setState({
        newDeck: updateDeck
      })
      console.log('deck final ELSE',this.state.newDeck)
    }
    return this.state.newDeck
    //console.log('deckfinal FUERA IF',this.state.newDeck)
  }

  addValue = (value, id) => {
    console.log('value', value, id)
    let items = [...this.state.lie];
    let editableProcess = items[id];
    editableProcess = {
      //palo: editableProcess.palo ? editableProcess.palo : undefined,
      value: value
    }
    /*this.setState({
      //...this.state.selectedPO,
      lie: items,
    })
    console.log('valor actualizado', this.state.lie)*/

  }

  componentDidMount = () => {
    let newDeck = this.props.deck.map((card,idx) => {
      return {
        palo: card.palo,
        valor: card.valor,
        desc: card.desc,
        enabled: false,
        id: idx
      }
    }
    )
    console.log('nuevo deck', newDeck)
    this.setState({
      newDeck: newDeck
    })
  }

  render() {
    const {
      closeModal,
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
              {
                this.state.discardCard.map((cards, idx) => (
                  <>
                    <div className="col col-md-6">
                      <label className={styles.text}>Palo </label>
                      <br />
                      <select className={styles.option} onChange={(e) => {
                        this.addMass(e.target.value, idx)
                      }}
                      >
                        <option default hidden>--</option>
                        {palo.map((palo) => (
                          <option className={styles.option} value={palo.value}>{palo.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col col-md-6">
                      <label className={styles.text}>Valor </label>
                      <select className={styles.option} onChange={(e) => {
                        this.addValue(e.target.value, idx)
                      }}>
                        <option default hidden>--</option>
                        {nums.map((nums) => (
                          <option className={styles.option} value={nums.value}>{nums.label}</option>
                        ))}
                      </select>
                    </div></>))}
            </div>
            <br />
            <div class="modal-footer">
              {this.state.doneLie && <button type="button" onClick={() => { saveChanges('hols') }}>Save changes</button>}
              <button type="button" onClick={() => { closeModal() }}>Close</button>
            </div>
          </div>}

        {this.state.onPlay === true &&
          <div className={styles.modal}>
            Select your cards for move
            <button type="button" onClick={() => {
              this.addDiscardCard()
            }}> + </button>
            <hr></hr>
            <div className='row'>
              <div className="col col-md-6">
                <label className={styles.text}>Palo </label>
                <br />
                {this.state.discardCard.map((disCard, idxCard) => (
                  <>
                    <select className={styles.option} onChange={(e) => {
                      this.removeCard(e.target.value, this.state.newDeck, idxCard)
                      //console.log(e.target.value)
                    }}>
                      <option default hidden>--</option>
                      {this.state.newDeck.map((palo, idx) => (
                        <option className={styles.option} value={idx} hidden={palo.enabled}>{palo.desc} </option>
                      ))}
                    </select>
                    <div className={styles.spacio}></div>
                  </>
                ))}
              </div>
            </div>
            <br />
            <div class="modal-footer">
              <button type="button" className="primary" onClick={() => {
                this.setState({
                  onPlay: false,
                  onLie: true
                })
              }}>Save changes</button>
              <button type="button" onClick={() => { closeModal() }}>Close</button>
            </div>

          </div>}
      </div>
    )
  }
}

export default Modal;