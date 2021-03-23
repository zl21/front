/*
$this： 当前实例
config  webconfig 配置

*/
import {
    filterVal,FindInstance
} from './common.js';


// 映射关系
export const refcolvalMap = ($this, config,key) => {
    if(config.srccols){
        config.srccol = config.srccols;
    }
    let targetVm = FindInstance($this,config.srccol,$this.item.tableName);
    let linkFormMap = {
        [key]: [`${$this.item.tableName}${$this.item.colname}`]
    };
    //挂载映射关系到对方 
    let checked = [];
    if(!targetVm[0]){
        return false;
    }
    targetVm.forEach((target)=>{
        if(target){
            if(!target.items._linkFormMap ||  target.items._linkFormMap && !target.items._linkFormMap.refcolval){
                target.items._linkFormMap = linkFormMap;
            }else{
                linkFormMap.refcolval.forEach((x)=>{
                    if(target.items._linkFormMap.refcolval.includes(x)){
                        target.items._linkFormMap.refcolval.push(x);
                    }
                })
            }
            
            checked.push(messageTip($this, target))
            

        }
        
    });
    // 查看返回结果
    if(checked.indexOf(false) === -1){
        return true
    }else{
        return false
    }
    
}

// 消息提示
export const messageTip = ($this, target) => {
    let value = filterVal(target);
    // let vm = FindInstance($this,$this.item.colname,$this.item.tableName);
    
    if(!$this._srccolValue){
        $this._srccolValue = {};
    }
    
    $this._srccolValue[target.items.colname] = value.ID;
    
    if (!value.ID) {
        $this.$Message.info(`请先选择${target.items.name}`);
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



// 接口拼接 fixcolumn
export const setFixedcolumns = ($this, type) => {
    let webconf = $this.item.webconf;    
    if (webconf && webconf.refcolval) {
       
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
    return {

    }




}


// 点击是否出现下拉
export const setisShowPopTip = ($this, config,network) => {
    // refcolval
    if (config && config.refcolval) {
        return () => {
            return refcolvalMap($this, config.refcolval,'refcolval');
        }
    }else if(config && config.refcolval_custom){
    // refcolval_custom
        return () => {
            return  refcolvalCustomUrl ($this, config,network)
        }
    }else {
        return () => {
            return true;
        }
    }
}

// refcolval_custom 接口请求
export  const refcolvalCustomUrl =  ($this, config,network) => {
    let checkd = refcolvalMap($this, config.refcolval_custom,'refcolval_custom');
    // async
    console.log(checkd,'checkdcheckd');
    if(checkd){
        return false
         //return postCustomUrl(network,config,$this)
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
            result = res.data.fixedcolumns;
            $this._datafixedcolumns = result;
            resolve(true);
        }else{
            resolve(false);
        }
      });
    })

}




