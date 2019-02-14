import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as searchResultActions from './SearchResultActions';
import {FETCH_AVAILABLEFACETS} from "./types";

const middlewares = [thunk]; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore({});

describe('search_result_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
        // before running each test
    });

    describe('fetchMetadataSearchResults', () => {
        test('Set correct default value for "searchString"', async () => {
            await store.dispatch(searchResultActions.fetchMetadataSearchResults());
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

    describe('fetchArticleSearchResults', () => {
        test('Set correct default value for "searchString"', async () => {
            await store.dispatch(searchResultActions.fetchArticleSearchResults());
            expect(store.getActions()[0].searchString).toBe("");
        });

        test('Get correct payload from API', async () => {
            await store.dispatch(searchResultActions.fetchArticleSearchResults());
            expect(store.getActions()[0].payload).not.toBeNull();
            expect(store.getActions()[0].payload).toHaveProperty('Limit');
            expect(store.getActions()[0].payload).toHaveProperty('Offset');
            expect(store.getActions()[0].payload).toHaveProperty('NumFound');
        });

        test('Get search results in payload from API', async () => {
            await store.dispatch(searchResultActions.fetchArticleSearchResults());
            expect(store.getActions()[0].payload.Results.length).toBeGreaterThan(0);
            expect(store.getActions()[0].payload.NumFound).toBeGreaterThan(0);
        });

        test('Dispatch correct type as default', async () => {
            await store.dispatch(searchResultActions.fetchArticleSearchResults());
            expect(store.getActions()[0].type).toBe("FETCH_ARTICLESEARCHRESULTS");
        });

        test('Dispatch correct type if "append" is true', async () => {
            await store.dispatch(searchResultActions.fetchArticleSearchResults(undefined, null, 1, true));
            expect(store.getActions()[0].type).toBe("APPEND_TO_ARTICLESEARCHRESULTS");
        });
    });

    describe('fetchDropdownSearchResults', () => {
        test('Set correct default value for "searchString"', async () => {
            await store.dispatch(searchResultActions.fetchDropdownSearchResults());
            expect(store.getActions()[0].searchString).toBe("");
        });

        test('Dispatch correct type as default', async () => {
            await store.dispatch(searchResultActions.fetchDropdownSearchResults());
            expect(store.getActions()[0].type).toBe("FETCH_DROPDOWNSEARCHRESULTS");
        });

        test('Get correct payload from API', async () => {
            await store.dispatch(searchResultActions.fetchDropdownSearchResults());
            expect(store.getActions()[0].payload).not.toBeNull();
            expect(store.getActions()[0].payload).toHaveProperty('NumFound');
            expect(store.getActions()[0].payload).toHaveProperty('Limit');
            expect(store.getActions()[0].payload).toHaveProperty('Offset');
            expect(store.getActions()[0].payload).toHaveProperty('Results');
        });

        test('Search results contains articles', async () => {
            await store.dispatch(searchResultActions.fetchDropdownSearchResults());
            expect(store.getActions()).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        searchResultsType: 'articles'
                    })
                ])
            );
        });

        test('Search results contains dataset', async () => {
            await store.dispatch(searchResultActions.fetchDropdownSearchResults());
            expect(store.getActions()).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        searchResultsType: 'dataset'
                    })
                ])
            );
        });

        test('Search results contains service', async () => {
            await store.dispatch(searchResultActions.fetchDropdownSearchResults());
            expect(store.getActions()).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        searchResultsType: 'service'
                    })
                ])
            );
        });

        test('Search results contains software', async () => {
            await store.dispatch(searchResultActions.fetchDropdownSearchResults());
            expect(store.getActions()).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        searchResultsType: 'software'
                    })
                ])
            );
        });
    });
});
