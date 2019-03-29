import network, { urlSearchParams } from '../../__utils__/network';
import router from '../router.config';
import { VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX } from '../../constants/global';
const getComponentName = () => {
  const { tableName, tableId, itemId } = router.currentRoute.params;
  return `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
};
export default {
  getObjectForMainTableForm({ commit }, { table, objid }) { // 获取主表面板数据
    network.post('/p/cs/getObject', urlSearchParams({
      table,
      objid
    })).then((res) => {
      const resData = res.data.data;
      commit('updateObjectForMainTableForm', resData);
    });
  },
  getObjectTabForMainTable({ commit }, { // 获取主表按钮和子表信息
    table, objid
  }) {
    network.post('/p/cs/objectTab', urlSearchParams({
      table,
      objid,
      ismaintable: 'y'
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        commit('updateMainButtonsData', resData);
        commit('updateMainTabPanelsData', resData);
        const param = {
          table: table,
          objid: objid
        };
        if (resData.reftabs && resData.reftabs.length > 0) {
          // 获取子表按钮
          if (this._actions[`${getComponentName()}/getObjectTabForRefTable`] && this._actions[`${getComponentName()}/getObjectTabForRefTable`].length > 0 && typeof this._actions[`${getComponentName()}/getObjectTabForRefTable`][0] === 'function') {
            this._actions[`${getComponentName()}/getObjectTabForRefTable`][0](param);
          } 
        }
      }
    });
  },
  getObjectTabForRefTable({ commit }, { // 获取子表按钮
    table, objid
  }) {
    network.post('/p/cs/objectTab', urlSearchParams({
      table,
      objid,
      ismaintable: 'n'
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        commit('updateRefButtonsData', resData);
      }
    });
  },
  getFormDataForRefTable({ commit }, { // 获取子表表单数据
    refTable, tabinlinemode
  }) {
    network.post('/p/cs/inputForitem', urlSearchParams({
      refTable,
      inlinemode: tabinlinemode
    })).then((res) => {
      if (res.data.code === 0) {
        const resData = res.data.data;
        commit('updateFormDataForRefTable', resData);
      }
    });
  }
};
