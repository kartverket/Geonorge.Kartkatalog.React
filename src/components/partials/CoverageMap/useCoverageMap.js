import { useRef, useState, useEffect, useCallback } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { fromLonLat, toLonLat, get as getProjection } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import 'ol/ol.css';

import {
  createBaseLayer,
  createWmsLeafLayer,
  createDekningskartLayer,
  createFullstendighetsLayer,
  createMarkerLayer,
  buildLayerTree,
  fetchWmsLayers,
  collectLeafIds,
} from './layerUtils';
import {
  DEKNINGSKART_RUTENETT_BASE_URL,
  DEKNINGSKART_RUTENETT_LAYER,
  DEKNINGSKART_KOMMUNER_BASE_URL,
  DEKNINGSKART_KOMMUNER_LAYER,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MAP_PROJECTION,
} from './constants';

// Register EPSG:25833 with extent
proj4.defs('EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
register(proj4);
const proj25833 = getProjection('EPSG:25833');
proj25833.setExtent([-2500000, 3500000, 3045984, 9045984]);

// ── Internal helpers ───────────────────────────────────────────────

function createOlLayer(leaf) {
  switch (leaf.type) {
    case 'wms-layer':
      return createWmsLeafLayer(leaf.url, leaf.layerName);
    case 'dekningskart-rutenett':
      return createDekningskartLayer(DEKNINGSKART_RUTENETT_BASE_URL, leaf.datasetName, DEKNINGSKART_RUTENETT_LAYER);
    case 'dekningskart-kommuner':
      return createDekningskartLayer(DEKNINGSKART_KOMMUNER_BASE_URL, leaf.datasetName, DEKNINGSKART_KOMMUNER_LAYER);
    case 'fullstendighetsdekning':
      return createFullstendighetsLayer(leaf.url);
    default:
      return null;
  }
}

const Z_ORDER = {
  fullstendighetsdekning: 0,
  'dekningskart-kommuner': 1,
  'dekningskart-rutenett': 2,
  'wms-layer': 3,
};

function getOrderedLeaves(tree) {
  const all = [];
  (function collect(nodes) {
    for (const n of nodes) {
      if (n.children?.length) collect(n.children);
      else if (n.id) all.push(n);
    }
  })(tree);
  return all.sort((a, b) => (Z_ORDER[a.type] ?? 3) - (Z_ORDER[b.type] ?? 3));
}

function buildNameMap(nodes) {
  const map = {};
  (function walk(list) {
    for (const n of list) {
      if (n.id) map[n.id] = n.name;
      if (n.children) walk(n.children);
    }
  })(nodes);
  return map;
}

function parseGmlFeatures(gmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(gmlText, 'text/xml');
  const allElements = doc.getElementsByTagName('*');
  const features = [];

  for (const el of allElements) {
    const local = el.localName.toLowerCase();
    // Match standard GML (featuremember) and MapServer (*_feature)
    if (local === 'featuremember' || local === 'featuremembers' || local.endsWith('_feature')) {
      const target = local.endsWith('_feature') ? el : el.children[0];
      if (!target) continue;
      const props = {};
      for (const child of target.children) {
        const tag = child.localName;
        if (/^(boundedBy|Box|coordinates|the_geom|geom|geometry|shape)$/i.test(tag)) continue;
        if (child.namespaceURI === 'http://www.opengis.net/gml') continue;
        props[tag] = child.textContent.trim();
      }
      if (Object.keys(props).length) features.push(props);
    }
  }
  return features;
}

// Formats we can parse, in preference order
const SUPPORTED_INFO_FORMATS = [
  'application/geo+json',
  'application/json',
  'application/vnd.ogc.gml',
  'application/vnd.ogc.gml/3.1.1',
  'application/gml+xml',
  'text/xml',
];

function pickInfoFormat(serverFormats) {
  for (const fmt of SUPPORTED_INFO_FORMATS) {
    if (serverFormats.some((s) => s.toLowerCase() === fmt.toLowerCase())) return fmt;
  }
  return null;
}

function isJsonFormat(fmt) {
  return fmt === 'application/geo+json' || fmt === 'application/json';
}

function parseInfoResponse(text, format) {
  if (isJsonFormat(format)) {
    const data = JSON.parse(text);
    return (data?.features || []).map((f) => f.properties || {});
  }
  return parseGmlFeatures(text);
}

async function handleMapClick(evt, map, layers, nameMap, infoFormatMap, markerLayer, setClickInfo) {
  const coordinate = evt.coordinate;
  const lonLat = toLonLat(coordinate, MAP_PROJECTION);

  // Place marker
  const src = markerLayer.getSource();
  src.clear();
  src.addFeature(new Feature(new Point(coordinate)));

  const results = [];

  // GeoJSON features at pixel
  map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
    if (layer === markerLayer) return;
    const props = { ...feature.getProperties() };
    delete props.geometry;
    const entry = Object.entries(layers).find(([, l]) => l === layer);
    results.push({
      source: entry ? nameMap[entry[0]] || entry[0] : 'Kartlag',
      type: 'geojson',
      properties: props,
    });
  });

  setClickInfo({ coordinate: lonLat, loading: true, results: [...results] });

  // WMS GetFeatureInfo
  const view = map.getView();
  const resolution = view.getResolution();
  const projection = view.getProjection();
  const promises = [];

  for (const [id, olLayer] of Object.entries(layers)) {
    if (!olLayer.getVisible()) continue;
    const source = olLayer.getSource();
    if (typeof source.getFeatureInfoUrl !== 'function') continue;

    // Dekningskart always uses GML; other WMS layers negotiate from capabilities
    let infoFormat;
    if (id.startsWith('dek-')) {
      infoFormat = 'application/vnd.ogc.gml';
    } else {
      infoFormat = pickInfoFormat(infoFormatMap[id] || []);
      if (!infoFormat) continue;
    }

    const infoUrl = source.getFeatureInfoUrl(coordinate, resolution, projection, {
      INFO_FORMAT: infoFormat,
      FEATURE_COUNT: 10,
    });
    if (!infoUrl) continue;

    promises.push(
      fetch(infoUrl)
        .then((r) => (r.ok ? r.text() : null))
        .then((text) => {
          if (!text) return [];
          return parseInfoResponse(text, infoFormat).map((props) => ({
            source: nameMap[id] || id,
            type: 'wms',
            properties: props,
          }));
        })
        .catch(() => []),
    );
  }

  const wmsResults = (await Promise.all(promises)).flat();

  setClickInfo({
    coordinate: lonLat,
    loading: false,
    results: [...results, ...wmsResults],
  });
}

// ── Hook ───────────────────────────────────────────────────────────

export default function useCoverageMap(mapTargetRef, layerGroups, options = {}) {
  const { center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM } = options;

  const mapRef = useRef(null);
  const layersRef = useRef({});
  const markerRef = useRef(null);

  const [layerTree, setLayerTree] = useState([]);
  const [layerState, setLayerState] = useState({});
  const [legendState, setLegendState] = useState({});
  const [clickInfo, setClickInfo] = useState(null);

  // Create map, fetch WMS capabilities, then add layers
  useEffect(() => {
    if (!mapTargetRef.current) return;
    let disposed = false;

    const baseLayer = createBaseLayer();
    const marker = createMarkerLayer();
    markerRef.current = marker;

    const map = new Map({
      target: mapTargetRef.current,
      controls: defaultControls({ attribution: false }),
      layers: [baseLayer, marker],
      view: new View({
        projection: MAP_PROJECTION,
        center: fromLonLat(center, MAP_PROJECTION),
        zoom,
      }),
    });
    mapRef.current = map;

    requestAnimationFrame(() => map.updateSize());
    const observer = new ResizeObserver(() => map.updateSize());
    observer.observe(mapTargetRef.current);

    // Fetch GetCapabilities for every WMS entry in parallel
    (async () => {
      const wmsCapabilities = {};
      const wmsInfoFormats = {};
      const fetches = [];
      (layerGroups || []).forEach((group, gi) => {
        (group.wms || []).forEach((wms, wi) => {
          const key = `${gi}-${wi}`;
          fetches.push(
            fetchWmsLayers(wms.url)
              .then(({ layers, infoFormats }) => {
                wmsCapabilities[key] = layers;
                wmsInfoFormats[key] = infoFormats;
              })
              .catch(() => { wmsCapabilities[key] = []; wmsInfoFormats[key] = []; }),
          );
        });
      });
      await Promise.all(fetches);
      if (disposed) return;

      const tree = buildLayerTree(layerGroups, wmsCapabilities);
      setLayerTree(tree);

      const layers = {};
      const initial = {};
      const olLayers = [];
      const infoFormatMap = {};
      for (const leaf of getOrderedLeaves(tree)) {
        const ol = createOlLayer(leaf);
        if (ol) {
          layers[leaf.id] = ol;
          olLayers.push(ol);
          initial[leaf.id] = { visible: true, opacity: 1 };
          // Attach supported info formats for WMS leaves
          const wmsMatch = leaf.id.match(/^wms-(\d+)-(\d+)-/);
          if (wmsMatch) {
            infoFormatMap[leaf.id] = wmsInfoFormats[`${wmsMatch[1]}-${wmsMatch[2]}`] || [];
          }
        }
      }

      // Insert overlay layers before the marker (last layer)
      for (const ol of olLayers) {
        map.getLayers().insertAt(map.getLayers().getLength() - 1, ol);
      }

      layersRef.current = layers;
      setLayerState(initial);

      const nameMap = buildNameMap(tree);
      map.on('singleclick', (evt) =>
        handleMapClick(evt, map, layers, nameMap, infoFormatMap, marker, setClickInfo),
      );
    })();

    return () => {
      disposed = true;
      observer.disconnect();
      map.setTarget(null);
      map.dispose();
    };
  }, [layerGroups]);

  // Sync visibility / opacity
  useEffect(() => {
    for (const [id, state] of Object.entries(layerState)) {
      const ol = layersRef.current[id];
      if (!ol) continue;
      ol.setVisible(state.visible);
      ol.setOpacity(state.opacity);
    }
  }, [layerState]);

  const toggleLayer = useCallback((id) => {
    setLayerState((prev) => ({
      ...prev,
      [id]: { ...prev[id], visible: !prev[id]?.visible },
    }));
  }, []);

  const toggleGroup = useCallback((node) => {
    const ids = collectLeafIds(node);
    setLayerState((prev) => {
      const allOn = ids.every((id) => prev[id]?.visible);
      const next = { ...prev };
      for (const id of ids) next[id] = { ...next[id], visible: !allOn };
      return next;
    });
  }, []);

  const setLayerOpacity = useCallback((id, opacity) => {
    setLayerState((prev) => ({ ...prev, [id]: { ...prev[id], opacity } }));
  }, []);

  const toggleLegend = useCallback((id) => {
    setLegendState((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const clearClickInfo = useCallback(() => {
    setClickInfo(null);
    markerRef.current?.getSource().clear();
  }, []);

  return {
    layerTree,
    layerState,
    legendState,
    clickInfo,
    toggleLayer,
    toggleGroup,
    setLayerOpacity,
    toggleLegend,
    clearClickInfo,
  };
}
