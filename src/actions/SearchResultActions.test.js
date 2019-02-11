import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as searchResultActions from './SearchResultActions';

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore({});

describe('search_result_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
        // before running each test
    });

    describe('fetchMetadataSearchResults', () => {
        test('Get search results from facets', async () => {
            const facets = {
                type: [
                    { Name: 'dataset' },
                ],
                dataaccess: [
                    { Name: "Open data" }
                ]
            }
            await store.dispatch(searchResultActions.fetchMetadataSearchResults(null, facets)); // searchString = "", facets = null, Offset = 1, append = false
            expect(store.getActions()).toMatchSnapshot();
        });

        test('Get search results from search string', async () => {
            const searchString = 'administrative enheter';
            await store.dispatch(searchResultActions.fetchMetadataSearchResults(searchString)); // searchString = "", facets = null, Offset = 1, append = false
            expect(store.getActions()).toMatchSnapshot();
        });

        test('Get search results from search string and facets', async () => {
            const searchString = 'administrative enheter';
            const facets = {
                type: [
                    { Name: 'dataset' },
                ],
                dataaccess: [
                    { Name: "Open data" }
                ]
            }
            await store.dispatch(searchResultActions.fetchMetadataSearchResults(searchString, facets)); // searchString = "", facets = null, Offset = 1, append = false
            expect(store.getActions()).toMatchSnapshot();
        });
    });
});
