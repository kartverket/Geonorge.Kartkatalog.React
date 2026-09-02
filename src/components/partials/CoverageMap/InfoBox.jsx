import React, { Fragment } from 'react';
import { Spinner } from '@digdir/designsystemet-react';
import style from './CoverageMap.module.scss';

const InfoBox = ({ clickInfo, onClose }) => {
  if (!clickInfo) return null;

  const [lon, lat] = clickInfo.coordinate;

  return (
    <div className={style.infoBox}>
      <div className={style.infoHeader}>
        <span>Punktinformasjon</span>
        <button type="button" className={style.closeBtn} onClick={onClose} aria-label="Lukk">
          ✕
        </button>
      </div>

      <div className={style.infoCoords}>
        <strong>Koordinater:</strong> {lat.toFixed(6)}, {lon.toFixed(6)}
      </div>

      {clickInfo.loading && (
        <div className={style.infoLoading}>
          <Spinner aria-label="Laster..." data-size="sm" />
        </div>
      )}

      {clickInfo.results.map((result, i) => (
        <div key={i} className={style.infoResult}>
          <strong>{result.source}</strong>
          <dl>
            {Object.entries(result.properties).map(([key, value]) => (
              <Fragment key={key}>
                <dt>{key}</dt>
                <dd>{value != null ? String(value) : '–'}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      ))}

      {!clickInfo.loading && clickInfo.results.length === 0 && (
        <p className={style.noInfo}>Ingen informasjon funnet</p>
      )}
    </div>
  );
};

export default InfoBox;
