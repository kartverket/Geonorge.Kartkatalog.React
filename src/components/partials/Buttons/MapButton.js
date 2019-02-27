import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './Buttons.scss'

import { removeMapItem, addMapItem } from '../../../actions/MapItemActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class MapButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMapItems: localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [],
            expanded: false
        };
    }

    compareMapItems(mapItemToCompare, mapItemToCompareWith) {
        return mapItemToCompare.GetCapabilitiesUrl === mapItemToCompareWith.GetCapabilitiesUrl && mapItemToCompare.Title === mapItemToCompareWith.Title;
    }

    mapItemIsAddedToLocalStorage(mapItemToCompare) {
        let isAddedToLocalStorage = false;
        this.state.selectedMapItems.forEach((mapItemToCompareWith) => {
            if (this.compareMapItems(mapItemToCompare, mapItemToCompareWith)) {
                isAddedToLocalStorage = true;
            }
        });
        return isAddedToLocalStorage;
    }

    datasetServicesIsAddedToLocalStorage() {
        let isAddedToLocalStorage = false;
        this.state.selectedMapItems.forEach((mapItemToCompareWith) => {
            this.props.metadata.DatasetServicesWithShowMapLink.forEach(item => {
                if (this.compareMapItems(item, mapItemToCompareWith)) {
                    isAddedToLocalStorage = true;
                }
            })
        });
        return isAddedToLocalStorage;
    }

    getMapItem(service = null) {
        return {
            Uuid: service ? service.Uuid : this.props.metadata.Uuid,
            Title: service ? service.Title : this.props.metadata.Title,
            DistributionProtocol: service ? service.DistributionProtocol : this.props.metadata.DistributionProtocol,
            GetCapabilitiesUrl: service ? service.GetCapabilitiesUrl : this.props.metadata.GetCapabilitiesUrl,
            addLayers: []
        }
    }

    getServiceMapItem() {
        return {
            Uuid: this.props.metadata.Uuid,
            Title: this.props.metadata.Title,                        
            DistributionProtocol: this.props.metadata.ServiceDistributionProtocolForDataset,
            GetCapabilitiesUrl: this.props.metadata.MapLink,
            addLayers: []
        } 
    }

    getMapItemFromMetadata() {
        return {
            Uuid: this.props.metadata.Uuid,
            Title: this.props.metadata.Title,                        
            DistributionProtocol: this.props.metadata.DistributionDetails.Protocol,
            GetCapabilitiesUrl: this.props.metadata.MapLink,
            addLayers: []
        } 
    }

    addToMap(mapItem) {
        this.props.addMapItem(mapItem);
        this.setState({
            isAdded: true,
            selectedMapItems: localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : []
        });

    }

    toggleExpand() {
        this.setState(prevState => ({
            expanded: !prevState.expanded && !prevState.expandedDownload
        }))
    }

    removeFromMap(mapItem) {
        this.props.removeMapItem(mapItem);
        this.setState({
            isAdded: false,
            selectedMapItems: localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : []
        });
    }

    renderListButton() {
        if (this.props.metadata.ShowMapLink) {
            let mapItem = this.props.metadata.Type === "dataset" ? this.getMapItem(this.props.metadata.DatasetServicesWithShowMapLink[0]) : this.getMapItem();
            let isAdded = this.mapItemIsAddedToLocalStorage(mapItem);
            let action = isAdded
                ? () => this.removeFromMap([mapItem])
                : () => this.addToMap([mapItem]);
            let icon = <FontAwesomeIcon title={isAdded ? "Fjern fra kart" : "Legg til i kart"} icon={isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus']}
                key="icon" />;
            let buttonClass = isAdded ? 'off' : 'on';
            let textContent = React.createElement('span', { key: "textContent" }, isAdded ? 'Fjern fra kart' : 'Legg til i kart');

            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);
        }
        return null;
    }

    renderButton(){
        if (this.props.metadata.CanShowServiceMapUrl || this.props.metadata.CanShowMapUrl) {
            let mapItem;
            if(this.props.metadata.CanShowServiceMapUrl){
                mapItem = this.getServiceMapItem()                
            }
            else if(this.props.metadata.CanShowMapUrl){
                mapItem = this.getMapItemFromMetadata()           
            }
            let isAdded = this.mapItemIsAddedToLocalStorage(mapItem);
            let action = isAdded
                ? () => this.removeFromMap([mapItem])
                : () => this.addToMap([mapItem]);
            let icon = <FontAwesomeIcon title={isAdded ? "Fjern fra kart" : "Legg til i kart"} icon={isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus']}
                key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, isAdded ? 'Fjern fra kart' : 'Legg til i kart');

            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title="Legg til i kart" icon={['far', 'map-marker-plus']} key="icon" />;
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, 'Legg til i kart');

            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }

    render() {
        if (this.props.listButton) {
            return this.renderListButton()
        }
        else{
            return this.renderButton()
        }
    }
}

MapButton.propTypes = {
    metadata: PropTypes.object.isRequired,
    listButton: PropTypes.bool,
    removeMapItem: PropTypes.func.isRequired,
    addMapItem: PropTypes.func.isRequired
};


MapButton.defaultProps = {
    listButton: true,
};

const mapDispatchToProps = {
    removeMapItem,
    addMapItem,
};

export default connect(null, mapDispatchToProps)(MapButton);
