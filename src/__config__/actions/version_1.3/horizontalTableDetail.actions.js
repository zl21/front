import network, { urlSearchParams } from '../../../__utils__/network';
import getComponentName from '../../../__utils__/getModuleName';

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
  performMainTableSaveAction({ commit }, parame) { // 主表保存
    const { tableName } = parame;
    const { objId } = parame;
    const { type } = parame;
    const { itemName } = parame;
    const { itemCurrentParameter } = parame;
    const { itemNameGroup } = parame;
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
    } else if (type === 'modify') { // 编辑保存参数
      const defaults = parame.default;
      if (itemNameGroup.length > 0) {
        const itemModify = itemCurrentParameter.modify;
        
      
        const itmValues = itemModify[itemName];
        if (itmValues instanceof Array === true) { // 判断上下结构是子表修改还是子表新增
          itmValues.ID = objId;
        } else {
          itmValues.ID = -1;
        }
        itemModify[itemName] = [
          itmValues
        ];
        itemModify[itemName].ID = objId;
        parames = {
          table: tableName, // 主表表名
          objId, // 明细id
          fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
            ...itemModify
          }
        };
      } else { // 没有子表
        const { modify } = parame;
        if (Object.values(modify[tableName]).length < 1) {
          defaults[tableName] = {};
        }
        parames = {
          table: tableName,
          objid: objId,
          data: { ...modify },
          after: { ...modify },
          before: { ...defaults }
        };
      }
    }

    network.post('/p/cs/objectSave', urlSearchParams(
      parames
    )).then((res) => {
      if (res.data.code === 0) {
        const data = res.data;
        commit('updateNewMainTableAddSaveData', { data, itemName });
      }
    });
  },
  performMainTableDeleteAction({ commit }, {
    path, table, objId, currentParameter, itemName, itemNameGroup
  }) { // 主表删除
    let parames = {};
    if (itemNameGroup && itemNameGroup.length > 0) {
      const mainTable = currentParameter.delete;
      mainTable[table].ID = objId;
      mainTable[table].isdelmtable = true;
      if (path) {
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

};
