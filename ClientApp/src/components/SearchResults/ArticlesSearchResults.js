import React, { Component } from 'react';
import style from './ArticlesSearchResults.scss';

class ListItem extends React.Component {
	render() {
		return (
			<div>{ this.props.listItem.title }</div>
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

  renderList() {

    let listItems = this.state.articles.map(function(listItem, i){
        return <ListItem listItem={listItem} key={i}/>;
    });
    let listElement = React.createElement('div', { className: style.list }, listItems);
    return listElement;
}


  render() {
    return (
      <div>
        {this.renderList()}
      </div>
    );
  }
}
