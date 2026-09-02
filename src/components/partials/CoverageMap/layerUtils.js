import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import ImageWMS from 'ol/source/ImageWMS';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { get as getProjection } from 'ol/proj';
import { getTopLeft, getWidth } from 'ol/extent';
import {
  DEKNINGSKART_RUTENETT_BASE_URL,
  DEKNINGSKART_KOMMUNER_BASE_URL,
  DEKNINGSSTATUS_COLORS,
  MAP_PROJECTION,
} from './constants';

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function createBaseLayer() {
  const projection = getProjection(MAP_PROJECTION);
  const extent = projection.getExtent();
  const size = getWidth(extent) / 256;
  const resolutions = Array.from({ length: 18 }, (_, i) => size / Math.pow(2, i));
  const matrixIds = resolutions.map((_, i) => String(i).padStart(2, '0'));

  return new TileLayer({
    source: new WMTS({
      url: 'https://cache.kartverket.no/v1/service',
      layer: 'topograatone',
      matrixSet: 'utm33n',
      format: 'image/png',
      projection,
      style: 'default',
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(extent),
        resolutions,
        matrixIds,
      }),
      attributions: '© Kartverket',
    }),
  });
}

export function createWmsLeafLayer(url, layerName) {
  return new ImageLayer({
    source: new ImageWMS({
      url,
      params: { LAYERS: layerName, FORMAT: 'image/png', TRANSPARENT: true },
      ratio: 1,
    }),
  });
}

export function createDekningskartLayer(baseUrl, datasetName, layerName) {
  return new ImageLayer({
    source: new ImageWMS({
      url: baseUrl,
      params: {
        datasett: datasetName,
        LAYERS: layerName,
        FORMAT: 'image/png',
        TRANSPARENT: true,
      },
      ratio: 1,
    }),
  });
}

export function createFullstendighetsLayer(url) {
  return new VectorLayer({
    source: new VectorSource({
      url,
      format: new GeoJSON({ dataProjection: 'EPSG:4326', featureProjection: MAP_PROJECTION }),
    }),
    style: (feature) => {
      const status =
        feature.get('dekningsstatus') || feature.get('status') || '';
      const color = DEKNINGSSTATUS_COLORS[status] || '#cccccc';
      return new Style({
        fill: new Fill({ color: hexToRgba(color, 0.6) }),
        stroke: new Stroke({ color, width: 1 }),
      });
    },
  });
}

export function createMarkerLayer() {
  return new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({ color: '#e00d0d' }),
        stroke: new Stroke({ color: '#ffffff', width: 2 }),
      }),
    }),
  });
}

// ── Tree building ──────────────────────────────────────────────────

function buildWmsChildren(layers, gi, wi, url) {
  return layers.map((l) => {
    if (l.Layer?.length) {
      return {
        type: 'wms-group',
        id: `wms-grp-${gi}-${wi}-${l.Name}`,
        name: l.Title || l.Name,
        children: buildWmsChildren(l.Layer, gi, wi, url),
      };
    }
    return {
      type: 'wms-layer',
      id: `wms-${gi}-${wi}-${l.Name}`,
      name: l.Title || l.Name,
      layerName: l.Name,
      url,
    };
  });
}

// Fetch WMS GetCapabilities and parse the layer tree + info formats
export async function fetchWmsLayers(url) {
  const sep = url.includes('?') ? '&' : '?';
  const capsUrl = `${url}${sep}SERVICE=WMS&REQUEST=GetCapabilities`;
  const res = await fetch(capsUrl);
  if (!res.ok) return { layers: [], infoFormats: [] };
  const text = await res.text();
  const caps = new WMSCapabilities().read(text);
  const rootLayer = caps?.Capability?.Layer;
  const layers = rootLayer ? (rootLayer.Layer || (rootLayer.Name ? [rootLayer] : [])) : [];
  const infoFormats = caps?.Capability?.Request?.GetFeatureInfo?.Format || [];
  return { layers, infoFormats };
}

// Build a layer tree synchronously from pre-fetched WMS capability layers
export function buildLayerTree(layerGroups, wmsCapabilities) {
  return layerGroups.map((group, gi) => ({
    type: 'group',
    name: group.name,
    children: [
      ...(group.wms || []).map((wms, wi) => {
        const capKey = `${gi}-${wi}`;
        const capsLayers = wmsCapabilities?.[capKey];
        const children = capsLayers
          ? buildWmsChildren(capsLayers, gi, wi, wms.url)
          : [];
        if (children.length === 0) {
          return {
            type: 'wms-layer',
            id: `wms-${gi}-${wi}-root`,
            name: wms.name,
            layerName: wms.layerName || '',
            url: wms.url,
          };
        }
        return {
          type: 'wms-service',
          id: `wms-svc-${gi}-${wi}`,
          name: wms.name,
          url: wms.url,
          children,
        };
      }),
      ...(group.dekningskartRutenett != null
        ? [
            {
              type: 'dekningskart-rutenett',
              id: `dek-rut-${gi}`,
              name: 'Dekningskart - rutenett',
              datasetName: group.dekningskartRutenett,
            },
          ]
        : []),
      ...(group.dekningskartKommuner != null
        ? [
            {
              type: 'dekningskart-kommuner',
              id: `dek-kom-${gi}`,
              name: 'Dekningskart - kommuner',
              datasetName: group.dekningskartKommuner,
            },
          ]
        : []),
      ...(group.fullstendighetsdekning != null
        ? [
            {
              type: 'fullstendighetsdekning',
              id: `fullst-${gi}`,
              name: 'Fullstendighetsdekning',
              url: group.fullstendighetsdekning,
            },
          ]
        : []),
    ],
  }));
}

// ── Utilities ──────────────────────────────────────────────────────

export function collectLeafIds(node) {
  if (node.children?.length) {
    return node.children.flatMap(collectLeafIds);
  }
  return node.id ? [node.id] : [];
}

export function getWmsLegendUrl(url, layerName) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=${encodeURIComponent(layerName)}&FORMAT=image/png`;
}

export function getDekningskartLegendUrl(baseUrl, datasetName, layerName) {
  return `${baseUrl}?datasett=${encodeURIComponent(datasetName)}&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=${encodeURIComponent(layerName)}&FORMAT=image/png`;
}
