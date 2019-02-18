import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {fetchMetadataSearchResults, fetchArticleSearchResults} from '../../actions/SearchResultActions';
import {updateSelectedSearchResultsType} from '../../actions/SelectedSearchResultsTypeActions';
import classNames from 'classnames/bind';

import MetadataSearchResult from './SearchResults/MetadataSearchResult'
import ArticleSearchResult from './SearchResults/ArticleSearchResult'

import FacetFilter from './FacetFilter'

import style from './SearchResults.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {        
            tabs: [
                {
                    id: 'metadata',
                    name: 'Kartkatalog',
                    counterProperty: 'NumFound'
                },
                {
                    id: 'articles',
                    name: 'Artikler',
                    counterProperty: 'NumFound'
                }
            ]
        }
    }

    setActiveTab(tab) {
        this.props.updateSelectedSearchResultsType(tab.id);
    }

    getCounterValue(type, counterProperty) {
        let counterValue = 0;
        if (this.props.searchResults[type] && this.props.searchResults[type][counterProperty]) {
            counterValue = this.props.searchResults[type][counterProperty];
        }
        return counterValue;
    }

    moreItemsAvailable() {
        if (this.props.searchResults.metadata) {
            const numberOfRequestedItems = this.props.searchResults.metadata.Limit + (this.props.searchResults.metadata.Offset - 1);
            if (this.props.searchResults.metadata.NumFound > numberOfRequestedItems) {
                return true
            }
        }
        return false;
    }

    moreArticlesAvailable() {
        if (this.props.searchResults.articles) {
            const numberOfRequestedItems = this.props.searchResults.articles.Limit + (this.props.searchResults.articles.Offset - 1);
            if (this.props.searchResults.articles.NumFound > numberOfRequestedItems) {
                return true
            }
        }
        return false;
    }

    addMoreMetadataToSearchResult() {
        this.props.fetchMetadataSearchResults(this.props.searchString, this.props.selectedFacets, this.props.searchResults.metadata.Offset + 10, true)
        this.renderActiveTabContent()
    }

    addMoreArticlesToSearchResult() {
        this.props.fetchArticleSearchResults("", this.props.searchResults.articles.Offset + 10, true);
        this.renderActiveTabContent()
    }

    renderTabs() {
        let tabs = this.state.tabs.map((tab, i) => {
            let tabClass = this.props.selectedSearchResultsType === tab.id ? style.tab + ' active' : style.tab;
            let counterValue = this.getCounterValue(tab.id, tab.counterProperty);
            let counter = React.createElement('span', {className: 'badge ' + style.badge, key: i}, counterValue);
            let tabContent = [tab.name, counter];
            return React.createElement('li', {
                onClick: () => this.setActiveTab(tab),
                key: i,
                className: tabClass
            }, tabContent);
        });
        return React.createElement('ul', {className: style.tabs}, tabs);
    }

    renderMetadataSearchResults() {
        let listItems = this.props.searchResults.metadata && this.props.searchResults.metadata.Results ? this.props.searchResults.metadata.Results : null;
        if (listItems) {
            let listItemElements = listItems.map((searchResult, i) => {
                return <MetadataSearchResult searchResult={searchResult} key={i}/>;
            });
            return React.createElement('div', {className: style.list, key: "searchResult"}, listItemElements);
        } else {
            return "";
        }
    }

    renderArticleSearchResults() {
        let listItems = this.props.searchResults.articles && this.props.searchResults.articles.Results ? this.props.searchResults.articles.Results : null;
        if (listItems) {
            let listItemElements = listItems.map((searchResult, i) => {
                return <ArticleSearchResult searchResult={searchResult} key={i}/>;
            });
            return React.createElement('div', {className: style.list}, listItemElements);
        } else {
            return "";
        }
    }

    renderActiveTabContent() {
        let searchString = "";
        if (this.props.selectedSearchResultsType === 'metadata') {
            const moreItemButtonClassNames = classNames({
                [style.morebtn]: true,
                hidden: !this.moreItemsAvailable()
            });
            
            if(this.props.searchString){
                searchString = 'Søk på "' + this.props.searchString + '" ga ' + this.props.searchResults.metadata.NumFound + ' treff'
            }
            return <div className={style.activeContent}>
                <div className={style.facets}>
                    <FacetFilter key="facetFilter"/>
                </div>

                <div className={style.searchResultContainer}>
                    <span className={searchString != "" ? style.searchResultInformation : ""}>{searchString}</span>
                    {this.renderMetadataSearchResults()}
                    <div className={style.morecontainer}>
                        <div className={moreItemButtonClassNames} onClick={() => this.addMoreMetadataToSearchResult()}>
                            <span>Vis flere</span> <FontAwesomeIcon icon={'angle-down'} key="icon"/></div>
                    </div>
                </div>
            </div>;
        } else if (this.props.selectedSearchResultsType === 'articles') {
            if(this.props.searchString){
                searchString = 'Søk på "' + this.props.searchString + '" ga ' + this.props.searchResults.articles.NumFound + ' treff'
            }
            const moreItemButtonClassNames = classNames({
                [style.morebtn]: true,
                hidden: !this.moreArticlesAvailable()
            });
            return <div className={style.searchResultContainer}>
                <span className={searchString != "" ? style.searchResultInformation : ""}>{searchString}</span>
                {this.renderArticleSearchResults()}
                <div className={style.morecontainer}>
                    <div className={moreItemButtonClassNames} onClick={() => this.addMoreArticlesToSearchResult()}>
                        <span>Vis flere</span> <FontAwesomeIcon icon={'angle-down'} key="icon"/></div>
                </div>
            </div>;
        } else {
            return "";
        }
    }

    render() {
        return (
            <div>
                {this.renderTabs()}
                {this.renderActiveTabContent()}
            </div>
        )
    }
}

SearchResults.propTypes = {
    searchResults: PropTypes.object.isRequired,
    selectedSearchResultsType: PropTypes.string.isRequired,
    fetchMetadataSearchResults: PropTypes.func.isRequired,
    fetchArticleSearchResults: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    searchResults: state.searchResults,
    selectedSearchResultsType: state.selectedSearchResultsType,
    selectedFacets: state.selectedFacets,
    searchString: state.searchString
});

const mapDispatchToProps = {
    fetchMetadataSearchResults,
    fetchArticleSearchResults,
    updateSelectedSearchResultsType
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);