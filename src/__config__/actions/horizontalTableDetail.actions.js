import network, { urlSearchParams } from '../../__utils__/network';

export default {
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
        commit('updateButtonsData', resData);
        commit('updateTabPanelsData', resData);
      }
    });
  },
  getObjectForMainTableForm({ commit }, { table, objid}) {
    network.post('/p/cs/getObject', urlSearchParams({
      table,
      objid
    })).then((res) => {
    });
  }
};
