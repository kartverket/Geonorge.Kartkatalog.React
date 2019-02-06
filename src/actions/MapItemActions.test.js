import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as mapItemActions from './MapItemActions';

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore();

const mapItem = {
    Title: "title mapItem",
    Uuid: "123456",
}

describe('map_item_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
    });

    describe('fetchMapItems', () => {
        test('Dispatches the correct action and payload', () => {
            store.dispatch(mapItemActions.fetchMapItems());
            expect(store.getActions()).toMatchSnapshot();
        });
    });

    describe('addMapItems', () => {
        test('Add map item', () => {
            store.dispatch(mapItemActions.addMapItem(mapItem)); 
            expect(localStorage.mapItems).toContain("123456");
        });
    });

    describe('removeMapItems', () => {
        test('Remove map item', () => {
            store.dispatch(mapItemActions.removeMapItem(mapItem)); 
            expect(localStorage.mapItems).not.toContain("123456");
        });
    });

});