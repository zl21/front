import network, { urlSearchParams, GetTableName } from './network';
import { Version } from '../constants/global';
// {"table":"CP_C_STORE","startindex":0,"range":10,"fixedcolumns":{},"column_include_uicontroller":true}
const getObjdisType = (data) => {
  const p = new Promise((resolve, reject) => {
    GetTableName({ tableName: data.table });
    network.post('/p/cs/QueryList', urlSearchParams({
      searchdata: {
        table: data.table,
        startindex: 0,
        range: Version() === '1.4' ? 0 : 1,
        fixedcolumns: Version() === '1.4' ? { ISACTIVE: ['=Y'] } : {},
        column_include_uicontroller: true,
      }
    })).then((res) => {
      if (Version() === '1.4') {
        resolve(res.data.data.objdistype);
      } else {
        resolve(res.data.datas.objdistype);
      }
    }).catch(() => {
      reject();
    });
  });
  return p;
};
export default getObjdisType;
