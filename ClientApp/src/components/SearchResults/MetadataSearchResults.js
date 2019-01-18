import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { FacetFilter } from './MetadataSearchResults/FacetFilter';
import style from './MetadataSearchResults.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdded: this.isAddedToLocalStorage(this.getMapItem())
    };
  }
  addToLocalStorage(mapItemToAdd) {
    let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
    mapItems.push(mapItemToAdd);
    localStorage.mapItems = JSON.stringify(mapItems);
  }
  removeFromLocalStorage(mapItemToRemove) {
    let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
    localStorage.mapItems = JSON.stringify(mapItems.filter(mapItemToKeep => mapItemToKeep.GetCapabilitiesUrl !== mapItemToRemove.GetCapabilitiesUrl));
  }
  compareMapItems(mapItemToCompare, mapItemToCompareWith) {
    return mapItemToCompare.GetCapabilitiesUrl === mapItemToCompareWith.GetCapabilitiesUrl && mapItemToCompare.Title === mapItemToCompareWith.Title;
  }
  isAddedToLocalStorage(mapItemToCompare) {
    if (localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems))) {
      let isAddedToLocalStorage = false;
      JSON.parse(localStorage.mapItems).forEach((mapItemToCompareWith) => {
        if (this.compareMapItems(mapItemToCompare, mapItemToCompareWith)) {
          isAddedToLocalStorage = true;
        }
      });
      return isAddedToLocalStorage;
    } else {
      return false;
    }
  }
  getMapItem() {
    return {
      Uuid: this.props.listItem.Uuid,
      Title: this.props.listItem.Title,
      DistributionProtocol: this.props.listItem.DistributionProtocol,
      GetCapabilitiesUrl: this.props.listItem.GetCapabilitiesUrl,
      addLayers: []
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
    let mapItem = this.getMapItem();
    if (this.props.listItem.ShowMapLink) {
      let action = this.state.isAdded
        ? () => this.removeFromMap(mapItem)
        : () => this.addToMap(mapItem);
      let icon = <FontAwesomeIcon icon={this.state.isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus']} />    
      let buttonClass = this.state.isAdded ? 'off' : 'on';      
      let textContent = React.createElement('span', null, this.state.isAdded ? 'Fjern fra kart' : 'Legg til i kart')      

      let childElements = [icon, textContent];
      return React.createElement('span', { onClick: action, className: buttonClass }, childElements);     
      
    } else {
      let content = 'Utilgjengelig';
      let buttonClass = 'btn btn-sm disabled';
      return React.createElement('span', { className: buttonClass }, content);
    }
  }
  render() {
    return (
      <Row className={style.listItem}>
        <Col sm={10}>
          <span className={style.listItemTitle}><a href={this.props.listItem.ShowDetailsUrl}>{this.props.listItem.Title}</a></span>
          <span className={style.listItemInfo}>{this.props.listItem.Type} fra <a href={this.props.listItem.OrganizationUrl}>{this.props.listItem.Organization}</a></span>
        </Col>
        <Col sm={2}>
          <span className={style.listItemButton}>
            {this.renderMapButton()}
          </span>
        </Col>
      </Row>
    );
  }
}

export class MetadataSearchResults extends Component {
  displayName = MetadataSearchResults.name

  getListItems() {
    let type = this.props.getRootStateValue('selectedType');
    return this.props.searchResults[type] && this.props.searchResults[type].Results ? this.props.searchResults[type].Results : [];
  }

  renderList() {
    let listItems = this.getListItems();
    let listItemElements = listItems.map((listItem, i) => {
      return <ListItem listItem={listItem} addToMap={this.props.updateRootState.bind(this)} key={i} />;
    });
    return React.createElement('div', { className: style.list }, listItemElements);
  }

  render() {
    return (
      <Row>
        <Col sm={2}>
          <FacetFilter
            getRootStateValue={this.props.getRootStateValue.bind(this)}
            updateRootState={this.props.updateRootState.bind(this)}
            showResults={this.props.showResults.bind(this)}>
          </FacetFilter>
        </Col>
        <Col sm={10}>
          <Grid fluid>
            {this.renderList()}
          </Grid>
        </Col>
      </Row>
    );
  }
}
