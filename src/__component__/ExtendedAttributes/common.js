/*
$this 目标实例
*/
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
/*
$this 目标实例
tableName  string  表明 
name  string  字段名称 
maintable 主子映射
*/
export const FindInstance = ($this,name,tableName,maintable) => {
    let target = [];
    // let panelFormParent = $this.$_live_getChildComponent(window.vm, `${$this.activeTab.keepAliveModuleName}`);
    let mainTableName = $this.$route.params.tableName;
     //console.log(mainTableName,'34343',$this.$route.params,$this.activeTab.keepAliveModuleName);
    let panelFormParent = {};
    if(document.querySelector('.ListsForm-box')){
        panelFormParent = document.querySelector('.ListsForm-box')._vue_;
        name = name.replace(new RegExp(mainTableName), "");
        if(!Array.isArray(name)){
            return [panelFormParent.$_live_getChildComponent(panelFormParent, mainTableName+name)]
        }else{
            return [panelFormParent.$_live_getChildComponent(panelFormParent, name[0])]
        }
    }else{
        panelFormParent =  document.querySelector(`#${mainTableName}`)._vue_;
    }
    if(name === 'panelForm'){
        let panelForm = $this.$_live_getChildComponent(panelFormParent, 'panelForm');
        return [panelForm];
    }
    if(!name){
        return [];
    }
    let namestertTableName = $this.$route.params.tableName || $this.$route.params.customizedModuleName;
    target = name.split(',').reduce((arr,x)=>{
        if(x){
            let vm = {};
            if(tableName){
                if(x.split('.').length>1){
                    x= x.split('.').join('');
                    vm = $this.$_live_getChildComponent(panelFormParent, x); 
                }else{
                    if(maintable && maintable[x]){
                        vm = $this.$_live_getChildComponent(panelFormParent, namestertTableName+x); 
                    }else{
                        vm = $this.$_live_getChildComponent(panelFormParent, tableName+x); 
                    }
                }
            }else{
                vm = $this.$_live_getChildComponent(panelFormParent, x); 
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
export const findComponentDownward = (context, componentName) =>{
    const childrens = context.$children;
    let children = null;
  
    if (childrens.length) {
      for (const child of childrens) {
        const name = child.$options.name;
  
        if (name === componentName) {
          children = child;
          break;
        } else {
          children = findComponentDownward(child, componentName);
          if (children) break;
        }
      }
    }
    return children;
  }
// 由一个组件，向下找到所有指定的组件
// export const findComponentsDownward = (context, componentName) => {
//     return context.$children.reduce((components, child) => {
//       if (child.$options.name === componentName) components.push(child);
//       const foundChilds = findComponentsDownward(child, componentName);
//       return components.concat(foundChilds);
//     }, []);
//   }
/*
/*
$this 目标实例
name  string  实例名称 
*/
export const FindInstanceAll = ($this,name) => {
    let panelFormParent = $this.$_live_getChildComponent(window.vm, `${$this.activeTab.keepAliveModuleName}`);
    let panelForm = $this.$_live_getChildComponent(panelFormParent, name,'all');
    
    // 获取来源值的实例
    return panelForm;
}
/*
$this 目标实例
name  string  表明+字段名称 
*/
// list 实例获取延时问题
export const delayedVm = async (mainTableName,name) => {
    return new Promise(resolve => {
        setTimeout(() => { // 用定时器模拟异步请求
            let panelFormParent = document.querySelector('.ListsForm-box')._vue_;
            if(!Array.isArray(name)){
                resolve([panelFormParent.$_live_getChildComponent(panelFormParent, mainTableName+name)])
            }else{
                resolve([panelFormParent.$_live_getChildComponent(panelFormParent, name[0])])
            }
        },100)
    });    
  
}
// 清除字段
export const ClearRefcolValue = ($this,name) => {
    let $vm = FindInstance($this,String(name));
    if($vm && Array.isArray($vm)){
        $vm.forEach((item)=>{
            item.value = '';
        })
    }
   
}
/*
$this 目标实例
targetVm 来源实例的数组
key  string  哪种配置 
*/

// 映射关系
export const mappingRelation = ($this,targetVm,key)=>{
    let linkFormMap = {
        [key]: [`${$this.items.tableName}${$this.items.colname}`]
    };
    //挂载映射关系到对方 
    targetVm.forEach((target)=>{
        if(target){
            if(!target.items._linkFormMap ||  target.items._linkFormMap && !target.items._linkFormMap[key]){
                target.items._linkFormMap = linkFormMap;
            }else{
                linkFormMap[key].forEach((x)=>{
                    if(!target.items._linkFormMap[key].includes(x)){
                        target.items._linkFormMap[key].push(x);
                    }
                })
            } 
        }
        
    });



}
/*
$this 目标实例
name 字段名称
tableName  表明
value   value map 
*/
// 字段赋值
export const setNewlValue = ($this,name,tableName,value) => {
    let $vmArray = FindInstance($this,String(name),tableName);

    if($vmArray && Array.isArray($vmArray)){
        $vmArray.forEach(($vm)=>{

            if( value[$vm.items.colname].COLUMN_TYPE !==1){

                if($vm.items.display === 'OBJ_SELECT'){
                    let index =  $vm.items.combobox.findIndex((x)=>{
                        x.value ===value[$vm.items.colname].LABLE_VALUES[0].VALUE
                    });
                    if(index>0){
                        $vm.value = value[$vm.items.colname].LABLE_VALUES[0].VALUE || ''; 
                    }
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
                    $vm.value =values;
                    $vm.typesource = 'formRequest';

                }
           }else if(value[$vm.items.colname].COLUMN_TYPE === 1){
            if($vm.items.display === 'OBJ_SELECT'){
                let index =  $vm.items.combobox.findIndex((x)=>{
                    x.value === value[$vm.items.colname].LABLE_VALUES[0].VALUE
                });
                if(index>0){
                    $vm.value = value[$vm.items.colname].LABLE_VALUES[0].VALUE || ''; 
                }
            }else{
                $vm.value = value[$vm.items.colname].LABLE_VALUES[0].VALUE ||  $vm.items.props.falseValue || ''; 
            }
           }             
        })
    }
   
}


/*
obj
*/
// 判空处理
export const isEmpty = (obj)=>{
    if(typeof obj ==='object'){
        obj = JSON.stringify(obj || {}).replace(/null|,/g,'');

    }

    if(obj === undefined || obj === "null" || obj === "" || obj === "[]" || obj === "{}"){
        return true;
    }else{
        return false;
    }
   
}

/*
$this 目标实例
*/
// 清除
export const clearFormRefcolval = function ($this) {
    if($this.items._linkFormMap){
        // refcolval
        let _linkFormMap = $this.items._linkFormMap;
        if(_linkFormMap.refcolval){
          // 清除目标字段的值
          ClearRefcolValue($this,_linkFormMap.refcolval);
        }
        if(_linkFormMap.refcolvalArray){
          // 清除目标字段的值
          ClearRefcolValue($this,_linkFormMap.refcolvalArray);
        }
        if(_linkFormMap.refcolval_custom){
          // 清除目标字段的值
          ClearRefcolValue($this,_linkFormMap.refcolval_custom);
        }
        if(_linkFormMap.filtercolval){
        }
      }

}