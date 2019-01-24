import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMapItems } from '../../actions/MapItemActions'
import {Map} from 'r_map';

import style from './MapContainer.scss';


class MapContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentWillMount() {
		this.props.fetchMapItems();
	}
	
	render() {
		return (
			<div className={style.map}>  
			<Map services={ this.props.mapItems }/> 
			</div>
			)
	}
}

MapContainer.propTypes = {
	mapItems: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
	mapItems: state.mapItems
});

export default connect(mapStateToProps, { fetchMapItems })(MapContainer);
