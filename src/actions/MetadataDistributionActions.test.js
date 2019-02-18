import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as metadataDistributionActions from './MetadataDistributionActions';
import {CLEAR_METADATADISTRIBUTIONS, FETCH_METADATADISTRIBUTIONS} from "./types";

const middlewares = [thunk]; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore({});

describe('metadata_distribution_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
        // before running each test
    });

    describe('clearMetadataDistributions', () => {
        test('Dispatch correct type', async () => {
            store.dispatch(metadataDistributionActions.clearMetadataDistributions());
            expect(store.getActions()[0].type).toBe(CLEAR_METADATADISTRIBUTIONS);
        });
        test('Don\'t get payload from API', async () => {
            store.dispatch(metadataDistributionActions.clearMetadataDistributions());
            expect(store.getActions()[0].payload).not.toBeDefined();
        });
    });

    describe('fetchMetadataDistributions', () => {
        const uuid = '041f1e6e-bdbc-4091-b48f-8a5990f3cc5b';
        test('Get correct payload from API', async () => {
            await store.dispatch(metadataDistributionActions.fetchMetadataDistributions(uuid));
            expect(store.getActions()[0].payload).not.toBeNull();
            expect(store.getActions()[0].payload).toHaveProperty('RelatedApplications');
            expect(store.getActions()[0].payload).toHaveProperty('RelatedDataset');
            expect(store.getActions()[0].payload).toHaveProperty('RelatedDownloadServices');
            expect(store.getActions()[0].payload).toHaveProperty('RelatedServiceLayer');
            expect(store.getActions()[0].payload).toHaveProperty('RelatedServices');
            expect(store.getActions()[0].payload).toHaveProperty('RelatedViewServices');
        });
        test('Dispatch correct type', async () => {
            await store.dispatch(metadataDistributionActions.fetchMetadataDistributions(uuid));
            expect(store.getActions()[0].type).toBe(FETCH_METADATADISTRIBUTIONS);
        });
    });
});
