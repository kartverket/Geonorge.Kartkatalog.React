import React, { Component } from 'react';

export class Layout extends Component {
  displayName = Layout.name

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
