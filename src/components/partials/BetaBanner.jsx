import React from "react";
import PropTypes from "prop-types";
import { HangerIcon } from "@navikt/aksel-icons";
import style from "./BetaBanner.module.scss";

const BetaBanner = ({ uuid }) => {
    const betaUrl = `${window.location.origin}/beta/metadata/${uuid}`;

    return (
        <div className={style.banner}>
            <HangerIcon aria-hidden className={style.icon} />
            <div className={style.textWrapper}>
                <p className={style.line1}>Vil du teste de nye produktsidene i ny drakt?</p>
                <p className={style.line2}>Vi jobber med å oppdatere produktsidene og vil gjerne ha tilbakemeldinger. <a href={betaUrl}>Gå til beta-versjonen</a></p>
            </div>
        </div>
    );
};

BetaBanner.propTypes = {
    uuid: PropTypes.string.isRequired
};

export default BetaBanner;
