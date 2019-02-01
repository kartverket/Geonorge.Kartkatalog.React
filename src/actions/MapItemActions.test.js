import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as mapItemActions from './MapItemActions';


const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore();

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


});
