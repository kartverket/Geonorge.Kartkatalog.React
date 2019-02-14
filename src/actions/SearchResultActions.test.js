import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as searchResultActions from './SearchResultActions';
import {FETCH_AVAILABLEFACETS} from "./types";

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore({});

describe('search_result_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
        // before running each test
    });

    describe('fetchMetadataSearchResults', () => {
        test('Set correct default value for "searchString"', async () => {
            await store.dispatch(searchResultActions.fetchMetadataSearchResults()); // searchString = "", facets = null, Offset = 1, append = false
            expect(store.getActions()[0].searchString).toBe("");
        });

        test('Get correct payload from API', async () => {
            await store.dispatch(searchResultActions.fetchMetadataSearchResults());
            expect(store.getActions()[0].payload).not.toBeNull();
            expect(store.getActions()[0].payload).toHaveProperty('Facets');
            expect(store.getActions()[0].payload).toHaveProperty('Limit');
            expect(store.getActions()[0].payload).toHaveProperty('Offset');
            expect(store.getActions()[0].payload).toHaveProperty('NumFound');
        });

        test('Get search results in payload from API', async () => {
            await store.dispatch(searchResultActions.fetchMetadataSearchResults());
            expect(store.getActions()[0].payload.Results.length).toBeGreaterThan(0);
            expect(store.getActions()[0].payload.NumFound).toBeGreaterThan(0);
        });

        test('Dispatch correct type as default', async () => {
            await store.dispatch(searchResultActions.fetchMetadataSearchResults());
            expect(store.getActions()[0].type).toBe("FETCH_METADATASEARCHRESULTS");
        });

        test('Dispatch correct type if "append" is true', async () => {
            await store.dispatch(searchResultActions.fetchMetadataSearchResults(undefined, null, 1, true));
            expect(store.getActions()[0].type).toBe("APPEND_TO_METADATASEARCHRESULTS");
        });

        test('Dispatch "FETCH_AVAILABLEFACETS"', async () => {
            await store.dispatch(searchResultActions.fetchMetadataSearchResults(undefined, null, 1, true));
            expect(store.getActions()[1].type).toBe("FETCH_AVAILABLEFACETS");
        });
    });
});
