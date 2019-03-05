// Actions to be tested
import * as facetFilterHelpers from './FacetFilterHelpers';

describe('facet_filter_helpers', () => {
    beforeEach(() => { // Runs before each test in the suite
    });

    describe('getQueryStringFromFacets', () => {
        test('Return correct query string with selected facets', () => {
            const selectedFacets = {
                type: {
                    facets: {
                        dataset: {Name: 'dataset'},
                        service: {Name: 'service'}
                    },
                    facetField: 'type'
                },
                theme: {
                    facets: {
                        Befolkning: {Name: 'Befolkning'},
                        Energi: {Name: 'Energi'}
                    },
                    facetField: 'theme'
                }
            };
            const queeryString = facetFilterHelpers.getQueryStringFromFacets(selectedFacets);
            expect(queeryString).toBe("?type=dataset&type=service&theme=Befolkning&theme=Energi");
        });
    });
});
