

import {
    FindInstance ,mappingRelation
  } from './common.js';
  
  // 过滤
  export const filtercolval = function ($current,config) {  
    console.log(12);
    let targetVm = FindInstance($current,config.col,$current.items.tableName);
    // mappingRelation($current,targetVm,'filtercolval');
    if(targetVm[0]){
        let value = $current.value;
        const $this = targetVm[0];
        let filterArry = config.map[value] || [];
        if(!$this.items.olderCombobox){
            $this.items.olderCombobox = [...$this.items.combobox];
        }
        const optionsArr = $this.items.olderCombobox.reduce((arr, option) => {
            const index = filterArry.findIndex(x => x === option.value);
            if (index !== -1) {
              arr.push(option);
            }
            return arr;
          }, []);
          if(optionsArr.length >0){
            $this.items.combobox = optionsArr;
        }else{
            $this.items.combobox = $this.items.olderCombobox;
        }
        $this.$forceUpdate();
    }

  };

//   重置 combobox
  export const resetFiltercolval = function ($this,config) {  
    let $vm = FindInstance($this,String(config));
    if($vm && Array.isArray($vm)){
        $vm.forEach(($option)=>{
            if($option.items.olderCombobox){
               $option.items.combobox = [...$option.items.olderCombobox];
            }
        })
    }
   
    
  }
  
  
  