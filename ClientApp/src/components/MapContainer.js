import React, { Component } from 'react';
import style from './MapContainer.scss';

export class MapContainer extends Component {
    displayName = MapContainer.name

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderList() {
      let listItems = this.props.items.map( (listItem) => {
        return  React.createElement('li', null, listItem);
      });
      return React.createElement('ul', { className: style.list }, listItems);
  }
  
    render() {
      return (
        <div className={style.map}>
            { this.renderList() }
        </div>
      );
    }
  }
  