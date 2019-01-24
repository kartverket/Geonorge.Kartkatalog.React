import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMetadataSearchResults, fetchArticleSearchResults, fetchDropdownSearchResults } from '../../../actions/searchResultActions';

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

	hideResults() {
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
        if (this.node.contains(e.target)) {
            return;
        }

        this.hideResults();
    }

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
		this.props.fetchDropdownSearchResults(e.target.value);
		
	}

	onFocus(e){
		this.showResults();
	}

	onSubmit(e) {
		e.preventDefault();
		const searchString = this.state.searchString;
		this.props.fetchMetadataSearchResults(e.target.value);
		this.props.fetchArticleSearchResults(e.target.value);
	}

	componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

	renderDropdownResults() {
		if (this.props.searchResults && this.props.searchResults.dropdownResults) {
			const resultsTypeElements = Object.keys(this.props.searchResults.dropdownResults).map((searchResultsType, i) => {
				let searchResults = this.props.searchResults.dropdownResults[searchResultsType];
				return <SearchResultsTypeList searchResults={searchResults} searchResultsType={searchResultsType} key={i} />
			})
			return resultsTypeElements;
		}
	}
	
	render() {
		return (
			<form ref={node => this.node = node} onSubmit={this.onSubmit} className={style.searchInput}>
				<input  placeholder="Søk" type="text" name="searchString" onChange={this.onChange} onFocus={this.onFocus} value={this.state.searchString} />
				<button>
					<img src={searchIcon}></img>
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
	searchResults: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	searchResults: state.searchResults
});

export default connect(mapStateToProps, { fetchMetadataSearchResults, fetchArticleSearchResults, fetchDropdownSearchResults })(SearchBar);