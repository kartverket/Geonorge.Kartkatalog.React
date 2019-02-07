import reducer from './SelectedSearchResultsTypeReducer';
import { UPDATE_SELECTED_SEARCHRESULTS_TYPE } from '../actions/types';

describe('selected_searchresults_type_reducer', () => {
    it('should return the initial state', () => {
        const initialState = 'metadata';
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle UPDATE_SELECTED_SEARCHRESULTS_TYPE', () => {
        const searchString = "software";
        const updateAction = {
            type: UPDATE_SELECTED_SEARCHRESULTS_TYPE,
            payload: searchString
        };
        expect(reducer({}, updateAction)).toMatchSnapshot();
    });
});
