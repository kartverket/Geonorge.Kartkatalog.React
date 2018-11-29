import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import style from './MetadataSearchResults.scss';
const dummydata = require('./MetadataSearchResults/dummydata.json');

class ListItem extends React.Component {
	render() {
    console.log(this.props.listItem);
    let mapLink = this.props.listItem.ShowMapLink ? 'kart' : '';
		return (
      <Row>
          <Col sm={9}>
          { this.props.listItem.Title }
          </Col>
          <Col sm={3}>
            { mapLink }
          </Col>
        </Row>
		);
	}
}

export class MetadataSearchResults extends Component {
  displayName = MetadataSearchResults.name

  constructor(props) {
    super(props);
    this.state = { 
      items: dummydata
    };
  }

  renderList() {
      let listItems = this.state.items.map(function(listItem, i){
          return <ListItem listItem={listItem} key={i}/>;
      });
      //let listElement = React.createElement('div', { className: style.list }, listItems);
      
      return listItems;
  }

 

  render() {
    return (
      <div>
        <h1>MetadataSearchResults</h1>

        <p>This is a simple example of a React component.</p>
        <Grid fluid>
        {this.renderList()}
        
        </Grid>


      </div>
    );
  }
}
