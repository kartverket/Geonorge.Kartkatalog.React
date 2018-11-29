import React, { Component } from 'react';
import { SearchResults } from './SearchResults';

export class Home extends Component {
  displayName = Home.name

  render() {
    return (
      <div>
        <SearchResults></SearchResults>        
      </div>
    );
  }
}
