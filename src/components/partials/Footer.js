// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import { getResource } from 'actions/ResourceActions'
import { getGeonorgeLogo } from 'actions/ImageActions';

// Stylesheets
import style from 'components/partials/Footer.module.scss';

// Assets
import kartverketLogo from 'images/kartverket.png';


export class Footer extends Component {

	getBuildNumber() {
		return this.props.environment && this.props.environment.buildNumber
		? (
				<p>
					<small>{this.props.getResource('Version', 'Versjon')} {this.props.environment.buildNumber}</small>
				</p>
		)
		: '';
	}

	render() {
		const isMapRoute = this.props.router && this.props.router.location && this.props.router.location.pathname === "/kart";
		return !isMapRoute ? (
			<div className={style.container}>
				<div className={style.logo}>
					<img src={this.props.getGeonorgeLogo()} alt="Geonorge logo" title="Logo for Geonorge" />
					{this.getBuildNumber()}
				</div>
				<div className={style.about}>
					<h2 className={style.heading}>{this.props.getResource('AboutTheSite', 'Om nettstedet')}</h2>
					<p>
						<a href="https://www.geonorge.no/aktuelt/om-geonorge/">
							{this.props.getResource('AboutGeonorge', 'Om Geonorge')}
						</a>
					</p>
					<p>
						<a href="https://www.geonorge.no/aktuelt/Nyheter/annet/personvern-og-bruk-av-cookies/#_ga=2.93024157.1065069024.1548754965-263923791.1536837570">
							{this.props.getResource('PrivacyAndUseOfCookies', 'Personvern og bruk av cookies')}
						</a>
					</p>
				</div>
				<div className={style.contact}>
					<h2 className={style.heading}>{this.props.getResource('ContactUs', 'Kontakt')}</h2>
					<p>{this.props.getResource('Telephone', 'Telefon')}: 32 11 80 00</p>
					<p>post@norgedigitalt.no</p>
					<p>{this.props.getResource('OrgNo', 'Org. nr.')}: 971 040 238</p>
					<hr />
					{this.props.getResource('ASolutionBy', 'En løsning fra')}
					<div className={style.logo}><img src={kartverketLogo} alt="Kartverket logo" title="Logo for Kartverket" /></div>
				</div>
			</div>
		) : ''
	}
}


const mapStateToProps = state => ({
    router: state.router,
	resources: state.resources,
	environment: state.environment
});

const mapDispatchToProps = {
	getResource,
    getGeonorgeLogo
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
