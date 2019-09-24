// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import { ErrorBoundary } from '../ErrorBoundary'

// Stylesheets
import style from "./NotFound.scss";

// Assets
import notFoundIllustration from '../../images/svg/404_illustration.svg';

class MapContainer extends Component {
    render() {
        const notFoundIllustrationStyle = {
            backgroundImage: `url(${notFoundIllustration})`,

        };
        return (
            <div>
                <ErrorBoundary>
                    <div className={style.content}>
                        <heading>
                            <h1>Siden finnes ikke</h1>
                            <div>
                                <span className={style.separator}></span>
                            </div>
                            <div className={style.illustration} style={notFoundIllustrationStyle}>
                                <div className={style.illustrationText}>
                                    <p>Vennligst prøv igjen senere.</p>
                                </div>
                            </div>
                        </heading>
                    </div>
                </ErrorBoundary>
            </div>
        )
    }
}

export default connect(null, null)(MapContainer);
