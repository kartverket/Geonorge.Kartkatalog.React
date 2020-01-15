import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as downloadItemActions from 'actions/DownloadItemActions';

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore();

const downloadItem = {
    title: "title mapItem",
    uuid: "123456",
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
            expect(localStorage.orderItems).toContain("123456");
        });
    });

    describe('removeItemSelectedForDownload', () => {
        test('Remove item to download', () => {
            store.dispatch(downloadItemActions.removeItemSelectedForDownload(downloadItem));
            expect(localStorage.orderItems).not.toContain("123456");
        });
    });

});
