import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import style from './MetadataSearchResults.scss';
const dummydata = require('./MetadataSearchResults/dummydata.json');

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      isAdded: this.isAddedToLocalStorage(this.props.listItem.Uuid)
    };
  }

  addToLocalStorage(uuid) {
    let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
    mapItems.push(uuid);
    localStorage.mapItems = JSON.stringify(mapItems);
  }
  removeFromLocalStorage(uuid) {
    let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
    localStorage.mapItems = JSON.stringify(mapItems.filter(mapItem => mapItem !== uuid));
  }
  isAddedToLocalStorage(uuid) {
    if ( localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ) {
      return JSON.parse(localStorage.mapItems).includes(uuid);
    }else {
      return false;
    }
  }

  addToMap(uuid) {
    this.setState({
      isAdded: true
    });
    this.addToLocalStorage(uuid);
    this.props.addToMap();
  }
  removeFromMap(uuid) {
    this.setState({
      isAdded: false
    });
    this.removeFromLocalStorage(uuid);
    this.props.addToMap();
  }

  renderMapButton() {
    if (this.props.listItem.ShowMapLink){
      let action = this.state.isAdded 
      ? () => this.removeFromMap(this.props.listItem.Uuid)
      : () => this.addToMap(this.props.listItem.Uuid);
      let content = this.state.isAdded ? 'Fjern fra kart' : 'Legg til i kart';
      let buttonClass = this.state.isAdded ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-success';
      return React.createElement('span', { onClick: action, className: buttonClass }, content);
    }else {
      return null;
    }
  }


	render() {
		return (
      <Row>
          <Col sm={9}>
          { this.props.listItem.Title }
          </Col>
          <Col sm={3}>
          { this.renderMapButton() }
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
        return <ListItem listItem={listItem} addToMap={this.props.updateNumberOfItems.bind(this)} className={style.listItem} key={i}/>;
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
