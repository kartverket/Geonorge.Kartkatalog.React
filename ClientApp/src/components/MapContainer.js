import React, { Component } from 'react';
import style from './MapContainer.scss';

import {Map} from 'r_map';

export class MapContainer extends Component {
    displayName = MapContainer.name

    constructor(props) {
        super(props);
    }
  
    render() {
      return (
        <div className={style.map}>        
            <Map services = { this.props.items }/>
        </div>
      );
    }
  }
  