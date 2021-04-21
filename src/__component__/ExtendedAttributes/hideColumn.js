
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

function hideColumn(source,configuration) {
  proxy.push({
    source,
    configuration
  })
}

function HiddenFields(){
  eventLoops.every(item => {
    item.configuration.every(temp => {

      // 当temp中ishide为true时，则refval控制字段的隐藏。当ishide为false时，则控制字段的显示
      let panelForm = item.source.$_live_getChildComponent(window.vm,'panelForm')
      let target = item.source.$_live_getChildComponent(panelForm,`${item.source.activeTab.tableName}${temp.target}`)
      if(!target){
        return
      }
      let panelIndex = target.items && target.items._index && target.items._index.split('_')[0];
      let itemIndex = target.items && target.items._index && target.items._index.split('_')[1]
      if(!item.source.value && !item.source.items.fkobj && item.source.items.display != 'OBJ_SELECT'){  //当来源字段不是外健字段和select字段时，并且值为空时不做处理
        return true
      }
      if(!panelIndex){
        return;
      }
      if((JudgeValue(item.source,temp) && !temp.ishide) || (!JudgeValue(item.source,temp) && temp.ishide)){  //判断当前字段与配置的value值进行对比
        // console.log('显示的字段',temp.target)
        panelForm.formItemLists[panelIndex].childs[itemIndex].show = true
      }else{
        // console.log('隐藏的字段',item.source)
        panelForm.formItemLists[panelIndex].childs[itemIndex].show = false 
        if(temp.clear){  //是否配置了隐藏字段时需要清空数据
          if(target.items.display === 'OBJ_CHECK'){
            target.value = target.items.combobox.filter(item => !item.limitdis)[0].limitval
          }else{
            target.value = '' 
          }
          
        }  
        
      }
      panelForm.panelRedraw(Object.values(panelForm.formItemLists[panelIndex].childs))
      return true
    })
    return true
  })
  
  
}


function JudgeValue(source,conf) {
  let value = source.value;
  
  switch(conf.expression){
    case '>=':
      return eval(Number(value) + conf.expression + Number(conf.refval));
      break;
    case '=<':
      return eval(Number(value) + conf.expression + Number(conf.refval));
      break;  
    case '>':
      return Number(value) > Number(conf.refval);
      break;
    case '<':
      return Number(value) < Number(conf.refval);
      break;
    case '!=':
      return !conf.refval.split(',').includes(value);
      break;
    case '=':
    default:
      if(source.$_live_type.isArray(value)){  //处理值为数组类型字段
        if(source.items.fkobj){  //处理外健字段
          value = value.map(item => conf.match === 'label'?item.Label:item.ID)
        }

        if(source.items.display === 'OBJ_SELECT' && conf.match === 'label'){
          let arr = source.items.combobox.filter(item => value.includes(item.limitval))
          value = arr.length > 0 ? arr[0].limitdesc : ''
        }
        
        
        return conf.refval.split(',').filter((x)=>{
          return value.includes(String(x))
        }).length > 0       
      }else{
        if(source.items.display === 'OBJ_SELECT' && conf.match === 'label'){
          let arr = source.items.combobox.filter(item => item.limitval == value)
          value = arr.length > 0 ? arr[0].limitdesc : ''
        }
        return conf.refval.split(',').includes(value);
      }
      break;
  }
}


export default hideColumn 