import reducer from './MapItemReducer';
import { FETCH_MAPITEMS } from '../actions/types';

describe('search_string_reducer', () => {

    it('should return the initial state', () => {
        const initialState = [];
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    const mapItems = [
        {
            Uuid: 'cf630753-508a-4e7a-99da-ae1111090248',
            Title: 'Mattilsynets WMS2',
            DistributionProtocol: 'OGC:WMS',
            GetCapabilitiesUrl: 'https://kart.mattilsynet.no/wmscache/service?request=GetCapabilities&service=WMS',
            addLayers: []
        },
        {
            Uuid: '7a50578c-c2b5-4be9-9046-663008016da8',
            Title: 'Skoler - WMS',
            DistributionProtocol: 'OGC:WMS',
            GetCapabilitiesUrl: 'https://kart.tromso.kommune.no/arcgis/services/Temadata/SkolerOgBarnehager/MapServer/WMSServer?request=GetCapabilities&service=WMS',
            addLayers: []
        }
    ]

    it('should handle FETCH_MAPITEMS', () => {
        const updateAction = {
            type: FETCH_MAPITEMS,
            payload: mapItems
        };
        expect(reducer({}, updateAction)).toMatchSnapshot();
    });
});
