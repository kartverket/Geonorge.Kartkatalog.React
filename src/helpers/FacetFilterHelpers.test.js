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
            const queryString = facetFilterHelpers.getQueryStringFromFacets(selectedFacets);
            expect(queryString).toBe("?type=dataset&type=service&theme=Befolkning&theme=Energi");
        });
        test('Return correct query string with selected facets and search string', () => {
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
            const searchString = "Administrative enheter";
            const queryString = facetFilterHelpers.getQueryStringFromFacets(selectedFacets, searchString);
            expect(queryString).toBe("?text=Administrative enheter&type=dataset&type=service&theme=Befolkning&theme=Energi");
        });
        test('Return correct query string for selected facets with added facet', () => {
            const selectedFacets = {
                theme: {
                    facets: {
                        Befolkning: {Name: 'Befolkning'},
                        Energi: {Name: 'Energi'}
                    },
                    facetField: 'theme'
                }
            };
            const options = {
                facetToAdd: {
                    facet: {
                        Name: 'dataset',
                    },
                    facetField: 'type'
                }
            };
            const queryString = facetFilterHelpers.getQueryStringFromFacets(selectedFacets, null, options);
            expect(queryString).toBe("?theme=Befolkning&theme=Energi&type=dataset");
        });
        test('Return correct query string for selected facets with added facet and child facets', () => {
            const selectedFacets = {
                theme: {
                    facets: {
                        Befolkning: {Name: 'Befolkning'},
                        Energi: {Name: 'Energi'}
                    },
                    facetField: 'theme'
                }
            };
            const options = {
                facetToAdd: {
                    facet: {
                        Name: '0/01/0119',
                        parent: {
                            facet: {
                                Name: '0/01'
                            },
                            facetField: 'area'
                        }
                    },
                    facetField: 'area'
                }
            };
            const queryString = facetFilterHelpers.getQueryStringFromFacets(selectedFacets, null, options);
            expect(queryString).toBe("?theme=Befolkning&theme=Energi&area=0/01|0/01/0119");
        });
        test('Return correct query string for selected facets without removed facet', () => {
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
            const options = {
                facetToRemove: {
                    facet: {
                        Name: 'service',
                    },
                    facetField: 'type'
                }
            };
            const queryString = facetFilterHelpers.getQueryStringFromFacets(selectedFacets, null, options);
            expect(queryString).toBe("?type=dataset&theme=Befolkning&theme=Energi");
        });
        test('Return correct query string for selected facets with removed facet and child facets', () => {
            const selectedFacets = {
                theme: {
                    facets: {
                        Befolkning: {Name: 'Befolkning'},
                        Energi: {Name: 'Energi'}
                    },
                    facetField: 'theme'
                },
                area: {
                    facets: {
                        '0/01': {
                            Name: '0/01',
                            facets: {
                                '0/01/0119': {
                                    Name: '0/01/0119',
                                },
                                '0/01/0105': {
                                    Name: '0/01/0105',
                                }
                            }
                        }
                    },
                    facetField: 'area'
                }
            };
            const options = {
                facetToRemove: {
                    facet: {
                        Name: '0/01/0119',
                        parent: {
                            facet: {
                                Name: '0/01'
                            },
                            facetField: 'area'
                        }
                    },
                    facetField: 'area'
                }
            };
            const queryString = facetFilterHelpers.getQueryStringFromFacets(selectedFacets, null, options);
            expect(queryString).toBe("?theme=Befolkning&theme=Energi&area=0/01|0/01/0105");
        });
    });
});
