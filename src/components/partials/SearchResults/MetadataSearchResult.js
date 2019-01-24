import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMapItems } from '../../../actions/MapItemActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'react-bootstrap';

import style from './MetadataSearchResult.scss';

class MetadataSearchResult extends Component {
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
      Uuid: this.props.searchResult.Uuid,
      Title: this.props.searchResult.Title,
      DistributionProtocol: this.props.searchResult.DistributionProtocol,
      GetCapabilitiesUrl: this.props.searchResult.GetCapabilitiesUrl,
      addLayers: []
    }
  }

  addToMap(GetCapabilitiesUrl) {
    this.setState({
      isAdded: true
    });
    this.addToLocalStorage(GetCapabilitiesUrl);
    this.props.fetchMapItems();
  }
  removeFromMap(GetCapabilitiesUrl) {
    this.setState({
      isAdded: false
    });
    this.removeFromLocalStorage(GetCapabilitiesUrl);
    this.props.fetchMapItems();
  }

  renderMapButton() {
    let mapItem = this.getMapItem();
    if (this.props.searchResult.ShowMapLink) {
      let action = this.state.isAdded
      ? () => this.removeFromMap(mapItem)
      : () => this.addToMap(mapItem);
      let icon = <FontAwesomeIcon icon={this.state.isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus']} key="icon" />    
      let buttonClass = this.state.isAdded ? 'off' : 'on';      
      let textContent = React.createElement('span', {key: "textContent"}, this.state.isAdded ? 'Fjern fra kart' : 'Legg til i kart')

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
     <span className={style.listItemTitle}><a href={this.props.searchResult.ShowDetailsUrl}>{this.props.searchResult.Title}</a></span>
     <span className={style.listItemInfo}>{this.props.searchResult.Type} fra <a href={this.props.searchResult.OrganizationUrl}>{this.props.searchResult.Organization}</a></span>
     </Col>
     <Col sm={2}>
     <span className={style.listItemButton}>
     {this.renderMapButton()}
     </span>
     </Col>
     </Row>
     )
  }
}

const mapStateToProps = state => ({
  mapItems: state.mapItems
});

export default connect(mapStateToProps, { fetchMapItems })(MetadataSearchResult);