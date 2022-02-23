/*
 routerPush 重写框架的push 方案
 vm,
 routePrefix,
 keepAliveModuleName


*/
import {
    isEmpty
} from './common';



class RouterPush {
    constructor(vm, routePrefix, keepAliveModuleName) {
        this.$vm = vm;
        this.routePrefix = routePrefix;
        this.listener = false;
        this.keepAliveModuleName = keepAliveModuleName;
    }
    router() {
        // 重写router
        if (window.vm.$router) {
            const originalPush = window.vm.$router.push;
            let self = this;
            window.vm.$router.push = function push(location) {
                if (location === '/') {
                    // 关闭所有的tab 则清空记录
                    self.clear(this);
                }
                // backtoTop 是否返回上一及，默认都返回
                if (arguments[1] && !arguments[1].backToTop) {
                    if (isEmpty(this.$R3_history)) {
                        // 获取当前历史(应对刷新问题) 
                        this.$R3_history = self.gethistory() || {};
                    }
                    // 是否新开tab
                    let tableName = arguments[1].tableName || arguments[1].customizedModuleName || arguments[1].linkName || arguments[1].pluginModuleName;
                    if(!tableName){
                        tableName = arguments[1].url.split('/')[1];
                    }
                    tableName = tableName + `/${arguments[1].id}`;

                    if (arguments[1].clearhistory) {
                        // 清除当前表的历史 
                        if (arguments[1].clearParams) {
                            delete this.$R3_history[arguments[1].clearParams];
                        }
                    } else {
                        this.$R3_history[tableName] = arguments[1].router;
                    }
                    this.$R3_params = arguments[1];
                    window.localStorage.setItem('$R3_history_current', JSON.stringify(this.$R3_history));
                }
                  // 调用清除事件的监听
                    let {
                        openedMenuLists
                    } = window.vm.$store.state.global;
                if(openedMenuLists.length>0 && !self.listener){
                    self.listener = true;
                    self.closeCurrent(this);
                }    
                // 存储当前新开的参数
                return originalPush.call(this, location).catch(err => err);
            };
        }
    }
    back() {
        // 框架返回逻辑
        const currentRouteForOpenNewTab = this.$vm.$router.currentRoute.fullPath;
        const closeParame = {
            tableName: this.$vm.tableName,
            routeFullPath: currentRouteForOpenNewTab,
            routePrefix: this.routePrefix,
            keepAliveModuleName: this.keepAliveModuleName,
            id: this.$vm.itemId,
            // stopRouterPush: true,
            itemId: this.$vm.itemId
        };


        let url = this.$vm.tableName + '/' + this.$vm.itemId;
        if (!this.$vm.$router.$R3_history) {
            // 获取本地历史记录
            this.$vm.$router.$R3_history = this.gethistory();
        }
        if (this.$vm.$router.$R3_history) {
            let tableData = {};
            tableData = this.$vm.$router.$R3_history[url];

            if (tableData) {
                const param = {
                    ...tableData.params,
                    back: true,
                    url: tableData.fullPath,
                    NToUpperCase: true,
                    clearhistory: true,
                    clearParams: url
                };
                if(/TABLE_DETAIL/.test(param.url)){
                    param.back = false;
                }

                // 关闭菜单   
                let { enableOpenNewTab } = window.ProjectConfig;
                if(closeParame.tableName !== param.tableName || enableOpenNewTab){
                    console.log(closeParame,param);
                    this.$vm.tabCloseAppoint(closeParame);
                }
                // 新开
                this.$vm.tabOpen(param);   
                
    
                return true
            }
        } else {
            return false;
        }
    }
    gethistory() {
        // 历史记录数据
        let data = window.localStorage.getItem('$R3_history_current') || '{}';
        return JSON.parse(data);
    }
    closeCurrent($route) {
        // 手动关闭菜单时调用的删除事件
        let openedMenuListsDom = document.querySelector('.openedMenuLists');
        if (openedMenuListsDom) {
            let openedMenuListsDomVue =openedMenuListsDom.__vue__;
            let handleClose = openedMenuListsDomVue.handleClose;
            let { enableOpenNewTab } = window.ProjectConfig;
            // 给关闭tab 界面添加清除历史记录事件
            openedMenuListsDomVue.handleClose = function(){
                let {
                    openedMenuLists
                } = window.vm.$store.state.global;
                let clearParams = openedMenuLists[arguments[0]];
                let clearParamstableName = `${clearParams.tableName}/`;
                if(/C./.test(clearParams.keepAliveModuleName)){
                    // 定制界面
                    clearParamstableName = `${clearParams.tableName}/${clearParams.tableId}`;
                }
                if(enableOpenNewTab){
                    // 全都是新开界面
                    clearParamstableName = `${clearParams.tableName}/${clearParams.itemId}`;
                }
                console.log(clearParamstableName,'clearParamstableName====',clearParams);
                let $R3_history_key = Object.keys($route.$R3_history || {});
                if($R3_history_key){
                    $R3_history_key.forEach((item)=>{
                        if(new RegExp(clearParamstableName).test(item)){
                            console.log(clearParamstableName,'test====');

                            delete $route.$R3_history[item]
                        }

                    })
                }
                handleClose.call(this,...arguments);
                
            }
        }

        //
    }
    clear($this) {
        // 清除所有历史记录
        $this.$R3_history = {};
        this.listener = false;
        window.localStorage.setItem('$R3_history_current', '{}');
    }
    init() {
        


        this.router();
    }
}
export default RouterPush;