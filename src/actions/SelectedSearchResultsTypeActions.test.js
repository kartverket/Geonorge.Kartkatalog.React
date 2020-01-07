import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

// Actions to be tested
import * as selectedSearchResultsTypeActions from 'actions/SelectedSearchResultsTypeActions';

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);
const store = mockStore();

describe('update_selected_search_results_type_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
    });

    describe('updateSelectedSearchResultsType', () => {
        test('Dispatches the correct action and payload', () => {
            const searchResultsType = 'software';
            store.dispatch(selectedSearchResultsTypeActions.updateSelectedSearchResultsType(searchResultsType));
            expect(store.getActions()).toMatchSnapshot();
        });
    });
});
