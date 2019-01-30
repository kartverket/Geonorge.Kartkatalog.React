import React, {Component} from 'react';
import { connect } from 'react-redux';
import logo_dev from '../../images/svg/geonorge-navbar-logo_dev.svg';
import style from './Footer.scss';

class Footer extends Component {
	
	render() {
		return (
			<div className={style.container}>  
				<div className={style.logo}><img src={logo_dev} alt="logo geonorge" title="Logo for Geonorge" /></div>
				<div className={style.about}>Om nettstedet</div>
				<div className={style.contact}>Kontakt info</div>
			</div>
		      
			
			)
	}
}

export default connect(null)(Footer);
