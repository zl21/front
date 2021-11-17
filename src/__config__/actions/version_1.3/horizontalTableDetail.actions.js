import network, { urlSearchParams } from '../../../__utils__/network';
import getComponentName from '../../../__utils__/getModuleName';
import { DispatchEvent } from '../../../__utils__/dispatchEvent';

export default {
  getObjectTabForMainTable({ commit }, {
    table, objid, type, tabIndex, isNotFirstRequest, moduleName, isFirstRequest, resolve
  }) {
    // 参数说明 table 主表表名，objid列表界面该行数据的id也就是rowid
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/objectTab', urlSearchParams({
      table,
      objid: id,
      ismaintable: 'y'
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        commit('updateDefaultButton', JSON.parse(JSON.stringify(res.data.data)));
        if (type === 'copy') {
          resData.type = 'copy';
          commit('updateTabPanelsData', resData);
        } else if (!isNotFirstRequest) {
          if (type === 'refresh') {
            resData.type = 'refresh';
            commit('updateTabPanelsData', resData);
          } else {
            commit('updateTabPanelsData', resData);
          }
        }
        commit('updateWebConf', resData.webconf);
        if (this._actions[`${moduleName || getComponentName()}/getObjectForMainTableForm`] && this._actions[`${moduleName || getComponentName()}/getObjectForMainTableForm`].length > 0 && typeof this._actions[`${moduleName || getComponentName()}/getObjectForMainTableForm`][0] === 'function') {
          const param = {
            table,
            objid,
            tabIndex
          };
          if (resData.webconf && resData.webconf.isCustomizeTab && !isFirstRequest) {
            param.tabIndex += 1;
          }
          this._actions[`${moduleName || getComponentName()}/getObjectForMainTableForm`][0](param);
        }
        if (resolve) {
          resolve(resData);
        }
      }
    });
  }, // 获取主表按钮和子表信息
  getObjectTabForChildTableButtons({ commit }, {
    maintable, table, objid, tabIndex, resolve, reject
  }) {
    // 参数说明 maintable主表表名，table 子表表名，objid列表界面该行数据的id也就是rowid
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/objectTab', urlSearchParams({
      maintable,
      table,
      objid: id,
      ismaintable: 'n'
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        resData.tabIndex = tabIndex;
        commit('updateButtonsData', resData);
        resolve();
      } else {
        reject();
      }
    });
  }, // 获取子表按钮
  getObjectForMainTableForm({ dispatch, commit }, { table, objid, tabIndex }) {
    // 参数说明 table 主表表名，objid列表界面该行数据的id也就是rowid
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/getObject', urlSearchParams({
      table,
      objid: id
    })).then((res) => {
      if (res.data.code === 0) {
        const formData = res.data.data;
        formData.tabIndex = tabIndex;
        // formData.objId = formData.data ? formData.data.id : null;
        commit('updateCopyDataForRealdOnly', formData);// 复制按钮操作保存默认数据
        commit('updatePanelData', formData);
      }
    });
  }, // 获取主表面板信息
  updateObjectForMainTableForm({ commit }) {
    commit('updateFormDataForRefshow');
  },
  getInputForitemForChildTableForm({ commit }, { table, tabIndex, tabinlinemode }) {
    // 参数说明 table 子表表名
    network.post('/p/cs/inputForitem', urlSearchParams({
      table,
      inlinemode: tabinlinemode
    })).then((res) => {
      if (res.data.code === 0) {
        const formData = res.data.data;
        formData.tabIndex = tabIndex;
        commit('updateFormData', formData);
      }
    });
  }, // 获取子表表单信息
  getItemObjForChildTableForm({ commit }, {
    table, objid, refcolid, tabIndex
  }) {
    // 参数说明  table 子表表名，objid列表界面该行数据的id也就是rowid，refcolid子表id
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/itemObj', urlSearchParams({
      table,
      objid: id,
      refcolid
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        resData.tabIndex = tabIndex;
        resData.id = res.data ? res.data.id : null;
        commit('updatePanelData', resData);
      }
    });
  }, // 获取子表面板信息
  getObjectTableItemForTableData({ commit }, {
    table, objid, refcolid, searchdata, tabIndex
  }) {
    // 参数说明  table 子表表名，objid列表界面该行数据的id也就是rowid，refcolid子表id,searchdata查询条件
    const id = objid === 'New' ? '-1' : objid;
    let mainTableName = this.state.global.activeTab && this.state.global.activeTab.tableName;

    const pageSizeCache = window.localStorage.getItem('r3-page-size') ? Number(window.localStorage.getItem('r3-page-size')) : 10
    searchdata.range = pageSizeCache || searchdata.range // 优先用本地缓存

    network.post('/p/cs/objectTableItem', urlSearchParams({
      table,
      objid: id,
      refcolid,
      mainTableName:mainTableName,
      searchdata
    })).then((res) => {
      if (res.data.code === 0) {
        const tableData = res.data.datas;
        tableData.tabIndex = tabIndex;
        commit('updateTableData', tableData);
      }
    });
  },
  // 按钮
  performMainTableSaveAction({ commit }, { parame, resolve, reject }) { // 主表保存
    // const { path } = parame;
    // const { isreftabs } = parame;
    // const { itemNameGroup } = parame;
    const {
      tabrelation, itemObjId, sataType, temporaryStoragePath, itemCurrentParameter, itemName, type, objId, tableName,dialogType 
    } = parame;
    const sataTypeName = sataType ? sataType.sataType : '';
    let parames = {};
    if (type === 'add') { // 新增保存参数
      const { add } = parame;
      parames = {
        table: tableName, // 主表表名
        objid: objId, // 固定传值-1 表示新增
        data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
          ...add
        }
      };
      network.post(temporaryStoragePath || '/p/cs/objectAdd', urlSearchParams(parames)).then((res) => {
        if (res.data.code === 0) {
          const data = res.data;
          resolve(res);
          commit('updateNewMainTableAddSaveData', { data, itemName });
        } else {
          reject();
        }
      });
    } else if (type === 'modify') { // 编辑保存参数
      const { modify } = parame;
      let itemModify = {};
      let itemAdd = {};
      if (itemCurrentParameter) {
        itemModify = itemCurrentParameter.modify;// 子表修改
        // if (itemModify && itemModify[itemName] && itemModify[itemName].length && itemModify[itemName].length > 0) {
        //   itemModify[itemName].map((item, i) => {
        //     if (Object.keys(item) && Object.keys(item).length === 1 && item.ID) {
        //       // itemModify[itemName] = [];
        //     }
        //   });
        //   console.log(444, itemModify[itemName]);
        // }
       

        itemAdd = itemCurrentParameter.add;// 子表新增
      }
      const { modifyLabel } = parame;
      const modifyLabelregroup = parame.modifyLabel[tableName];// 用于begore after字段翻译修改过后的中文label
      const defaultLabelregroup = parame.defaultLabel[tableName];// 用于begore after字段翻译修改过后的中文默认label(包含所有接口返回值)
      const labelregroup = {};// 用于begore after字段翻译修改过后的中文默认label（修改过后的before值，未组装表名）
      let itemModifyLabel = {};// 子表修改的label
      let itemBeforeLabel = {};
      if (parame.itemCurrentParameter) {
        itemModifyLabel = parame.itemCurrentParameter.modifyLabel;// after值
        // if (itemModifyLabel && itemModifyLabel[itemName] && itemModifyLabel[itemName].length && itemModifyLabel[itemName].length > 0) {
        //   itemModifyLabel[itemName].map((item, i) => {
        //     if (Object.keys(item).length === 1 && item.ID) {
        //       itemModifyLabel[itemName] = [];
        //     }
        //   });
        // }
        // console.log(444, itemModifyLabel[itemName]);
        itemBeforeLabel = parame.itemCurrentParameter.itemBeforeLabel;// before值
        // if (itemBeforeLabel && itemBeforeLabel[itemName] && itemBeforeLabel[itemName].length && itemBeforeLabel[itemName].length > 0) {
        //   itemBeforeLabel[itemName].map((item, i) => {
        //     if (Object.keys(item).length === 1 && item.ID) {
        //       itemBeforeLabel[itemName] = [];
        //     }
        //   });
        //   console.log(444, itemBeforeLabel[itemName]);
        // }
      }
      Object.keys(defaultLabelregroup).reduce((obj, item) => {
        Object.keys(modifyLabelregroup).forEach((modifyDataItem) => {
          if (item === modifyDataItem) {
            labelregroup[item] = defaultLabelregroup[modifyDataItem];
            return false;
          }
          return true;
        });

        return {};
      }, {});
      let labelregroupTableName = {};
      if (tableName) {
        labelregroupTableName = {// before值
          [tableName]: labelregroup
        };
      }
      if (temporaryStoragePath) {
        parames = {
          table: tableName,
          objid: objId,
          data: modify,
          after: modifyLabel,
          before: labelregroupTableName,
        };
      } else if (tableName === itemName) { // 主表修改
        parames = {
          table: tableName,
          objid: objId,
          data: modify,
          after: modifyLabel,
          before: labelregroupTableName,
        };
      } else if (sataTypeName === 'add') { // 子表新增
        const addDefault = itemCurrentParameter.addDefault;
        const add = Object.assign({}, addDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
        Object.assign(itemAdd[itemName], add);
        const itemTableAdd = Object.assign({}, itemAdd);
        itemTableAdd[itemName].ID = -1;
        itemTableAdd[itemName] = [
          itemTableAdd[itemName]
        ];
  
        if (Object.values(modify[tableName]).length > 0) {
          const value = Object.assign({}, modify, labelregroupTableName);
          parames = {
            table: tableName,
            objid: objId,
            data: {
              ...modify,
              ...itemTableAdd
            },
            after: { 
              ...modifyLabel,
            },
            before: {
              ...value,
            } 
          };
        } else {
          parames = {
            table: tableName, // 主表表名
            objid: objId, // 明细id
            data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
              ...itemTableAdd
            }
          };
        }
      } else if (sataTypeName === 'modify') { // 子表修改
        if (Object.values(modify[tableName]).length > 0) {
          const value = Object.assign({}, modify, labelregroupTableName);
          parames = {
            table: tableName,
            objid: objId,
            data: {
              ...modify,
              ...itemModify,
            },
            after: { 
              ...modifyLabel,
              ...itemModifyLabel 
                
            },
            before: {
              ...value,
              ...itemBeforeLabel
            } 
          };
        } else if (tabrelation) {
          const itemLabelBeforeRes = parame.itemCurrentParameter.defaultLabel;// 子表修改的label
          const itemModifyResBefore = {};
          const obj = {};

          Object.keys(itemModify[itemName]).forEach((item) => {
            Object.keys(itemLabelBeforeRes[itemName]).forEach((itemBefore) => {
              if (item === itemBefore) {
                obj[itemBefore] = itemLabelBeforeRes[itemName][itemBefore];
                obj.ID = itemObjId;
                itemModifyResBefore[itemName] = [obj];
              }
            });
          });
          itemModify[itemName].ID = itemObjId;
          itemModifyLabel[itemName].ID = itemObjId;

          const itemModifyRes = {}; 
          const itemModifyResAfter = {};

          itemModifyRes[itemName] = [itemModify[itemName]];
          itemModifyResAfter[itemName] = [itemModifyLabel[itemName]];

          if (itemObjId === -1) {
            parames = {
              table: tableName,
              objid: objId,
              data: itemModifyRes,
            };
          } else {
            parames = {
              table: tableName,
              objid: objId,
              data: itemModifyRes,
              after: itemModifyResAfter,
              before: itemModifyResBefore,
            };
          }
        } else {
          parames = {
            table: tableName,
            objid: objId,
            data: itemModify,
            after: itemModifyLabel,
            before: itemBeforeLabel,
          };
        }
      } else if (sataTypeName === 'addAndModify') { // 同时执行多种保存
        const addDefault = itemCurrentParameter.addDefault;
        const add = Object.assign({}, addDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
        Object.assign(itemAdd[itemName], add);
        const itemTableAdd = Object.assign({}, itemAdd);
        itemTableAdd[itemName].ID = -1;
        itemTableAdd[itemName] = [
          itemTableAdd[itemName]
        ];
        const itemAddAndModify = {};// 整合子表新增与子表修改参数，合并到一个数组
        itemAddAndModify[itemName] = itemTableAdd[itemName].concat(itemModify[itemName]);
        // 子表新增保存
        // if (Object.values(itemAdd[itemName]).length > 0 && Object.values(modify[tableName]).length === 0 && Object.values(itemModify[itemName]).length === 0) {
        //   parames = {
        //     table: tableName, // 主表表名
        //     objid: objId, // 明细id
        //     data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
        //       ...itemTableAdd
        //     }
        //   };
        // } else if (Object.values(itemModify[itemName]).length > 0 && Object.values(itemAdd[itemName]).length === 0 && Object.values(modify[tableName]).length === 0) { // 子表修改保存
        //   parames = {
        //     table: tableName,
        //     objid: objId,
        //     data:itemModify,
        //     after: itemModifyLabel,
        //     before: itemBeforeLabel,
        //   };
        // } else 
        if (Object.values(itemAdd[itemName]).length > 0 && Object.values(itemModify[itemName]).length > 0 && Object.values(modify[tableName]).length === 0) { // 2种保存合并（子表修改，子表新增）
          parames = {
            table: tableName, // 主表表名
            objid: objId, // 明细id
            data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
              ...itemAddAndModify
            },
            after: itemModifyLabel,
            before: itemBeforeLabel,
          };
        } else if (Object.values(itemAdd[itemName]).length > 0 && Object.values(modify[tableName]).length > 0 && Object.values(itemModify[itemName]).length === 0) { // 2种保存合并（主表修改，子表新增）
          const value = Object.assign({}, modify, labelregroupTableName);
          parames = {
            table: tableName,
            objid: objId,
            data: {
              ...modify,
              ...itemTableAdd
            },
            after: { 
              ...modifyLabel,
            },
            before: {
              ...value,
            } 
          };
        } else if (Object.values(itemModify[itemName]).length > 0 && Object.values(modify[tableName]).length > 0 && Object.values(itemAdd[itemName]).length === 0) { // 2种保存合并（主表修改，子表修改）
          const value = Object.assign({}, modify, labelregroupTableName);
          parames = {
            table: tableName,
            objid: objId,
            data: {
              ...itemModify,
              ...itemTableAdd
            },
            after: { 
              ...modifyLabel,
              ...itemModifyLabel 
                
            },
            before: {
              ...value,
              ...itemBeforeLabel
            } 
          };
        } else if (Object.values(itemAdd[itemName]).length > 0 && Object.values(itemModify[itemName]).length > 0 && Object.values(modify[tableName]).length > 0) { // 3种保存合并（主表修改，子表新增，子表修改）
          const value = Object.assign({}, modify, labelregroupTableName);
          parames = {
            table: tableName,
            objid: objId,
            data: {
              ...modify,
              ...itemAddAndModify
            },
            after: { 
              ...modifyLabel,
              ...itemModifyLabel 
                
            },
            before: {
              ...value,
              ...itemBeforeLabel
            } 
          };
        }
      } else { // 左右结构单主表
        parames = {
          table: tableName,
          objid: objId,
          data: modify,
          after: modifyLabel,
          before: labelregroupTableName,
        };
      }
      if(dialogType){
        // 兼容子表数据导入
        if(parames.fixedData[itemName] && parames.fixedData[itemName][0]){
          let import_dialog = parames.fixedData[itemName][0]._import_dialog;
          parames.fixedData[itemName] = [...import_dialog]
        }
      }
    
      network.post(temporaryStoragePath || '/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
        if (res.data.code === 0) {
          const data = res.data;
          resolve(res);
          commit('updateNewMainTableAddSaveData', { data, itemName });
        } else {
          reject();
        }
      }).catch(() => {
        reject();
      });
    }
  },

  performMainTableDeleteAction({ commit }, {
    path, table, objId, currentParameter, itemName, itemNameGroup, itemCurrentParameter, resolve, reject
  }) { // 主表删除
    let parames = {};
    if (itemNameGroup && itemNameGroup.length > 0) {
      const itemDelete = itemCurrentParameter.delete;
      if (itemName !== table) { // 子表删除
        const idArray = [];
        itemDelete[itemName].forEach((item) => {
          idArray.push(item.ID);
        });
        const tabItem = { }; 
        tabItem[itemName] = idArray;
        parames = {
          table,
          objid: objId,
          isdelmtable: false,
          data: { ...tabItem }
        };
      } 
    } else {
      parames = {
        table, // 主表表名
        objid: objId,
        delMTable: true
      };
    }
   
    network.post(path || '/p/cs/objectDelete', urlSearchParams(parames)).then((res) => {
      if (res.data.code === 0) {
        resolve();
        const data = res.data;
        commit('updateNewMainTableDeleteData', data);
      } else if (res.data.code === -1) {
        reject();
        const data = res.data.data;
        commit('updatetooltipForItemTableData', data);
      }
    });
  },
  getExportQueryForButtons({ commit }, // 导出
    { OBJ, resolve, reject }) {
    network.post('/p/cs/export', urlSearchParams(
      OBJ
    )).then((res) => {
      if (res.data.code === 0) {
        resolve();
        const data = res.data.data;
        commit('updateButtonsExport', data,);
      } else {
        const data = res.data.data;
        commit('updateButtonsExport', data,);
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
  getObjectTrySubmit({ commit }, {
    objId, table, path, resolve, reject, moduleName,
    routeQuery, routePath
  }) { // 获取提交数据
    objId = objId === 'New' ? '-1' : objId;
    network.post(path || '/p/cs/objectSubmit', urlSearchParams({ objid: objId, table })).then((res) => {
      if (res.data.code === 0) {
        const submitData = res.data;
        resolve();
        commit('updateSubmitData', submitData);
      } else {
        const data = res.data.data;
        commit('updatetooltipForItemTableData', data);
        reject();
      }
      DispatchEvent('batchSubmitForR3', {
        detail: {
          name: 'exeAction',
          type: 'horizontalTable',
          url: path || '/p/cs/objectSubmit',
          res,
          moduleName,
          routeQuery,
          tableName: routeQuery.tableName,
          routePath
        }
      });
    }).catch(() => {
      reject();
    });
  },
  getObjectTryUnSubmit({ commit }, {
    objId, table, path, resolve, reject
  }) { // 获取取消提交数据
    objId = objId === 'New' ? '-1' : objId;
    network.post(path || '/p/cs/objectUnSubmit', urlSearchParams({ objid: objId, table })).then((res) => {
      if (res.data.code === 0) {
        const unSubmitData = res.data;
        resolve();
        commit('updateUnSubmitData', unSubmitData);
      } else {
        const data = res.data.data;
        commit('updatetooltipForItemTableData', data);
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
  getObjectTryInvalid({ commit }, {
    objId, table, path, resolve, reject
  }) { // 获取作废数据
    objId = objId === 'New' ? '-1' : objId;
    network.post(path || '/p/cs/objectVoid', urlSearchParams({ objid: objId, table })).then((res) => {
      if (res.data.code === 0) {
        const invalidData = res.data;
        resolve();

        commit('updateiInvalidData', invalidData);
      } else {
        const data = res.data.data;
        commit('updatetooltipForItemTableData', data);
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
  getObjTabActionSlientConfirm({
    commit
  }, {
    tab,
    params,
    path,
    resolve, reject,
    moduleName,
    routeQuery,
    routePath,
    vuedisplay
  }) {
    let actionName = '';

    // slient_custom类型的按钮默认不加网关
    let serviceconfig;
    if (vuedisplay === 'slient_custom') {
      serviceconfig = {
        noServiceId: true
      };
    }
    
    if (path.search('/') === -1) {
      actionName = '';
      network.post(actionName || '/p/cs/exeAction', urlSearchParams({
        actionid: tab.webid,
        webaction: null,
        param: JSON.stringify(params),
      }), serviceconfig).then((res) => {
        if (res.data.code === 0) {
          const invalidData = res.data;
          resolve(res, actionName);
          commit('updateObjTabActionSlientConfirm', invalidData);
        } else {
          reject(res, actionName);
        }
        DispatchEvent('exeActionForR3', {
          detail: {
            name: 'exeAction',
            type: 'horizontalTable',
            url: actionName || '/p/cs/exeAction',
            res,
            moduleName,
            routeQuery,
            tableName: routeQuery.tableName,
            routePath
          }
        });
      }).catch((res) => {
        reject(res, actionName);
      });
    } else {
      actionName = path;
      network.post(actionName || '/p/cs/exeAction', params, serviceconfig).then((res) => {
        if (res.data.code === 0) {
          const invalidData = res.data;
          resolve();
  
          commit('updateObjTabActionSlientConfirm', invalidData);
        } else {
          reject();
        }
        DispatchEvent('exeActionForR3', {
          detail: {
            name: 'exeAction',
            type: 'horizontalTable',
            url: actionName || '/p/cs/exeAction',
            res,
            moduleName,
            routeQuery,
            tableName: routeQuery.tableName,
            routePath
          }
        });
      }).catch(() => {
        reject();
      });
    }
  },
  getActionDataForButtons({ commit }, { param, resolve }) {
    network.post('/p/cs/getAction', urlSearchParams(param)).then((res) => {
      commit('updateButtonGetActionData', res.data);
      resolve();
    });
  },
 
};
