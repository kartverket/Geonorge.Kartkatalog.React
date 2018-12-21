import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { MainNavigation } from './components/MainNavigation';
import { Home } from './components/Home';
import { MapContainer } from './components/MapContainer';

import axios from 'axios';

import style from './App.scss';



export default class App extends Component {
  displayName = App.name

  constructor(props) {
    super(props);
    this.state = {
      mapItems: this.getMapItems(),
      itemsPerSubType: 30,
      metadataSearchApiUrls: {
        all: 'https://kartkatalog.dev.geonorge.no/api/search?limit=30',
        software: 'https://kartkatalog.dev.geonorge.no/api/search?limit=30&facets%5B1%5Dname=type&facets%5B1%5Dvalue=software',
        service: 'https://kartkatalog.dev.geonorge.no/api/search?limit=30&facets%5B1%5Dname=type&facets%5B1%5Dvalue=service',
        dataset: 'https://kartkatalog.dev.geonorge.no/api/search?limit=30&facets%5B1%5Dname=type&facets%5B1%5Dvalue=dataset'
      },
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
      },
      selectedType: 'metadata',
      selectedSubType: 'all',
      routes: [
        {
          path: '/',
          component: Home,
          updateMapItems: this.updateMapItems
        },
        {
          path: '/kart',
          component: MapContainer,
          updateMapItems: this.updateMapItems
        }
      ]
    };
    this.getMapItems = this.getMapItems.bind(this);

  }

  getMapItems() {
    return localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
  }

  updateState(stateProperty, value) {
    this.setState({
      [stateProperty]: value
    });
  }

  updateMapItems() {
    this.setState({
      mapItems: this.getMapItems()
    });
  }

  updateRootState(key, value) {
    this.setState({
      [key]: value
    });
  }

  getRootStateValue(key) {
    return this.state[key];
  }

  getSearchApiUrls(searchString) {
    return {
      all: 'https://kartkatalog.dev.geonorge.no/api/search?limit=' + this.state.itemsPerSubType + '&text=' + searchString,
      software: 'https://kartkatalog.dev.geonorge.no/api/search?limit=' + this.state.itemsPerSubType + '&facets%5B1%5Dname=type&facets%5B1%5Dvalue=software&text=' + searchString,
      service: 'https://kartkatalog.dev.geonorge.no/api/search?limit=' + this.state.itemsPerSubType + '&facets%5B1%5Dname=type&facets%5B1%5Dvalue=service&text=' + searchString,
      dataset: 'https://kartkatalog.dev.geonorge.no/api/search?limit=' + this.state.itemsPerSubType + '&facets%5B1%5Dname=type&facets%5B1%5Dvalue=dataset&text=' + searchString
    }
  }

  getSearchApiUrls(searchString) {
    return {
      metadata: {
        all: 'https://kartkatalog.dev.geonorge.no/api/search?limit=' + this.state.itemsPerSubType + '&text=' + searchString,
        software: 'https://kartkatalog.dev.geonorge.no/api/search?limit=' + this.state.itemsPerSubType + '&facets%5B1%5Dname=type&facets%5B1%5Dvalue=software&text=' + searchString,
        service: 'https://kartkatalog.dev.geonorge.no/api/search?limit=' + this.state.itemsPerSubType + '&facets%5B1%5Dname=type&facets%5B1%5Dvalue=service&text=' + searchString,
        dataset: 'https://kartkatalog.dev.geonorge.no/api/search?limit=' + this.state.itemsPerSubType + '&facets%5B1%5Dname=type&facets%5B1%5Dvalue=dataset&text=' + searchString
      },
      articles: {
        all: 'https://kartkatalog.dev.geonorge.no/api/articles?limit=' + this.state.itemsPerSubType + '&text=' + searchString
      }
    }
  }

  showResults(searchString, type, subType) {
    let metadataSearchApiUrls = this.getSearchApiUrls(searchString);
    this.setState({
      selectedType: type,
      selectedSubType: subType
    });
    Object.keys(metadataSearchApiUrls).map((type) => {
      Object.keys(metadataSearchApiUrls[type]).map((subType) => {
        let url = metadataSearchApiUrls[type][subType];
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

  componentDidMount() {
    this.showResults('', this.state.selectedType, this.state.selectedSubType);
  }

  render() {
    return (
      <Layout>
        <MainNavigation showResults={this.showResults.bind(this)} mapItems={this.state.mapItems} />
        <div className={style.pageContent}>
          {this.state.routes.map(({ path, component: C, updateMapItems }, i) => (
            <Route exact path={path} key={i} render={(props) => <C {...props} searchResults={this.state.searchResults} mapItems={this.state.mapItems} updateMapItems={this.updateMapItems.bind(this)} updateRootState={this.updateRootState.bind(this)} getRootStateValue={this.getRootStateValue.bind(this)} />} />
          ))}
        </div>
      </Layout>
    );
  }
}
