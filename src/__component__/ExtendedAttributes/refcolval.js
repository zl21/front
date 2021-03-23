/*
$this： 当前实例
config  webconfig 配置

*/
import {
    filterVal
} from './common.js';

// 映射关系
export const refcolvalMap = ($this, config) => {
    let panelForm = $this.$_live_getChildComponent(window.vm, 'panelForm');
    // 获取来源值的实例
    let target = $this.$_live_getChildComponent(panelForm, `${$this.item.tableName}${config.srccol}`);
    let linkFormMap = {
        'refcolval': [`${$this.item.tableName}${$this.item.colname}`]
    };
    //挂载映射关系到对方 
    if(!target.items._linkFormMap ||  target.items._linkFormMap && !target.items._linkFormMap.refcolval){
        target.items._linkFormMap = linkFormMap;
    }else{
        linkFormMap.refcolval.forEach((x)=>{
            if(target.items._linkFormMap.refcolval.includes(x)){
                target.items._linkFormMap.push(x);
            }
        })
    }
    return messageTip($this, target);
}

// 消息提示
export const messageTip = ($this, target) => {
    let value = filterVal(target);
    $this._srccolValue = value;
    if (!value) {
        $this.$Message.info(`请先选择${target.items.name}`);
        setTimeout(() => {
            target.$el.querySelector('input').focus();
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
            if(type === 'AutoRequest'){
                return {
                    [webconf.refcolval.fixcolumn]:'='+$this._srccolValue
                }
            }else{
                return {
                    [webconf.refcolval.fixcolumn]:$this._srccolValue
                }
            }
           
        }

    }
    return {

    }




}


// 点击是否出现下拉
export const setisShowPopTip = ($this, config) => {
    if (config && config.refcolval) {
        return () => {
            return refcolvalMap($this, config.refcolval);
        }
    } else {
        return () => {
            return true;
        }
    }
}

