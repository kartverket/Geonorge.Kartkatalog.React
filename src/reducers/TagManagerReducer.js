export const Types = {
  ADD_TO_DATALAYER: 'app/analytics/ADD_TO_DATALAYER',
  PUSH_TO_DATALAYER: 'app/analytics/PUSH_TO_DATALAYER',
  RESET_DATALAYER: 'app/analytics/RESET_DATALAYER'
};

const initialState = {
  dataLayer: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case Types.ADD_TO_DATALAYER:
      return action.data
    case Types.RESET_DATALAYER:
      return null
    default:
      return state;
  }
}

export const addToDataLayer = (data = {}) => {
  return {type: Types.ADD_TO_DATALAYER, data};
};

export const pushToDataLayer = (data = {}) => (dispatch) => {
  dispatch(addToDataLayer(data));
  return dispatch({type: Types.PUSH_TO_DATALAYER});
};

export const resetDataLayer = () => {
  return {type: Types.RESET_DATALAYER};
};

export const getDataLayer = (state) => {
  return state.dataLayer;
};
