import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { fetchMapItems } from '../../actions/MapItemActions'

import SearchBar from './MainNavigation/SearchBar';

import logo from '../../images/svg/geonorge-navbar-logo.svg';
import style from './MainNavigation.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class MainNavigation extends Component {

	componentWillMount() {
	    this.props.fetchMapItems();
	}
	
	render() {
		return (
			<div className={style.mainNavigationContainer}>
				<div className={style.mainNavigation + ' container'}>
					<Link to={'/'}>
                        <div className={style.logo}>
                            <img src={logo} alt="Geonorge logo"></img>
                        </div>
                    </Link>
                    <div className={style.search}>
						<SearchBar />
                    </div>
                    <span className={style.iconButton} style={{display: "none"}}>
                        <span className={style.counter}>12</span>
                        <img src={require('../../images/svg/download-icon.svg')} alt="download icon"></img>
                    </span>
                    <Link to={'/kart'}>
                        <span className={style.iconButton}>
                            <span className={style.counter}>{this.props.mapItems.length}</span>
                            <FontAwesomeIcon icon={'map-marker-alt'} className={this.props.mapItems.length > 0 ? style.content : style.fisk}/>
                        </span>
                    </Link>
				</div>
			</div>
			)
	}
}

MainNavigation.propTypes = {
	fetchMapItems: PropTypes.func.isRequired,
	mapItems: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
	mapItems: state.mapItems
});

export default connect(mapStateToProps, { fetchMapItems })(MainNavigation);
