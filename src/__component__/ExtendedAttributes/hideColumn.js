
import {
  FindInstance
} from './common.js';

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
      if(item.source.activeTab.keepAliveModuleName.split('.')[0].toLocaleUpperCase() ==='S'){
        return false;
      }
      let target = FindInstance(item.source,temp.target,`${item.source.activeTab.tableName}`)[0];
      let panelFormParent = item.source.$_live_getChildComponent(window.vm, `${item.source.activeTab.keepAliveModuleName}`);
      let panelForm = item.source.$_live_getChildComponent(panelFormParent, 'panelForm');
      
      if(!target){
        return
      }
      let panelIndex = target.items && target.items._index && target.items._index.split('_')[0];
      let itemIndex = target.items && target.items._index && target.items._index.split('_')[1]

      // console.log(temp,target.items,'900========',!item.source.value && !item.source.items.fkobj && item.source.items.display != 'OBJ_SELECT');

      // if(!item.source.value && !item.source.items.fkobj && item.source.items.display != 'OBJ_SELECT'){  //当来源字段不是外健字段和select字段时，并且值为空时不做处理
      //   return true
      // }
      if(!panelIndex){
        return;
      }
      let formItem = panelForm.formItemLists[panelIndex].childs[itemIndex];
      if((JudgeValue(item.source,temp) && !temp.ishide) || (!JudgeValue(item.source,temp) && temp.ishide)){  
        //判断当前字段与配置的value值进行对比
        // console.log('显示的字段',temp.target)
        formItem.show = true
      }else{
        // console.log('隐藏的字段',item.source)
        formItem.show = false 
        if(temp.clear){  //是否配置了隐藏字段时需要清空数据
          if(target.items.display === 'OBJ_CHECK'){
            target.value = target.items.combobox.filter(item => !item.limitdis)[0].limitval
          }else{
            //target.value = '';
            let dom =  target.$el && target.$el.querySelector('.iconios-close-circle');
            if(dom){
               dom.click();
            }

          }
          
        }  
        
      }
      const srccol = formItem.validate && formItem.validate.refcolval && formItem.validate.refcolval.srccol;
      const prmsrccol = formItem.validate && formItem.refcolprem && formItem.refcolprem.srccol;
      // 兼容子表映射判断
      let LinkageForm = [{
            key: `${formItem.tableName}${formItem.colname}`,
            name: formItem.name,
            show: formItem.show,
            srccol: `${formItem.tableName}${srccol || prmsrccol}`,
            maintable: true,
            tableName: formItem.tableName
          }];
      // 是否校验判断
      target.setRules();
      // 兼容子表映射判断
      // panelForm.linkFormSet(LinkageForm);
      panelForm.panelRedraw(Object.values(panelForm.formItemLists[panelIndex].childs))
      return true
    })
    return true
  })
  
  
}


function JudgeValue(source,conf) {
  let value = source.value;
  if (parseFloat(value) === 0) {
    value = 0;
  // eslint-disable-next-line use-isnan
  } else if (value === '') {
    value = undefined;
  }
  switch(conf.expression){
    case '>=':
      return eval(Number(value) + conf.expression + Number(conf.refval));
      break;
    case '<=':
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
        return conf.refval.split(',').includes(String(value));
      }
      break;
  }
}


export default hideColumn 