// Dependencies
import React from "react";

// Components
import { ErrorBoundary } from "../ErrorBoundary";

// Stylesheets
import style from "components/routes/NotFound.module.scss";

// Assets
import notFoundIllustration from "images/svg/404_illustration.svg";

const notFoundIllustrationStyle = {
    backgroundImage: `url(${notFoundIllustration})`
};

const NotFound = () => {
    return (
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
    );
};

export default NotFound;
