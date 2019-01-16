import React, { Component } from 'react';
import axios from 'axios';
import style from './MainNavigation.scss';
import { Browser as Router, Link } from 'react-router-dom'

class SearchResultsListItem extends React.Component {
    render() {
        return (
            <div className={style.searchResultsItem}>
                <a href={this.props.listItem.ShowDetailsUrl}>{this.props.listItem.Title}</a>
            </div>
        );
    }
}

class SearchResultsList extends React.Component {

    renderSearchResults() {
        let listItemsElement = null;
        let listItemsResults = this.props.listItems && this.props.listItems.Results ? this.props.listItems.Results : null;
        if (listItemsResults) {
            let listItems = listItemsResults.map(function (listItem, i) {
                return <SearchResultsListItem listItem={listItem} key={i} />;
            });
            listItemsElement = React.createElement('div', null, listItems);
        }
        return listItemsElement;
    }

    getCounterValue(counterProperty) {
        let counterValue = 0;
        let listItems = this.props.listItems ? this.props.listItems : null;
        if (listItems && listItems[counterProperty]) {
            counterValue = listItems[counterProperty];
        }
        return counterValue;
    }

    render() {
        let listItemsResults = this.props.listItems && this.props.listItems.Results ? this.props.listItems.Results : null;
        if (listItemsResults && listItemsResults.length) {
            return (
                <div className={style.searchResultsSection}>
                    <div className={style.searchResultsSectionHeadingContainer}>
                        <span className={style.searchResultsSectionHeading}>{this.props.heading}</span>
                        <span className={style.counter}>{this.getCounterValue('NumFound')}</span>
                        <span onClick={() => this.props.showResults(this.props.urlParametersString, this.props.type, this.props.subType)} className={style.showAllButton}>
                            Vis alle
                        </span>
                    </div>
                    {this.renderSearchResults()}
                </div>
            );
        } else {
            return null;
        }
    }
}


export class MainNavigation extends Component {
    displayName = MainNavigation.name

    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            urlParametersString: '',
            showResults: false,
            itemsPerSubType: 5,
            searchResults: {
                metadata: {
                    all: null,
                    dataset: null,
                    service: null,
                    software: null
                },
                articles: {
                    all: null
                }
            }
        };
        this.performSearch = this.performSearch.bind(this);
        this.showResults = this.showResults.bind(this);
    }

    getSearchApiUrls(urlParametersString) {
        return {
            metadata: {
                all: `https://kartkatalog.dev.geonorge.no/api/search?limit=${this.state.itemsPerSubType}&${urlParametersString}`,
                software: `https://kartkatalog.dev.geonorge.no/api/search?limit=${this.state.itemsPerSubType}&facets%5B1%5Dname=type&facets%5B1%5Dvalue=software&${urlParametersString}`,
                service: `https://kartkatalog.dev.geonorge.no/api/search?limit=${this.state.itemsPerSubType}&facets%5B1%5Dname=type&facets%5B1%5Dvalue=service&${urlParametersString}`,
                dataset: `https://kartkatalog.dev.geonorge.no/api/search?limit=${this.state.itemsPerSubType}&facets%5B1%5Dname=type&facets%5B1%5Dvalue=dataset&${urlParametersString}`
            },
            articles: {
                all: `https://kartkatalog.dev.geonorge.no/api/articles?${urlParametersString}`
            }
        }
    }

    performSearch(event) {
        if (event.target.value) {
            let searchString = event.target.value;
            let urlParametersString = `text=${searchString}`;
            this.setState({
                searchString: searchString,
                urlParametersString: urlParametersString
            });

            let searchApiUrls = this.getSearchApiUrls(urlParametersString);
            Object.keys(searchApiUrls).map((type) => {
                Object.keys(searchApiUrls[type]).map((subType) => {
                    let url = searchApiUrls[type][subType];
                    axios.get(url)
                        .then((response) => {
                            this.setState(prevState => ({
                                searchResults: {
                                    ...prevState.searchResults,
                                    [type]: {
                                        ...prevState.searchResults[type],
                                        [subType]: response.data
                                    }
                                }
                            }));
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
            })
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

    getSearchResults(type, subType) {
        if (type && subType) {
            return this.state.searchResults[type][subType];
        } else if (type) {
            return this.state.searchResults[type];
        } else {
            return this.state.searchResults;
        }
    }

    render() {
        return (
            <div className={style.mainNavigationContainer}>
                <div className={style.mainNavigation + ' container'}>
                    <Link to={'/'}>
                        <div className={style.logo}>
                            <img src={require('../../images/svg/geonorge-navbar-logo_dev.svg')}></img>
                        </div>
                    </Link>
                    <div ref={node => this.node = node} className={style.search}>
                        <div className={style.searchInput}>
                            <input placeholder="Søk" onFocus={this.showResults} onChange={this.performSearch}></input>
                            <button><img src={require('../../images/svg/search-icon.svg')}></img></button>
                            <div className={this.state.showResults ? style.searchResults + ' active' : style.searchResults}>
                                <SearchResultsList
                                    heading="Dataset"
                                    type="metadata"
                                    subType="dataset"
                                    listItems={this.getSearchResults('metadata', 'dataset')}
                                    urlParametersString={this.state.urlParametersString}
                                    showResults={this.props.showResults.bind(this)}>
                                </SearchResultsList>
                                <SearchResultsList
                                    heading="Applikasjoner"
                                    type="metadata"
                                    subType="software"
                                    listItems={this.getSearchResults('metadata', 'software')}
                                    urlParametersString={this.state.urlParametersString}
                                    showResults={this.props.showResults.bind(this)}>
                                </SearchResultsList>
                                <SearchResultsList
                                    heading="Tjenester"
                                    type="metadata"
                                    subType="service"
                                    listItems={this.getSearchResults('metadata', 'service')}
                                    urlParametersString={this.state.urlParametersString}
                                    showResults={this.props.showResults.bind(this)}>
                                </SearchResultsList>
                                <SearchResultsList
                                    heading="Artikler"
                                    type="articles"
                                    subType="all"
                                    listItems={this.getSearchResults('articles', 'all')}
                                    urlParametersString={this.state.urlParametersString}
                                    showResults={this.props.showResults.bind(this)}>
                                </SearchResultsList>
                            </div>
                        </div>
                    </div>
                    <span className={style.iconButton} style={{display: "none"}}>
                        <span className={style.counter}>12</span>
                        <img src={require('../../images/svg/download-icon.svg')}></img>
                    </span>
                    <Link to={'/kart'}>
                        <span className={style.iconButton}>
                            <span className={style.counter}>{this.props.mapItems.length}</span>
                            <img src={require('../../images/svg/map-icon.svg')}></img>
                        </span>
                    </Link>
                </div>
            </div >
        );
    }
}
