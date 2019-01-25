import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMapItems } from '../../actions/MapItemActions'
import {Map} from 'r_map';
import classNames from 'classnames/bind';

import style from './MapContainer.scss';


class MapContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeMenu: false
		};
	}

	componentWillMount() {
		this.props.fetchMapItems();
	}
	
	
	render() {
		
			let mapContainerClassNames = classNames({
				[style.map]: true,
				[style.activeMenu]: this.state.activeMenu
				
			}) 
		
		return (			
			<div className={mapContainerClassNames}>  
				<div className={style.layers} onClick={() => this.openSidebar()}>Meny
			
					<div>Meny for kartlagene</div>
				</div>
				<div onClick={() => this.closeSidebar()}>lukk</div>
				
				<div className={style.mapContent}><Map services={ this.props.mapItems }/> </div>
			</div>
			)
	}
	openSidebar() {				
		this.setState({activeMenu: true});
		}
	closeSidebar() {
		console.log(this.state.activeMenu)
		this.setState({activeMenu: false})
	}
}

MapContainer.propTypes = {
	mapItems: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
	mapItems: state.mapItems
});

export default connect(mapStateToProps, { fetchMapItems })(MapContainer);
