import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMapItems, removeMapItem } from '../../actions/MapItemActions'
import { MapComponent } from 'r_map';

class MapContainer extends Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		this.props.fetchMapItems();
	}

	render() {
		return (
			<div>
				<MapComponent services={this.props.mapItems} removeMapItem={this.props.removeMapItem} />
			</div>
		)
	}
}

MapContainer.propTypes = {
	mapItems: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	mapItems: state.mapItems
});

const mapDispatchToProps = {
	fetchMapItems,
	removeMapItem
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
