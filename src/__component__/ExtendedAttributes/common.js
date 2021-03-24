// 过滤value
export const filterVal = function ($this) {
    let _value = [];
    if (Array.isArray($this.value)) {
        if ($this.value[0] && $this.value[0].ID) {
            _value = $this.value.reduce((arr,item)=>{
              if(item.ID){
                arr.push(
                    item.ID,
                );
              }  
              return arr;
            },[]);
        } else {
            _value = String($this.value);
        }
    }else{
        _value = $this.value;

    }
    return {
        ID:String(_value || ''),
        colname:$this.items.colname
    }
    //                    colname:$this.items.colname

}
// 查找实例
export const FindInstance = ($this,name,tableName) => {
    let target = [];
    let panelForm = $this.$_live_getChildComponent(window.vm, 'panelForm');
    if(!name){
        return [];
    }
    target = name.split(',').reduce((arr,x)=>{
        if(x){
            let vm = {};
            if(tableName){
                vm = $this.$_live_getChildComponent(panelForm, tableName+x); 
            }else{
                vm = $this.$_live_getChildComponent(panelForm, x); 
            }
            if(vm){
                arr.push(vm);
            }
        }
        return arr;      
    },[]);
   
    // 获取来源值的实例
    return target;
}

// 清除字段
export const ClearRefcolValue = ($this,name) => {
    let $vm = FindInstance($this,String(name));
    if($vm && Array.isArray($vm)){
        $vm.forEach((item)=>{
            item.value = [];
        })
    }
   
}
// 字段赋值
export const setNewlValue = ($this,name,tableName,value) => {
    let $vmArray = FindInstance($this,String(name),tableName);
    if($vmArray && Array.isArray($vmArray)){
        $vmArray.forEach(($vm)=>{
            if( value[$vm.items.colname].COLUMN_TYPE !==1){
                if($vm.items.type === 'select'){
                    $vm.value = value[$vm.items.colname].LABLE_VALUES[0].VALUE || ''; 
                }else{
                    let values = value[$vm.items.colname].LABLE_VALUES.reduce((arr, options) => {
                        if (options.VALUE) {
                            arr.push({
                                ID: options.VALUE || '',
                                Label: options.LABLE || ''
                            });
                        }
                        return arr;
                    }, []);
                    if(values.length>0){
                        $vm.value =values;
                    }

                }
           }else if(value[$vm.items.colname].COLUMN_TYPE === 1){
              $vm.value = value[$vm.items.colname].LABLE_VALUES[0].VALUE ||  $vm.items.props.falseValue || ''; 
           }             
        })
    }
   
}

