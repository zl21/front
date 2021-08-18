/*
外键字段跳转前的校验
name  string  表明+字段名称 
*/
export const verifyRouter = (name,mainId,id,openedMenuLists,obj,$state,state) => {
    let next = false;
    let index = openedMenuLists.findIndex((x)=>{
        if(x.keepAliveModuleName && x.keepAliveModuleName.split('.').length>3){
            let keepAliveModuleName = x.keepAliveModuleName.substring(x.keepAliveModuleName.indexOf('.')+1);
            return keepAliveModuleName === name+'.'+mainId+'.'+id;
        }
      
    });

    if(index !== -1){
        next = true;
        window.vm.$Modal.fcWarning({
            title: '提示',
            mask:true,
            closable:true,
            showCancel:true,
            content: '该表已经打开,是否要替换',
            onOk: () => {
                let keepModuleName = obj[0].openedMenuLists[index].keepAliveModuleName;
                let i = obj[0].keepAliveLists.findIndex((x)=>{ return x === keepModuleName})
                delete obj[1].original;
                // 清除所在缓存
                $state.commit('global/delectkeepAliveLists',i);
                setTimeout(()=>{
                    $state.commit('global/tabOpen',  obj[1]);
                },200)
            },
            onCancel:()=>{
                // 直接打开
                delete obj[1].original;
                setTimeout(()=>{
                    $state.commit('global/tabOpen',  obj[1]);
                },200)
            }
        });

    }
    return next;


    
}