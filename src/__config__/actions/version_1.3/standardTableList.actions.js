/* eslint-disable camelcase */

import network, { urlSearchParams } from '../../../__utils__/network';

export default {
  getQueryListForAg({ commit }, {
    table, startIndex, range, fixedcolumns, column_include_uicontroller = true
  }) {
    network.post('/p/cs/QueryList', urlSearchParams({
      searchdata: {
        table,
        startindex: startIndex || 0,
        range: range || 10,
        fixedcolumns,
        column_include_uicontroller,
      }
    })).then((res) => {
      const updateTableData = res.data.datas;
      commit('updateTableData', updateTableData);
    });
  },
  getTableQueryForForm({ commit }, { table }) {
    network.post('/p/cs/getTableQuery', urlSearchParams({
      table,
      getcmd: 'y'
    })).then((res) => {
      if (res.data.code === 0) {
        const queryData = res.data;
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
        commit('updateButtonsExport', data,);
      } else {
        reject();
      }
    });
  },
  getBatchDeleteForButtons({ commit }, { tableName, selectIdArr }) { // 调用删除明细接口
    const objids = selectIdArr.join(',');
    network.post('/p/cs/batchDelete', 
      urlSearchParams({
        table: tableName,
        objids
      })).then((res) => {
      const deleteTableData = res.data;
      commit('updateButtonDeleteData', deleteTableData);
    }); 
  },
  getExeActionDataForButtons({ commit }, { item, obj }) {
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
  batchVoidForButtons({ commit }, { tableName, ids }) { // 调用作废接口
    network.post('/p/cs/batchVoid', 
      { tableName, ids }).then((res) => {
      const messageData = res.data.message;
      commit('batchVoidForButtonsData', messageData);
    });
  },
  
  batchSubmitForButtons({ commit }, { url, tableName, ids }) { // 调用调接口
    network.post(url || '/p/cs/batchSubmit', {
      tableName, 
      ids
    }).then((res) => {
      commit('updateButtonbatchSubmitData', res.data);
    });
  },
  batchUnSubmitForButtons({ commit }, obj) { // 调用提交接口
    network.post('/p/cs/batchUnSubmit', {
      obj
    }).then((res) => {
      commit('updateButtonbatchUnSubmitData', res.data);
    });
  },
  updateUserConfig({ commit }, { type, id }) {
    network.post('/p/cs/getUserConfig', urlSearchParams({ type, id })).then((res) => {
      commit('updateUserConfig', { userConfig: res.data.data });
    });
  }
};
