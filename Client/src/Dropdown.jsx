import React, { useState, useEffect, useRef } from "react";
//import styles from './modal.module.css';
import { Component } from 'react';
import Select from "react-dropdown-select";
import styled from "@emotion/styled";

const palo = [
  { value: 'oro', label: 'oro' },
  { value: 'copas', label: 'copas' },
  { value: 'espadas', label: 'espadas' },
  { value: 'bastos', label: 'bastos' }
]

const StyledHtmlSelect = styled.select`
  padding: 0;
  margin: 0 0 0 10px;
  height: 50px !important;
  color: red !important;
  background: #fff;
  border: 1px solid #0071dc;
`;

const colores = {
  color: 'red'
}

class DropDown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectValues: [],
    }
  }

  setValues = selectValues => this.setState({ selectValues });

  render() {
    return (
      <div>
        hola
        {<Select 
        className={colores}
        placeholder="Select peoples"
        multi={true}
        //color={"black"}
        options={palo}
        onChange={(values) => this.setValues(values)}
        />}

{<StyledHtmlSelect 
        placeholder="Select peoples"
        multi={true}
        color={"black"}
        options={palo}
        onChange={(values) => this.setValues(values)}
        >
          {Object.keys(palo[0]).map(f => (
              <option key={f} value={f}>
                {f}
              </option>))}
          </StyledHtmlSelect>}
          <br />
        <p>Los valores seleccionados son: {JSON.stringify(this.state.selectValues, false, 2)}</p>
      </div>
    )
  }
}

export default DropDown;