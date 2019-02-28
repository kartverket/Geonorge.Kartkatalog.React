import React, { Component } from 'react';
import style from './Modal.scss';
import styleBtn from './Buttons.scss';

export const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
  
    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          {children}
          <button className={styleBtn.btn} onClick={handleClose}>Lukk</button>
        </section>
      </div>
    );
  };