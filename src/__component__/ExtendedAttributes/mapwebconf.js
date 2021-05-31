import {
    FindInstance 
  } from './common.js';
export default {
  mounted() {
    if(this.items.webconf && this.items.webconf.filtercolval){

        // 过滤显示字段
        let filtercolval = this.items.webconf.filtercolval;
        let targetVm = FindInstance(this,filtercolval.col,this.items.tableName);
        if(!targetVm[0]){
          return;
        }
        if(targetVm[0].items.webconf){
            targetVm[0].items.webconf.filtercolval = filtercolval;
        }else{
            targetVm[0].items.webconf = {};
            targetVm[0].items.webconf.filtercolval = filtercolval;
        }
        targetVm[0].items.webconf.filtercolval.col =this.items.colname;
        delete this.items.webconf.filtercolval
     }
  }  
};