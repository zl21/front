
let eventLoops = []
let t = null
let instance = null
let flag = false
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
  instance = source;
  proxy.push({
    source,
    configuration
  })
}

function HiddenFields(){
  flag = false
  eventLoops.every(item => {
    item.configuration.every(temp => {
      // 当temp中ishide为true时，则refval控制字段的隐藏。当ishide为false时，则控制字段的显示
      if(temp.refval.split(',').includes(item.source.value)){  //判断当前字段与配置的value值进行对比
        // console.log('显示的字段',temp.target)
        
      }else{
        // console.log('隐藏的字段',item.source)
        let panelForm = item.source.$_live_getChildComponent(window.vm,'panelForm')
        let target = item.source.$_live_getChildComponent(panelForm,`${item.source.activeTab.tableName}${temp.target}`)
        let panelIndex = target.items._index.split('_')[0];
        let itemIndex = target.items._index.split('_')[1]
        if(panelForm.defaultData.addcolums[panelIndex].childs[itemIndex].show === undefined){
          flag = true
        }
        panelForm.formItemLists[panelIndex].childs[itemIndex].show = false
        panelForm.panelRedraw(panelIndex,Object.values(panelForm.formItemLists[panelIndex].childs))
        
      }
      return true
    })
    return true
  })
  
  // 

  // if(flag){
  //   instance.$_live_getChildComponent(window.vm,'panelForm').$forceUpdate()
  // }
  
}



export default hideColumn 