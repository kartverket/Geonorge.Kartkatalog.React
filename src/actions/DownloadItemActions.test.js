import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as downloadItemActions from './DownloadItemActions';

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore();

const downloadItem = {
    Title: "title mapItem",
    Uuid: "123456",
}

describe('download_item_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
    });

    describe('fetchItemsToDownload', () => {
        test('Dispatches the correct action and payload', () => {
            store.dispatch(downloadItemActions.fetchItemsToDownload());
            expect(store.getActions()).toMatchSnapshot();
        });
    });

    describe('addItemSelectedForDownload', () => {
        test('Add item to download', () => {
            store.dispatch(downloadItemActions.addItemSelectedForDownload(downloadItem)); 
            expect(localStorage.itemsToDownload).toContain("123456");
        });
    });

    describe('removeItemSelectedForDownload', () => {
        test('Remove item to download', () => {
            store.dispatch(downloadItemActions.removeItemSelectedForDownload(downloadItem)); 
            expect(localStorage.itemsToDownload).not.toContain("123456");
        });
    });

});