import network, { urlSearchParams } from '../../../__utils__/network';
import getComponentName from '../../../__utils__/getModuleName';
import { DispatchEvent } from '../../../__utils__/dispatchEvent';
import router from '../../router.config';


export default {
  getObjectTabForMainTable({ commit }, {
    table, objid, type, tabIndex, isNotFirstRequest, moduleName, isFirstRequest, resolve, reject
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
        resolve(resData);
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
        if (resData.tabfilter && resData.tabfilter.length > 0) {
          const childTableFixedcolumns = {};
          const tabfilterData = JSON.parse(JSON.stringify(resData));
          tabfilterData.tabfilter.forEach((item) => {
            if (item.display === 'OBJ_DATENUMBER') {
              // 日期控件
              if (item.default === '-1') {
                childTableFixedcolumns[item.colname] = '';
              } else if (item.default !== '-1' && item.default) {
                childTableFixedcolumns[item.colname] = `${new Date().setNewFormt(new Date().minusDays(Number(item.default)).toIsoDateString(), '-', '')}~${new Date().setNewFormt(new Date().toIsoDateString(), '-', '')}`;
                // childTableFixedcolumns[item.colname] = new Date().setNewFormt(Date().minusDays(item.default).toIsoDateString(), '-', '');
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
        commit('updateButtonsData', resData);
        if (resolve) {
          resolve();
        }
      } else if (reject) {
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
        const tableData = res.data.data;
        tableData.tabIndex = tabIndex;
        commit('updateTableData', tableData);
      }
    });
  },
  // 按钮
  performMainTableSaveAction({ commit }, { parame, resolve, reject }) { // 主表保存
    const {
      tabrelation, itemObjId, tableName, objId, path, type, itemName, itemCurrentParameter, isreftabs, itemNameGroup, sataType, temporaryStoragePath, jflowPath
    } = parame;
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
      if (isreftabs) {
        const itemModify = itemCurrentParameter.modify;
        const itemAdd = itemCurrentParameter.add;// 子表新增
        const itemDefault = itemCurrentParameter.addDefault;// 子表新增
        if (path) { // 有path的参数
          const { modify } = parame;
          if (itemNameGroup.map(item => item.tableName).includes(itemName)) {
            if (sataTypeName === 'addAndModify') {
              const add = Object.assign({}, itemDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
              Object.assign(itemAdd[itemName], add);
              // modify[tableName].ID = objId;// 主表id
              const itemTableAdd = Object.assign({}, itemAdd);

              itemTableAdd[itemName].ID = -1;
              const mainTabale = {};
              mainTabale[tableName] = {
                ID: objId// 主表id
              };
              const itemModifyForAddAndModify = Object.assign([], itemModify[itemName]);
              itemModifyForAddAndModify.push(itemTableAdd[itemName]);
              const addAndModifyParames = [];
              addAndModifyParames[itemName] = [
                ...itemModifyForAddAndModify
              ];
              if (temporaryStoragePath) {
                parames = {
                  ...mainTabale,
                };
              } else {
                parames = {
                  ...mainTabale,
                  ...addAndModifyParames
                };
              }
            } else if (sataTypeName === 'add') { // 子表新增
              const add = Object.assign({}, itemDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
              Object.assign(itemAdd[itemName], add);
              const itemTableAdd = Object.assign({}, itemAdd);

              itemTableAdd[itemName].ID = -1;
              itemTableAdd[itemName] = [
                itemTableAdd[itemName]
              ];
              const mainTabale = {};
              mainTabale[tableName] = {
                ID: objId// 主表id
              };
              
              if (temporaryStoragePath) {
                parames = {
                  ...mainTabale,
                };
              } else {
                parames = {
                  ...mainTabale,
                  ...itemTableAdd
                };
              }
            } else if (sataTypeName === 'modify') { // 子表编辑
              const mainTabale = {};
              mainTabale[tableName] = {
                ID: objId// 主表id
              };
              if (temporaryStoragePath) {
                parames = {
                  ...mainTabale,
                };
              } else if (tabrelation) { // 处理子表1:1模式逻辑
                let itemDefaultData = {};
                if (Object.keys(itemDefault).length > 0) {
                  itemDefaultData = itemDefault[itemName];
                }
                const itemModifyAssign = Object.assign({}, itemDefaultData, itemModify[itemName]);// 整合子表修改和默认值数据
                itemModifyAssign.ID = itemObjId;
                // itemModifyAssign[itemName] = {
                //   ID: itemObjId
                // };
                const itemModifyRes = {}; 
                itemModifyRes[itemName] = [itemModifyAssign];
                parames = {
                  ...mainTabale,
                  ...itemModifyRes
                };
              } else {
                parames = {
                  ...mainTabale,
                  ...itemModify
                };
              }
            }
          } else { // 因引起jflow报错ID改为大写
            // if (enableJflow()) {
            //   modify[tableName].ID = objId;
            // } else {
            //   modify[tableName].Id = objId;
            // }
            modify[tableName].ID = objId;
            parames = {
              ...modify,
            };
          }
        } else if (sataTypeName === 'addAndModify') {
          const add = Object.assign({}, itemDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
          Object.assign(itemAdd[itemName], add);
          const itemTableAdd = Object.assign({}, itemAdd);
          itemTableAdd[itemName].ID = -1;
          const itemModifyForAddAndModify = Object.assign([], itemModify[itemName]);
          itemModifyForAddAndModify.push(itemTableAdd[itemName]);
          const addAndModifyParames = [];
          addAndModifyParames[itemName] = [
            ...itemModifyForAddAndModify
          ];
          if (temporaryStoragePath) {
            console.log('子表不支持暂存');
          } else {
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...addAndModifyParames
              }
            };
          }
        } else if (sataTypeName === 'add') { // 子表新增
          const add = Object.assign({}, itemDefault[itemName], itemAdd[itemName]);// 整合子表新增和默认值数据
          Object.assign(itemAdd[itemName], add);
          const itemTableAdd = Object.assign({}, itemAdd);
          itemTableAdd[itemName].ID = -1;
          itemTableAdd[itemName] = [
            itemTableAdd[itemName]
          ];
          if (temporaryStoragePath) {
            console.log('子表不支持暂存');
          } else {
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...itemTableAdd
              }
            };
          }
        } else if (sataTypeName === 'modify') { // 子表编辑
          if (temporaryStoragePath) {
            console.log('子表不支持暂存');
          } else if (tabrelation) { // 处理子表1:1模式逻辑
            // const itemModifyDefault = itemCurrentParameter.default;
            // const itemModifyAssign = Object.assign({}, itemModifyDefault[itemName], itemModify[itemName]);// 整合子表修改和默认值数据

            // 子表1:1模式参数不需要传默认值
            const itemModifyAssign = Object.assign({}, itemModify[itemName]);// 整合子表修改和默认值数据

            const itemModifyAssignData = {};
            itemModifyAssignData[itemName] = itemModifyAssign;
            itemModifyAssignData[itemName].ID = itemObjId;
            const itemModifyRes = {}; 
            itemModifyRes[itemName] = [itemModifyAssignData[itemName]];


            // itemModify[itemName].ID = itemObjId;
            // const itemModifyRes = {}; 
            // itemModifyRes[itemName] = [itemModify[itemName]];
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...itemModifyRes
              }
            };
          } else {
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...itemModify
              }
            };
          }
        } else {
          const itemValue = itemModify;
        

          if (Object.keys(itemValue[tableName]).length > 0) {
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                ...itemValue
              }
            };
          } else {
            parames = {
              table: tableName, // 主表表名
              objId, // 明细id
              fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
                [tableName]: {}
              }
            };
          }
         
          // }
        }
      } else if (path) { // 没有子表 ,有path的参数
        const { modify } = parame;
        const mainTabale = modify[tableName];
        mainTabale.ID = objId;
        parames = mainTabale;
      } else {
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
    // let jflowpath = '';
    // if (buttonInfo && buttonInfo.jflowpath) {
    //   jflowpath = buttonInfo.jflowpath;
    // }
    network.post(temporaryStoragePath || jflowPath || path || '/p/cs/objectSave', parames).then((res) => {
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
  },
  performMainTableDeleteAction({ commit }, {
    buttonInfo, path, table, objId, currentParameter, itemName, itemNameGroup, itemCurrentParameter, resolve, reject
  }) { // 主表删除
    let parames = {};
    if (itemNameGroup && itemNameGroup.length > 0) {
      const itemDelete = itemCurrentParameter.delete;
      if (itemName !== table) {
        if (path) {
          if (currentParameter && currentParameter.delete) {
            const mainTable = currentParameter.delete;
            mainTable[table].ID = objId;
            mainTable[table].isdelmtable = false;
            parames = {
              ...mainTable,
              ...itemDelete
            };
          }
        } else {
          const tabItem = {
            ...itemDelete
          };
          parames = {
            table, // 主表表名
            objId,
            delMTable: false,
            tabItem
          };
        }
      } else if (path) {
        if (currentParameter && currentParameter.delete) {
          const mainTable = currentParameter.delete;
          mainTable[table].ID = objId;
          mainTable[table].isdelmtable = true;
          parames = {
            ...mainTable,
            ...itemDelete
          };
        }
      } else {
        const tabItem = {
          ...itemDelete
        };
        parames = {
          table, // 主表表名
          objId,
          delMTable: true,
          tabItem
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
    objId, table, path, isreftabs, resolve, reject, moduleName,
    routeQuery, routePath
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
  getObjectTryUnSubmit({ commit }, {
    objId, table, path, isreftabs, resolve, reject
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
    }).catch(() => {
      reject();
    });
  },
  getObjectTryInvalid({ commit }, {
    objId, table, path, isreftabs, resolve, reject
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
    }).catch(() => {
      reject();
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
        resolve(res);

        commit('updateObjTabActionSlientConfirm', invalidData);
      } else {
        reject(res);
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
      reject(res);
    });
  },
  getActionDataForButtons({ commit }, { param, resolve }) {
    network.post('/p/cs/getAction', urlSearchParams(param)).then((res) => {
      commit('updateButtonGetActionData', res.data);
      resolve();
    });
  },
};
