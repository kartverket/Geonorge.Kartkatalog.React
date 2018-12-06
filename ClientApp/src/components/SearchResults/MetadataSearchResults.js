import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import style from './MetadataSearchResults.scss';
const dummydata = require('./MetadataSearchResults/dummydata.json');

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      isAdded: this.isAddedToLocalStorage(this.props.listItem.GetCapabilitiesUrl)
    };
  }

  addToLocalStorage(GetCapabilitiesUrl) {
    let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
    mapItems.push(GetCapabilitiesUrl);
    localStorage.mapItems = JSON.stringify(mapItems);
  }
  removeFromLocalStorage(GetCapabilitiesUrl) {
    let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
    localStorage.mapItems = JSON.stringify(mapItems.filter(mapItem => mapItem !== GetCapabilitiesUrl));
  }
  isAddedToLocalStorage(GetCapabilitiesUrl) {
    if ( localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ) {
      return JSON.parse(localStorage.mapItems).includes(GetCapabilitiesUrl);
    }else {
      return false;
    }
  }

  addToMap(GetCapabilitiesUrl) {
    this.setState({
      isAdded: true
    });
    this.addToLocalStorage(GetCapabilitiesUrl);
    this.props.addToMap();
  }
  removeFromMap(GetCapabilitiesUrl) {
    this.setState({
      isAdded: false
    });
    this.removeFromLocalStorage(GetCapabilitiesUrl);
    this.props.addToMap();
  }

  renderMapButton() {
    if (this.props.listItem.ShowMapLink){
      let action = this.state.isAdded 
      ? () => this.removeFromMap(this.props.listItem.GetCapabilitiesUrl)
      : () => this.addToMap(this.props.listItem.GetCapabilitiesUrl);
      let content = this.state.isAdded ? 'Fjern fra kart' : 'Legg til i kart';
      let buttonClass = this.state.isAdded ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-success';
      return React.createElement('span', { onClick: action, className: buttonClass }, content);
    }else {
      let content = 'Utilgjengelig';
      let buttonClass = 'btn btn-sm disabled';
      return React.createElement('span', { className: buttonClass }, content);
    }
  }


	render() {
		return (
      <Row className={style.listItem}>
          <Col sm={9}>
            <span className={style.listItemTitle}>{ this.props.listItem.Title }</span>
            <span className={style.listItemInfo}>{this.props.listItem.TypeTranslated} fra <a href="#">{this.props.listItem.OrganizationShortName}</a></span>
          </Col>
          <Col sm={3}>
          <span className={style.listItemButton}>
            { this.renderMapButton() }
          </span>
          </Col>
        </Row>
		);
	}
}

export class MetadataSearchResults extends Component {
  displayName = MetadataSearchResults.name

  constructor(props) {
    super(props);
    this.state = { 
      items: dummydata
    };
  }

  renderList() {
      let listItems = this.state.items.map( (listItem, i) => {
        return <ListItem listItem={listItem} addToMap={this.props.updateNumberOfItems.bind(this)} key={i}/>;
      });
      return React.createElement('div', { className: style.list }, listItems);
  }

  render() {
    return (
      <Grid fluid>
      {this.renderList()}
      </Grid>
    );
  }
}
