/* eslint-disable camelcase */
import network, { urlSearchParams } from '../../../__utils__/network';
import { DispatchEvent } from '../../../__utils__/dispatchEvent';

export default {
  setColHide(store, data) {
    network.post('/p/cs/setHideColumn', urlSearchParams(data));
  },
  setColPosition(store, data) {
    network.post('/p/cs/setColPosition', urlSearchParams(data));
  },
  setColPin(store, data) {
    network.post('/p/cs/setFixedColumn', urlSearchParams(data));
  },
  getQueryListForAg({ commit }, {
    table, startIndex, range, fixedcolumns, column_include_uicontroller = true, orderby, merge = false, reffixedcolumns
  }) {
    network.post('/p/cs/QueryList', urlSearchParams({
      searchdata: {
        table,
        startindex: startIndex || 0,
        range: range || 10,
        fixedcolumns,
        reffixedcolumns,
        column_include_uicontroller,
        orderby
      }
    })).then((res) => {
      const updateTableData = res.data.data;
      if (merge) {
        commit('updateTableDataWithMerge', updateTableData);
      } else {
        commit('updateTableData', updateTableData);
      }
    });
  },
  getTableQueryForForm({ commit }, { searchData, resolve }) {
    network.post('/p/cs/getTableQuery', urlSearchParams({
      table: searchData.table,
      getcmd: 'y'
    })).then((res) => {
      if (res.data.code === 0) {
        const queryData = res.data.data;
        commit('updateButtonsTabcmd', queryData.tabcmd);
        commit('updateButtonWaListButtons', queryData.waListButtons);
        commit('updateTableStatus4css', queryData.datas);
        commit('updateDefaultFormItemsLists', queryData.datas.dataarry);
        commit('updateDefaultButtonsdatas', queryData.datas);
        commit('updateDefaultSearchFoldnum', queryData.datas.searchFoldnum);
        if (queryData.datas.webconf && queryData.datas.webconf.commonTable) {
          commit('updateWebconfCommonTable', queryData.datas.webconf);
        }
        if (queryData.datas.webconf && queryData.datas.webconf.dynamicRouting) {
          commit('updateWebconfDynamicRouting', queryData.datas.webconf);
        }
        resolve();
      }
    });
  },
  getExportQueryForButtons({ commit },
    {
      OBJ, resolve, reject, data
    }) {
    network.post(data.jflowUrlPath || data.requestUrlPath || '/p/cs/export', urlSearchParams(
      OBJ
    )).then((res) => {
      if (res.data.code === 0) {
        resolve();
        const datas = res.data.data;
        commit('updateButtonsExport', datas);
      } else {
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
  getBatchDeleteForButtons({ commit }, {
    tableName, selectIdArr, resolve, reject, data
  }) { // 调用删除明细接口
    const ids = selectIdArr.map(d => parseInt(d));
    network.post(data.jflowUrlPath || data.requestUrlPath || '/p/cs/batchDelete',
      {
        tableName,
        ids
      }).then((res) => {
      const deleteTableData = res.data;
      if (res.data.code === 0) {
        resolve();
       
        commit('updateButtonDeleteData', deleteTableData);
        // commit('updateButtonsExport', deleteTableData);
      } else {
        commit('updateButtonDeleteData', deleteTableData);
        reject();

        // this.dispatch(`${getComponentName()}/getQueryListForAg`).then(() => {
        //   commit('updateButtonDeleteData', deleteTableData);
        // });
      }
    });
  },
  getExeActionDataForButtons({ commit }, {
    item, obj, resolve, reject, moduleName, routeQuery, routePath
  }) {
    let actionName = '';
    if (item.action.search('/') !== -1) { // 兼容1.3版本action配置为包名时，请求默认接口
      actionName = item.action;
    } else {
      actionName = '';
    }
    network.post(actionName || '/p/cs/exeAction', obj).then((res) => {
      if (res.data.code === 0) {
        resolve(res, actionName);
       
        commit('updateButtonExeActionData', res.data.message);
      } else if (res.data.code === -1) {
        if (res.data.data.length > 0) {
          const deleteFailInfo = res.data.data;
          DispatchEvent('updateSTFailInfo', {
            detail: {
              failInfo: deleteFailInfo,
              moduleComponentName: moduleName
            }
          });
        } else {
          commit('updateButtonExeActionData', res.data.message);
        }
       
        reject(res, actionName);
      }
      DispatchEvent('exeActionForR3', {
        detail: {
          name: 'exeAction',
          type: 'standardTable',
          url: actionName || '/p/cs/exeAction',
          moduleName,
          routeQuery,
          tableName: routeQuery.tableName,
          routePath,
          res,
        }
      });
    }).catch((res) => {
      reject(res, actionName);
    });
  },
  getActionDataForButtons({ commit }, { param, resolve }) {
    network.post('/p/cs/getAction', urlSearchParams(param)).then((res) => {
      commit('updateButtonGetActionData', res.data);
      resolve();
    });
  },
  getToFavoriteDataForButtons({ commit }, { id, type }) { // 收藏
    network.post('/p/cs/addToFavorite', urlSearchParams({
      id,
      type
    })).then((res) => {
      const data = res.data;
      commit('updateButtonSetFavoriteData', data);
    });
  },
  getRemoveFavoriteDataForButtons({ commit }, { id, type }) { // 取消收藏
    network.post('/p/cs/removeFromFavorite', urlSearchParams({
      id,
      type
    })).then((res) => {
      const data = res.data;
      commit('updateButtonSetFavoriteData', data);
    });
  },
  importGetUploadParametersForButtons({ commit }) {
    network.post('/p/cs/settings', urlSearchParams({
      configNames: JSON.stringify(['upload.import.max-file-size'])
    })).then((res) => {
      const data = res.data;
      commit('updateButtonImportGetUploadParameters', data);
    });
  },
  downloadImportTemplateForButtons({ commit }, tableName) {
    network.post('/p/cs/downloadImportTemplate', urlSearchParams({
      searchdata: {
        table: tableName,
      },
    })).then((res) => {
      const data = res.data;
      commit('updateButtonDownloadImportTemplate', data);
    });
  },
  batchVoidForButtons({ commit }, {
    tableName, ids, resolve, reject, data
  }) { // 调用作废接口
    network.post(data.jflowUrlPath || data.requestUrlPath || '/p/cs/batchVoid',
      { tableName, ids }).then((res) => {
      const datas = res.data;
      if (res.data.code === 0) {
        resolve();
        commit('batchVoidForButtonsData', datas);
        commit('onSelectionChangedAssignment', {});
      } else {
        reject();
        commit('batchVoidForButtonsData', datas.data);
        commit('onSelectionChangedAssignment', {});
      }
    });
  },
  batchSubmitForButtons({ commit }, {
    url, tableName, ids, resolve, reject, moduleName, routeQuery, routePath
  }) { // 调用提交接口
    network.post(url || '/p/cs/batchSubmit', {
      tableName,
      ids
    }).then((res) => {
      if (res.data.code === 0) {
        resolve();
        commit('updateButtonbatchSubmitData', res.data);
        commit('onSelectionChangedAssignment', {});
      } else {
        reject();
        commit('updateButtonbatchSubmitData', res.data.data);
        commit('onSelectionChangedAssignment', {});
      }
      DispatchEvent('batchSubmitForR3', {
        detail: {
          name: 'exeAction',
          type: 'verticalTable',
          url: url || '/p/cs/batchSubmit',
          res,
          moduleName,
          routeQuery,
          tableName: routeQuery.tableName,
          routePath
        }
      });
    });
  },
 
  batchUnSubmitForButtons({ commit },
    {
      obj, resolve, reject, data
    }) {
    network.post(data.jflowUrlPath || data.requestUrlPath || '/p/cs/batchUnSubmit',
      obj).then((res) => {
      if (res.data.code === 0) {
        resolve(res);
        commit('updateButtonbatchUnSubmitData', res.data.message);
        commit('onSelectionChangedAssignment', {});
      } else {
        reject();
        commit('updateButtonbatchUnSubmitData', res.data.data);
        commit('onSelectionChangedAssignment', {});
      }
    }).catch((err) => {
      reject(err);
    });
  },
  updateUserConfig({ commit }, { type, id }) {
    network.post('/p/cs/getUserConfig', urlSearchParams({ type, id })).then((res) => {
      setTimeout(() => {
        commit('updateUserConfig', { userConfig: res.data.data });
      }, 100);
    });
  }
};
