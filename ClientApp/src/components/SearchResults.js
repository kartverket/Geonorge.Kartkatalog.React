import React, { Component } from 'react';
import { MetadataSearchResults } from './SearchResults/MetadataSearchResults';
import { ArticlesSearchResults } from './SearchResults/ArticlesSearchResults';
import { MapContainer } from './MapContainer';
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
            activeTabId: 'mapCatalog',
            mapItems: this.getMapItems(),
            articleItems: [],
            metadataItems: [],
            tabs: [
                {
                    id: 'mapCatalog',
                    name: 'Kartkatalog',
                    itemArrayProperty: 'metadataItems'
                },
                {
                    id: 'articles',
                    name: 'Artikler',
                    itemArrayProperty: 'articleItems'
                },
                {
                    id: 'map',
                    name: 'Vis i kart',
                    itemArrayProperty: 'mapItems'
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
            let tabClass = this.state.activeTabId === tab.id ? style.tab + ' active' : style.tab;
            let counter = React.createElement('span', { className: 'badge ' + style.badge, key: i }, this.state[tab.itemArrayProperty].length);
            let tabContent = [tab.name, counter];
            return React.createElement('li', { onClick: () => this.setActiveTabId(tab.id), key: i, className: tabClass }, tabContent);
        });
        return React.createElement('ul', { className: style.tabs }, tabs);
    }

    renderActiveTabContent() {
        let activeTabId = this.state.activeTabId;
        
        if (activeTabId === 'articles') {
            return (
                <ArticlesSearchResults/>
            );
        }
        else if (activeTabId === 'map') {
            return (
                <MapContainer items={this.state.mapItems}/>
            );
        }
        else {
            return (
                <MetadataSearchResults updateMapItems={this.props.updateMapItems.bind(this)} />
            );
        }
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
  