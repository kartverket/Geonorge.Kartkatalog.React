import React, { Component } from 'react';
import style from './MapContainer.scss';

import Map from 'r_map'

const EXEMPEL = [
  {
    "Uuid": "8c2c434b-07f7-4ebc-9bc6-9c15cdd75c4c",
    "Title": "Fastmerker & Basestajoner WMS",
    "DistributionProtocol": "OGC:WMS",
    "GetCapabilitiesUrl": "https://openwms.statkart.no/skwms1/wms.fastmerker2?request=GetCapabilities&service=WMS",
    addLayers:[]
  }
]

export class MapContainer extends Component {
    displayName = MapContainer.name

    constructor(props) {
        super(props);
        this.state = {
          services: EXEMPEL
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
            {/** <Map services = { this.props.items }/> */}
            <Map services = { this.state.services }/>
        </div>
      );
    }
  }
  