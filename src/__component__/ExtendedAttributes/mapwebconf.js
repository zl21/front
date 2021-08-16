import {
    FindInstance 
  } from './common.js';


import {filtercolval } from './filtercolval.js';

  
export default {
  mounted() {
    if(this.items.webconf && this.items.webconf.filtercolval){

        // 过滤显示字段
        this.$nextTick(()=>{
          let colfiltercolval = this.items.webconf.filtercolval;
          let targetVm = FindInstance(this,colfiltercolval.col,this.items.tableName);
          if(!targetVm[0]){
            return;
          }
          if(targetVm[0].items.webconf){
              targetVm[0].items.webconf.filtercolval = colfiltercolval;
          }else{
              targetVm[0].items.webconf = {};
              targetVm[0].items.webconf.filtercolval = colfiltercolval;
          }
          targetVm[0].items.webconf.filtercolval.col =this.items.colname;
          // 兼容初始化渲染过滤
          filtercolval(targetVm[0],this.items.webconf.filtercolval)
          delete this.items.webconf.filtercolval;
        })
       
     }
  }  
};