// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { removeMapItem, addMapItem } from '../../../actions/MapItemActions'
import { getResource } from '../../../actions/ResourceActions'

// Stylesheets
import style from './Buttons.scss'


export class MapButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            isAdded: false
        };
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
    }

    toggleExpand() {
        this.setState(prevState => ({
            expanded: !prevState.expanded && !prevState.expandedDownload
        }))
    }

    removeFromMap(mapItem) {
        this.props.removeMapItem(mapItem);
    }

    renderListButton() {
        if (this.props.metadata.ShowMapLink || this.props.metadata.CanShowMapUrl) {
            let mapItem = this.props.metadata.Type === "dataset" || this.props.metadata.Type === "Datasett" ? this.getMapItem(this.props.metadata.DatasetServicesWithShowMapLink[0]) : this.getMapItem();
            let isAdded = this.state.isAdded;
            let buttonDescription = isAdded ? this.props.getResource('removeFromMap', 'Fjern fra kart') : this.props.getResource('addToMap', 'Legg til i kart');
            let action = isAdded
                ? () => this.removeFromMap([mapItem])
                : () => this.addToMap([mapItem]);
            let icon = <FontAwesomeIcon title={buttonDescription} icon={isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus']}
                key="icon" />;
            let buttonClass = isAdded ? 'off' : 'on';
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);
        }
        return null;
    }

    renderButton() {
        let isAdded = this.state.isAdded;
        const buttonDescription = isAdded ? this.props.getResource('removeFromMap', 'Fjern fra kart') : this.props.getResource('addToMap', 'Legg til i kart');
        const buttonClass = this.state.isAdded ? [style.btn + ' remove'] : [style.btn + ' download'];
        const buttonIcon = isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus'];
        if (this.props.metadata.CanShowServiceMapUrl || this.props.metadata.CanShowMapUrl) {
            let mapItem;
            if (this.props.metadata.CanShowServiceMapUrl) {
                mapItem = this.getServiceMapItem()
            }
            else if (this.props.metadata.CanShowMapUrl) {
                mapItem = this.getMapItemFromMetadata()
            }
            
            let action = isAdded
                ? () => this.removeFromMap([mapItem])
                : () => this.addToMap([mapItem]);           
            let icon = <FontAwesomeIcon title={buttonDescription} icon={buttonIcon}
                key="icon" />;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title={buttonDescription} icon={buttonIcon} key="icon" />;
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, 'Legg til i kart');

            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }

    componentDidMount() {
        let mapItemUuid = this.props.metadata.Type === "dataset" || this.props.metadata.Type === "Datasett" ? this.getMapItem(this.props.metadata.DatasetServicesWithShowMapLink[0]).Uuid : this.getMapItem().Uuid;
        const isAdded = this.props.mapItems.filter(mapItem => {
            return mapItemUuid === mapItem.Uuid;
        }).length > 0;
        if (isAdded) {
            this.setState({
                isAdded: isAdded
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const wasAdded = prevState.isAdded;
        let mapItemUuid = this.props.metadata.Type === "dataset" || this.props.metadata.Type === "Datasett" ? this.getMapItem(this.props.metadata.DatasetServicesWithShowMapLink[0]).Uuid : this.getMapItem().Uuid;
        const isAdded = this.props.mapItems.filter(mapItem => {
            return mapItemUuid === mapItem.Uuid;
        }).length > 0;
        if (wasAdded !== isAdded) {
            this.setState({
                isAdded: isAdded
            });
        }
    }

    render() {
        if (this.props.listButton) {
            return this.renderListButton()
        }
        else {
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

const mapStateToProps = state => ({
    mapItems: state.mapItems,
    resources: state.resources
});

const mapDispatchToProps = {
    removeMapItem,
    addMapItem,
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(MapButton);
