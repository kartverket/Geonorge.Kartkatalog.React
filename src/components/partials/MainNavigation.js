import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {fetchMapItems, removeMapItem} from '../../actions/MapItemActions'
import {fetchItemsToDownload} from '../../actions/DownloadItemActions'
import { ErrorBoundary } from '../ErrorBoundary'

import SearchBar from './MainNavigation/SearchBar';

import logo from '../../images/svg/geonorge-navbar-logo.svg';
import style from './MainNavigation.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export class MainNavigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
    }

    componentWillMount() {
        this.props.fetchMapItems();
        this.props.fetchItemsToDownload();
    }

    modalMapItems() {
        return this.props.mapItems.length > 0;
    }

    toggleExpand() {
        this.setState(prevState => ({
            expanded: !prevState.expanded && !prevState.expandedDownload
        }))
    }

    toggleExpandDownload() {
        this.setState(prevState => ({
            expandedDownload: !prevState.expandedDownload && !prevState.expanded
        }))
    }

    renderMapitems() {
        const mapItems = this.props.mapItems.map((mapItem, index) => {
            return (
                <li key={index}>
                    <span>
                        <button className={style.mapBtnlink}>{mapItem.Title}</button>
                    </span>
                    <FontAwesomeIcon icon="times"
                                     onClick={() => this.props.removeMapItem([mapItem])}/>
                </li>
            )
        });
        return mapItems
    }

    renderMapbutton() {
        if (this.props.router && this.props.router.location && this.props.router.location.pathname === '/kart') {
            return (
                <Link to={'/'}>
                    <span className={style.iconButton}>
                        <span className={style.counter}>{this.props.mapItems.length}</span>
                        <FontAwesomeIcon title="Tilbake til katalogen" icon={'map-marker-times'}
                                         className={this.props.mapItems.length > 0 ? style.content : style.content1}/>
                    </span>
                </Link>
            )
        } else if (this.props.mapItems.length > 0) {
            return (
                <div>
                    <div className={style.openmap} onClick={() => this.toggleExpand()}>
                        <span className={style.iconButton}>
                            <span className={style.counter}>{this.props.mapItems.length}</span>
                            <FontAwesomeIcon key="map-alt" icon={'map-marker-alt'}
                                             className={this.props.mapItems.length > 0 ? style.content : style.noCsontent}/>
                        </span>
                    </div>
                    <div
                        className={this.state.expanded ? style.selectedlayers + " " + style.open : style.selectedlayers}>
                        <Link to={'/kart'} className={style.openMaplink}>Vis kart <FontAwesomeIcon
                            icon={['fal', 'globe-europe']}/></Link>
                        <ul className={style.mapitems}>
                            {this.renderMapitems()}
                        </ul>
                    </div>
                </div>
            )

        }
        return <Link to={'/kart'}>
            <span className={style.iconButton}>
                <span className={style.counter}>{this.props.mapItems.length}</span>
                <FontAwesomeIcon key="map-alt" icon={'map-marker-alt'}
                                 className={this.props.mapItems.length > 0 ? style.content : style.content1}/>
            </span>
        </Link>
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
                        <ErrorBoundary><SearchBar/></ErrorBoundary>
                    </div>
                    {this.renderMapbutton()}

                    <div className={style.openmap} onClick={() => this.toggleExpandDownload()}>
                        <span className={style.iconButton}>
                            <span className={style.counter}>{this.props.itemsToDownload.length}</span>
                            <FontAwesomeIcon icon={'cloud-download'}
                                             className={this.props.itemsToDownload.length > 0 ? style.content : style.content1}/>
                        </span>
                    </div>
                    <div
                        className={this.state.expandedDownload ? style.expandeddownload + " " + style.open : style.expandeddownload}>
                        <Link to={'/nedlasting'}>Åpne nedlastinger</Link>
                        Liste over nedlastinger
                    </div>
                </div>
            </div>
        )
    }
}


MainNavigation.propTypes = {
    fetchMapItems: PropTypes.func.isRequired,
    fetchItemsToDownload: PropTypes.func.isRequired,
    mapItems: PropTypes.array.isRequired,
    itemsToDownload: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    mapItems: state.mapItems,
    itemsToDownload: state.itemsToDownload,
    router: state.router
});


const mapDispatchToProps = {
    fetchMapItems,
    removeMapItem,
    fetchItemsToDownload
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);
