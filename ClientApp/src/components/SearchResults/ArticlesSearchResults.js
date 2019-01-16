import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import style from './ArticlesSearchResults.scss';

class ListItem extends React.Component {
  render() {
    return (
      <Row className={style.listItem}>
        <Col sm={12}>
          <span className={style.listItemTitle}>
            <a href={this.props.listItem.ShowDetailsUrl}>{this.props.listItem.Title}</a>
            <span className={style.listItemType}>
              {this.props.listItem.Type}
            </span>
          </span>
          <span className={style.listItemInfo}>
            {this.props.listItem.Intro}
          </span>
          <span className={style.listItemDate}>
            {this.props.listItem.Date}
          </span>
        </Col>
      </Row>
    );
  }
}

export class ArticlesSearchResults extends Component {
  displayName = ArticlesSearchResults.name

  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    getRootStateValue: PropTypes.func.isRequired,
    updateRootState: PropTypes.func.isRequired,
    updateMapItems: PropTypes.func.isRequired
}


  getListItems() {
    let type = this.props.getRootStateValue('selectedType');
    //  let subType = this.props.getRootStateValue('selectedSubType');
    return this.props.searchResults[type] && this.props.searchResults[type].Results ? this.props.searchResults[type].Results : [];
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
