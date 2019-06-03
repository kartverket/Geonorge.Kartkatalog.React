import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMapItems, removeMapItem } from '../../actions/MapItemActions';
import { fetchGeonorgeMenu } from '../../actions/MainNavigationActions';
import { fetchItemsToDownload, removeItemSelectedForDownload, getDownloadItemMetadata } from '../../actions/DownloadItemActions';
import { getGeonorgeLogo } from '../../actions/ImageActions';
import { ErrorBoundary } from '../ErrorBoundary';

import SearchBar from './MainNavigation/SearchBar';

import style from './MainNavigation.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GeonorgeMenuButton from './Buttons/GeonorgeMenuButton';

export class MainNavigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
    }

    componentWillMount() {
        this.props.fetchMapItems();
        this.props.fetchGeonorgeMenu();
        this.props.fetchItemsToDownload();
        document.addEventListener('mousedown', this.handleClick, false);
        document.addEventListener('mousedown', this.handleDownloadClick, false);

    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
        document.removeEventListener('mousedown', this.handleDownloadClick, false);
    }
    handleClick = (e) => {
        if (!this.mapNode || !this.mapNode.contains(e.target)) {
            return this.setState({ expanded: false });
        }
    }
    handleDownloadClick = (e) => {
        if (!this.downloadNode.contains(e.target)) {
            return this.setState({ expandedDownload: false });
        }
    }

    modalMapItems() {
        return this.props.mapItems.length > 0;
    }

    toggleExpand() {
        this.setState(prevState => ({
            expanded: !prevState.expanded,
            expandedDownload: false
        }))
    }

    toggleExpandDownload() {
        this.setState(prevState => ({
            expandedDownload: !prevState.expandedDownload,
            expanded: false
        }))
    }

    renderMapitems() {
        const mapItems = this.props.mapItems.map((mapItem, index) => {
            return (
                <li key={index}>
                    <span>
                        <button className={style.mapBtnlink}>{mapItem.Title}</button>
                    </span>
                    <FontAwesomeIcon icon={['far', 'map-marker-minus']}
                        onClick={() => this.props.removeMapItem([mapItem])} />
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
                            className={this.props.mapItems.length > 0 ? style.content : style.content1} />
                    </span>
                </Link>
            )
        } else if (this.props.mapItems.length > 0) {
            return (
                <div ref={mapNode => this.mapNode = mapNode}>
                    <div className={style.openmap} onClick={() => this.toggleExpand()}>
                        <span className={style.iconButton}>
                            <span className={style.counter}>{this.props.mapItems.length}</span>
                            <FontAwesomeIcon title="Vis kartet" key="map-alt" icon={'map-marker-alt'}
                                className={this.props.mapItems.length > 0 ? style.content : style.noCsontent} />
                        </span>
                    </div>
                    <div
                        className={this.state.expanded ? style.selectedlayers + " " + style.open : style.selectedlayers}>
                        <Link to={'/kart'} className={style.openMaplink}>Vis kart </Link>
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
                    className={this.props.mapItems.length > 0 ? style.content : style.content1} />
            </span>
        </Link>
    }


    renderDownloadItems() {
        const downloadItems = this.props.itemsToDownload.map((downloadItemUuid, index) => {
            const downloadItem = this.props.getDownloadItemMetadata(downloadItemUuid);
            return (
                <li key={index}>
                    <span>
                        <button className={style.mapBtnlink}>{downloadItem.name}</button>
                    </span>
                    <FontAwesomeIcon icon={['far', 'trash']}
                        onClick={() => this.props.removeItemSelectedForDownload(downloadItem)} />
                </li>
            )
        });
        return downloadItems;
    }

    renderDownloadButton() {
        return (
            <div ref={downloadNode => this.downloadNode = downloadNode}>
                <div className={style.openmap} onClick={() => this.toggleExpandDownload()}>
                    <span className={style.iconButton}>
                        <span className={style.counter}>{this.props.itemsToDownload.length}</span>
                        <FontAwesomeIcon title="Vis nedlastede elementer" icon={'cloud-download'}
                            className={this.props.itemsToDownload.length > 0 ? style.content : style.content1} />
                    </span>
                </div>
                <div
                    className={this.state.expandedDownload ? style.expandeddownload + " " + style.open : style.expandeddownload}>
                    <a href="/nedlasting" target="_self" className={style.openMaplink}>Åpne nedlastinger</a>
                    <ul className={style.mapitems}>
                        {this.renderDownloadItems()}
                    </ul>
                </div>
            </div>
        );
    }


    render() {
        return (
            <div className={style.mainNavigationContainer}>
                <div className={style.mainNavigation + ' container'}>
                    <Link to={'/'}>
                        <div className={style.logo}>
                            <img src={this.props.getGeonorgeLogo()} alt="Geonorge logo" />
                        </div>
                    </Link>
                    <div className={style.search}>
                        <ErrorBoundary><SearchBar /></ErrorBoundary>
                    </div>
                    <GeonorgeMenuButton geonorgeMenu={this.props.geonorgeMenu} multilingual />
                    {this.renderMapbutton()}
                    {this.renderDownloadButton()}
                </div>
            </div>
        )
    }
}


MainNavigation.propTypes = {
    fetchMapItems: PropTypes.func.isRequired,
    removeMapItem: PropTypes.func.isRequired,
    fetchItemsToDownload: PropTypes.func.isRequired,
    removeItemSelectedForDownload: PropTypes.func.isRequired,
    getDownloadItemMetadata: PropTypes.func.isRequired,
    mapItems: PropTypes.array.isRequired,
    itemsToDownload: PropTypes.array.isRequired,
    fetchGeonorgeMenu: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    mapItems: state.mapItems,
    itemsToDownload: state.itemsToDownload,
    router: state.router,
    geonorgeMenu: state.geonorgeMenu
});


const mapDispatchToProps = {
    fetchMapItems,
    removeMapItem,
    fetchItemsToDownload,
    removeItemSelectedForDownload,
    getDownloadItemMetadata,
    getGeonorgeLogo,
    fetchGeonorgeMenu
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);
