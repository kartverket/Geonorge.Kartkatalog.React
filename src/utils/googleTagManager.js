import {Types, getDataLayer} from '../reducers/TagManagerReducer';



export default({getState}) => {
  const DATA_LAYER_CONTAINER = 'dataLayer';
  const _dataLayer = window[DATA_LAYER_CONTAINER] || [];

  // TODO: Finne bedre løsning for denne
  const _gtm = window.google_tag_manager && window.google_tag_manager['GTM-MR2X5P'] ? window.google_tag_manager['GTM-MR2X5P'] : () => {
    setTimeout(function(){
      return window.google_tag_manager && window.google_tag_manager['GTM-MR2X5P'] ? window.google_tag_manager['GTM-MR2X5P'] : null
    }, 300);
  };

  if (!_gtm){console.log("NO GTM")}
  return(next) => (action) => {
    const returnValue = next(action);

    if (_gtm) {
      if (action.type === Types.PUSH_TO_DATALAYER) {
        _dataLayer.push(getDataLayer(getState()));
      } else if (action.type === Types.RESET_DATALAYER) {
        _gtm[DATA_LAYER_CONTAINER].reset();
      }
    }

    return returnValue;
  };
};
