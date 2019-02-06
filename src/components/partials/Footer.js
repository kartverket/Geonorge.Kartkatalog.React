import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo_dev from '../../images/svg/geonorge-navbar-logo_dev.svg';
import logo_kart_dev from '../../images/kartverket.png';
import style from './Footer.scss';

class Footer extends Component {

	render() {
		return (
			<div className={style.container}>
				<div className={style.logo}><img src={logo_dev} alt="logo geonorge" title="Logo for Geonorge" /></div>
				<div className={style.about}>
					<h3>OM NETTSTEDET</h3>					
					<p><a href="https://www.geonorge.no/aktuelt/om-geonorge/">Om Geonorge</a></p>
					<p><a href="http://kartverket.no/Om-Kartverket/Personvern-og-cookies/#_ga=2.93024157.1065069024.1548754965-263923791.1536837570">Personvern og bruk av cookies</a></p>
				</div>
				<div className={style.contact}>
					<h3>KONTAKT</h3>
					<p>Telefon: 32 11 80 00</p>
					<p>post@norgedigitalt.no</p>
					<p>Org. nr.: 971 040 238</p>
					<hr />
						En løsning fra
					<div className={style.logo}><img src={logo_kart_dev} alt="logo geonorge" title="Logo for Kartverket" /></div>
				</div>
			</div>


		)
	}
}

export default connect(null)(Footer);
