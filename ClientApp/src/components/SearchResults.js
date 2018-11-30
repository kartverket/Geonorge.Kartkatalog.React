import React, { Component } from 'react';
import { MetadataSearchResults } from './SearchResults/MetadataSearchResults';
import { ArticlesSearchResults } from './SearchResults/ArticlesSearchResults';
import { MapContainer } from './MapContainer';
import style from './SearchResults.scss';

export class SearchResults extends Component {
    displayName = SearchResults.name

    constructor(props) {
        super(props);
        this.state = {
            activeTabId: 'mapCatalog',
            tabs: [
                {
                    id: 'mapCatalog',
                    name: 'Kartkatalog',
                    count: 0,
                },
                {
                    id: 'articles',
                    name: 'Artikler',
                    count: 0
                },
                {
                    id: 'map',
                    name: 'Vis i kart',
                    count: 0
                }
            ]
        };
    }

    setActiveTabId(tabId) {
        this.setState({
            activeTabId: tabId
        });
    }

    renderTabs() {
        let tabs = this.state.tabs.map( (tab, i) => {
            let tabClass = this.state.activeTabId == tab.id ? style.tab + ' active' : style.tab;
            let counter = React.createElement('span', { className: 'badge ' + style.badge, key: i }, tab.count);
            let tabContent = [tab.name, counter];
            return React.createElement('li', { onClick: () => this.setActiveTabId(tab.id), key: i, className: tabClass }, tabContent);
        });
        return React.createElement('ul', { className: style.tabs }, tabs);
    }

    renderActiveTabContent() {
        let activeTabId = this.state.activeTabId;
        let activeTabContent = null;
        
        if (activeTabId == 'articles') {
            activeTabContent = ArticlesSearchResults;
        }
        else if (activeTabId == 'map') {
            activeTabContent = MapContainer;
        }
        else {
            activeTabContent = MetadataSearchResults;
        }
        return React.createElement(activeTabContent);
    }
  
    render() {
      return (
        <div>
            { this.renderTabs() }
            { this.renderActiveTabContent() }
        </div>
      );
    }
  }
  