import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { Col, Row } from 'react-bootstrap';

import style from './ArticleSearchResult.scss';

class ArticleSearchResult extends Component {
	getTypeIcon() {
		const typeIcons = {
			StandardPage: ['far', 'square'],
			NewsPage: ['far', 'check-square']
		}
		return typeIcons[this.props.searchResult.Type]
	}

	render() {
		return (
			<Row className={style.listItem}>
				<Col sm={12}>
					<span className={style.listItemTitle}>
						<a href={this.props.searchResult.ShowDetailsUrl}>{this.props.searchResult.Title}</a>
						<span className={style.listItemType}>
							{this.props.searchResult.Type}
							<FontAwesomeIcon icon={this.getTypeIcon()} />
						</span>
					</span>
					<span className={style.listItemInfo}>
						{this.props.searchResult.Intro}
					</span>
					<span className={style.listItemDate}>
						{this.props.searchResult.Date}
					</span>
				</Col>
			</Row>
		)
	}
}

ArticleSearchResult.propTypes = {
	searchResult: PropTypes.object.isRequired
}



export default connect(null)(ArticleSearchResult);
