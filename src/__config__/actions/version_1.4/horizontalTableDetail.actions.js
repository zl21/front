import network, { urlSearchParams } from '../../../__utils__/network';
import getComponentName from '../../../__utils__/getModuleName';

export default {
  getObjectTabForMainTable({ commit }, {
    table, objid, type, tabIndex 
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
        } else {
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
  getInputForitemForChildTableForm({ commit }, { table, tabIndex }) {
    // 参数说明 table 子表表名
    network.post('/p/cs/inputForitem', urlSearchParams({
      table,
      inlinemode: 'Y'
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
        const tableData = res.data.data;
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
      if (path) { // 没有子表    有path的参数
        add[tableName].ID = objId;
        parames = {
          ...add
        };
      } else {
        parames = {
          table: tableName, // 主表表名
          objId, // 固定传值-1 表示新增
          fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
            ...add
          }
        };
      }
    } else if (type === 'modify') { // 编辑保存参数
      // const { sataType } = parame;
      if (isreftabs) {
        const itemModify = itemCurrentParameter.modify;
        const itemAdd = itemCurrentParameter.add;// 子表新增
        const itemDefault = itemCurrentParameter.addDefault;// 子表新增
        if (path) { // 有path的参数
          const { modify } = parame;
          // const itmValues = itemModify[itemName];
          if (itemNameGroup.map(item => item.tableName).includes(itemName)) {
            // itemModify[itemName].ID = objId;
            // const add = Object.assign({}, itemDefault, itemAdd);// 整合子表新增和默认值数据
          
            if (sataTypeName === 'add') { // 子表新增
              const add = Object.assign({}, itemAdd[itemName], itemDefault[itemName]);// 整合子表新增和默认值数据
              Object.assign(itemAdd[itemName], add);
              // modify[tableName].ID = objId;// 主表id
              const itemTableAdd = Object.assign({}, itemAdd);

              itemTableAdd[itemName].ID = -1;
              itemTableAdd[itemName] = [
                itemTableAdd[itemName]
              ];
              const mainTabale = {};
              mainTabale[tableName] = {
                ID: objId// 主表id
              };
              parames = {
                ...mainTabale,
                ...itemTableAdd
              };
            } else if (sataTypeName === 'modify') { // 子表编辑
              const mainTabale = {};
              mainTabale[tableName] = {
                ID: objId// 主表id
              };
              // modify[tableName].ID = objId;// 主表id

              parames = {
                ...modify,
                ...itemModify
              };
            }
            //  else {
            //   parames = {
            //     ...modify,
            //   };
            // }
            // if (itmValues instanceof Array === true) { // 判断上下结构是子表修改还是子表新增
            //   itmValues.ID = objId;
            // } else {
            //   itmValues.ID = -1;
            //   itemModify[itemName] = [
            //     itmValues
            //   ];
            // }
          } else {
            modify[tableName].Id = objId;
            parames = {
              ...modify,
            };
          }
        } else {
          const add = Object.assign({}, itemDefault, itemAdd);// 整合子表新增和默认值数据
          if (sataTypeName === 'add') { // 子表新增
            add[itemName].ID = -1;
            add[itemName] = [
              add[itemName]
            ];
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...itemModify
              }
            };
          } else if (sataTypeName === 'modify') { // 子表编辑
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...itemModify
              }
            };
          }


          // const itmValues = itemModify[itemName];
          // if (itmValues instanceof Array === true) { // 判断上下结构是子表修改还是子表新增
          //   itmValues.ID = objId;
          // } else {
          //   itmValues.ID = -1;
          // }
          // itemModify[itemName] = [
          //   itmValues
          // ];
          // itemModify[itemName].ID = objId;
          // parames = {
          //   table: tableName, // 主表表名
          //   objId, // 明细id
          //   fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
          //     ...itemModify
          //   }
          // };
        }
      } else { // 没有子表
        const { modify } = parame;
        parames = {
          table: tableName, // 主表表名
          objId, // 明细id
          fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
            ...modify
          }
        };
      }
    }
    network.post(path || '/p/cs/objectSave', parames).then((res) => {
      if (res.data.code === 0) {
        const data = res.data;
        resolve();
        commit('updateNewMainTableAddSaveData', { data, itemName });
      } else {
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
  performMainTableDeleteAction({ commit }, {
    path, table, objId, currentParameter, itemName, itemNameGroup, itemCurrentParameter
  }) { // 主表删除
    let parames = {};
    if (itemNameGroup && itemNameGroup.length > 0) {
      const mainTable = currentParameter.delete;
      mainTable[table].ID = objId;
      mainTable[table].isdelmtable = false;
      const itemDelete = itemCurrentParameter.delete;
      if (path) {
        parames = {
          ...mainTable,
          ...itemDelete
        };
      } else {
        parames = {
          table, // 主表表名
          objId,
          delMTable: true
        };
      }
    } else if (path) {
      parames = {
        // table, // 主表表名
        ID: objId,
        isdelmtable: true
      };
    } else {
      parames = {
        table, // 主表表名
        objId,
        delMTable: true
      };
    }
   
    network.post(path || '/p/cs/objectDelete', parames).then((res) => {
      if (res.data.code === 0) {
        const data = res.data;
        commit('updateNewMainTableDeleteData', data);
      } else if (res.data.code === -1) {
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
      }
    });
  },
};
