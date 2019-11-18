/* eslint-disable import/prefer-default-export */
import network, { urlSearchParams } from '../../../__utils__/network';

export const fetchActionsInCustomizePage = function fetchActionsInCustomizePage(params) {
  network
    .get('/p/cs/fetchActionsInCustomizePage', { params: { param: params.params } })
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};

export const queryMenuPermission = function queryMenuPermission(params) {
  network
    .get('/p/cs/queryMenuPermission', { params: { param: { query: params.params } } })
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};

export const copyPermission = function copyPermission(params) {
  network
    .post('/p/cs/copyPermission', urlSearchParams({ param: params.params }))
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};

export const savePermission = function savePermission(params) {
  const param = {
    GROUPID: params.params.GROUPID,
    fixcolumn: { CP_C_GROUPPERM: params.params.CP_C_GROUPPERM }
  };
  network
    .post('/p/cs/savePermission', urlSearchParams({ param }))
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};

export const cgroupsquery = function cgroupsquery(params) {
  network
    .get('/p/cs/cgroupsquery', { params: { param: params.params } })
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};

export const getMenuTree = function getMenuTree(params) {
  network
    .get('/p/cs/getMenuTree')
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};

export const groupTreeload = function groupTreeload(params) {
  network
    .post('/p/cs/groupTreeload', {})
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};
