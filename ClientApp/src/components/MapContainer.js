import React, { Component } from 'react';
import style from './MapContainer.scss';

import {Map} from 'r_map';

export class MapContainer extends Component {
    displayName = MapContainer.name
    render() {
      return (
        <div className={style.map}>  
          <Map services={ this.props.mapItems }/> 
        </div>
      );
    }
  }
  