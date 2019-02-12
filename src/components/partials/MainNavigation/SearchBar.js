import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMetadataSearchResults, fetchArticleSearchResults, fetchDropdownSearchResults } from '../../../actions/SearchResultActions';
import { updateSearchString } from '../../../actions/SearchStringActions';

import SearchResultsTypeList from './SearchResultsTypeList';

import style from './SearchBar.scss';
import searchIcon from '../../../images/svg/search-icon.svg';

class SearchBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			searchString: '',
			showResults: false
		};
		this.onFocus = this.onFocus.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.showResults = this.showResults.bind(this);
	}

	hideDropdownResults() {
		this.setState({
			showResults: false
		});
	}

	showResults() {
		this.setState({
			showResults: true
		});
	}

	handleClick = (e) => {
		if (this.node && this.node.contains(e.target)) {
			return;
		}

		this.hideDropdownResults();
	}

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
		this.props.fetchDropdownSearchResults(e.target.value);

	}

	onFocus(e) {
		this.showResults();
	}

	onSubmit(e) {
		e.preventDefault();
		this.hideDropdownResults();
		this.props.fetchMetadataSearchResults(this.state.searchString);
		this.props.fetchArticleSearchResults(this.state.searchString);
		this.props.updateSearchString(this.state.searchString);
	}

	componentWillMount() {
		document.addEventListener('mousedown', this.handleClick, false);
	}

	componentWillUnMount() {
		document.addEventListener('mousedown', this.handleClick, false);
	}

	renderDropdownResults() {
		if (this.props.dropdownResults) {
			const resultsTypeElements = Object.keys(this.props.dropdownResults).filter(searchResultsType => {
				return this.props.dropdownResults[searchResultsType].NumFound;
			}).map((searchResultsType, i) => {
				let searchResults = this.props.dropdownResults[searchResultsType];
				return <SearchResultsTypeList onShowResults={() => this.hideDropdownResults()} searchString={this.state.searchString} searchResults={searchResults} searchResultsType={searchResultsType} key={i} />
			})
			return resultsTypeElements;
		}
	}

	render() {
		return (
			<form ref={node => this.node = node} autoComplete="off" onSubmit={this.onSubmit} className={style.searchInput}>
				<input placeholder="Søk" type="text" name="searchString" onChange={this.onChange} onFocus={this.onFocus} value={this.state.searchString} />
				<button>
					<img src={searchIcon} alt="search icon"></img>
				</button>
				<div className={this.state.showResults ? style.searchResults + ' active' : style.searchResults}>
					{this.renderDropdownResults()}
				</div>
			</form>
		)
	}
}

SearchBar.propTypes = {
	fetchMetadataSearchResults: PropTypes.func.isRequired,
	fetchArticleSearchResults: PropTypes.func.isRequired,
	fetchDropdownSearchResults: PropTypes.func.isRequired,
	dropdownResults: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	dropdownResults: state.searchResults.dropdownResults ? state.searchResults.dropdownResults : {}
});

const mapDispatchToProps = {
	fetchMetadataSearchResults,
	fetchArticleSearchResults,
	fetchDropdownSearchResults,
	updateSearchString
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);