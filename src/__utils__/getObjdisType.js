import network, { urlSearchParams } from './network';

const getObjdisType = (data) => {
  const p = new Promise((resolve) => {
    network.post('/p/cs/QueryList', urlSearchParams({
      searchdata: {
        table: data.table,
        startindex: 0,
        range: 0,
        fixedcolumns: { ISACTIVE: ['=Y'] },
        column_include_uicontroller: true,
      }
    })).then((res) => {
      resolve(res.data.data.objdistype);
    });
  });
  return p;
};
export default getObjdisType;
