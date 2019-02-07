import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as searchStringActions from './SearchStringActions';

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore();

describe('search_string_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
    });

    describe('updateSearchString', () => {
        test('Dispatches the correct action and payload', () => {
            const searchString = 'administrative enheter';
            store.dispatch(searchStringActions.updateSearchString(searchString));
            expect(store.getActions()).toMatchSnapshot();
        });
    });
});
