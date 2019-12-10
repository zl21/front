import { isArray } from 'util';
import network, {
  urlSearchParams
} from '../../../__utils__/network';
import getComponentName from '../../../__utils__/getModuleName';

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
    itemTabelPageInfo
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
        } else {
          commit('updateMainButtonsData', resData);
          commit('updateMainTabPanelsData', resData, itemTabelPageInfo);
        }

        if (resData.reftabs && resData.reftabs.length > 0) {
          const firstReftab = resData.reftabs[state.tabCurrentIndex];
          // 获取子表按钮
          if (type !== 'copy') { // 按钮执行复制方法时，不调用子表相关接口
            let webactType = '';
            if (resData.reftabs[0].webact) { // 自定义tab全定制，tab切换时不需要请求
              webactType = resData.reftabs[0].webact.substring(0, resData.reftabs[0].webact.lastIndexOf('/')).toUpperCase();
            }
            if (webactType !== 'ALL') {
              const getObjectTabPromise = new Promise((rec, rej) => {
                if (this._actions[`${getComponentName()}/getObjectTabForRefTable`] && this._actions[`${getComponentName()}/getObjectTabForRefTable`].length > 0 && typeof this._actions[`${getComponentName()}/getObjectTabForRefTable`][0] === 'function') {
                  const param = {
                    table: firstReftab.tablename,
                    objid,
                    tabIndex,
                    rec,
                    rej
                  };
                  this._actions[`${getComponentName()}/getObjectTabForRefTable`][0](param);
                }
              });
              if (resData.reftabs[0].refcolid !== -1) {
                // commit('updateActiveRefFormInfo', resData.reftabs[0]);
                // 获取第一个tab的子表表单
                if (this._actions[`${getComponentName()}/getFormDataForRefTable`] && this._actions[`${getComponentName()}/getFormDataForRefTable`].length > 0 && typeof this._actions[`${getComponentName()}/getFormDataForRefTable`][0] === 'function') {
                  const formParam = {
                    table: firstReftab.tablename,
                    inlinemode: firstReftab.tabinlinemode,
                    tabIndex
                  };
                  this._actions[`${getComponentName()}/getFormDataForRefTable`][0](formParam);
                }
                // 获取第一个tab的子表列表数据
                if (resData.reftabs[0].tabrelation === '1:m') {
                  getObjectTabPromise.then(() => {
                    if (this._actions[`${getComponentName()}/getObjectTableItemForTableData`] && this._actions[`${getComponentName()}/getObjectTableItemForTableData`].length > 0 && typeof this._actions[`${getComponentName()}/getObjectTableItemForTableData`][0] === 'function') {
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
                      this._actions[`${getComponentName()}/getObjectTableItemForTableData`][0](tableParam);
                    }
                  });
                } else if (resData.reftabs[0].tabrelation === '1:1') {
                  // 获取子表面板数据
                  if (this._actions[`${getComponentName()}/getItemObjForChildTableForm`] && this._actions[`${getComponentName()}/getItemObjForChildTableForm`].length > 0 && typeof this._actions[`${getComponentName()}/getItemObjForChildTableForm`][0] === 'function') {
                    const tableParam = {
                      table: firstReftab.tablename,
                      objid,
                      refcolid: firstReftab.refcolid,
                      tabIndex
                    };
                    this._actions[`${getComponentName()}/getItemObjForChildTableForm`][0](tableParam);
                  }
                }
              }
            }
          }
        }
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
        commit('updatePanelData', formData);
      }
    });
  },
  // performMainTableSaveAction({
  //   commit
  // }, {
  //   parame,
  //   resolve,
  //   reject
  // }) { // 主表保存
  //   const {
  //     tableName
  //   } = parame;
  //   const {
  //     add
  //   } = parame;
  //   const {
  //     objId
  //   } = parame;
  //   const {
  //     type
  //   } = parame;
  //   const {
  //     itemName
  //   } = parame;
  //   const {
  //     itemCurrentParameter
  //   } = parame;
  //   const {
  //     isreftabs
  //   } = parame;
  //   const {
  //     itemNameGroup
  //   } = parame;
  //   const { sataType } = parame;
  //   const { modify } = parame;
  //   let parames = {};
  //   let labelName = {};
  //   let fkId = {};
  //   let labelData = {};
  //   let fkIdData = {};
  //   const modifyDataForSaveAfter = {};
  //   debugger;
  //   const modifyDataForSave = {};


  //   if (type === 'add') {
  //     if (Object.keys(add).length > 0) {
  //       labelData = Object.assign({}, Object.keys(add).reduce((obj, value) => add[value], {}));
  //       fkIdData = Object.assign({}, Object.keys(add).reduce((obj, value) => add[value], {}));
  //     }
  //   } else if (type === 'modify') {
  //     if (Object.keys(modify).length > 0) {
  //       labelData = Object.assign({}, Object.keys(modify).reduce((obj, value) => modify[value], {}));
  //       fkIdData = Object.assign({}, Object.keys(modify).reduce((obj, value) => modify[value], {}));
  //     }
  //   }
  //   if (type === 'modify') {
  //     labelName = Object.keys(labelData).reduce((obj, value) => {
  //       if (labelData[value] && Array.isArray(labelData[value]) && labelData[value].length === 1) { // 是外键类型(外键单选)
  //         const label = labelData[value].map(item => item.Label);
  //         if (label[0] !== '') {
  //           labelData[value] = label[0];
  //         }
  //       }
  //       if (labelData[value] && Array.isArray(labelData[value]) && labelData[value].length > 1) { // 外键多选
  //         const label = labelData[value].map(item => item.Label).join(',');
  //         labelData[value] = label[0];
  //       }
  //       obj[value] = labelData[value];
  //       return obj;
  //     }, {});
  //     console.log('🍓', labelName);
  //     const modifyChangeDataAfter = Object.assign({}, labelData, labelName);

  //     modifyDataForSaveAfter[tableName] = modifyChangeDataAfter;
  //   }

  //   if (Object.keys(fkIdData).length > 0) {
  //     fkId = Object.keys(fkIdData).reduce((obj, value) => {
  //       if (fkIdData[value] && Array.isArray(fkIdData[value]) && fkIdData[value].length === 1) { // 是外键类型(外键单选)
  //         const ID = fkIdData[value].map(item => item.ID);
  //         if (ID[0] !== '' && ID[0] !== 'undefined') {
  //           fkIdData[value] = Number(ID[0]);
  //         }
  //       }
  
  //       if (fkIdData[value] && Array.isArray(fkIdData[value]) && fkIdData[value].length > 1) { // 外键多选
  //         const ID = fkIdData[value].map(item => item.ID).join(',');
  //         fkIdData[value] = ID[0];
  //       }

  //       obj[value] = fkIdData[value];
  //       return obj;
  //     }, {});

  //     const modifyChangeData = Object.assign({}, fkIdData, fkId);
  //     modifyDataForSave[tableName] = modifyChangeData;
  //   }

  
  //   console.log('modifyDataForSave', modifyDataForSave);
  //   console.log('modifyDataForSaveAfter', modifyDataForSaveAfter);
  //   if (type === 'add') { // 新增保存参数
  //     if (isreftabs) { // 存在子表
  //       if (itemNameGroup.length > 0) {
  //         const itemAdd = itemCurrentParameter.add;
  //         const {
  //           addDefault
  //         } = itemCurrentParameter;

  //         if (Object.values(itemAdd[itemName]).length > 0) {
  //           const itemTableAdd = Object.assign({}, itemAdd);
  //           itemTableAdd[itemName].ID = objId;
  //           itemTableAdd[itemName] = [
  //             itemTableAdd[itemName]
  //           ];
  //           parames = {
  //             table: tableName, // 主表表名
  //             objid: objId, // 固定传值-1 表示新增
  //             data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
  //               ...add,
  //               ...itemTableAdd,
  //             }
  //           };
  //         } else if (Object.values(addDefault[itemName]).length > 0) { // 如果子表有默认值
  //           const itemTableAdd = Object.assign({}, addDefault);
  //           itemTableAdd[itemName].ID = objId;
  //           itemTableAdd[itemName] = [
  //             itemTableAdd[itemName]
  //           ];
  //           parames = {
  //             table: tableName, // 主表表名
  //             objid: objId, // 固定传值-1 表示新增
  //             data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
  //               ...add,
  //               ...itemTableAdd,
  //             }
  //           };
  //         } else {
  //           parames = {
  //             table: tableName, // 主表表名
  //             objid: objId, // 固定传值-1 表示新增
  //             data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
  //               ...modifyDataForSave,
  //             }
  //           };
  //         }
  //       } else {
  //         parames = {
  //           table: tableName, // 主表表名
  //           objid: objId,
  //           data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
  //             ...modifyDataForSave,
  //           }
  //         };
  //       }
  //     } else {
  //       parames = {
  //         table: tableName, // 主表表名
  //         objid: objId, // 固定传值-1 表示新增
  //         data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
  //           ...modifyDataForSave
  //         }
  //       };
  //     }
  //     network.post('/p/cs/objectAdd', urlSearchParams(parames)).then((res) => {
  //       if (res.data.code === 0) {
  //         const data = res.data;
  //         resolve();
  //         commit('updateNewMainTableAddSaveData', {
  //           data,
  //           itemName
  //         });
  //       } else {
  //         reject();
  //       }
  //     });
  //   } else if (type === 'modify') { // 编辑保存参数
  //     const itemModify = itemCurrentParameter ? itemCurrentParameter.modify : {};// 子表修改

  //     const itemDefault = itemCurrentParameter ? itemCurrentParameter.default : {};
  //     const itemAdd = itemCurrentParameter ? itemCurrentParameter.add : {};// 子表新增
  //     // const itemDefault = itemCurrentParameter.addDefault;// 子表新增
  //     const sataTypeName = sataType ? sataType.sataType : '';
  //     const dufault = parame.default;
  //     if (sataTypeName === 'add') { // 子表新增
  //       const addDefault = itemCurrentParameter ? itemCurrentParameter.addDefault : {};
  //       const add = Object.assign({}, addDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
  //       Object.assign(itemAdd[itemName], add);
  //       const itemTableAdd = Object.assign({}, itemAdd);
  //       itemTableAdd[itemName].ID = -1;
  //       itemTableAdd[itemName] = [
  //         itemTableAdd[itemName]
  //       ];
  //       parames = {
  //         table: tableName, // 主表表名
  //         objid: objId, // 明细id
  //         data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
  //           ...itemTableAdd
  //         }
  //       };
  //       network.post('/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
  //         if (res.data.code === 0) {
  //           const data = res.data;
  //           resolve();
  //           commit('updateNewMainTableAddSaveData', { data, itemName });
  //         } else {
  //           reject();
  //         }
  //       });
  //     } else if (sataTypeName === 'modify') {
  //       const defaultData = [];
  //       const defaultForSaveArray = [];
  //       const defaultForSave = {};
  //       const dufaultDataForSave = {};
  //       itemModify[itemName].forEach((modifyItem) => {
  //         itemDefault[itemName].forEach((defaultItem) => {
  //           if (modifyItem.ID === defaultItem.EXCEPT_COLUMN_NAME) {
  //             Object.keys(defaultItem).reduce((obj, item) => {
  //               Object.keys(modifyItem).reduce((modifyDataObj, modifyDataItem) => {
  //                 if (item === modifyDataItem) {
  //                   let itemDefault = {};
  //                   defaultForSave[modifyDataItem] = defaultItem[item];
  //                   itemDefault = Object.assign({}, modifyItem, defaultForSave);
  //                   defaultForSaveArray.push(itemDefault);
  //                 }
  //                 return modifyDataObj;
  //               }, {});
  //               return obj;
  //             }, {});
  //             defaultData.push(defaultItem);
  //           }
  //         });
  //       });
  //       dufaultDataForSave[tableName] = defaultForSave;
  //       parames = {
  //         table: tableName,
  //         objid: objId,
  //         data: { ...itemModify },
  //         after: { ...itemModify },
  //         before: { defaultForSaveArray }
  //       };
  //       network.post('/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
  //         if (res.data.code === 0) {
  //           const data = res.data;
  //           resolve();
  //           commit('updateNewMainTableAddSaveData', { data, itemName });
  //         } else {
  //           reject();
  //         }
  //       });
  //     } else if (sataTypeName === 'addAndModify') {
  //       if (Object.values(itemAdd[itemName]).length > 0) {
  //         const addDefault = itemCurrentParameter ? itemCurrentParameter.addDefault : {};
  //         const add = Object.assign({}, addDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
  //         Object.assign(itemAdd[itemName], add);
  //         const itemTableAdd = Object.assign({}, itemAdd);
  //         itemTableAdd[itemName].ID = -1;
  //         itemTableAdd[itemName] = [
  //           itemTableAdd[itemName]
  //         ];
  //         parames = {
  //           table: tableName, // 主表表名
  //           objid: objId, // 明细id
  //           data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
  //             ...itemTableAdd
  //           }
  //         };
  //         network.post('/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
  //           if (res.data.code === 0) {
  //             const data = res.data;
  //             resolve();
  //             commit('updateNewMainTableAddSaveData', { data, itemName });
  //           } else {
  //             reject();
  //           }
  //         });
  //       }
  //       if (Object.values(itemModify[itemName]).length > 0) {
  //         const defaultData = [];
  //         const defaultForSaveArray = [];
  //         const defaultForSave = {};
  //         const dufaultDataForSave = {};
  //         itemModify[itemName].forEach((modifyItem) => {
  //           itemDefault[itemName].forEach((defaultItem) => {
  //             if (modifyItem.ID === defaultItem.EXCEPT_COLUMN_NAME) {
  //               Object.keys(defaultItem).reduce((obj, item) => {
  //                 Object.keys(modifyItem).reduce((modifyDataObj, modifyDataItem) => {
  //                   if (item === modifyDataItem) {
  //                     let itemDefault = {};
  //                     defaultForSave[modifyDataItem] = defaultItem[item];
  //                     itemDefault = Object.assign({}, modifyItem, defaultForSave);
  //                     defaultForSaveArray.push(itemDefault);
  //                   }
  //                   return modifyDataObj;
  //                 }, {});
  //                 return obj;
  //               }, {});
  //               defaultData.push(defaultItem);
  //             }
  //           });
  //         });
  //         dufaultDataForSave[tableName] = defaultForSave;
  //         parames = {
  //           table: tableName,
  //           objid: objId,
  //           data: { ...itemModify },
  //           after: { ...itemModify },
  //           before: { defaultForSaveArray }
  //         };
  //         network.post('/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
  //           if (res.data.code === 0) {
  //             const data = res.data;
  //             resolve();
  //             commit('updateNewMainTableAddSaveData', { data, itemName });
  //           } else {
  //             reject();
  //           }
  //         });
  //       }
  //     } else {
  //       const dufaultData = dufault[tableName];
  //       const defaultForSave = {};
  //       const dufaultDataForSave = {};
  //       Object.keys(dufaultData).reduce((obj, item) => {
  //         const modifyData = modify[tableName];
  //         Object.keys(modifyData).reduce((modifyDataObj, modifyDataItem) => {
  //           if (item === modifyDataItem) {
  //             defaultForSave[modifyDataItem] = dufaultData[item];
  //           }
  //           return modifyDataObj;
  //         }, {});
  //         return obj;
  //       }, {});
  //       const defaultChangeDataAfterlabelName = Object.keys(defaultForSave).reduce((obj, value) => {
  //         if (defaultForSave[value] && Array.isArray(defaultForSave[value]) && defaultForSave[value].length === 1) { // 是外键类型(外键单选)
  //           const label = defaultForSave[value].map(item => item.Label);
  //           if (label[0] !== '') {
  //             defaultForSave[value] = label[0];
  //           }
  //         }
  //         if (defaultForSave[value] && Array.isArray(defaultForSave[value]) && defaultForSave[value].length > 1) { // 外键多选
  //           const label = defaultForSave[value].map(item => item.Label).join(',');
  //           defaultForSave[value] = label[0];
  //         }
  //         obj[value] = defaultForSave[value];
  //         return obj;
  //       }, {});
  //       dufaultDataForSave[tableName] = defaultChangeDataAfterlabelName;
  //       parames = {
  //         table: tableName,
  //         objid: objId,
  //         data: modifyDataForSave,
  //         after: modifyDataForSaveAfter,
  //         before: dufaultDataForSave
  //       };
  //       network.post('/p/cs/objectSave', urlSearchParams(parames)).then((res) => {
  //         if (res.data.code === 0) {
  //           const data = res.data;
  //           resolve();
  //           commit('updateNewMainTableAddSaveData', { data, itemName });
  //         } else {
  //           reject();
  //         }
  //       });
  //     }
  //   }
  // },
  
 
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
      tableName
    } = parame;
    const {
      add
    } = parame;
    const {
      objId
    } = parame;
    const {
      type
    } = parame;
    const {
      itemName
    } = parame;
    const {
      itemCurrentParameter
    } = parame;
    const {
      isreftabs
    } = parame;
    const {
      itemNameGroup
    } = parame;
    const { sataType } = parame;
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
            parames = {
              table: tableName, // 主表表名
              objid: objId, // 固定传值-1 表示新增
              data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...add,
                ...itemTableAdd,
              }
            };
          } else if (Object.values(addDefault[itemName]).length > 0) { // 如果子表有默认值
            const itemTableAdd = Object.assign({}, addDefault);
            itemTableAdd[itemName].ID = objId;
            itemTableAdd[itemName] = [
              itemTableAdd[itemName]
            ];
            parames = {
              table: tableName, // 主表表名
              objid: objId, // 固定传值-1 表示新增
              data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...add,
                ...itemTableAdd,
              }
            };
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
      network.post('/p/cs/objectAdd', urlSearchParams(parames)).then((res) => {
        if (res.data.code === 0) {
          const data = res.data;
          resolve();
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
        itemModifyLabel = parame.itemCurrentParameter.modifyLabel;// 子表修改的label
        itemBeforeLabel = parame.itemCurrentParameter.itemBeforeLabel;// before值
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
      const itemModify = itemCurrentParameter ? itemCurrentParameter.modify : {};// 子表修改
      const itemAdd = itemCurrentParameter ? itemCurrentParameter.add : {};// 子表新增
      const sataTypeName = sataType ? sataType.sataType : '';
      if (sataTypeName === 'add') { // 子表新增
        const addDefault = itemCurrentParameter ? itemCurrentParameter.addDefault : {};
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
      } else if (sataTypeName === 'modify') {
        parames = {
          table: tableName,
          objid: objId,
          data: { ...itemModify },
          after: itemModifyLabel,
          before: itemBeforeLabel,
        };
      } else if (sataTypeName === 'addAndModify') {
        const addDefault = itemCurrentParameter ? itemCurrentParameter.addDefault : {};
        const add = Object.assign({}, addDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
        Object.assign(itemAdd[itemName], add);
        const itemTableAdd = Object.assign({}, itemAdd);
        itemTableAdd[itemName].ID = -1;
        itemTableAdd[itemName] = [
          itemTableAdd[itemName]
        ];
        if (Object.values(itemAdd[itemName]).length > 0) {
          parames = {
            table: tableName, // 主表表名
            objid: objId, // 明细id
            data: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
              ...itemTableAdd
            }
          };
        }
        if (Object.values(itemModify[itemName]).length > 0) {
          parames = {
            table: tableName,
            objid: objId,
            data: { ...itemModify },
            after: { ...itemModifyLabel },
            before: itemBeforeLabel

          };
        }
        if (Object.values(itemAdd[itemName]).length > 0 && Object.values(itemModify[itemName]).length > 0 && Object.values(modify[tableName]).length > 0) {
          const value = Object.assign({}, modify, labelregroupTableName);
          parames = {
            table: tableName,
            objid: objId,
            data: {
              ...modify,
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
  },
  
  getObjectTrySubmit({
    commit
  }, {
    objId,
    table,
    path,
    resolve,
    reject
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
    resolve, reject
  }) {
    let actionName = '';
    if (path.search('/') === -1) {
      actionName = '';
      network.post(actionName || '/p/cs/exeAction', urlSearchParams({
        actionid: tab.webid,
        webaction: null,
        param: JSON.stringify(params),
      })).then((res) => {
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
    } else {
      actionName = path;

      network.post(actionName || '/p/cs/exeAction', params).then((res) => {
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
    }
  },
};
