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
};
