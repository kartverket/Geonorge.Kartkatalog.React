import React, { Component } from 'react';
import axios from 'axios';
import style from './MainNavigation.scss';
import { BrowserRouter as Link } from 'react-router-dom'

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
                    <span onClick={() => this.props.showResults(this.props.searchString, 'metadata', this.props.subType )} className="btn btn-default">
                        Vis alle
                    </span>
                </div>
            );
        } else {
            return null;
        }
    }
}

class ArticleSearchResultsListItem extends React.Component {
    render() {
        return (
            <div className={style.searchResultsItem}>
                {this.props.listItem.Title}
            </div>
        );
    }
}

class ArticleSearchResultsList extends React.Component {
    renderArticleSearchResults() {
        let listItemsElement = null;
        if (this.props.listItems) {
            let listItems = this.props.listItems.map(function (listItem, i) {
                return <ArticleSearchResultsListItem listItem={listItem} key={i} />;
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
                    {this.renderArticleSearchResults()}
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
            showResults: false,
            metadataSearchApiUrls: {
                software: null,
                service: null,
                dataset: null,
            },
            metadataSearchResults: {
                software: null,
                service: null,
                dataset: null,
            },
            articleSearchResults: null,
        };
        this.performSearch = this.performSearch.bind(this);
        this.showResults = this.showResults.bind(this);
    }

    updateMetadataValuesFromApi(name, url) {
        axios.get(url)
            .then((response) => {
                this.setState(prevState => ({
                    metadataSearchResults: {
                        ...prevState.metadataSearchResults,
                        [name]: response.data.Results
                    }
                }));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    performSearch(event) {
        if (event.target.value) {
            let searchString = event.target.value;
            this.setState(prevState => ({
                metadataSearchApiUrls: {
                    software: 'https://kartkatalog.dev.geonorge.no/api/search?limit=5&facets%5B1%5Dname=type&facets%5B1%5Dvalue=software&text=' + searchString,
                    service: 'https://kartkatalog.dev.geonorge.no/api/search?limit=5&facets%5B1%5Dname=type&facets%5B1%5Dvalue=service&text=' + searchString,
                    dataset: 'https://kartkatalog.dev.geonorge.no/api/search?limit=5&facets%5B1%5Dname=type&facets%5B1%5Dvalue=dataset&text=' + searchString
                }
            }));
            Object.keys(this.state.metadataSearchApiUrls).map((name) => {
                let url = this.state.metadataSearchApiUrls[name];
                this.updateMetadataValuesFromApi(name, url);
            })

            axios.get('https://kartkatalog.dev.geonorge.no/api/articles?text=' + event.target.value)
                .then((response) => {
                    this.setState({
                        articleSearchResults: response.data.Results
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

    getMetadataSearchResults(name) {
        if (name) {
            return this.state.metadataSearchResults[name];
        } else {
            return this.state.metadataSearchResults;
        }
    }

    getMetadataSearchApiUrl(name) {
        if (name) {
            return this.state.metadataSearchApiUrls[name];
        } else {
            return this.state.metadataSearchApiUrls;
        }
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
                                <MetadataSearchResultsList
                                    heading="Dataset"
                                    subType="dataset"
                                    listItems={this.getMetadataSearchResults('dataset')}
                                    searchString={this.state.searchString}
                                    showResults={this.props.showResults.bind(this)}>
                                </MetadataSearchResultsList>
                                <MetadataSearchResultsList
                                    heading="Applikasjoner"
                                    subType="software"
                                    listItems={this.getMetadataSearchResults('software')}
                                    searchString={this.state.searchString}
                                    showResults={this.props.showResults.bind(this)}>
                                </MetadataSearchResultsList>
                                <MetadataSearchResultsList
                                    heading="Tjenester"
                                    subType="service"
                                    listItems={this.getMetadataSearchResults('service')}
                                    searchString={this.state.searchString}
                                    showResults={this.props.showResults.bind(this)}>
                                </MetadataSearchResultsList>

                                <ArticleSearchResultsList heading="Artikler" listItems={this.state.articleSearchResults}></ArticleSearchResultsList>
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
            </div >
        );
    }
}
