import network, { urlSearchParams } from '../../__utils__/network';

export default {
  getQueryListForAg({ commit }) {
    network.post('/p/cs/QueryList', urlSearchParams({
      searchdata: {
        table: 'AD_TABLE',
        column_include_uicontroller: true,
        fixedcolumns: { ISACTIVE: ['=Y'] },
        multiple: [],
        startindex: 0
      }
    })).then((res) => {
      const updateTableData = res.data.data;
    });
  },
};
