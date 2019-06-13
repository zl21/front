/* eslint-disable camelcase */

import network, { urlSearchParams } from '../../../__utils__/network';

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
    table, startIndex, range, fixedcolumns, column_include_uicontroller = true, orderby
  }) {
    network.post('/p/cs/QueryList', urlSearchParams({
      searchdata: {
        table,
        startindex: startIndex || 0,
        range: range || 10,
        fixedcolumns,
        column_include_uicontroller,
        orderby
      }
    })).then((res) => {
      const updateTableData = res.data.data;
      commit('updateTableData', updateTableData);
    });
  },
  getTableQueryForForm({ commit }, { table }) {
    network.post('/p/cs/getTableQuery', urlSearchParams({
      table,
      getcmd: 'y'
    })).then((res) => {
      if (res.data.code === 0) {
        const queryData = res.data.data;
        commit('updateButtonsTabcmd', queryData.tabcmd);
        commit('updateButtonWaListButtons', queryData.waListButtons);
        commit('updateTableStatus4css', queryData.datas.status4css);
        commit('updateDefaultFormItemsLists', queryData.datas.dataarry);
        commit('updateDefaultButtonsdatas', queryData.datas);
        commit('updateDefaultSearchFoldnum', queryData.datas.searchFoldnum);
      }
    });
  },
  getExportQueryForButtons({ commit }, 
    { OBJ, resolve, reject }) {
    network.post('/p/cs/export', urlSearchParams(
      OBJ
    )).then((res) => {
      if (res.data.code === 0) {
        resolve();
        const data = res.data.data;
        commit('updateButtonsExport', data);
      } else {
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
  getBatchDeleteForButtons({ commit }, {
    tableName, selectIdArr, resolve, reject 
  }) { // 调用删除明细接口
    const ids = selectIdArr.map(d => parseInt(d));
    network.post('/p/cs/batchDelete',
      {
        tableName,
        ids
      }).then((res) => {
      if (res.data.code === 0) {
        resolve();
        const deleteTableData = res.data;
        commit('updateButtonDeleteData', deleteTableData);
        commit('updateButtonsExport', deleteTableData);
      } else {
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
  getExeActionDataForButtons({ commit }, { item, obj }) {
    // debugger;
    // let param = {};
    // if (item.action) {
    //   param = {};
    // } else {
    //   param = {
    //     actionid: item.webid,
    //     webaction: null,
    //     param: JSON.stringify(obj),
    //   };
    // }
    network.post(item.action || '/p/cs/exeAction', urlSearchParams({
      actionid: item.webid,
      webaction: null,
      param: JSON.stringify(obj),
    })).then((res) => {
      commit('updateButtonExeActionData', res.data);
    });
  },
  getActionDataForButtons({ commit }, { successAction }) {
    network.post('/p/cs/getAction', urlSearchParams({
      actionid: 0,
      webaction: successAction,
    })).then((res) => {
      commit('updateButtonGetActionData', res.data);
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
    tableName, ids, resolve, reject 
  }) { // 调用作废接口
    network.post('/p/cs/batchVoid', 
      { tableName, ids }).then((res) => {
      const data = res.data;
      if (res.data.code === 0) {
        resolve();
        commit('batchVoidForButtonsData', data);
      } else {
        reject();
        commit('batchVoidForButtonsData', data.data);
      }
    }).catch(() => {
      reject();
    });
  },
  batchSubmitForButtons({ commit }, {
    url, tableName, ids, resolve, reject 
  }) { // 调用提交接口
    network.post(url || '/p/cs/batchSubmit', {
      tableName, 
      ids
    }).then((res) => {
      if (res.data.code === 0) {
        resolve();
        commit('updateButtonbatchSubmitData', res.data);
      } else {
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
 
  batchUnSubmitForButtons({ commit }, 
    { obj, resolve, reject }) {
    network.post('/p/cs/batchUnSubmit',
      obj).then((res) => {
      if (res.data.code === 0) {
        resolve();
        commit('updateButtonbatchUnSubmitData', res.data.message);
      } else {
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
  updateUserConfig({ commit }, { type, id }) {
    network.post('/p/cs/getUserConfig', urlSearchParams({ type, id })).then((res) => {
      commit('updateUserConfig', { userConfig: res.data.data });
    });
  }
};
