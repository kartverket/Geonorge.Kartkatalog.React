import {Types, getDataLayer} from '../reducers/TagManagerReducer';

const DATA_LAYER_CONTAINER = 'dataLayer';
const _dataLayer = window[DATA_LAYER_CONTAINER] || [];
const _gtm = window.google_tag_manager['GTM-MR2X5P'];

export default({getState}) => {
  return(next) => (action) => {
    const returnValue = next(action);

    if (action.type === Types.PUSH_TO_DATALAYER) {
      _dataLayer.push(getDataLayer(getState()));
    } else if (action.type === Types.RESET_DATALAYER) {
      _gtm[DATA_LAYER_CONTAINER].reset();
    }

    return returnValue;
  };
};
