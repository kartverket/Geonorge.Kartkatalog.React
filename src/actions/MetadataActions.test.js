import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as metadataActions from './MetadataActions';
import {CLEAR_METADATA, FETCH_METADATA} from "./types";

const middlewares = [thunk]; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore({});

describe('metadata_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
        // before running each test
    });

    describe('clearMetadata', () => {
        test('Dispatch correct type', async () => {
            store.dispatch(metadataActions.clearMetadata());
            expect(store.getActions()[0].type).toBe(CLEAR_METADATA);
        });
        test('Don\'t get payload from API', async () => {
            store.dispatch(metadataActions.clearMetadata());
            expect(store.getActions()[0].payload).not.toBeDefined();
        });
    });

    describe('fetchMetadata', () => {
        const uuid = '041f1e6e-bdbc-4091-b48f-8a5990f3cc5b';
        test('Get correct payload from API', async () => {
            await store.dispatch(metadataActions.fetchMetadata(uuid));
            expect(store.getActions()[0].payload).not.toBeNull();
            expect(store.getActions()[0].payload).toHaveProperty('Uuid');
            expect(store.getActions()[0].payload).toHaveProperty('Title');
            expect(store.getActions()[0].payload).toHaveProperty('Abstract');
        });
        test('Get correct UUID value from API', async () => {
            await store.dispatch(metadataActions.fetchMetadata(uuid));
            expect(store.getActions()[0].payload.Uuid).toBe(uuid);
        });
        test('Dispatch correct type', async () => {
            await store.dispatch(metadataActions.fetchMetadata(uuid));
            expect(store.getActions()[0].type).toBe(FETCH_METADATA);
        });
    });
});
