import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import style from './Modal.scss';
import styleBtn from './Buttons.scss';


class Modal extends Component {

  handleClick = (e) => {
    if (this.node && this.node.contains(e.target)) {
      return;
    }
    this.props.handleClose();
  }

  escFunction = (event) => {
    if (event.keyCode === 27) {
      this.props.handleClose();
    }
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
    document.addEventListener("keydown", this.escFunction, false);

  }

  componentWillUnmount() {
    document.addEventListener('mousedown', this.handleClick, false);
    document.removeEventListener("keydown", this.escFunction, false);

  }

  render() {
    const modalClassnames = classNames({
      [style.modal]: true,
      [style.hidden]: !this.props.show
    });
    const modalButtonClassnames = classNames({
      [styleBtn.btn]: true,
      [style.modalButton]: true
    });
    return (
      <div className={modalClassnames}>
        <section className={style.modalMain}>
          {this.props.children}
          <button className={modalButtonClassnames} onClick={this.props.handleClose}>Lukk</button>
        </section>
      </div>
    );
  }
}

export default connect(null, null)(Modal);
