// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Geonorge Webcomponents
import { GeonorgeFooter } from '@kartverket/geonorge-web-components/GeonorgeFooter';

// Actions
import { getResource } from 'actions/ResourceActions'


export class Footer extends Component {
	render() {
		const isMapRoute = this.props.router?.location?.pathname === "/kart";
		return !isMapRoute ? (
			<React.Fragment>
				<geonorge-footer language={this.props.selectedLanguage} environment={this.props.environment?.environment} version={this.props.environment?.buildNumber} />
			</React.Fragment>
		) : ''
	}
}


const mapStateToProps = state => ({
	router: state.router,
	resources: state.resources,
	environment: state.environment,
	selectedLanguage: state.selectedLanguage
});

const mapDispatchToProps = {
	getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
