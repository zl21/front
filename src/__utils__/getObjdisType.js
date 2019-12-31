import network, { urlSearchParams, GetTableName } from './network';
import { Version } from '../constants/global';

const getObjdisType = (data) => {
  const p = new Promise((resolve, reject) => {
    GetTableName({ tableName: data.table });
    network.post('/p/cs/QueryList', urlSearchParams({
      searchdata: {
        table: data.table,
        startindex: 0,
        range: 0,
        fixedcolumns: Version() === '1.4' ? { ISACTIVE: ['=Y'] } : {},
        column_include_uicontroller: true,
      }
    })).then((res) => {
      resolve(res.data.data.objdistype);
    }).catch(() => {
      reject();
    });
  });
  return p;
};
export default getObjdisType;
