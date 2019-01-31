import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMetadataSearchResults } from '../../../actions/SearchResultActions';
import { updateSelectedFacets } from '../../../actions/FacetFilterActions';
import { updateSelectedSearchResultsType } from '../../../actions/SelectedSearchResultsTypeActions';


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
		this.props.fetchMetadataSearchResults(this.props.searchString,
			{
				type: [
					{ Name: this.props.searchResultsType }
				]
			}
		);
		this.props.updateSelectedFacets([
			{
				facets: [{ Name: this.props.searchResultsType }],
				facetField: 'type'
			}
		]);
		this.props.updateSelectedSearchResultsType(this.props.searchResultsType);
	}
	render() {
		return (
			<div className={style.searchResultsSection}>
				<div className={style.searchResultsSectionHeadingContainer}>
					<span className={style.searchResultsSectionHeading}>{this.props.searchResults.TypeTranslated}</span>
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
	searchString: PropTypes.string.isRequired,
	searchResultsType: PropTypes.string.isRequired,
	searchResults: PropTypes.object.isRequired
};

const mapDispatchToProps = {
	fetchMetadataSearchResults,
	updateSelectedFacets,
	updateSelectedSearchResultsType
};

export default connect(null, mapDispatchToProps)(SearchResultsTypeList);
