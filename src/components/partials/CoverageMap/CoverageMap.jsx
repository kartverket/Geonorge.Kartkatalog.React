import React, { useRef } from 'react';
import useCoverageMap from './useCoverageMap';
import LayerPanel from './LayerPanel';
import InfoBox from './InfoBox';
import style from './CoverageMap.module.scss';

const CoverageMap = ({ layerGroups, center, zoom, className }) => {
  const mapTargetRef = useRef(null);

  const {
    layerTree,
    layerState,
    legendState,
    clickInfo,
    toggleLayer,
    toggleGroup,
    setLayerOpacity,
    toggleLegend,
    clearClickInfo,
  } = useCoverageMap(mapTargetRef, layerGroups, { center, zoom });

  return (
    <div className={`${style.coverageMapContainer} ${className || ''}`}>
      <div ref={mapTargetRef} className={style.mapTarget} />

      <LayerPanel
        layerTree={layerTree}
        layerState={layerState}
        legendState={legendState}
        onToggle={toggleLayer}
        onToggleGroup={toggleGroup}
        onOpacityChange={setLayerOpacity}
        onToggleLegend={toggleLegend}
      />

      <InfoBox clickInfo={clickInfo} onClose={clearClickInfo} />
    </div>
  );
};

export default CoverageMap;
