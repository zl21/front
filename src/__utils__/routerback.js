
/*
 routerPush 重写框架的push 方案
 vm,
 routePrefix,
 keepAliveModuleName


*/
import {isEmpty} from './common';
class RouterPush {
    constructor(vm, routePrefix, keepAliveModuleName) {
        this.$vm = vm;
        this.routePrefix = routePrefix;
        this.keepAliveModuleName = keepAliveModuleName;
    }
    router() {
        // 重写router
        if (window.vm.$router) {
            const originalPush = window.vm.$router.push;
            let self = this;
            window.vm.$router.push = function push(location) { 
                if(location ==='/'){
                  // 关闭所有的tab 则清空记录
                    self.clear(this);
                }
              
                let {
                    enableOpenNewTab
                } = window.ProjectConfig;
                if (arguments[1]) {
                    if (isEmpty(this.$R3_history)) {
                        // 获取当前历史(应对刷新问题) 
                        this.$R3_history = self.gethistory() || {};
                    }
                    // 是否新开tab
                    let tableName = arguments[1].tableName || arguments[1].customizedModuleName || arguments[1].linkName;
                    if (enableOpenNewTab) {
                        // 新开添加id 名称
                        tableName = tableName + `/${arguments[1].id}`;
                    }
                    if (arguments[1].clearhistory) {
                        // 清除当前表的历史 
                        delete this.$R3_history[tableName];
                    } else {
                      
                        this.$R3_history[tableName] = arguments[1].router;

                    }
                    this.$R3_params = arguments[1];
                    window.localStorage.setItem('$R3_history_current',JSON.stringify(this.$R3_history));
                } else {
                    // 没有arguments[1] 默认是关闭菜单，则删除来源记录
                    // delete this.$R3_history[tableName];
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
            itemId: this.$vm.itemId
        };
     
        let url = this.$vm.tableName + '/' + this.$vm.itemId;

        let {
            enableOpenNewTab
        } = window.ProjectConfig;
        if(!this.$vm.$router.$R3_history){
            // 获取本地历史记录
            this.$vm.$router.$R3_history =  this.gethistory();
        }
       
        if (this.$vm.$router.$R3_history) {
            let tableData = {};
            if (enableOpenNewTab) {
                tableData = this.$vm.$router.$R3_history[url];
            } else {
                tableData = this.$vm.$router.$R3_history[this.$vm.tableName];
            }
            if(tableData){
                const param = {
                    ...tableData.params,
                    back: true,
                    url: tableData.fullPath,
                    NToUpperCase: true,
                    clearhistory: true
                };
                // 关闭菜单   
                this.$vm.tabCloseAppoint(closeParame);
                // 新开s
                this.$vm.tabOpen(param);
                return true
            }
            

        }else {
            return false;
        }

    }

    gethistory(){
        // 历史记录数据

        let data = window.localStorage.getItem('$R3_history_current') || '{}';
        return JSON.parse(data);
        // this.$R3_params =

    }

    clear($this){
        // 清除所有历史记录

        $this.$R3_history = {};
        window.localStorage.setItem('$R3_history_current','{}');

    }

    init() {
        this.router();
    }
}
export default RouterPush;