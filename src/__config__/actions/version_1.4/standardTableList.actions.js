/* eslint-disable camelcase */
import network, { urlSearchParams } from '../../../__utils__/network';
import { DispatchEvent } from '../../../__utils__/dispatchEvent';
import { querySearch } from '../../../__utils__/indexedDB';
import { enableKAQueryDataForUser } from '../../../constants/global';
import i18n from '../../../assets/js/i18n';

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
  getQueryListForAg({ commit }, searchdatas) {
    const {
      table, startIndex, range, fixedcolumns, column_include_uicontroller = true, orderby, merge = false, reffixedcolumns, isolr, resolve, reject, searchBeforeResolve, searchBeforeReject
    } = searchdatas;
    let searchdata = {
      table,
      startindex: startIndex || 0,
      range,
      fixedcolumns,
      reffixedcolumns,
      column_include_uicontroller,
      orderby,
      isolr
    };
    searchdata = Object.assign(searchdata, searchdatas);
    delete searchdata.startIndex;
    network.post('/p/cs/QueryList', urlSearchParams({
      searchdata
    })).then(async (res) => {
      // 存在es检索，展示合计总计
      if (isolr) {
        await network.post('/p/cs/QueryList', urlSearchParams({
          searchdata: {
            ...searchdata,
            getsumfileds: true
          }  
        })).then((response) => {
          res.data.datas.fullRangeSubTotalRow = response.data.datas.fullRangeSubTotalRow;
        });
      }
      const updateTableData = res.data.data;
      if (updateTableData.row === '') {
        updateTableData.row = [];
      }
      if (merge) {
        commit('updateTableDataWithMerge', updateTableData);
      } else {
        commit('updateTableData', updateTableData);
      }
      resolve(res);
      if (searchBeforeReject) searchBeforeResolve(res);
    }).catch(() => {
      reject();
      if (searchBeforeReject) searchBeforeReject();
    });
  },
  getTableQueryForForm({ commit }, { searchData, resolve }) {
    network.post('/p/cs/getTableQuery', urlSearchParams({
      table: searchData.table,
      getcmd: 'y'
    })).then(async (res) => {
      if (res.data.code === 0) {
        let indexDBResponse = null;
        if (enableKAQueryDataForUser() || (res.data.data.datas.webconf && res.data.data.datas.webconf.enableKAQueryDataForUser)) {
          indexDBResponse = await querySearch(`${this.state.global.userInfo.id}_${searchData.table}`)
        }
          const queryData = res.data.data;
          if (searchData.closeIsBig) {
            queryData.datas.isbig = false;
          }
          commit('updateButtonsTabcmd', queryData.tabcmd);
          commit('updateButtonWaListButtons', queryData.waListButtons);
          commit('updateTableStatus4css', queryData.datas);
          commit('updateDefaultFormItemsLists', {
            data:queryData.datas.dataarry,
            indexDB: indexDBResponse
          });
          commit('updateDefaultButtonsdatas', queryData.datas);
          commit('updateDefaultSearchFoldnum', queryData.datas.searchFoldnum);
          commit('updateFilterButtons', queryData.datas.listbutton_filter_conf);
          queryData.datas.tablequery = {
            multi_tab: queryData.datas.multi_tab
          };
          if (queryData.datas.tablequery && queryData.datas.tablequery.multi_tab && queryData.datas.tablequery.multi_tab.length > 0) {
            queryData.datas.tablequery.multi_tab.unshift({ tab_name: i18n.t('tips.all') });
            queryData.datas.tablequery.open = true;
          }
          commit('updateFilterTableData', queryData.datas.tablequery);
          if (queryData.datas.webconf) {
            if (queryData.datas.webconf.commonTable) {
              commit('updateWebconfCommonTable', queryData.datas.webconf);
            }
            if (queryData.datas.webconf.dynamicRouting) {
              commit('updateWebconfDynamicRouting', queryData.datas.webconf);
            }
            commit('updataWebConf', queryData.datas.webconf);
          }
          resolve();
        
      }
    });
  },
  getExportQueryForButtons({ commit },
    {
      OBJ, resolve, reject, buttonsData
    }) {
    let jflowpath = '';
    let requestUrlPath = '';
    if (buttonsData) {
      if (buttonsData.jflowpath) {
        jflowpath = buttonsData.jflowpath;
      }
      if (buttonsData.requestUrlPath) {
        requestUrlPath = buttonsData.requestUrlPath;
      }
    }
    network.post(jflowpath || requestUrlPath || '/p/cs/export', urlSearchParams(
      OBJ
    )).then((res) => {
      if (res.data.code === 0) {
        resolve();
        const data = res.data.data;
        commit('updateButtonsExport', {
          fileUrl: data,
          message: res.data.message
        });
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
    const ids = selectIdArr.map(d => window.parseInt16(d));
    let jflowpath = '';
    let requestUrlPath = '';
    if (data) {
      if (data.jflowpath) {
        jflowpath = data.jflowpath;
      }
      if (data.requestUrlPath) {
        requestUrlPath = data.requestUrlPath;
      }
    }
    network.post(jflowpath || requestUrlPath || '/p/cs/batchDelete',
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
    // 处理存储过程逻辑，配置的actiontype中为sp时则走定制的/p/cs/exeAction
    if (item.actiontype === 'sp') {
      actionName = '/p/cs/exeAction';
    }
    obj.actionName = item.webname;
    // slient_custom类型的按钮默认不加网关
    let serviceconfig;
    if (item.vuedisplay === 'slient_custom') {
      serviceconfig = {
        noServiceId: true
      };
    }

    network.post(actionName || '/p/cs/exeAction', obj, serviceconfig).then((res) => {
      if (res.data.code === 0) {
        resolve(res, actionName);
       
        commit('updateButtonExeActionData', res.data.message);
      } else if (res.data.code === -1) {
        if (res.data.data.length > 0) {
          const deleteFailInfo = res.data.data;
          commit('updateFailInfo', deleteFailInfo);
          // 页面刷新
          if(obj.ids.length >deleteFailInfo.length){
            resolve({isrefrsh:true}, actionName);
          }
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
      if (data.code === 0) {
        commit('updateButtonSetFavoriteData', data);
      }
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
    let jflowpath = '';
    let requestUrlPath = '';
    if (data) {
      if (data.jflowpath) {
        jflowpath = data.jflowpath;
      }
      if (data.requestUrlPath) {
        requestUrlPath = data.requestUrlPath;
      }
    }
    network.post(jflowpath || requestUrlPath || '/p/cs/batchVoid',
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
    url, tableName, ids, resolve, reject, moduleName, routeQuery, routePath, data
  }) { // 调用提交接口
    let jflowpath = '';
    let requestUrlPath = '';
    if (data) {
      if (data.jflowpath) {
        jflowpath = data.jflowpath;
      }
      if (data.requestUrlPath) {
        requestUrlPath = data.requestUrlPath;
      }
    }
    network.post(jflowpath || requestUrlPath || url || '/p/cs/batchSubmit', {
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
    let jflowpath = '';
    let requestUrlPath = '';
    if (data) {
      if (data.jflowpath) {
        jflowpath = data.jflowpath;
      }
      if (data.requestUrlPath) {
        requestUrlPath = data.requestUrlPath;
      }
    }
    network.post(jflowpath || requestUrlPath || '/p/cs/batchUnSubmit',
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
