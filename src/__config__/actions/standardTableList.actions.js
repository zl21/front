import network, { urlSearchParams } from '../../__utils__/network';

export default {
  getQueryListForAg({ commit }, { table, startIndex, range }) {
    network.post('/p/cs/QueryList', urlSearchParams({
      searchdata: {
        table,
        startindex: startIndex || 0,
        range: range || 10
      }
    })).then((res) => {
      const updateTableData = res.data.data;
      commit('updateTableData', updateTableData);
    });
  },
  getTableQueryForForm({ commit }, { table }) {
    network.post('/p/cs/getTableQuery', urlSearchParams({
      table,
      getcmd: 'y'
    })).then((res) => {
      const queryData = res.data.data;
      commit('updateButtonsTabcmd', queryData.tabcmd);
      commit('updateButtonWaListButtons', queryData.waListButtons);
      commit('updateTableStatus4css', queryData.datas.status4css);
      commit('updateDefaultFormItemsLIsts', queryData.datas.dataarry);
    });
  },
  getExportQueryForButtons({ commit }, {
    searchdata, filename, filetype, showColumnName, menu
  }) {
    network.post('/p/cs/export', urlSearchParams({
      searchdata, filename, filetype, showColumnName, menu
    })).then((res) => {
      if (res.data.code === 0) {
        const path = `/p/cs/download?filename=${res.data.data}`;
        network.get(path);
        alert('导出成功');
      }
    });
  },
  getBatchDeleteForButtons({ commit }, tableName) {
    network.post('/p/cs/batchDelete', urlSearchParams({
      tableName
    })).then((res) => {
      const deleteTableData = res.data.data;
      commit('deleteTableData', deleteTableData);
    });
  },

};
