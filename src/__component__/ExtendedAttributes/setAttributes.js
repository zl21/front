import {
  FindInstance,isEmpty
} from './common.js';
let eventLoops = {}
let t = null
var proxy = new Proxy(eventLoops, {
  set:function (target, key, value) {
    if(value.source){
      let a = -1;
      if(!target[value.tableName]){
        target[value.tableName] = [];
      }
      target[value.tableName].find((item,index) => {
        if(item.source.items.colname == value.source.items.colname){
          a = index;
        }
        return item.source.items.colname == value.source.items.colname
      })

      if(a >= 0){   
        target[value.tableName].splice(a,1)
      }
      target[value.tableName].push(value)
    }
    if(t!=null){
  　　　clearTimeout(t)
  　 }
    t=setTimeout(function(){
        HiddenFields(value.tableName)
  　 },100)
    return true
  }
});

function setAttributes(source,configuration) {
  proxy.tableName = {
    source,
    tableName:source.activeTab.keepAliveModuleName,
    configuration
  }
}

function HiddenFields(tableName){
  eventLoops[tableName].every(item => {
    item.configuration.every(temp => {
      // if(item.source.activeTab.keepAliveModuleName.split('.')[0].toLocaleUpperCase() ==='S'){
      //   return false;
      // }
      let target = FindInstance(item.source,temp.field.refcolumn,item.source.items.tableName)[0];
      
      if(!target || !target.items){
        return;
      }
      let panelForm = document.querySelector(`#${target.items.formName}`)._vue_;
      if(!target.items.original){
        target.items.original = {};
        target.items.original.isnotnull = target.items.isnotnull;
        target.items.original.readonly = target.items.readonly;

      }
      let panelIndex = target.items && target.items._index && target.items._index.split('_')[0];
      let itemIndex = target.items && target.items._index && target.items._index.split('_')[1]
      if(!panelIndex){
        return;
      }
      let formItem = panelForm.formItemLists[panelIndex].childs[itemIndex];
      if(JudgeValue(item.source,temp,panelForm)){
        if(temp.props && temp.props.required !== undefined){
          formItem.isnotnull = temp.props.required;
        }
        if(temp.props && temp.props.disabled !== undefined){
          formItem.readonly = temp.props.disabled;
        }
       
      }else{
        formItem.isnotnull = target.items.original.isnotnull;
        formItem.readonly = target.items.original.readonly;
      }
      // 是否校验判断
      target.setRules();
      // 初始化字段的属性
      target.inheritanceComponents();
      // delete panelForm.formItemLists[panelIndex].childs[itemIndex].Components
      target.$forceUpdate()
      return true
    })
    return true
  })
  
  
}

// 判断配置的值是否匹配
function JudgeValue(source,conf,panelForm) {

    let flag = true
    conf.source.every(item => {
      let sourceCom = FindInstance(source,item.refcolumn,source.items.tableName)[0]
      let value = sourceCom.value || '';
              // 空值判断
      if(isEmpty(value)){
        value = ''
      }        
      if(item.refval ==="''" || item.refval ==="undefined" || item.refval ==="null"){
        item.refval = "";
      }
      if(sourceCom.$_live_type.isArray(value)){
        
        if(sourceCom.items.fkobj){  //处理外健字段
          value = value.map(item => conf.match === 'label'?item.Label:item.ID)
        }
        if((item.refval || '').toString().split(',').filter((x)=>{
          return value.includes(String(x))
        }).length === 0){
          flag = false;
          return false;
        }
      }else {
        // 空值判断
        if( item.refval === ""  && value === ''){
              return true;
        }
        if(!(item.refval || '').toString().split(',').includes(value)){
          flag = false;
          return false
        }
      }
      
      return true
    })


    return flag
  
}


export default setAttributes 