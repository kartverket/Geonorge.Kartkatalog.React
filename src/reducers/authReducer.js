const initialState = {
    user: null,
    isAuthenticated: false,
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload, isAuthenticated: !!action.payload };
        case 'REMOVE_USER':
            return { ...state, user: null, isAuthenticated: false };
        default:
            return state;
    }
}