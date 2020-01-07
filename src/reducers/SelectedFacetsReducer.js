import {
    UPDATE_SELECTED_FACETS_FOR_FACET_FIELD,
    UPDATE_SELECTED_FACETS_FROM_URL,
    UPDATE_SELECTEDFACETS
} from 'actions/types';

const initialState = {
    type: {},
    theme: {},
    placegroups: {},
    nationalinitiative: {},
    organization: {},
    dataaccess: {},
    area: {},
    DistributionProtocols: {},
    license: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_SELECTEDFACETS:
            return action.payload;
        case UPDATE_SELECTED_FACETS_FROM_URL:
            return action.payload;
        case UPDATE_SELECTED_FACETS_FOR_FACET_FIELD:
            return action.payload;
        default:
            return state;
    }
}
