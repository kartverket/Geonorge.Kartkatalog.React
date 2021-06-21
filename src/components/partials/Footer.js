// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Geonorge Webcomponents
import { GeonorgeFooter } from '@kartverket/geonorge-web-components/GeonorgeFooter';

// Actions
import { getResource } from 'actions/ResourceActions'

// Stylesheets
import style from 'components/partials/Footer.module.scss';


export class Footer extends Component {
	render() {
		const isMapRoute = this.props.router?.location?.pathname === "/kart";
		return !isMapRoute ? (
			<React.Fragment>
				<geonorge-footer language={this.props.selectedLanguage} environment={this.props.environment?.environment} />
				<div className={style.buildNumber}>
					{
						this.props.environment?.buildNumber
							? (
								<p>
									<small>{this.props.getResource('Version', 'Versjon')} {this.props.environment.buildNumber}</small>
								</p>
							)
							: ''
					}
				</div>
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
