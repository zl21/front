import network, { urlSearchParams } from '../../__utils__/network';
import router from '../router.config';
import { HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX } from '../../constants/global';

const getComponentName = () => {
  const { tableName, tableId, itemId } = router.currentRoute.params;
  return `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
};

export default {
  getObjectTabForMainTable({ commit }, { table, objid }) {
    // 参数说明 table 主表表名，objid列表界面该行数据的id也就是rowid
    network.post('/p/cs/objectTab', urlSearchParams({
      table,
      objid,
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
    network.post('/p/cs/objectTab', urlSearchParams({
      maintable,
      table,
      objid,
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
    network.post('/p/cs/getObject', urlSearchParams({
      table,
      objid
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
    network.post('/p/cs/itemObj', urlSearchParams({
      table,
      objid,
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
    network.post('/p/cs/objectTableItem', urlSearchParams({
      table,
      objid,
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
  getNewMainTableSaveData({ commit }, parame) { // 主表保存
    const { tableName } = parame;
    const { modify } = parame;
    const { objId } = parame;

    network.post('/p/cs/objectSave', {
      table: tableName, // 主表表名
      objId, // 固定传值-1 表示新增
      fixedData: { // 固定结构： fixedData:{ '主表表名': { '主表字段1'： '字段1的值', .... } }
        ...modify
      }
    }).then((res) => {
      // if (res.data.code === 0) {
      const data = res.data.data;
      commit('updateNewMainTableSaveData', data);
      // }
    });
  },
  getNewMainTableDeleteData({ commit }, { table, objId }) { // 主表保存
    network.post('/p/cs/objectDelete', {
      table, // 主表表名
      objId, 
      delMTable: true
    }).then((res) => {
      // if (res.data.code === 0) {
      // const data = res.data;
      // commit('updateNewMainTableDeleteData', data);
      // }
    });
  },
};
