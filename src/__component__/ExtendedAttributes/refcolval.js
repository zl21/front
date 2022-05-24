/*
$this： 当前实例
config  webconfig 配置

*/
import {
    filterVal,FindInstance
} from './common.js';
import network from '../../__utils__/network';
import i18n from '../../assets/js/i18n'

// 处理url

const urlSearchParams = (data) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      const dataType = Object.prototype.toString.call(data[key]);
  
      if (dataType === '[object Object]' || dataType === '[object Array]') {
        data[key] = JSON.stringify(data[key]);
      }
  
      params.append(key, data[key]);
    });
    return params;
  };


// 映射关系
export const refcolvalMap = ($this, config,key,type) => {
    let maintable = {
    };
    if(config.srccols){
        // 兼容数据
        config.srccol = config.srccols;
    }else{
        maintable[config.srccol] = config.maintable || false;
    }

    if(key === 'refcolvalArray' && Array.isArray(config)){
        let srccol = config.reduce((arr,item)=>{
                arr.push(item.srccol);
                maintable[item.srccol] = item.maintable || false;
                return arr;
        },[]).join(',');
         config = {};
        config.srccol = srccol;
    }
    console.log(121212,'====');
    let targetVm = FindInstance($this,config.srccol,$this.item.tableName,maintable);
    let linkFormMap = {
        [key]: [`${$this.item.tableName || ''}${$this.item.colname}`]
    };

    //挂载映射关系到对方 
    let checked = [];
    targetVm.forEach((target)=>{
        if(target.items.show){
            if(!target.items._linkFormMap ||  target.items._linkFormMap && !target.items._linkFormMap[key]){
                target.items._linkFormMap = linkFormMap;
            }else{
                linkFormMap[key].forEach((x)=>{
                    if(!target.items._linkFormMap[key].includes(x)){
                        target.items._linkFormMap[key].push(x);
                    }
                })
            }
            if(checked.indexOf(false) === -1 && !type){
                checked.push(messageTip($this, target,key))
            }
            

        }else{
            checked.push(true);
        }
        
    });
    if(!type){
         // 查看返回结果
        if(checked.indexOf(false) === -1 || checked.length<1){
            return true
        }else{
            return false
        }

    }
   
    
}

/*
$this 目标实例
target  来源字段实例
key webconf 的配置  eg：refcolvalArray
*/
// 消息提示
export const messageTip = ($this, target,key) => {
    let value = filterVal(target);
    // let vm = FindInstance($this,$this.item.colname,$this.item.tableName);
    
    if(!$this._srccolValue){
        $this._srccolValue = {};
    }
    $this._srccolValue[target.items.colname] = value.ID;

    // 无需校验
    if(key === 'refcolvalArray'){
        return true;
    }
    if (!value.ID) {
        $this.$Message.info(`${i18n.t('form.selectPlaceholder')}${target.items.name || target.items.coldesc}`);
        setTimeout(() => {
            if(target.$el.querySelector('input')){
                target.$el.querySelector('input').focus();
            }else if(target.$el.querySelector('textarea')){
                target.$el.querySelector('textarea').focus();
            }
        }, 100);
        return false
    } else {
        return true;
    }
}


/*
$this 目标实例
type  是否是模糊查询还是外键查询
*/
// 接口拼接 fixcolumn
export const setFixedcolumns = ($this, type) => {
    let webconf = $this.item.webconf;  
   //  
    if(webconf && webconf.refcolprem){
        let precolnameslist = [JSON.parse(JSON.stringify(webconf.refcolprem))];
        precolnameslist[0].refcolval = $this._srccolValue[webconf.refcolprem.srccol];
        return {
            precolnameslist:precolnameslist
        }
    }
    if($this.item.precolnameslist){
        return {
            precolnameslist:$this.item.precolnameslist
        }
    }
    if(!$this.item.Query){
        // 不走关联字段查询
        return {};
    }
    if (webconf && webconf.refcolval) {
        if(webconf.refcolval.srccol === '$OBJID$'){
            if (/NEW/.test($this.activeTab.keepAliveModuleName.toLocaleUpperCase())) {
                return {};
              }
              let id = $this.activeTab.keepAliveModuleName.split('.');
              return {
                [webconf.refcolval.fixcolumn]:id[id.length-1]
              }
        }
        if(!$this._srccolValue){
            // 兼容模糊查询无法
            setisShowPopTip($this, webconf,network);
        }
        if ($this._srccolValue) {
            let colnameID = $this._srccolValue[webconf.refcolval.srccol];
            const query = webconf.refcolval.expre === 'equal' ? '=' : '';
            if(type === 'AutoRequest'){
                return {
                    [webconf.refcolval.fixcolumn]:query+String(colnameID)
                }
            }else{
                return {
                    [webconf.refcolval.fixcolumn]:String(colnameID)
                }
            }
           
        }

    }
    if(webconf && webconf.refcolval_custom){
        return {...$this._datafixedcolumns}
    }
    if(webconf && webconf.refcolvalArray){
        let fixcolumns = webconf.refcolvalArray.reduce((arr,item)=>{
            arr[item.fixcolumn] = $this._srccolValue && $this._srccolValue[item.srccol] || ''
            return arr;
        },{});
        return {...fixcolumns}
    }
    return {

    }




}

/*
$this 目标实例
config  webcof 的配置
network 
*/

// 点击是否出现下拉
export const setisShowPopTip = ($this, config,network,type) => {
    if(config && config.refcolprem){
        // 关联店仓权限
        return refcolvalMap($this, config.refcolprem,'refcolprem',type);
    }
    if(!$this.item.Query){
        // 不走关联字段查询
        return ()=>{
            return true;
        }
    }
   
    // refcolval
    if (config && config.refcolval) {
        if(config.refcolval.srccol === '$OBJID$'){
            return true;
        }
       return refcolvalMap($this, config.refcolval,'refcolval',type);
       
    }else if(config && config.refcolval_custom){
    // refcolval_custom
        return  refcolvalCustomUrl ($this, config,network,'refcolval_custom',type)

    }else if(config && config.refcolvalArray) {
        // refcolvalArray
        return  refcolvalMap ($this, config.refcolvalArray,'refcolvalArray',type)

    }else{
        return true;
    }
}

// refcolval_custom 接口请求
export  const refcolvalCustomUrl =  ($this, config,network,value,type) => {
    let checkd = refcolvalMap($this, config.refcolval_custom,'refcolval_custom',type);
    // async
    if(checkd){
         return postCustomUrl(network,config,$this)
    }else{
        return false
    }
   
}
// 接口请求
 function postCustomUrl(network,config,$this){
    return new Promise((resolve) => {
     network.post(config.refcolval_custom.url, {
        fixedcolumns: {...$this._srccolValue}
      }).then((res) => {
        if (res.data.code === 0) {
            let result = res.data.fixedcolumns;
            $this._datafixedcolumns = result;
            resolve(true);
        }else{
            resolve(false);
        }
      });
    })

}

/*
self 当前实例
*/

 // 字段联动 表格数据查询
export const postTableData = async function(self,url){

    let Fixedcolumns = setFixedcolumns(self,'TableRequest');
    if(Fixedcolumns.precolnameslist){
        this.searchdata.precolnameslist = Fixedcolumns.precolnameslist;

    }else{
        if (JSON.stringify(Fixedcolumns) !== '{}') {
            this.searchdata.fixedcolumns = Fixedcolumns;
          } else {
            delete this.searchdata.fixedcolumns
        }

    }
     
      return new Promise((resolve) => {
        this.post(url, urlSearchParams({
          searchdata: this.searchdata
        }), (response) => {
          resolve(response);
        });
      });
}

 // 字段联动 模糊查询
 export  function postData(self,url){
    let Fixedcolumns = setFixedcolumns(self,'AutoRequest');
    if(Fixedcolumns.precolnameslist){
        this.searchdata.precolnameslist = Fixedcolumns.precolnameslist;
    }
   
    let selfChildren = this.$children[0];
    if(typeof selfChildren.isShowPopTip === 'function'){
        if(!selfChildren.isShowPopTip()){
            this.$el.querySelector('input').value ='';
           return new Promise((resolve) => {
            resolve([]);
          });
        }else if(selfChildren.isShowPopTip() &&  typeof selfChildren.isShowPopTip().then === 'function'){
            selfChildren.isShowPopTip().then((res)=>{
              if(res === true){
                return newpostData(Fixedcolumns,this,url)
              }
          });
        }else{
          return newpostData(Fixedcolumns,this,url);
        }
    }
 }

 const newpostData = (Fixedcolumns,$this,url)=>{
    if (JSON.stringify(Fixedcolumns) !== '{}') {
        if(Fixedcolumns.precolnameslist){
            $this.sendMessage.fixedcolumns = {
                precolnameslist:Fixedcolumns.precolnameslist
            };
        }else{
            $this.sendMessage.fixedcolumns = {
                "whereKeys":Fixedcolumns
              };
        }
      
    }
    return new Promise((resolve) => {
      $this.post(url,  urlSearchParams(
        $this.sendMessage
      ), (res) => {
        resolve(res.data);
      });
    });
  }
  
//   初始化映射  init
export const initWebConf=()=>{

}