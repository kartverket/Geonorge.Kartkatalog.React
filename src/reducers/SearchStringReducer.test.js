import reducer from 'reducers/SearchStringReducer';
import { UPDATE_SEARCH_STRING } from 'actions/types';

describe('search_string_reducer', () => {
    it('should return the initial state', () => {
        const initialState = '';
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle UPDATE_SEARCH_STRING', () => {
        const searchString = "administrative enheter";
        const updateAction = {
            type: UPDATE_SEARCH_STRING,
            payload: searchString
        };
        expect(reducer({}, updateAction)).toMatchSnapshot();
    });
});
