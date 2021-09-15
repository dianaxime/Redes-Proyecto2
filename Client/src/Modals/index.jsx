//import "./chat.scss";
//import { to_Decrypt, to_Encrypt } from "../aes.js";
import React, { useState, useEffect, useRef } from "react";
import styles from './modal.module.css';
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

let lie = []
let play = []

export const Modal = ({
  type,
  closeModal,
  deck
}) => {
  return (
    <>
      {type === 'lie' &&
        <div className={styles.modal}>
          Select your cards for lie
          <hr></hr>
          <div className='row'>
            <div className="col col-md-6">
              <label className={styles.text}>Palo </label>
              <br />
              <select className={styles.option}>
                <option default hidden>--</option>
                {palo.map((palo) => (
                  <option className={styles.option} value={palo.value}>{palo.label}</option>
                ))}
              </select>
            </div>
            <div className="col col-md-6">

              <label className={styles.text}>Valor </label>
              <select className={styles.option}>
              <option default hidden>--</option>
                {nums.map((nums) => (
                  <option className={styles.option} value={nums.value}>{nums.label}</option>
                ))}
              </select>
            </div>
          </div>
          <br />
          <div class="modal-footer">
            <button type="button" >Save changes</button>
            <button type="button" onClick={() => { closeModal() }}>Close</button>
          </div>
        </div>}

      {type === 'play' &&
        <div className={styles.modal}>
        Select your cards for move
        <hr></hr>
        <div className='row'>
          <div className="col col-md-6">
            <label className={styles.text}>Palo </label>
            <br />
            <select className={styles.option} onChange={(e) => {
              play.push(e.target.value)
            console.log(play)
            }}>
              <option default hidden>--</option>
              {deck.map((palo, idx) => (
                <option className={styles.option} value={idx}>{palo.desc} </option>
              ))}
            </select>
          </div>
        </div>
        <br />
        <div class="modal-footer">
          <button type="button" >Save changes</button>
          <button type="button" onClick={() => { closeModal() }}>Close</button>
        </div>
      </div>}
    </>
  )
}

export default Modal;