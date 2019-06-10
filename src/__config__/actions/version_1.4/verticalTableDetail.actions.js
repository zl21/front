import network, { urlSearchParams } from '../../../__utils__/network';
import getComponentName from '../../../__utils__/getModuleName';

export default {
  getObjectForMainTableForm({ dispatch, commit }, { table, objid }) { // 获取主表面板数据
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/getObject', urlSearchParams({
      table,
      objid: id,
    })).then((res) => {
      const resData = res.data.data;
      commit('updateCopyDataForRealdOnly', resData);// 复制按钮操作保存默认数据
      dispatch('updateObjectForMainTableForm').then(() => {
        commit('updateObjectForMainTableForm', resData);
      });
    });
  },
  updateObjectForMainTableForm({ commit }) {
    commit('updateFormDataForRefshow');
  },
  getObjectTabForMainTable({ commit, state }, { // 获取主表按钮和子表信息
    table, objid, type
  }) {
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
          commit('updateMainButtonsData', resData,);
          commit('updateMainTabPanelsData', resData);
        } else {
          commit('updateMainButtonsData', resData);
          commit('updateMainTabPanelsData', resData);
        }
        
        if (resData.reftabs && resData.reftabs.length > 0) {
          const firstReftab = resData.reftabs[state.tabCurrentIndex];
          // 获取子表按钮
          if (type !== 'copy') { // 按钮执行复制方法时，不调用子表相关接口
            if (this._actions[`${getComponentName()}/getObjectTabForRefTable`] && this._actions[`${getComponentName()}/getObjectTabForRefTable`].length > 0 && typeof this._actions[`${getComponentName()}/getObjectTabForRefTable`][0] === 'function') {
              const param = {
                table: firstReftab.tablename,
                objid
              };
              this._actions[`${getComponentName()}/getObjectTabForRefTable`][0](param);
            }
            if (resData.reftabs[0].refcolid !== -1) {
            // commit('updateActiveRefFormInfo', resData.reftabs[0]);
            // 获取第一个tab的子表表单
              if (this._actions[`${getComponentName()}/getFormDataForRefTable`] && this._actions[`${getComponentName()}/getFormDataForRefTable`].length > 0 && typeof this._actions[`${getComponentName()}/getFormDataForRefTable`][0] === 'function') {
                const formParam = {
                  table: firstReftab.tablename,
                  inlinemode: firstReftab.tabinlinemode
                };
                this._actions[`${getComponentName()}/getFormDataForRefTable`][0](formParam);
              }
              // 获取第一个tab的子表列表数据
              if (resData.reftabs[0].tabrelation === '1:m') {
                if (this._actions[`${getComponentName()}/getObjectTableItemForTableData`] && this._actions[`${getComponentName()}/getObjectTableItemForTableData`].length > 0 && typeof this._actions[`${getComponentName()}/getObjectTableItemForTableData`][0] === 'function') {
                  const tableParam = {
                    table: firstReftab.tablename,
                    objid,
                    refcolid: firstReftab.refcolid,
                    searchdata: {
                      column_include_uicontroller: true
                    }

                  };
                  this._actions[`${getComponentName()}/getObjectTableItemForTableData`][0](tableParam);
                }
              } else if (resData.reftabs[0].tabrelation === '1:1') {
              // 获取子表面板数据
                if (this._actions[`${getComponentName()}/getItemObjForChildTableForm`] && this._actions[`${getComponentName()}/getItemObjForChildTableForm`].length > 0 && typeof this._actions[`${getComponentName()}/getItemObjForChildTableForm`][0] === 'function') {
                  const tableParam = {
                    table: firstReftab.tablename,
                    objid,
                    refcolid: firstReftab.refcolid,
                  };
                  this._actions[`${getComponentName()}/getItemObjForChildTableForm`][0](tableParam);
                }
              }
            }
          }
        }
      }
    });
  },
  getObjectTabForRefTable({ commit }, { // 获取子表按钮
    table, objid
  }) {
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/objectTab', urlSearchParams({
      table,
      objid: id,
      ismaintable: 'n'
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        commit('updateRefButtonsData', resData);
      }
    });
  },
  getFormDataForRefTable({ commit }, { // 获取子表表单数据
    table, inlinemode
  }) {
    network.post('/p/cs/inputForitem', urlSearchParams({
      table,
      inlinemode
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        commit('updateFormDataForRefTable', resData);
      }
    });
  },
  getObjectTableItemForTableData({ commit }, { // 获取子表列表数据
    table, objid, refcolid, searchdata // fixedcolumns - objectIds
  }) {
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/objectTableItem', urlSearchParams({
      table,
      objid: id, // -1 代表新增
      refcolid,
      searchdata
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        commit('updateTableListForRefTable', resData);
      }
    });
  },
  
  // 按钮
  getItemObjForChildTableForm({ commit }, { table, objid, refcolid }) { // 获取子表面板信息
    // 参数说明  table 子表表名，objid列表界面该行数据的id也就是rowid，refcolid子表id
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/itemObj', urlSearchParams({
      table,
      objid: id,
      refcolid
    })).then((res) => {
      if (res.data.code === 0) {
        const formData = res.data.data;
        commit('updatePanelData', formData);
      }
    });
  },
  performMainTableSaveAction({ commit }, { parame, resolve, reject }) { // 主表保存
    const { tableName } = parame;
    const { objId } = parame;
    const { path } = parame;
    const { type } = parame;
    const { itemName } = parame;
    const { itemCurrentParameter } = parame;
    const { isreftabs } = parame;
    const { enter } = parame;
    const { itemNameGroup } = parame;
    let parames = {};
    if (type === 'add') { // 新增保存参数
      const { add } = parame;
      if (isreftabs) { // 存在子表
        if (itemNameGroup.length > 0) {
          const itemAdd = itemCurrentParameter.add;
          if (path) { // 有path的参数
            add[tableName].ID = objId;
            add[tableName].ISACTIVE = 'Y';
            if (Object.values(itemAdd[itemName]).length > 0) {
              itemAdd[itemName].ID = objId;
              itemAdd[itemName] = [
                itemAdd[itemName]
              ];
              parames = {
                ...add,
                ...itemAdd
              };
            } else {
              parames = {
                ...add,
              };
            }
          } else if (Object.values(itemAdd[itemName]).length > 0) {
            itemAdd[itemName].ID = objId;
            itemAdd[itemName] = [
              itemAdd[itemName]
            ];
            parames = {
              table: tableName, // 主表表名
              objId, // 固定传值-1 表示新增
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...add,
                ...itemAdd,
              }
            };
          } else {
            parames = {
              table: tableName, // 主表表名
              objId, // 固定传值-1 表示新增
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...add,
              }
            };
          }
        } else if (path) { // 有path的参数
          add[tableName].ID = objId;
          parames = {
            ...add,
          };
        } else {
          parames = {
            table: tableName, // 主表表名
            objId, // 固定传值-1 表示新增
            fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
              ...add,
            }
          };
        }
      } else 
      if (path) { // 没有子表    有path的参数
        add[tableName].ID = objId;
        parames = {
          ...add[tableName]
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
      const { modify } = parame;
      const { sataType } = parame;
      if (isreftabs) {
        const itemModify = itemCurrentParameter.modify;
        if (sataType === 'itemSave') { // 子表保存
          if (path) { // 有path的参数
            // let itmValues = itemModify[itemName];
            // if (Object.values(itemModify[itemName]).length > 0) {
            //   itemModify[itemName].ID = objId;
            //   itemModify[itemName] = [
            //     itemModify[itemName]
            //   ];
            // } else {
            //   itemModify[itemName].ID = objId;
            // }
            if (itemModify[itemName]) {
              const itmValues = itemModify[itemName]; 
              if (itmValues instanceof Array === true) { // 判断上下结构是子表修改还是子表新增
                itemModify[itemName].ID = -1;
              } else {
                itemModify[itemName].ID = -1; 
                itemModify[itemName] = [
                  itemModify[itemName]
                ];
              }
            } else {
              itemModify[itemName].ID = objId;
            }
            if (enter) {
              modify[tableName].ID = objId;
            }
            parames = {
              ...modify,
              ...itemModify
            };
          } else {
            const itmValues = itemModify[itemName];

            if (itmValues instanceof Array === true) { // 判断上下结构是子表修改还是子表新增
              itmValues.ID = objId;
            } else {
              itmValues.ID = -1;
              itemModify[itemName] = [
                itmValues
              ]; 
            }
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...itemModify
              }
            };
          } 
        } else if (path) { // 主表保存有path的参数
          modify[tableName].ID = objId;// 主表id
          parames = {
            ...modify
          };
        } else { // 带子表的没有path的主表保存
          const itmValues = itemModify[itemName];
          itemModify[itemName] = [
            itmValues
          ]; 
          parames = {
            table: tableName, // 主表表名
            objId, // 明细id
            fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
              ...itemModify
            }
          };
        }
      } else if (path) { // 测试提出bug:单表通用保存服务（无path）传参格式不对（公司修改）
        const modifys = modify[tableName];
        modifys.ID = objId;
        parames = {
          ...modifys
        };
      } else {
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
    path, table, objId, currentParameter, itemName, isreftabs
  }) { // 主表删除
    let parames = {};
   
    if (isreftabs) {
      if (path) {
        const mainTable = currentParameter.delete;
        mainTable[table].ID = objId;
        mainTable[table].isdelmtable = true;
        parames = {
          ...mainTable
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
      }
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
        reject();
      }
    }).catch(() => {
      reject();
    });
  },
  getObjTabActionSlientConfirm({ commit }, {
    params, path, resolve, reject 
  }) { // 获取作废数据
    network.post(path || '/p/cs/exeAction', { params }).then((res) => {
      if (res.data.code === 0) {
        const invalidData = res.data;
        resolve();

        commit('updateObjTabActionSlientConfirm', invalidData);
      }
    });
  },
};
