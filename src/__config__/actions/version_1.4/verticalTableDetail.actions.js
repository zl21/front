import network, {
  urlSearchParams
} from '../../../__utils__/network';
import getComponentName from '../../../__utils__/getModuleName';
import { DispatchEvent } from '../../../__utils__/dispatchEvent';

let childTableFixedcolumns = {};

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
  }) {
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/objectTab', urlSearchParams({
      table,
      objid: id,
      ismaintable: 'y',
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        if (type === 'copy') {
          resData.type = 'copy';
          commit('updateMainButtonsData', resData);
          commit('updateMainTabPanelsData', resData, itemTabelPageInfo);
        } else if (type === 'refresh') {
          resData.type = 'refresh';
          commit('updateTabPanelsData', resData, itemTabelPageInfo);
        } else {
          commit('updateMainButtonsData', resData);
          commit('updateMainTabPanelsData', resData, itemTabelPageInfo);
        }
        commit('updateWebConf', resData.webconf);
        if (resData.reftabs && resData.reftabs.length > 0) {
          const firstReftab = resData.reftabs[state.tabCurrentIndex];
          // 获取子表按钮
          // && !stopItemRequest
          if (type !== 'copy') { // 按钮执行复制方法时，不调用子表相关接口    // 子表配置自定义tab时阻止子表接口请求
            // let webactType = '';
            // if (resData.reftabs[0].webact) { // 自定义tab全定制，tab切换时不需要请求
            //   webactType = resData.reftabs[0].webact.substring(0, resData.reftabs[0].webact.lastIndexOf('/')).toUpperCase();
            // }
            // console.log(111, webactType);
            // webactType !== 'ALL'
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
              if (resData.reftabs[0].refcolid !== -1) { // 以下请求是上下结构获取子表信息（当配置自定义tab时，没有子表，不请求子表信息）
                // commit('updateActiveRefFormInfo', resData.reftabs[0]);
                // 获取第一个tab的子表表单
               
               
                // 获取第一个tab的子表列表数据
                if (resData.reftabs[tabIndex].tabrelation === '1:m') {
                  if (this._actions[`${moduleName || getComponentName()}/getFormDataForRefTable`] && this._actions[`${moduleName || getComponentName()}/getFormDataForRefTable`].length > 0 && typeof this._actions[`${moduleName || getComponentName()}/getFormDataForRefTable`][0] === 'function') {
                    const formParam = {
                      table: firstReftab.tablename,
                      inlinemode: firstReftab.tabinlinemode,
                      tabIndex
                    };
                    this._actions[`${moduleName || getComponentName()}/getFormDataForRefTable`][0](formParam);// 获取子表新增区域表单数据
                  }
                  getObjectTabPromise.then(() => {
                    if (this._actions[`${moduleName || getComponentName()}/getObjectTableItemForTableData`] && this._actions[`${moduleName || getComponentName()}/getObjectTableItemForTableData`].length > 0 && typeof this._actions[`${moduleName || getComponentName()}/getObjectTableItemForTableData`][0] === 'function') {
                      const tableParam = {
                        table: firstReftab.tablename,
                        objid,
                        refcolid: firstReftab.refcolid,
                        searchdata: {
                          column_include_uicontroller: true,
                          startindex: itemTabelPageInfo ? (Number(itemTabelPageInfo.currentPageIndex) - 1) * Number(itemTabelPageInfo.pageSize) : 0,
                          range: itemTabelPageInfo ? itemTabelPageInfo.pageSize : 10,
                          fixedcolumns: childTableFixedcolumns
                        },
                        tabIndex
                      };
                      this._actions[`${moduleName || getComponentName()}/getObjectTableItemForTableData`][0](tableParam);
                      childTableFixedcolumns = {};
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
        const resData = res.data.data;
        childTableFixedcolumns = {};
        if (resData.tabfilter && resData.tabfilter.length > 0) { // 只有1.4版本支持
          resData.tabfilter.forEach((item) => {
            if (item.display === 'OBJ_DATENUMBER') {
              // 日期控件
              if (item.default === '-1') {
                childTableFixedcolumns[item.colname] = '';
              } else if (item.default !== '-1' && item.default) {
                // childTableFixedcolumns[item.colname] = new Date().setNewFormt(new Date().minusDays(item.default).toIsoDateString(), '-', '');
                childTableFixedcolumns[item.colname] = `${new Date().setNewFormt(new Date().minusDays(Number(item.default)).toIsoDateString(), '-', '')}~${new Date().setNewFormt(new Date().toIsoDateString(), '-', '')}`;
              } else {
                childTableFixedcolumns[item.colname] = `${new Date().setNewFormt(new Date().minusDays(Number(item.daterange)).toIsoDateString(), '-', '')}~${new Date().setNewFormt(new Date().toIsoDateString(), '-', '')}`;
              }
            } else if (item.display === 'OBJ_DATE') {
              if (item.default === '-1') {
                childTableFixedcolumns[item.colname] = '';
              } else {
                childTableFixedcolumns[item.colname] = `${new Date().setNewFormt(new Date().minusDays(Number(item.daterange)).toIsoDateString(), '-', '/')} 00:00:00~${new Date().setNewFormt(new Date().toIsoDateString(), '-', '/')} 23:59:59`;
              }
            } else if (item.display === 'OBJ_SELECT' && item.default) {
              childTableFixedcolumns[item.colname] = [`=${item.default}`];
            } else if (item.display === 'OBJ_FK' && item.refobjid) {
              childTableFixedcolumns[item.colname] = [`${item.refobjid}`];
            } else if (item.default) {
              childTableFixedcolumns[item.colname] = item.default;
            }
          });
          commit('updateTableFixedcolumns', JSON.parse(JSON.stringify(childTableFixedcolumns)));
        }
        resData.tabIndex = tabIndex;
        rec();
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
        const resData = res.data.data;
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
  performMainTableSaveAction({
    commit
  }, {
    parame,
    resolve,
    reject
  }) { // 主表保存
    const {
      tabrelation, itemObjId, tableName, temporaryStoragePath, objId, path, type, itemName, itemCurrentParameter, isreftabs, itemNameGroup, jflowPath
    } = parame;
    let parames = {};
    if (type === 'add') { // 新增保存参数
      const {
        add
      } = parame;

      if (isreftabs) { // 存在子表
        if (itemNameGroup.length > 0) {
          const itemAdd = itemCurrentParameter.add;
          const {
            addDefault
          } = itemCurrentParameter;

          if (path) { // 有path的参数
            add[tableName].ID = objId;
            add[tableName].ISACTIVE = 'Y';
            if (Object.values(itemAdd[itemName]).length > 0) {
              itemAdd[itemName].ID = objId;
              const itemTableAdd = Object.assign({}, itemAdd);
              itemTableAdd[itemName] = [
                itemTableAdd[itemName]
              ];
              if (temporaryStoragePath) {
                parames = {
                  ...add,
                };
              } else {
                parames = {
                  ...add,
                  ...itemTableAdd
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
                  objId, // 固定传值-1 表示新增
                  fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                    ...add,
                  }
                };
              } else {
                parames = {
                  table: tableName, // 主表表名
                  objId, // 固定传值-1 表示新增
                  fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                    ...add,
                    ...itemTableAdd,
                  }
                };
              }
            } else { // 子表没有form
              parames = {
                ...add
              };
            }
          } else if (Object.values(itemAdd[itemName]).length > 0) {
            const itemTableAdd = Object.assign({}, itemAdd);
            itemTableAdd[itemName].ID = objId;
            itemTableAdd[itemName] = [
              itemTableAdd[itemName]
            ];
            if (temporaryStoragePath) {
              parames = {
                table: tableName, // 主表表名
                objId, // 固定传值-1 表示新增
                fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                  ...add,
                }
              };
            } else {
              parames = {
                table: tableName, // 主表表名
                objId, // 固定传值-1 表示新增
                fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
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
                objId, // 固定传值-1 表示新增
                fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                  ...add,
                }
              };
            } else {
              parames = {
                table: tableName, // 主表表名
                objId, // 固定传值-1 表示新增
                fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                  ...add,
                  ...itemTableAdd,
                }
              };
            }
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
      } else if (path) { // 没有子表    有path的参数
        const addData = Object.assign({}, add);
        addData[tableName].ID = objId;
        parames = {
          ...addData[tableName]
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
      const modify = parame.modify;
      const {
        sataType
      } = parame;
      const sataTypeName = sataType ? sataType.sataType : '';
      if (isreftabs) {
        const itemModify = itemCurrentParameter.modify; // 子表修改
        const itemAdd = itemCurrentParameter.add; // 子表新增
        const itemDefault = itemCurrentParameter.addDefault; // 子表新增
        if (sataTypeName === 'addAndModify') {
          const add = Object.assign({}, itemAdd[itemName], itemDefault[itemName]); // 整合子表新增和默认值数据
          const addItem = Object.assign({}, add, itemAdd[itemName]);
          addItem.ID = -1;
          const itemModifyForAddAndModify = Object.assign([], itemModify[itemName]);
          itemModifyForAddAndModify.push(addItem);
          const addAndModifyParames = [];
          addAndModifyParames[itemName] = [
            ...itemModifyForAddAndModify
          ];
          modify[tableName].ID = objId;
          if (path) { // 有path的参数
            modify[tableName].ID = objId;
            if (temporaryStoragePath) {
              parames = {
                ...modify,
              };
            } else {
              parames = {
                ...modify,
                ...addAndModifyParames,
              };
            }
          } else if (temporaryStoragePath) {
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...modify
              }
            };
          } else {
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...addAndModifyParames,
                ...modify
              }
            };
          }
        } else if (sataTypeName === 'modify') { // 子表修改保存
          if (path) { // 有path的参数
            if (temporaryStoragePath) {
              modify[tableName].ID = objId;
              parames = {
                ...modify,
              };
            } else if (tabrelation) {
              itemModify[itemName].ID = itemObjId;
              const itemModifyRes = {}; 
              itemModifyRes[itemName] = [itemModify[itemName]];
              modify[tableName].ID = objId;
              parames = {
                ...modify,
                ...itemModifyRes
              };
            } else {
              modify[tableName].ID = objId;
              parames = {
                ...modify,
                ...itemModify
              };
            }
          } else if (temporaryStoragePath) {
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...modify,
              }
            };
          } else if (tabrelation) { // 处理子表1:1模式逻辑
            // itemModify[itemName].ID = itemObjId;
            // const itemModifyRes = {}; 
            // itemModifyRes[itemName] = [itemModify[itemName]];
            const itemModifyDefault = itemCurrentParameter.default;
            const itemModifyAssign = Object.assign({}, itemModifyDefault[itemName], itemModify[itemName]);// 整合子表修改和默认值数据
            const itemModifyAssignData = {};
            itemModifyAssignData[itemName] = itemModifyAssign;
            itemModifyAssignData[itemName].ID = itemObjId;
            const itemModifyRes = {}; 
            itemModifyRes[itemName] = [itemModifyAssignData[itemName]];
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...modify,
                ...itemModifyRes
              }
            };
          } else {
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...modify,
                ...itemModify
              }
            };
          }
        } else if (sataTypeName === 'add') { // 子表新增保存
          const add = Object.assign({}, itemAdd[itemName], itemDefault[itemName]); // 整合子表新增和默认值数据
          const addItem = Object.assign({}, add, itemAdd[itemName]);
          addItem.ID = -1;
          const addItemName = {};
          addItemName[itemName] = itemName;
          addItemName[itemName] = [
            addItem
          ];
          if (path) {
            modify[tableName].ID = objId;
            if (temporaryStoragePath) {
              parames = {
                ...modify,
              };
            } else {
              parames = {
                ...modify,
                ...addItemName
              };
            }
          } else if (Object.values(modify[tableName]).length > 0) {
            // modify[tableName].ID = objId;
            if (temporaryStoragePath) {
              parames = {
                table: tableName, // 主表表名
                objId, // 明细id
                fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                  ...modify,
                }
              };
            } else {
              parames = {
                table: tableName, // 主表表名
                objId, // 明细id
                fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                  ...modify,
                  ...addItemName
                }
              };
            }
          } else if (temporaryStoragePath) {
            console.log('暂存不支持子表编辑');
          } else {
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...addItemName
              }
            };
          }
        } else if (path) { // 主表保存有path的参数
          const modifyRes = JSON.parse(JSON.stringify(modify));
          if (!modifyRes[tableName]) {
            modifyRes[tableName] = {};
            modifyRes[tableName].ID = objId; // 主表id
          } else {
            modifyRes[tableName].ID = objId; // 主表id
          }
          parames = {
            ...modifyRes
          };
        } else { // 带子表的没有path的主表保存
          parames = {
            table: tableName, // 主表表名
            objId, // 明细id
            fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
              ...modify
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
    // let jflowpath = '';
    // if (buttonInfo && buttonInfo.jflowpath) {
    //   jflowpath = buttonInfo.jflowpath;
    // }
    network.post(temporaryStoragePath || jflowPath || path || '/p/cs/objectSave', parames).then((res) => {
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
    }).catch(() => {
      reject();
    });
  },
  performMainTableDeleteAction({
    commit
  }, {
    buttonInfo,
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
    let jflowpath = '';
    if (buttonInfo && buttonInfo.jflowpath) {
      jflowpath = buttonInfo.jflowpath;
    }
    network.post(jflowpath || path || '/p/cs/objectDelete', parames).then((res) => {
      if (res.data.code === 0) {
        resolve();
        const data = res.data;
        commit('updateNewMainTableDeleteData', data);
      } else {
        reject();
      }
    });
  },


  getObjectTrySubmit({
    commit
  }, {
    objId,
    table,
    path,
    isreftabs,
    resolve,
    reject,
    moduleName, routeQuery, routePath
  }) { // 获取提交数据
    objId = objId === 'New' ? '-1' : objId;
    let param = {};
    if (path) {
      if (isreftabs) {
        param[table] = {
          ID: objId,
        };
      } else {
        param = {
          ID: objId,
        };
      }
    } else {
      param = {
        objId,
        table
      };
    }
    network.post(path || '/p/cs/objectSubmit', param).then((res) => {
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
    isreftabs,
    resolve,
    reject
  }) { // 获取取消提交数据
    objId = objId === 'New' ? '-1' : objId;
    let param = {};
    if (path) {
      if (isreftabs) {
        param[table] = {
          ID: objId,
        };
      } else {
        param = {
          ID: objId,
        };
      }
    } else {
      param = {
        objId,
        table
      };
    }
    network.post(path || '/p/cs/objectUnSubmit', param).then((res) => {
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
    isreftabs,
    resolve,
    reject
  }) { // 获取作废数据
    objId = objId === 'New' ? '-1' : objId;
    let param = {};
    if (path) {
      if (isreftabs) {
        param[table] = {
          ID: objId,
        };
      } else {
        param = {
          ID: objId,
        };
      }
    } else {
      param = {
        objId,
        table
      };
    }
    network.post(path || '/p/cs/objectVoid', param).then((res) => {
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
    params,
    path,
    resolve, reject, moduleName,
    routeQuery,
    routePath
  }) {
    let actionName = '';
    if (path.search('/') !== -1) { // 兼容1.3版本action配置为包名时，请求默认接口
      actionName = path;
    } else {
      actionName = '';
    }
    network.post(actionName || '/p/cs/exeAction', params).then((res) => {
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
  },
  getActionDataForButtons({ commit }, { param, resolve }) {
    network.post('/p/cs/getAction', urlSearchParams(param)).then((res) => {
      commit('updateButtonGetActionData', res.data);
      resolve();
    });
  },
};
