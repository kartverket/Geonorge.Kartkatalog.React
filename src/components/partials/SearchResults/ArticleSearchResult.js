// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';

// Stylesheets
import style from 'components/partials/SearchResults/ArticleSearchResult.module.scss';


class ArticleSearchResult extends Component {
	getArticleTypeIcon() {
		const iconClasses = {
			StandardPage: ['fal', 'file-alt'],
			NewsPage: ['fal', 'newspaper']
		};
		return iconClasses[this.props.searchResult.Type]
	}
	render() {
		return (
			<div className={style.listItem}>
				<span className={style.listItemTitle}>
					<a href={this.props.searchResult.ShowDetailsUrl}>{this.props.searchResult.Title}</a>
					<span title={this.props.searchResult.Type}>
						<FontAwesomeIcon className={style.icon} icon={this.getArticleTypeIcon()} />
					</span>
				</span>
				<span className={style.listItemInfo}>
					{this.props.searchResult.Intro}
				</span>
				<span className={style.listItemDate}>
					<Moment format="DD.MM.YYYY">{this.props.searchResult.Date}</Moment>
				</span>
			</div>
		)
	}
}

ArticleSearchResult.propTypes = {
	searchResult: PropTypes.object.isRequired
};

export default connect(null)(ArticleSearchResult);
