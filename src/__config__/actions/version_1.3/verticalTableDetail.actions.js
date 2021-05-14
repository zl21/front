import { isArray } from 'util';
import network, {
  urlSearchParams
} from '../../../__utils__/network';
import getComponentName from '../../../__utils__/getModuleName';
import { DispatchEvent } from '../../../__utils__/dispatchEvent';

export default {
  getObjectForMainTableForm({
    dispatch,
    commit
  }, {
    table,
    objid
  }) { // 获取主表面板数据
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/getObject', urlSearchParams({
      table,
      objid: id,
    })).then((res) => {
      const resData = res.data.data;
      commit('updateCopyDataForRealdOnly', resData); // 复制按钮操作保存默认数据
      dispatch('updateObjectForMainTableForm').then(() => {
        commit('updateObjectForMainTableForm', resData);
      });
    });
  },
  updateObjectForMainTableForm({
    commit
  }) {
    commit('updateFormDataForRefshow');
  },
  getObjectTabForMainTable({
    commit,
    state
  }, { // 获取主表按钮和子表信息
    table,
    objid,
    type,
    tabIndex,
    itemTabelPageInfo,
    moduleName,
    resolve, reject
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
          commit('updateMainButtonsData', resData);
          commit('updateMainTabPanelsData', resData, itemTabelPageInfo);
        } else if (type === 'refresh') {
          resData.type = 'refresh';
          commit('updateMainButtonsData', resData);
          commit('updateMainTabPanelsData', resData, itemTabelPageInfo);
        } else {
          commit('updateMainButtonsData', resData);
          commit('updateMainTabPanelsData', resData, itemTabelPageInfo);
        }
        commit('updateWebConf', resData.webconf);

        if (resData.reftabs && resData.reftabs.length > 0) {
          const firstReftab = resData.reftabs[state.tabCurrentIndex];
          // 获取子表按钮
          if (type !== 'copy') { // 按钮执行复制方法时，不调用子表相关接口
            // let webactType = '';
            // if (resData.reftabs[0].webact) { // 自定义tab全定制，tab切换时不需要请求
            //   webactType = resData.reftabs[0].webact.substring(0, resData.reftabs[0].webact.lastIndexOf('/')).toUpperCase();
            // }
            const { vuedisplay } = resData.reftabs[tabIndex];
            if (vuedisplay !== 'TabItem') {
              const getObjectTabPromise = new Promise((rec, rej) => {
                if (this._actions[`${moduleName || getComponentName()}/getObjectTabForRefTable`] && this._actions[`${moduleName || getComponentName()}/getObjectTabForRefTable`].length > 0 && typeof this._actions[`${moduleName || getComponentName()}/getObjectTabForRefTable`][0] === 'function') {
                  const param = {
                    table: firstReftab.tablename,
                    objid,
                    tabIndex,
                    rec,
                    rej
                  };
                  this._actions[`${moduleName || getComponentName()}/getObjectTabForRefTable`][0](param);
                }
              });
              if (resData.reftabs[tabIndex].refcolid !== -1) {
                // commit('updateActiveRefFormInfo', resData.reftabs[0]);
                
                // 获取第一个tab的子表列表数据
                if (resData.reftabs[tabIndex].tabrelation === '1:m') {
                  // 获取第一个tab的子表表单
                  if (this._actions[`${moduleName || getComponentName()}/getFormDataForRefTable`] && this._actions[`${moduleName || getComponentName()}/getFormDataForRefTable`].length > 0 && typeof this._actions[`${moduleName || getComponentName()}/getFormDataForRefTable`][0] === 'function') {
                    const formParam = {
                      table: firstReftab.tablename,
                      inlinemode: firstReftab.tabinlinemode,
                      tabIndex
                    };
                    this._actions[`${moduleName || getComponentName()}/getFormDataForRefTable`][0](formParam);
                  }
                  getObjectTabPromise.then(() => {
                    if (this._actions[`${moduleName || getComponentName()}/getObjectTableItemForTableData`] && this._actions[`${moduleName || getComponentName()}/getObjectTableItemForTableData`].length > 0 && typeof this._actions[`${moduleName || getComponentName()}/getObjectTableItemForTableData`][0] === 'function') {
                      const tableParam = {
                        table: firstReftab.tablename,
                        objid,
                        refcolid: firstReftab.refcolid,
                        searchdata: {
                          startindex: itemTabelPageInfo ? (Number(itemTabelPageInfo.currentPageIndex) - 1) * Number(itemTabelPageInfo.pageSize) : 0,
                          range: itemTabelPageInfo ? itemTabelPageInfo.pageSize : 10,
                          column_include_uicontroller: true
                        },
                        tabIndex
                      };
                      this._actions[`${moduleName || getComponentName()}/getObjectTableItemForTableData`][0](tableParam);
                    }
                  });
                } else if (resData.reftabs[tabIndex].tabrelation === '1:1') {
                  // 获取子表面板数据
                  if (this._actions[`${moduleName || getComponentName()}/getItemObjForChildTableForm`] && this._actions[`${moduleName || getComponentName()}/getItemObjForChildTableForm`].length > 0 && typeof this._actions[`${moduleName || getComponentName()}/getItemObjForChildTableForm`][0] === 'function') {
                    const tableParam = {
                      table: firstReftab.tablename,
                      objid,
                      refcolid: firstReftab.refcolid,
                      tabIndex
                    };
                    this._actions[`${moduleName || getComponentName()}/getItemObjForChildTableForm`][0](tableParam);
                  }
                }
              }
            }
          }
        }
        resolve();
      }
    });
  },
  getObjectTabForRefTable({
    commit
  }, { // 获取子表按钮
    table,
    objid,
    tabIndex,
    rec,
    rej
  }) {
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/objectTab', urlSearchParams({
      table,
      objid: id,
      ismaintable: 'n'
    })).then((res) => {
      if (res.data.code === 0) {
        rec();
        const resData = res.data.data;
        resData.tabIndex = tabIndex;
        commit('updateRefButtonsData', resData);
      } else {
        rej();
      }
    });
  },
  getFormDataForRefTable({
    commit
  }, { // 获取子表表单数据
    table,
    inlinemode,
    tabIndex
  }) {
    network.post('/p/cs/inputForitem', urlSearchParams({
      table,
      inlinemode
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        resData.tabIndex = tabIndex;
        commit('updateFormDataForRefTable', resData);
      }
    });
  },
  getObjectTableItemForTableData({
    commit
  }, { // 获取子表列表数据
    table,
    objid,
    refcolid,
    searchdata,
    tabIndex // fixedcolumns - objectIds
  }) {
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/objectTableItem', urlSearchParams({
      table,
      objid: id, // -1 代表新增
      refcolid,
      searchdata
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.datas;
        resData.tabIndex = tabIndex;
        commit('updateTableListForRefTable', resData);
      }
    });
  },

  // 按钮
  getItemObjForChildTableForm({
    commit
  }, {
    table,
    objid,
    refcolid,
    tabIndex
  }) { // 获取子表面板信息
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
        formData.objId = res.data.id; 
        commit('updatePanelData', formData);
      }
    });
  },
  
  performMainTableDeleteAction({
    commit
  }, {
    path,
    table,
    objId,
    currentParameter,
    itemName,
    isreftabs,
    resolve, reject
  }) { // 主表删除
    let parames = {};
    if (isreftabs) {
      parames = {
        table, // 主表表名
        objid: objId,
        delMTable: true
      };
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
      } else {
        reject();
      }
    });
  },

  performMainTableSaveAction({
    commit
  }, {
    parame,
    resolve,
    reject
  }) { // 主表保存
    const {
      tabrelation, itemObjId, tableName, add, objId, type, sataType, itemName, itemCurrentParameter, isreftabs, itemNameGroup, temporaryStoragePath
    } = parame;
    let parames = {};
    if (type === 'add') { // 新增保存参数
      if (isreftabs) { // 存在子表
        if (itemNameGroup.length > 0) {
          const itemAdd = itemCurrentParameter.add;
          const {
            addDefault
          } = itemCurrentParameter;

          if (Object.values(itemAdd[itemName]).length > 0) {
            const itemTableAdd = Object.assign({}, itemAdd);
            itemTableAdd[itemName].ID = objId;
            itemTableAdd[itemName] = [
              itemTableAdd[itemName]
            ];
            if (temporaryStoragePath) {
              parames = {
                table: tableName, // 主表表名
                objid: objId, // 固定传值-1 表示新增
                data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                  ...add,
                }
              };
            } else {
              parames = {
                table: tableName, // 主表表名
                objid: objId, // 固定传值-1 表示新增
                data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                  ...add,
                  ...itemTableAdd,
                }
              };
            }
          } else if (Object.values(addDefault[itemName]).length > 0) { // 如果子表有默认值
            const itemTableAdd = Object.assign({}, addDefault);
            itemTableAdd[itemName].ID = objId;
            itemTableAdd[itemName] = [
              itemTableAdd[itemName]
            ];
            if (temporaryStoragePath) {
              parames = {
                table: tableName, // 主表表名
                objid: objId, // 固定传值-1 表示新增
                data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                  ...add,
                }
              };
            } else {
              parames = {
                table: tableName, // 主表表名
                objid: objId, // 固定传值-1 表示新增
                data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                  ...add,
                  ...itemTableAdd,
                }
              };
            }
          } else {
            parames = {
              table: tableName, // 主表表名
              objid: objId, // 固定传值-1 表示新增
              data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...add,
              }
            };
          }
        } else {
          parames = {
            table: tableName, // 主表表名
            objid: objId,
            data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
              ...add,
            }
          };
        }
      } else {
        parames = {
          table: tableName, // 主表表名
          objid: objId, // 固定传值-1 表示新增
          data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
            ...add
          }
        };
      }
      network.post(temporaryStoragePath || '/p/cs/objectAdd', urlSearchParams(parames)).then((res) => {
        if (res.data.code === 0) {
          const data = res.data;
          resolve(res);
          commit('updateNewMainTableAddSaveData', {
            data,
            itemName
          });
        } else {
          reject();
        }
      });
    } else if (type === 'modify') { // 编辑保存参数
      const { modify } = parame;
      const { modifyLabel } = parame;// 主表修改的label
      let itemModifyLabel = {};// 子表修改的label
      let itemBeforeLabel = {};
      if (parame.itemCurrentParameter) { // 子表取值
        if (temporaryStoragePath) { // 开启暂存
          itemModifyLabel = {};// 子表修改的label
          itemBeforeLabel = {};// before值
        } else {
          itemModifyLabel = parame.itemCurrentParameter.modifyLabel;// 子表修改的label
          // if (itemModifyLabel && itemModifyLabel[itemName] && itemModifyLabel[itemName].length && itemModifyLabel[itemName].length > 0) {
          //   itemModifyLabel[itemName] = itemModifyLabel[itemName].filter((item) => {
          //     if (Object.keys(item).length === 1 && item.ID) {
          //       // itemModifyLabel[itemName] = [];
          //     } else {
          //       return item;
          //     }
          //   });
          // }
          // console.log(444, itemModifyLabel[itemName]);
          itemBeforeLabel = parame.itemCurrentParameter.itemBeforeLabel;// before值
          if (itemBeforeLabel && itemBeforeLabel[itemName] && itemBeforeLabel[itemName].length && itemBeforeLabel[itemName].length > 0) {
            // itemBeforeLabel[itemName] = itemBeforeLabel[itemName].filter((item) => {
            //   if (Object.keys(item).length === 1 && item.ID) {
            //     // itemBeforeLabel[itemName] = [];
            //   } else {
            //     return item;
            //   }
            // });
            // console.log(444, itemBeforeLabel[itemName]);
          }
        }
      }
      const modifyLabelregroup = parame.modifyLabel[tableName];// 用于begore after字段翻译修改过后的中文label
      const defaultLabelregroup = parame.defaultLabel[tableName];// 用于begore after字段翻译修改过后的中文默认label(包含所有接口返回值)
      const labelregroup = {};// 用于begore after字段翻译修改过后的中文默认label（修改过后的返回值）
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
      const labelregroupTableName = {// label修改过后的值
        [tableName]: labelregroup
      };
      let itemModify = {};
      let itemAdd = {};
      if (temporaryStoragePath) { // 暂存
        itemModify = {};// 子表修改
        itemAdd = {};// 子表新增
      } else {
        itemModify = itemCurrentParameter ? itemCurrentParameter.modify : {};// 子表修改
        
        // if (itemModify && itemModify[itemName] && itemModify[itemName].length && itemModify[itemName].length > 0) {
        //   itemModify[itemName] = itemModify[itemName].filter((item) => {
        //     console.log(99, Object.keys(item).length, item.ID);

        //     if (Object.keys(item).length === 1 && item.ID) {
        //       // itemModify[itemName].splice(i, 1);
        //     } else {
        //       return item;
        //     }
        //   });
        // }
        itemAdd = itemCurrentParameter ? itemCurrentParameter.add : {};// 子表新增
      }
      const sataTypeName = sataType ? sataType.sataType : '';
      if (sataTypeName === 'add') { // 子表新增
        const addDefault = itemCurrentParameter ? itemCurrentParameter.addDefault : {};

        const add = Object.assign({}, addDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据

        if (itemAdd && itemAdd[itemName]) {
          Object.assign(itemAdd[itemName], add);
        }
        
        const itemTableAddOld = Object.assign({}, itemAdd);

        // const originProto = Object.getPrototypeOf(itemAdd);
        // const itemTableAdd = Object.assign(Object.create(originProto), itemAdd);
        const addAssign = JSON.stringify(itemTableAddOld);// 因此操作会改变store状态值，所以对象字符串之间互转，生成新对象
        const itemTableAdd = JSON.parse(addAssign);


        if (itemTableAdd && itemTableAdd[itemName]) {
          itemTableAdd[itemName].ID = -1;
          itemTableAdd[itemName] = [
            itemTableAdd[itemName]
          ];
        }
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
        } else if (temporaryStoragePath) {
          const value = Object.assign({}, modify, labelregroupTableName);
          parames = {
            table: tableName,
            objid: objId,
            data: { ...modify },
            after: { ...modifyLabel },
            before: value,
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
      } else if (sataTypeName === 'modify') {
        if (temporaryStoragePath) {
          const value = Object.assign({}, modify, labelregroupTableName);
          parames = {
            table: tableName,
            objid: objId,
            data: { ...modify },
            after: { ...modifyLabel },
            before: value,
          };
        } else if (Object.values(modify[tableName]).length > 0) {
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
          Object.keys(itemModify[itemName]).forEach((item) => {
            Object.keys(itemLabelBeforeRes[itemName]).forEach((itemBefore) => {
              if (item === itemBefore) {
                const obj = {};
                obj.ID = itemObjId;
                obj[itemBefore] = itemLabelBeforeRes[itemName][itemBefore];
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
  
  
          parames = {
            table: tableName,
            objid: objId,
            data: itemModifyRes,
            after: itemModifyResAfter,
            before: itemModifyResBefore,
          };
        } else {
          parames = {
            table: tableName,
            objid: objId,
            data: itemModify,
            after: itemModifyLabel,
            before: itemBeforeLabel,
          };
        }
      } else if (sataTypeName === 'addAndModify') {
        const addDefault = itemCurrentParameter ? itemCurrentParameter.addDefault : {};
        const add = Object.assign({}, addDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
        const itemAddAndModify = {};

        if (itemAdd && itemAdd[itemName]) {
          Object.assign(itemAdd[itemName], add);
        }

        const itemTableAdd = Object.assign({}, itemAdd);
        if (itemTableAdd && itemTableAdd[itemName]) {
          itemTableAdd[itemName].ID = -1;
          itemTableAdd[itemName] = [
            itemTableAdd[itemName]
          ];
        }
        // if (itemAddAndModify && itemAddAndModify[itemName]) {
        itemAddAndModify[itemName] = itemTableAdd[itemName].concat(itemModify[itemName]);
        // }
        if (itemAdd[itemName]
          && itemAdd[itemName]
          && Object.values(itemAdd[itemName]).length > 0
          && modify[tableName]
          && Object.values(modify[tableName]).length > 0 
          && itemModify[itemName]
          && Object.values(itemModify[itemName]).length === 0) { // 2种保存合并（主表修改，子表新增）
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
        } else if (itemModify[itemName]
          && Object.values(itemModify[itemName]).length > 0
          && modify[tableName]
           && Object.values(modify[tableName]).length > 0 
           && itemAdd[itemName]
           && Object.values(itemAdd[itemName]).length === 0) { // 2种保存合并（主表修改，子表修改）
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
        } else if (
          itemAdd[itemName]
          && Object.values(itemAdd[itemName]).length > 0
           && itemModify[itemName]
          && Object.values(itemModify[itemName]).length > 0
          && modify[tableName]
           && Object.values(modify[tableName]).length === 0) { // 2种保存合并（子表修改，子表新增）
          parames = {
            table: tableName,
            objid: objId,
            data: {
              ...itemAddAndModify
            },
            after: { 
              ...itemModifyLabel 
              
            },
            before: {
              ...itemBeforeLabel
            } 
          };
        } else if (
          itemAdd[itemName]
          && Object.values(itemAdd[itemName]).length > 0
          && itemModify[itemName]
           && Object.values(itemModify[itemName]).length > 0 
           && modify[tableName]
           && Object.values(modify[tableName]).length > 0) { // 3种保存合并（主表修改，子表新增，子表修改）
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
        } else if (temporaryStoragePath) {
          const value = Object.assign({}, modify, labelregroupTableName);
          parames = {
            table: tableName,
            objid: objId,
            data: { ...modify },
            after: { ...modifyLabel },
            before: value,
          };
        }
      } else { // 主表修改
        const value = Object.assign({}, modify, labelregroupTableName);
        parames = {
          table: tableName,
          objid: objId,
          data: { ...modify },
          after: { ...modifyLabel },
          before: value,
        };
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
  getObjectTrySubmit({
    commit
  }, {
    objId,
    table,
    path,
    resolve,
    reject,
    moduleName,
    routeQuery,
    routePath
  }) { // 获取提交数据
    objId = objId === 'New' ? '-1' : objId;
    network.post(path || '/p/cs/objectSubmit', urlSearchParams({
      table,
      objid: objId
    })).then((res) => {
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
          type: 'verticalTable',
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
  getObjectTryUnSubmit({
    commit
  }, {
    objId,
    table,
    path,
    resolve,
    reject
  }) { // 获取取消提交数据
    objId = objId === 'New' ? '-1' : objId;
    network.post(path || '/p/cs/objectUnSubmit', urlSearchParams({
      table,
      objid: objId
    })).then((res) => {
      if (res.data.code === 0) {
        const unSubmitData = res.data;
        resolve();
        commit('updateUnSubmitData', unSubmitData);
      } else {
        const data = res.data.data;
        commit('updatetooltipForItemTableData', data);
        reject();
      }
    });
  },
  getObjectTryInvalid({
    commit
  }, {
    objId,
    table,
    path,
    resolve,
    reject
  }) { // 获取作废数据
    objId = objId === 'New' ? '-1' : objId;
    network.post(path || '/p/cs/objectVoid', urlSearchParams({
      table,
      objid: objId
    })).then((res) => {
      if (res.data.code === 0) {
        const invalidData = res.data;
        resolve();

        commit('updateiInvalidData', invalidData);
      } else {
        const data = res.data.data;
        commit('updatetooltipForItemTableData', data);
        reject();
      }
    });
  },
  getExportQueryForButtons({
    commit
  }, // 导出
  {
    OBJ,
    resolve,
    reject
  }) {
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
            type: 'verticalTable',
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
          resolve(res, actionName);
  
          commit('updateObjTabActionSlientConfirm', invalidData);
        } else {
          reject(res, actionName);
        }
        DispatchEvent('exeActionForR3', {
          detail: {
            name: 'exeAction',
            type: 'verticalTable',
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
    }
  },
  getActionDataForButtons({ commit }, { param, resolve }) {
    network.post('/p/cs/getAction', urlSearchParams(param)).then((res) => {
      commit('updateButtonGetActionData', res.data);
      resolve();
    });
  },
};
