import React, { useState } from 'react';
import { Switch } from '@digdir/designsystemet-react';
import { collectLeafIds, getWmsLegendUrl, getDekningskartLegendUrl } from './layerUtils';
import { DEKNINGSSTATUS_ENTRIES, DEKNINGSKART_RUTENETT_LAYER, DEKNINGSKART_KOMMUNER_LAYER } from './constants';
import style from './CoverageMap.module.scss';

// ── Legend sub-components ──────────────────────────────────────────

function WmsLegend({ node }) {
  const url = getWmsLegendUrl(node.url, node.layerName);
  return <img src={url} alt={`Tegnforklaring: ${node.name}`} className={style.legendImage} />;
}

function DekningskartLegend({ node }) {
  const isRutenett = node.type === 'dekningskart-rutenett';
  const url = getDekningskartLegendUrl(
    isRutenett
      ? 'https://wms.geonorge.no/skwms1/wms.geonorge_dekningskart'
      : 'https://wms.geonorge.no/skwms1/wms.gp_dek_oversikt',
    node.datasetName,
    isRutenett ? DEKNINGSKART_RUTENETT_LAYER : DEKNINGSKART_KOMMUNER_LAYER,
  );
  return <img src={url} alt={`Tegnforklaring: ${node.name}`} className={style.legendImage} />;
}

function FullstendighetsLegend() {
  return (
    <div>
      {DEKNINGSSTATUS_ENTRIES.map(({ key, color }) => (
        <div key={key} className={style.legendSwatch}>
          <span className={style.swatchColor} style={{ backgroundColor: color }} />
          <span>{key}</span>
        </div>
      ))}
    </div>
  );
}

function LayerLegend({ node }) {
  if (node.type === 'wms-layer') return <WmsLegend node={node} />;
  if (node.type === 'dekningskart-rutenett' || node.type === 'dekningskart-kommuner')
    return <DekningskartLegend node={node} />;
  if (node.type === 'fullstendighetsdekning') return <FullstendighetsLegend />;
  return null;
}

// ── Recursive layer tree node ──────────────────────────────────────

function LayerNode({
  node,
  depth,
  layerState,
  legendState,
  onToggle,
  onToggleGroup,
  onOpacityChange,
  onToggleLegend,
  expanded,
  onToggleExpanded,
}) {
  const isGroup = node.children?.length > 0;

  if (isGroup) {
    const leafIds = collectLeafIds(node);
    const allVisible = leafIds.every((id) => layerState[id]?.visible);
    const isOpen = expanded[node.id] !== false;

    return (
      <div className={style.layerNode}>
        <div className={style.groupHeader}>
          <button
            type="button"
            className={style.expandBtn}
            onClick={() => onToggleExpanded(node.id)}
            aria-label={isOpen ? 'Skjul' : 'Vis'}
          >
            {isOpen ? '▾' : '▸'}
          </button>
          <Switch
            data-size="sm"
            checked={allVisible}
            onChange={() => onToggleGroup(node)}
            label={node.name}
          />
        </div>

        {isOpen && (
          <div className={style.groupChildren}>
            {node.children.map((child) => (
              <LayerNode
                key={child.id || child.name}
                node={child}
                depth={depth + 1}
                layerState={layerState}
                legendState={legendState}
                onToggle={onToggle}
                onToggleGroup={onToggleGroup}
                onOpacityChange={onOpacityChange}
                onToggleLegend={onToggleLegend}
                expanded={expanded}
                onToggleExpanded={onToggleExpanded}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Leaf node
  const state = layerState[node.id];
  const showDetails = legendState[node.id];

  return (
    <div className={style.layerNode}>
      <div className={style.leafRow}>
        <Switch
          data-size="sm"
          checked={!!state?.visible}
          onChange={() => onToggle(node.id)}
          label={node.name}
        />
        <button
          type="button"
          className={style.detailsBtn}
          onClick={() => onToggleLegend(node.id)}
          aria-label={showDetails ? 'Skjul detaljer' : 'Vis detaljer'}
        >
          {showDetails ? '▾' : '⋯'}
        </button>
      </div>

      {showDetails && (
        <div className={style.leafDetails}>
          <label className={style.opacityLabel}>
            Gjennomsiktighet
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state?.opacity ?? 1}
              onChange={(e) => onOpacityChange(node.id, parseFloat(e.target.value))}
              className={style.opacitySlider}
            />
          </label>
          <LayerLegend node={node} />
        </div>
      )}
    </div>
  );
}

// ── Panel ──────────────────────────────────────────────────────────

const LayerPanel = ({
  layerTree,
  layerState,
  legendState,
  onToggle,
  onToggleGroup,
  onOpacityChange,
  onToggleLegend,
}) => {
  const [expanded, setExpanded] = useState({});
  const [panelOpen, setPanelOpen] = useState(true);

  const toggleExpanded = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: prev[id] === false ? true : false }));

  if (!panelOpen) {
    return (
      <div className={style.layerPanel}>
        <button
          type="button"
          className={style.panelToggle}
          onClick={() => setPanelOpen(true)}
          aria-label="Vis kartlag"
        >
          Kartlag ▸
        </button>
      </div>
    );
  }

  return (
    <div className={style.layerPanel}>
      <div className={style.layerPanelHeader}>
        <span>Kartlag</span>
        <button
          type="button"
          className={style.panelToggle}
          onClick={() => setPanelOpen(false)}
          aria-label="Skjul kartlag"
        >
          ✕
        </button>
      </div>

      {layerTree.map((group) => (
        <div key={group.name} className={style.layerGroup}>
          <div className={style.layerGroupName}>{group.name}</div>
          {group.children.map((node) => (
            <LayerNode
              key={node.id || node.name}
              node={node}
              depth={0}
              layerState={layerState}
              legendState={legendState}
              onToggle={onToggle}
              onToggleGroup={onToggleGroup}
              onOpacityChange={onOpacityChange}
              onToggleLegend={onToggleLegend}
              expanded={expanded}
              onToggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LayerPanel;
