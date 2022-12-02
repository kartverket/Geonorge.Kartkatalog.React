import { UPDATE_EXPANDEDFACETFILTERS } from "actions/types";

const initialState = {
    type: true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_EXPANDEDFACETFILTERS:
            return action.payload;
        default:
            return state;
    }
}
