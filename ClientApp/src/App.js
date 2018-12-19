import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { MainNavigation } from './components/MainNavigation';
import { Home } from './components/Home';
import { MapContainer } from './components/MapContainer';

export default class App extends Component {
  displayName = App.name

  constructor(props) {
    super(props);
    this.state = {
      mapItems: this.getMapItems(),
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

  updateSearchResults() {

  }

  render() {
    return (
      <Layout>
        <MainNavigation showResults={this.updateSearchResults.bind(this)} mapItems={this.state.mapItems} />
        {this.state.routes.map(({ path, component: C, updateMapItems }, i) => (
          <Route exact path={path} key={i} render={(props) => <C {...props} mapItems={this.state.mapItems} updateMapItems={this.updateMapItems.bind(this)} />} />
        ))}
      </Layout>
    );
  }
}
