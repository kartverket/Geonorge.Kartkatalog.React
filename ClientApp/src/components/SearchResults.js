import React, { Component } from 'react';
import { MetadataSearchResults } from './SearchResults/MetadataSearchResults';
import { ArticlesSearchResults } from './SearchResults/ArticlesSearchResults';
import style from './SearchResults.scss';

export class SearchResults extends Component {
    displayName = SearchResults.name

    getMapItems() {
        return localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
    }
    updateNumberOfMapItems() {
        this.setState({
            mapItems: this.getMapItems()
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            mapItems: this.getMapItems(),
            articleItems: [],
            metadataItems: [],
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
            ],
            subTabs: {
                metadata: [
                    {
                        id: 'all',
                        name: 'Alle',
                        counterProperty: 'NumFound'
                    },
                    {
                        id: 'dataset',
                        name: 'Datasett',
                        counterProperty: 'NumFound'
                    },
                    {
                        id: 'service',
                        name: 'Tjenester',
                        counterProperty: 'NumFound'
                    },
                    {
                        id: 'software',
                        name: 'Applikasjoner',
                        counterProperty: 'NumFound'
                    }
                ],
                articles: []
            }
        };
    }

    setActiveTab(tabId) {
        this.props.updateRootState('selectedType', tabId);
        this.props.updateRootState('selectedSubType', 'all');
    }

    setActiveSubTab(tabId) {
        this.props.updateRootState('selectedSubType', tabId);
    }

    getCounterValue(type, subType, counterProperty) {
        let counterValue = 0;
        if (this.props.searchResults[type] && this.props.searchResults[type][counterProperty]) {
            counterValue = this.props.searchResults[type][counterProperty];
        }
        return counterValue;
    }

    renderTabs() {
        let tabs = this.state.tabs.map((tab, i) => {
            let tabClass = this.props.getRootStateValue('selectedType') === tab.id ? style.tab + ' active' : style.tab;
            let counterValue = this.getCounterValue(tab.id, 'all', tab.counterProperty);
            let counter = React.createElement('span', { className: 'badge ' + style.badge, key: i }, counterValue);
            let tabContent = [tab.name, counter];
            return React.createElement('li', { onClick: () => this.setActiveTab(tab.id), key: i, className: tabClass }, tabContent);
        });
        return React.createElement('ul', { className: style.tabs }, tabs);
    }

    /*renderSubTabs() {
        let selectedType = this.props.getRootStateValue('selectedType');
        let selectedSubType = this.props.getRootStateValue('selectedSubType');
        let subTabs = this.state.subTabs[selectedType].map((subTab, i) => {
            let tabClass = selectedSubType === subTab.id ? style.tab + ' active' : style.tab;
            let counterValue = this.getCounterValue(selectedType, subTab.id, subTab.counterProperty);
            let counter = React.createElement('span', { className: 'badge ' + style.badge, key: i }, counterValue);
            let tabContent = [subTab.name, counter];
            return React.createElement('li', { onClick: () => this.setActiveSubTab(subTab.id), key: i, className: tabClass }, tabContent);
        });
        return React.createElement('ul', { className: style.subTabs }, subTabs);
    }*/

    renderActiveTabContent() {
        let activeTabId = this.props.getRootStateValue('selectedType');

        if (activeTabId === 'articles') {
            return (
                <ArticlesSearchResults
                    searchResults={this.props.searchResults}
                    updateMapItems={this.props.updateMapItems.bind(this)}
                    updateRootState={this.props.updateRootState.bind(this)}
                    getRootStateValue={this.props.getRootStateValue.bind(this)} />
            );
        }
        else {
            return (
                <MetadataSearchResults
                    searchResults={this.props.searchResults}
                    updateMapItems={this.props.updateMapItems.bind(this)}
                    updateRootState={this.props.updateRootState.bind(this)}
                    getRootStateValue={this.props.getRootStateValue.bind(this)}
                    showResults={this.props.showResults.bind(this)} />
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderTabs()}
                {this.renderActiveTabContent()}
            </div>
        );
    }
}
