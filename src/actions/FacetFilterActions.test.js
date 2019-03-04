import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as facetFilterActions from './FacetFilterActions';


const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore();

describe('facet_filter_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
    });

    describe('updateSelectedFacets', () => {
        test('Dispatches the correct action and payload', () => {
            const facets = [
                {
                    facets: [
                        { Name: 'dataset' },
                        { Name: 'service' }
                    ],
                    facetField: 'type'
                },
                {
                    facets: [
                        { Name: 'Befolkning' },
                        { Name: 'Energi' }
                    ],
                    facetField: 'theme'
                }
            ]
            store.dispatch(facetFilterActions.updateSelectedFacets(facets));
            expect(store.getActions()).toMatchSnapshot();
        });
    });

    describe('updateSelectedFacetsForFacetField', () => {
        test('Dispatches the correct action and payload', () => {
            const facets = [
                { Name: 'dataset' },
                { Name: 'service' }
            ];
            const facetField = 'type';
            store.dispatch(facetFilterActions.updateSelectedFacetsForFacetField(facets, facetField));
            expect(store.getActions()).toMatchSnapshot();
        });
    });
});
