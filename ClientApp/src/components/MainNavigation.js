import React, { Component } from 'react';
import axios from 'axios';
import style from './MainNavigation.scss';
import { BrowserRouter as Router, Link } from 'react-router-dom'

class MetadataSearchResultsListItem extends React.Component {
    render() {
        return (
            <div className={style.searchResultsItem}>
                {this.props.listItem.Title}
            </div>
        );
    }
}

class MetadataSearchResultsList extends React.Component {
    constructor(props) {
        super(props);
    }
    renderMetadataSearchResults() {
        let listItemsElement = null;
        if (this.props.listItems) {
            let listItems = this.props.listItems.map(function (listItem, i) {
                return <MetadataSearchResultsListItem listItem={listItem} key={i} />;
            });
            listItemsElement = React.createElement('div', { className: style.searchResultsSection }, listItems);
        }

        return listItemsElement;
    }

    render() {
        if (this.props.listItems && this.props.listItems.length) {
            return (
                <div>
                    <h3 className={style.searchResultsSectionHeading}>{this.props.heading}</h3>
                    {this.renderMetadataSearchResults()}
                </div>
            );
        } else {
            return null;
        }
    }
}
/*
class ArticleSearchResultsListItem extends React.Component {
    render() {
        return (
            <div>
                {this.props.searchResult.Title}
            </div>
        );
    }
}*/
/*
class ArticleSearchResultsListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    renderArticlesSearchResults() {
        let articlesSearchResultsElement = null;
        if (this.state.articlesSearchResults) {
            let articlesSearchResults = this.props.listItems.map(function (listItem, i) {
                return <ArticleSearchResultsList searchResult={listItem} key={i} />;
            });
            articlesSearchResultsElement = React.createElement('div', { className: style.searchResultsSection }, articlesSearchResults);
        }
        return articlesSearchResultsElement;
    }

    render() {
        return (
            <div>
                {this.renderArticlesSearchResults()}
            </div>
        );
    }
}*/

export class MainNavigation extends Component {
    displayName = MainNavigation.name

    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            showResults: false,
            metadataSearchResults: {
                metadataSoftwareSearchResults: null,
                metadataServiceSearchResults: null,
                metadataDatasetSearchResults: null,
            },
            articlesSearchResults: null,
        };
        this.performSearch = this.performSearch.bind(this);
        this.showResults = this.showResults.bind(this);
    }

    updateStateValuesFromApi(url, statePropertyName) {
        axios.get(url)
            .then((response) => {
                this.setState(prevState => ({
                    metadataSearchResults: {
                        ...prevState.metadataSearchResults,
                        [statePropertyName]: response.data.Results
                    }
                }));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    performSearch(event) {
        if (event.target.value) {
            let apiUrls = [
                {
                    statePropertyName: 'metadataSoftwareSearchResults',
                    url: 'https://kartkatalog.dev.geonorge.no/api/search?limit=5&facets%5B1%5Dname=type&facets%5B1%5Dvalue=software&text=' + event.target.value
                },
                {
                    statePropertyName: 'metadataServiceSearchResults',
                    url: 'https://kartkatalog.dev.geonorge.no/api/search?limit=5&facets%5B1%5Dname=type&facets%5B1%5Dvalue=service&text=' + event.target.value
                },
                {
                    statePropertyName: 'metadataDatasetSearchResults',
                    url: 'https://kartkatalog.dev.geonorge.no/api/search?limit=5&facets%5B1%5Dname=type&facets%5B1%5Dvalue=dataset&text=' + event.target.value
                }
            ]
            apiUrls.forEach((apiUrl) => {
                this.updateStateValuesFromApi(apiUrl.url, apiUrl.statePropertyName);
            })

            axios.get('https://kartkatalog.dev.geonorge.no/api/articles?text=' + event.target.value)
                .then((response) => {
                    this.setState({
                        articlesSearchResults: response.data.Results
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
            this.setState({
                searchString: event.target.value
            });
        }
    }

    hideResults() {
        this.setState({
            showResults: false
        });
    }

    showResults() {
        this.setState({
            showResults: true
        });
    }

    handleClick = (e) => {
        if (this.node.contains(e.target)) {
            console.log("inside");
            return;
        }

        this.hideResults();
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    render() {
        return (
            <div className={style.mainNavigationContainer}>
                <div className={style.mainNavigation + ' container'}>
                    <Link to={'/'}>
                        <div className={style.logo}>
                            <img src={require('../images/svg/geonorge-navbar-logo_dev.svg')}></img>
                        </div>
                    </Link>
                    <div ref={node => this.node = node} className={style.search}>
                        <div className={style.searchInput}>
                            <input placeholder="Søk" onFocus={this.showResults} onChange={this.performSearch}></input>
                            <button><img src={require('../images/svg/search-icon.svg')}></img></button>

                            <div className={this.state.showResults ? style.searchResults + ' active' : style.searchResults}>
                                <MetadataSearchResultsList heading="Dataset" listItems={this.state.metadataSearchResults.metadataDatasetSearchResults}></MetadataSearchResultsList>
                                <MetadataSearchResultsList heading="Applikasjoner" listItems={this.state.metadataSearchResults.metadataSoftwareSearchResults}></MetadataSearchResultsList>
                                <MetadataSearchResultsList heading="Tjenester" listItems={this.state.metadataSearchResults.metadataServiceSearchResults}></MetadataSearchResultsList>
                            </div>
                        </div>
                    </div>
                    <span className={style.iconButton}>
                        <span className={style.counter}>12</span>
                        <img src={require('../images/svg/download-icon.svg')}></img>
                    </span>
                    <Link to={'/kart'}>
                        <span className={style.iconButton}>
                            <span className={style.counter}>{this.props.mapItems.length}</span>
                            <img src={require('../images/svg/map-icon.svg')}></img>
                        </span>
                    </Link>
                </div>
            </div>
        );
    }
}
