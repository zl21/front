
let eventLoops = []
let t = null
var proxy = new Proxy(eventLoops, {
  set:function (target, key, value) {
    if(value.source){
      let a = -1;
      target.find((item,index) => {
        if(item.source.items.colname == value.source.items.colname){
          a = index;
        }
        return item.source.items.colname == value.source.items.colname
      })

      if(a >= 0){   
        target.splice(a,1)
      }
      target.push(value)
    }
    if(t!=null){
  　　　clearTimeout(t)
  　 }
    t=setTimeout(function(){
        HiddenFields()
  　 },100)
    return true
  },
  get:function (target, key) {
    return target[key];
  }
});

function setAttributes(source,configuration) {
  proxy.push({
    source,
    configuration
  })
}

function HiddenFields(){
  eventLoops.every(item => {
    item.configuration.every(temp => {
      let panelForm = item.source.$_live_getChildComponent(window.vm,`panelForm`)
      let target = item.source.$_live_getChildComponent(panelForm,`${item.source.activeTab.tableName}${temp.field.refcolumn}`)
      if(!target || !target.items){
        return;
      }
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
        formItem.isnotnull = temp.props.required;
        formItem.readonly = temp.props.disabled;
      }else{
        formItem.isnotnull = target.items.original.isnotnull;
        formItem.readonly = target.items.original.readonly;
      }
      // 是否校验判断
      if(formItem.isnotnull && !formItem.readonly && formItem.show){
        formItem.rules.required = true
      }else{
        formItem.rules.required = false
      }
      delete panelForm.formItemLists[panelIndex].childs[itemIndex].Components
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
      let sourceCom = source.$_live_getChildComponent(panelForm,`${source.activeTab.tableName}${item.refcolumn}`)
      let value = sourceCom.value;
      console.log(item.refval,value,'===sourceCom');

      if(sourceCom.$_live_type.isArray(value)){
        if(sourceCom.items.fkobj){  //处理外健字段
          value = value.map(item => conf.match === 'label'?item.Label:item.ID)
        }

        if(item.refval.split(',').filter((x)=>{
          return value.includes(String(x))
        }).length === 0){
          flag = false;
          return false;
        }
      }else {
        if(!item.refval.split(',').includes(value)){
          flag = false;
          return false
        }
      }
      
      return true
    })


    return flag
  
}


export default setAttributes 