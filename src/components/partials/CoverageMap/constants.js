export const DEKNINGSSTATUS_ENTRIES = [
  { key: 'fullstendig', color: '#a6d388' },
  { key: 'ufullstendig', color: '#e8d38a' },
  { key: 'ikkeKartlagt', color: '#f09c5a' },
  { key: 'ikkeRelevant', color: '#b4b4b4' },
];

export const DEKNINGSSTATUS_COLORS = Object.fromEntries(
  DEKNINGSSTATUS_ENTRIES.map(({ key, color }) => [key, color]),
);

export const DEKNINGSKART_RUTENETT_BASE_URL =
  'https://wms.geonorge.no/skwms1/wms.geonorge_dekningskart';
export const DEKNINGSKART_RUTENETT_LAYER = 'geonorgedekningskart';

export const DEKNINGSKART_KOMMUNER_BASE_URL =
  'https://wms.geonorge.no/skwms1/wms.gp_dek_oversikt';
export const DEKNINGSKART_KOMMUNER_LAYER = 'gp_dek_oversikt_wms';

export const BASE_MAP_URL =
  'https://cache.kartverket.no/v1/wmts/1.0.0/topograatone/default/utm33n/{z}/{y}/{x}.png';

export const DEFAULT_CENTER = [15, 65];
export const DEFAULT_ZOOM = 4;

export const MAP_PROJECTION = 'EPSG:25833';
