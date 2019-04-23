import network, { urlSearchParams } from '../../__utils__/network';
import getComponentName from '../../__utils__/getModuleName';

export default {
  getObjectTabForMainTable({ commit }, { table, objid }) {
    // 参数说明 table 主表表名，objid列表界面该行数据的id也就是rowid
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/objectTab', urlSearchParams({
      table,
      objid: id,
      ismaintable: 'y'
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        commit('updateTabPanelsData', resData);
        // debugger;
        if (this._actions[`${getComponentName()}/getObjectForMainTableForm`] && this._actions[`${getComponentName()}/getObjectForMainTableForm`].length > 0 && typeof this._actions[`${getComponentName()}/getObjectForMainTableForm`][0] === 'function') {
          const param = {
            table,
            objid
          };
          this._actions[`${getComponentName()}/getObjectForMainTableForm`][0](param);
        }
      }
    });
  }, // 获取主表按钮和子表信息
  getObjectTabForChildTableButtons({ commit }, { maintable, table, objid }) {
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
        commit('updateButtonsData', resData);
      }
    });
  }, // 获取子表按钮
  getObjectForMainTableForm({ commit }, { table, objid }) {
    // 参数说明 table 主表表名，objid列表界面该行数据的id也就是rowid
    const id = objid === 'New' ? '-1' : objid;
    network.post('/p/cs/getObject', urlSearchParams({
      table,
      objid: id
    })).then((res) => {
      if (res.data.code === 0) {
        const formData = res.data.data;
        commit('updatePanelData', formData);
      }
    });
  }, // 获取主表面板信息
  getInputForitemForChildTableForm({ commit }, { table }) {
    // 参数说明 table 子表表名
    network.post('/p/cs/inputForitem', urlSearchParams({
      table,
      inlinemode: 'Y'
    })).then((res) => {
      if (res.data.code === 0) {
        const formData = res.data.data;
        commit('updateFormData', formData);
      }
    });
  }, // 获取子表表单信息
  getItemObjForChildTableForm({ commit }, { table, objid, refcolid }) {
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
  }, // 获取子表面板信息
  getObjectTableItemForTableData({ commit }, {
    table, objid, refcolid, searchdata
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
        commit('updateTableData', tableData);
      }
    });
  },
  // 按钮
  // performMainTableSaveAction({ commit }, parame) { // 主表保存
  //   const { tableName } = parame;
  //   const { objId } = parame;
  //   const { path } = parame;
  //   const { type } = parame;

  //   // modify[tableName].ID = -1;
  //   let parames = {};
  //   if (type === 'add') { // 新增保存参数
  //     const { add } = parame;
  //     if (path) { // 有path的参数
  //       add[tableName].ID = objId;

  //       parames = {
  //         ...add[tableName]
  //       };
  //     } else {
  //       parames = {
  //         table: tableName, // 主表表名
  //         objId, // 固定传值-1 表示新增
  //         fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
  //           ...add
  //         }
  //       };
  //     }
  //   } else if (type === 'modify') { // 编辑保存参数
  //     const { modify } = parame;
  //     if (path) { // 有path的参数
  //       modify[tableName].ID = objId;// 主表id

  //       parames = {
  //         ...modify[tableName]
  //       };
  //     } else {
  //       parames = {
  //         table: tableName, // 主表表名
  //         objId, // 明细id
  //         fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
  //           ...modify
  //         }
  //       };
  //     }
  //   }

  //   network.post(path || '/p/cs/objectSave', parames).then((res) => {
  //     if (res.data.code === 0) {
  //       const data = res.data;
  //       if (data.message === '新增成功') {
  //         commit('updateNewMainTableAddSaveData', data.data);
  //       } else if (data.message === '更新成功') { commit('updateNewMainTableModifySaveData', data.data); }
  //     }
  //   });
  // },
  performMainTableSaveAction({ commit }, parame) { // 主表保存
    const { tableName } = parame;
    const { objId } = parame;
    const { path } = parame;
    const { type } = parame;
    const { itemName } = parame;
    const { itemNameGroup } = parame;
    let parames = {};
    // if (itemName !== '') { // 带子表
    //   if (type === 'add') { // 新增带子表保存
    //     if (objectType === 'horizontal') { // 新增带子表保存左右结构
    //       const { add } = parame;
    //       if (path) { // 有path的参数
    //         add[tableName].ID = objId;
    //         parames = {
    //           ...add[tableName]
    //         };
    //       } else {
    //         parames = {
    //           table: tableName, // 主表表名
    //           objId, // 固定传值-1 表示新增
    //           fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
    //             ...add
    //           }
    //         };
    //       }
    //     } else if (objectType === 'vertical') { // 新增带子表保存上下结构
    //       const { add } = parame;
    //       if (path) { // 有path的参数
    //         add[tableName].ID = objId;
    //         parames = {
    //           ...add[tableName]
    //         };
    //       } else {
    //         parames = {
    //           table: tableName, // 主表表名
    //           objId, // 固定传值-1 表示新增
    //           fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
    //             ...add
    //           }
    //         };
    //       }
    //     }
    //   } else if (type === 'modify') { // 修改带子表的保存

    //   }
    // } else if (itemName === '') { // 不带子表
    debugge;
    if (type === 'add') { // 新增保存参数
      if (itemNameGroup.length > 0) { // 存在子表
        const currentlyEdited = itemNameGroup.filter(d => d === itemName);
        console.log('🍊', currentlyEdited);
        const { add } = parame;
        if (path) { // 有path的参数
          add[tableName].ID = objId;
          parames = {
            ...add[tableName],

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
      } else { // 没有子表
        const { add } = parame;
        if (path) { // 有path的参数
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
      }
    } else if (type === 'modify') { // 编辑保存参数
      const { modify } = parame;
      if (path) { // 有path的参数
        modify[tableName].ID = objId;// 主表id
  
        parames = {
          ...modify[tableName]
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
    // }
   

    network.post(path || '/p/cs/objectSave', parames).then((res) => {
      if (res.data.code === 0) {
        const data = res.data;
        if (data.message === '新增成功') {
          commit('updateNewMainTableAddSaveData', data.data);
        } else if (data.message === '更新成功') { commit('updateNewMainTableModifySaveData', data.data); }
      }
    });
  },
  performMainTableDeleteAction({ commit }, { path, table, objId }) { // 主表保存
    let parames = {};
    if (path) {
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
      // if (res.data.code === 0) {
      // const data = res.data;
      // commit('updateNewMainTableDeleteData', data);
      // }
    });
  },

};
