import {
  FETCH_AVAILABLE_WFS_SERVICE_STATUSES, FETCH_AVAILABLE_WMS_SERVICE_STATUSES
} from 'actions/types';
import { getServiceStatusApiUrl } from 'actions/ApiUrlActions';


export const fetchAvailableWFSServiceStatuses = () => dispatch => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  const serviceStatusApi = dispatch(getServiceStatusApiUrl());
  return fetch(`${serviceStatusApi}/services?servicetype=WFS`, fetchOptions)
    .then(res => res.json())
    .then(resources => dispatch({
      type: FETCH_AVAILABLE_WFS_SERVICE_STATUSES,
      payload: resources
    }))
};


export const fetchAvailableWMSServiceStatuses = () => dispatch => {
  const serviceStatusApi = dispatch(getServiceStatusApiUrl());
  return fetch(`${serviceStatusApi}/services?servicetype=WMS`)
    .then(res => res.json())
    .then(resources => dispatch({
      type: FETCH_AVAILABLE_WMS_SERVICE_STATUSES,
      payload: resources
    }))
};