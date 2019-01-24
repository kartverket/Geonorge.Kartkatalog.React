import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import style from './SearchResultsTypeList.scss';

class SearchResultsTypeList extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	renderDropdownResults() {
		if (this.props.searchResults && this.props.searchResults.Results) {
			const resultsTypeElements = this.props.searchResults.Results.map((result, i) => {
				return <div className={style.searchResultsItem} key={i}><a href={result.ShowDetailsUrl} key={i}>{result.Title}</a></div>
			})
			return resultsTypeElements;
		}
	}

	showResults() {

	}
	
	render() {
		return (
			<div className={style.searchResultsSection}>
				<div className={style.searchResultsSectionHeadingContainer}>
	                <span className={style.searchResultsSectionHeading}>{this.props.searchResultsType}</span>
	                <span className={style.counter}>{this.props.searchResults.NumFound}</span>
	                <span onClick={() => this.showResults()} className={style.showAllButton}>
	                  Vis alle
	                </span>
	            </div>
				{this.renderDropdownResults()}
			</div>
			)
	}
}

SearchResultsTypeList.propTypes = {
	searchResultsType: PropTypes.string.isRequired,
	searchResults: PropTypes.object.isRequired
}

export default connect(null)(SearchResultsTypeList);