import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMapItems } from '../../actions/MapItemActions'
import { Map } from 'r_map';
import classNames from 'classnames/bind';
import style from './MapContainer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
				<div className={style.layers}>


					<FontAwesomeIcon onClick={() => this.toggleSidebar()} className={style.toggle} icon={this.state.activeMenu ? 'times' : 'bars'} />

					<div className={style.container}><ul>
						<li>Kartdata 1</li>
						<li>Kartdata 3</li>
					</ul>
					</div>
				</div>
				<div className={style.mapContent}><Map services={this.props.mapItems} /> </div>
			</div>
		)
	}
	toggleSidebar() {
		this.setState({ activeMenu: !this.state.activeMenu })
	}
}

MapContainer.propTypes = {
	mapItems: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	mapItems: state.mapItems
});

const mapDispatchToProps = {
	fetchMapItems
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
