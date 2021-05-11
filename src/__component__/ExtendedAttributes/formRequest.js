

import {
    filterVal,FindInstance,setNewlValue,isEmpty
} from './common.js';
import network from '../../__utils__/network';

// 过滤value
export const equalformRequest = function equalformRequest(params) {
    // 服务端赋值
    network.post(params.url, params.searchObject, { serviceId: '' }).then((res) => {
      if (typeof params.success === 'function') {
        params.success(res.data);
      }
    });
  };
  

  export const formRequestInit = function formRequestInit($this,config) {
    // 初始化
    if(Array.isArray($this.value) || isEmpty($this.value)){
        let data = {};
        let targetVm = FindInstance($this,config.refcolumn,$this.items.tableName);
        targetVm.forEach((x)=>{
            let value = filterVal(x);
            data[value.colname] = value.ID || '';
        });


        equalformRequest({
            url: config.url,
            searchObject:{
                ASSIGN:data
            },
            success: (res) => {
                if(Array.isArray(res) ){
                    let newValueObject = {};
                    let name = res.reduce((arr,item)=>{
                        arr.push(item.COLUMN_NAME);
                        newValueObject[item.COLUMN_NAME] = item;
                        return arr;
                    },[]);
                    setNewlValue($this,name,$this.items.tableName,newValueObject);

                }
            }
        });
    }
  };