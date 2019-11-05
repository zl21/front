import network, { urlSearchParams } from '../../../__utils__/network';
import getComponentName from '../../../__utils__/getModuleName';

export default {
  getObjectTabForMainTable({ commit }, {
    table, objid, type, tabIndex, isNotFirstRequest
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

        if (type === 'copy') {
          resData.type = 'copy';
          commit('updateTabPanelsData', resData);
        } else if (!isNotFirstRequest) {
          commit('updateTabPanelsData', resData);
        }
        if (this._actions[`${getComponentName()}/getObjectForMainTableForm`] && this._actions[`${getComponentName()}/getObjectForMainTableForm`].length > 0 && typeof this._actions[`${getComponentName()}/getObjectForMainTableForm`][0] === 'function') {
          const param = {
            table,
            objid,
            tabIndex
          };
          this._actions[`${getComponentName()}/getObjectForMainTableForm`][0](param);
        }
      }
    });
  }, // 获取主表按钮和子表信息
  getObjectTabForChildTableButtons({ commit }, {
    maintable, table, objid, tabIndex
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
        const formData = res.data.data;
        formData.tabIndex = tabIndex;
        commit('updatePanelData', formData);
      }
    });
  }, // 获取子表面板信息
  getObjectTableItemForTableData({ commit }, {
    table, objid, refcolid, searchdata, tabIndex
  }) {
    // 参数说明  table 子表表名，objid列表界面该行数据的id也就是rowid，refcolid子表id,searchdata查询条件
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/objectTableItem', urlSearchParams({
      table,
      objid: id,
      refcolid,
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
    const { tableName } = parame;
    const { objId } = parame;
    const { path } = parame;
    const { type } = parame;
    const { itemName } = parame;
    const { itemCurrentParameter } = parame;
    const { isreftabs } = parame;
    const { itemNameGroup } = parame;
    const { sataType } = parame;
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
      network.post('/p/cs/objectAdd', urlSearchParams(parames)).then((res) => {
        if (res.data.code === 0) {
          const data = res.data;
          resolve();
          commit('updateNewMainTableAddSaveData', { data, itemName });
        } else {
          reject();
        }
      });
    } else if (type === 'modify') { // 编辑保存参数
      const { modify } = parame;
      const itemModify = itemCurrentParameter.modify;// 子表修改
      const itemDefault = itemCurrentParameter.default;
      const itemAdd = itemCurrentParameter.add;// 子表新增
      // const itemDefault = itemCurrentParameter.addDefault;// 子表新增
      const dufault = parame.default;
      if (tableName === itemName) { // 主表修改
        const dufaultData = dufault[tableName];
        const defaultForSave = {};
        const dufaultDataForSave = {};
        Object.keys(dufaultData).reduce((obj, item) => { 
          const modifyData = modify[tableName];
          Object.keys(modifyData).reduce((modifyDataObj, modifyDataItem) => {
            if (item === modifyDataItem) {
              defaultForSave[modifyDataItem] = dufaultData[item];
            }
            return modifyDataObj;
          }, {});
          return obj;
        }, {});
        dufaultDataForSave[tableName] = defaultForSave;
        parames = {
          table: tableName,
          objid: objId,
          data: { ...modify },
          after: { ...modify },
          before: dufaultDataForSave
        };
        network.post('/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
          if (res.data.code === 0) {
            const data = res.data;
            resolve();
            commit('updateNewMainTableAddSaveData', { data, itemName });
          } else {
            reject();
          }
        });
      } else if (sataTypeName === 'add') { // 子表新增
        const addDefault = itemCurrentParameter.addDefault;
        const add = Object.assign({}, addDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
        Object.assign(itemAdd[itemName], add);
        const itemTableAdd = Object.assign({}, itemAdd);
        itemTableAdd[itemName].ID = -1;
        itemTableAdd[itemName] = [
          itemTableAdd[itemName]
        ];
        parames = {
          table: tableName, // 主表表名
          objid: objId, // 明细id
          data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
            ...itemTableAdd
          }
        };
        network.post('/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
          if (res.data.code === 0) {
            const data = res.data;
            resolve();
            commit('updateNewMainTableAddSaveData', { data, itemName });
          } else {
            reject();
          }
        });
      } else if (sataTypeName === 'modify') {
        const defaultData = [];
        const defaultForSaveArray = [];
        const defaultForSave = {};
        const dufaultDataForSave = {};
        console.log('🍇', itemModify);
        if (typeof itemModify[itemName] === 'object') {

        } else {
          itemModify[itemName].forEach((modifyItem) => {
            itemDefault[itemName].forEach((defaultItem) => {
              if (modifyItem.ID === defaultItem.EXCEPT_COLUMN_NAME) {
                Object.keys(defaultItem).reduce((obj, item) => { 
                  Object.keys(modifyItem).reduce((modifyDataObj, modifyDataItem) => {
                    if (item === modifyDataItem) {
                      let itemDefault = {};
                      defaultForSave[modifyDataItem] = defaultItem[item];
                      itemDefault = Object.assign({}, modifyItem, defaultForSave);  
                      defaultForSaveArray.push(itemDefault);
                    }
                    return modifyDataObj;
                  }, {});
                  return obj;
                }, {});
                defaultData.push(defaultItem);
              }
            });
          });
        }
        
       
        debugger;
        dufaultDataForSave[tableName] = defaultForSave;
        parames = {
          table: tableName,
          objid: objId,
          data: { ...itemModify },
          after: { ...itemModify },
          before: { defaultForSaveArray }
        };
        network.post('/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
          if (res.data.code === 0) {
            const data = res.data;
            resolve();
            commit('updateNewMainTableAddSaveData', { data, itemName });
          } else {
            reject();
          }
        });
      } else if (sataTypeName === 'addAndModify') {
        if (Object.values(itemAdd[itemName]).length > 0) {
          const addDefault = itemCurrentParameter.addDefault;
          const add = Object.assign({}, addDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
          Object.assign(itemAdd[itemName], add);
          const itemTableAdd = Object.assign({}, itemAdd);
          itemTableAdd[itemName].ID = -1;
          itemTableAdd[itemName] = [
            itemTableAdd[itemName]
          ];
          parames = {
            table: tableName, // 主表表名
            objid: objId, // 明细id
            data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
              ...itemTableAdd
            }
          };
          network.post('/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
            if (res.data.code === 0) {
              const data = res.data;
              resolve();
              commit('updateNewMainTableAddSaveData', { data, itemName });
            } else {
              reject();
            }
          });
        } 
        if (Object.values(itemModify[itemName]).length > 0) {
          const defaultData = [];
          const defaultForSaveArray = [];
          const defaultForSave = {};
          const dufaultDataForSave = {};
          itemModify[itemName].forEach((modifyItem) => {
            itemDefault[itemName].forEach((defaultItem) => {
              if (modifyItem.ID === defaultItem.EXCEPT_COLUMN_NAME) {
                Object.keys(defaultItem).reduce((obj, item) => { 
                  Object.keys(modifyItem).reduce((modifyDataObj, modifyDataItem) => {
                    if (item === modifyDataItem) {
                      let itemDefault = {};
                      defaultForSave[modifyDataItem] = defaultItem[item];
                      itemDefault = Object.assign({}, modifyItem, defaultForSave);  
                      defaultForSaveArray.push(itemDefault);
                    }
                    return modifyDataObj;
                  }, {});
                  return obj;
                }, {});
                defaultData.push(defaultItem);
              }
            });
          });
          dufaultDataForSave[tableName] = defaultForSave;
          parames = {
            table: tableName,
            objid: objId,
            data: { ...itemModify },
            after: { ...itemModify },
            before: { defaultForSaveArray }
          };
          network.post('/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
            if (res.data.code === 0) {
              const data = res.data;
              resolve();
              commit('updateNewMainTableAddSaveData', { data, itemName });
            } else {
              reject();
            }
          });
        }
      }
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
    objId, table, path, resolve, reject
  }) { // 获取提交数据
    objId = objId === 'New' ? '-1' : objId;
    network.post(path || '/p/cs/objectSubmit', { objId, table }).then((res) => {
      if (res.data.code === 0) {
        const submitData = res.data;
        resolve();
        commit('updateSubmitData', submitData);
      } else {
        const data = res.data.data;
        commit('updatetooltipForItemTableData', data);
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
  getObjectTryUnSubmit({ commit }, {
    objId, table, path, resolve, reject
  }) { // 获取取消提交数据
    objId = objId === 'New' ? '-1' : objId;
    network.post(path || '/p/cs/objectUnSubmit', { objId, table }).then((res) => {
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
    network.post(path || '/p/cs/objectVoid', { objId, table }).then((res) => {
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
  getObjTabActionSlientConfirm({ commit }, {
    params, path, resolve, reject
  }) { // 获取作废数据
    network.post(path, params).then((res) => {
      if (res.data.code === 0) {
        const invalidData = res.data;
        resolve();
        commit('updateObjTabActionSlientConfirm', invalidData);
      } else {
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
};
