import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { MainNavigation } from './layout/components/MainNavigation';
import { Home } from './routes/components/Home';
import { MapContainer } from './routes/components/MapContainer';

import axios from 'axios';

import style from './App.scss';



export default class App extends Component {
  displayName = App.name

  constructor(props) {
    super(props);
    this.state = {
      mapItems: this.getMapItems(),
      itemsPerSubType: 30,
      searchResults: {
        metadata: {},
        articles: {}
      },
      selectedType: 'metadata',
      selectedSubType: 'all',
      selectedFacets: {},
      availableFacets: {},
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

  getSearchApiUrls(urlParameterString) {
    urlParameterString = urlParameterString ? "&" + encodeURI(urlParameterString) : "";
    return {
      metadata: {
        all: 'https://kartkatalog.dev.geonorge.no/api/search?limit=' + this.state.itemsPerSubType + urlParameterString,
      },
      articles: {
        all: 'https://kartkatalog.dev.geonorge.no/api/articles?limit=' + this.state.itemsPerSubType + urlParameterString
      }
    }
  }



  showResults(urlParameterString, type, subType) {
    let metadataSearchApiUrls = this.getSearchApiUrls(urlParameterString);
    type = type ? type : this.state.selectedType;
    subType = subType ? subType : this.state.selectedSubType;
    this.setState({
      selectedType: type
    });
    Object.keys(metadataSearchApiUrls).map((type) => {
      let url = metadataSearchApiUrls[type][subType];
      axios.get(url)
        .then((response) => {
          this.setState(prevState => ({
            searchResults: {
              ...prevState.searchResults,
              [type]: response.data
            }
          }));

          if (response.data.Facets) {
            response.data.Facets.map(facet => {
              this.setState(prevState => ({
                availableFacets: {
                  ...prevState.availableFacets,
                  [type]: {
                    ...prevState.availableFacets[type],
                    [facet.FacetField]: {FacetResults: facet.FacetResults,
                    NameTranslated: facet.NameTranslated}
                  }
                }
              }))
            })
          }


        })
        .catch(function (error) {
          console.log(error);
        });
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
          {this.state.routes.map(({ path, component: C }, i) => (
            <Route exact path={path} key={i} render={(props) => <C {...props}
              searchResults={this.state.searchResults}
              mapItems={this.state.mapItems}
              updateMapItems={this.updateMapItems.bind(this)}
              updateRootState={this.updateRootState.bind(this)}
              getRootStateValue={this.getRootStateValue.bind(this)}
              showResults={this.showResults.bind(this)} />} />
          ))}
        </div>
      </Layout>
    );
  }
}
