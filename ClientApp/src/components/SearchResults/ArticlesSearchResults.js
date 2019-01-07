import React, { Component } from 'react';
import style from './ArticlesSearchResults.scss';

class ListItem extends React.Component {
  render() {
    return (
      <div><a href={this.props.listItem.ShowDetailsUrl}>{this.props.listItem.Title}</a></div>
    );
  }
}

export class ArticlesSearchResults extends Component {
  displayName = ArticlesSearchResults.name

  constructor(props) {
    super(props);
    this.state = {
      articles: [
        { title: 'Artikkel 1' },
        { title: 'Artikkel 2' }
      ]
    };
  }


  getListItems() {
    let type = this.props.getRootStateValue('selectedType');
    let subType = this.props.getRootStateValue('selectedSubType');
    return this.props.searchResults[type][subType] && this.props.searchResults[type][subType].Results ? this.props.searchResults[type][subType].Results : [];
  }

  renderList() {
    let listItems = this.getListItems();
    let listItemElements = listItems.map((listItem, i) => {
      return <ListItem listItem={listItem} addToMap={this.props.updateMapItems.bind(this)} key={i} />;
    });
    return React.createElement('div', { className: style.list }, listItemElements);
  }


  render() {
    return (
      <div>
        {this.renderList()}
      </div>
    );
  }
}
