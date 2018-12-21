import React, { Component } from 'react';
import { SearchResults } from './SearchResults';
import style from './Home.scss';

export class Home extends Component {
  displayName = Home.name

  

  render() {
    return (
      <div>
        <div className={style.header}>
          <h1>Kartkatalogen</h1>
        </div>
        <SearchResults searchResults={this.props.searchResults} updateMapItems={this.props.updateMapItems.bind(this)} updateRootState={this.props.updateRootState.bind(this)} getRootStateValue={this.props.getRootStateValue.bind(this)}></SearchResults>
      </div>
    );
  }
}
