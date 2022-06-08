/*
 routerPush 重写框架的push 方案
 vm,
 routePrefix,
 keepAliveModuleName


*/
import {
    isEmpty
} from './common';


/*
  @backtoTop 是否返回上一级，默认都返回
  @tableName:来源值的表明
  @tableNameUrl :表明/表id
  @clearhistory:表示来源是关闭动作
  @formUrl:表示来源表+来源的id
  @CurrentUrl:表示当前表+来源的id


*/
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
                self.arguments = arguments;
                // 历史记录书签
                self.bookmark(this);
                return originalPush.call(this, location).catch(err => err);
            };
        }
    }
    bookmark($route) {
        // 历史记录书签
        if (this.arguments[1] && !this.arguments[1].backToTop) {
            if (isEmpty($route.$R3_history)) {
                // 获取当前历史(应对刷新问题) 
                $route.$R3_history = this.gethistory() || {};
            }
            let tablelistdata = {};
            if(this.arguments[1].type ==='tablelist'){
                // 从列表单对象
                tablelistdata = this.pathMatching(this.arguments[1]);
                if(!tablelistdata){
                    return ;
                }
                this.arguments[1].tableName = tablelistdata.tableName;
                this.arguments[1].id = tablelistdata.id;
                this.arguments[1].router.params.itemId = this.arguments[1].id;
                console.log(this.arguments[1],tablelistdata);

            }
            let tableName = this.arguments[1].tableName || this.arguments[1].customizedModuleName || this.arguments[1].linkName || this.arguments[1].pluginModuleName || tablelistdata.tableName;
            let formTableName = this.arguments[1].router.params.tableName || this.arguments[1].router.params.customizedModuleName || this.arguments[1].router.params.linkName || this.arguments[1].router.params.pluginModuleName;

            if (!tableName) {
                // 表明不存在，截图路径上的
                tableName = this.arguments[1].url.split('/')[1];
            }
            let tableNameUrl = tableName + `/${(this.arguments[1].id || tablelistdata.tableId)}`;
            let CurrentUrl = `${tableName}/${this.arguments[1].router.params.itemId}`;
            let formUrl = formTableName + `/${this.arguments[1].router.params.itemId}`;
            // 清除nav 记录  
            this.clearNav(`/${(this.arguments[1].tableName || tablelistdata.tableName)}/`);
            if (this.arguments[1].clearhistory) {
                // 清除当前表的历史 
                if (this.arguments[1].clearParams) {
                    delete $route.$R3_history[this.arguments[1].clearParams];
                }
            } else {
                let {
                    enableOpenNewTab
                } = window.ProjectConfig;
                if (!enableOpenNewTab) {
                    if (!this.arguments[1].target) {
                        this.setNewHistory($route, tableNameUrl, formUrl)
                    } else {
                        // 当在自身页面进行保存时
                        $route.$R3_history[tableNameUrl] = $route.$R3_history[CurrentUrl];
                        delete $route.$R3_history[CurrentUrl];

                    }
                } else {
                   this.setNewHistory($route, tableNameUrl, formUrl)
                }
            }
            $route.$R3_params = this.arguments[1];

        } else {
        
           
        }
        window.localStorage.setItem('$R3_history_current', JSON.stringify($route.$R3_history));

        // 调用清除事件的监听
        let {
            openedMenuLists
        } = window.vm.$store.state.global;
        if (openedMenuLists.length > 0 && !this.listener) {
            this.listener = true;
            // 关闭按钮触发的事件
            this.closeCurrent($route);
        }
    }
    setNewHistory($route, tableNameUrl, formUrl) {
        // 添加历史记录判断
        if ($route.$R3_history[tableNameUrl]) {
            // 当前表已经有历史记录的状态下，判断来源表是否等于当前表
            if (formUrl != tableNameUrl) {
              //  $route.$R3_history[tableNameUrl] = this.arguments[1].router;
            }
        } else {
           $route.$R3_history[tableNameUrl] = {...this.arguments[1].router};
        }
       // this.clearNav($route.currentRoute.path)

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
                if (['CP_C_TASK', 'U_NOTE'].includes(param.tableName) && ['CP_C_TASK', 'U_NOTE'].includes(closeParame.tableName)) {
                    // 我的任务除外
                    return false;
                }
                let {
                    enableOpenNewTab
                } = window.ProjectConfig;
                if (/TABLE_DETAIL/.test(param.url)) {
                    param.back = false;
                    if (param.tableName === closeParame.tableName && closeParame.itemId === 'New' && !enableOpenNewTab) {
                        delete this.$vm.$router.$R3_history[url];
                        return false;
                    }
                }

                // 关闭菜单   
                if (closeParame.tableName !== param.tableName || enableOpenNewTab) {
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
    pathMatching(data){
        // 匹配路径
        let tableName = '';
        let tableId = '';
        if(/SYSTEM/.test(data.path) && /\/[H|V]\//.test(data.path)){
            let path  = data.path.split(/\/[H|V]\//)[1];
            let pathName = path.split('/');
            tableName = pathName[0];
            tableId = pathName[2];
            return {
                tableName:tableName,
                id:tableId
            }
        }else{
            return false
        }

     


    }
    gethistory() {
        // 历史记录数据
        let data = window.localStorage.getItem('$R3_history_current') || '{}';
        try {
            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    }
    closeCurrent($route) {
        // 手动关闭菜单时调用的删除事件
        let openedMenuListsDom = document.querySelector('.openedMenuLists');
        if (openedMenuListsDom) {
            let openedMenuListsDomVue = openedMenuListsDom.__vue__;
            let handleClose = openedMenuListsDomVue.handleClose;
            let {
                enableOpenNewTab
            } = window.ProjectConfig;
            // 给关闭tab 界面添加清除历史记录事件
            let self = this;
            openedMenuListsDomVue.handleClose = function () {
                let {
                    openedMenuLists
                } = window.vm.$store.state.global;
                let clearParams = openedMenuLists[arguments[0]];
                let clearParamstableName = `${clearParams.tableName}/`;
                if (/C./.test(clearParams.keepAliveModuleName)) {
                    // 定制界面
                    clearParamstableName = `${clearParams.tableName}/${clearParams.tableId}`;
                }
                if (enableOpenNewTab) {
                    // 全都是新开界面
                    clearParamstableName = `${clearParams.tableName}/${clearParams.itemId}`;
                }
                let $R3_history_key = Object.keys($route.$R3_history || {});
                if ($R3_history_key) {
                    $R3_history_key.forEach((item) => {
                        if (new RegExp(clearParamstableName).test(item)) {
                            delete $route.$R3_history[item]
                        }
                    })
                }

                self.clearNav($route.currentRoute.path);
                handleClose.call(this, ...arguments);

            }
        }

        //
    }
    clearNav(url) {
        // 清除导航跳转来的记录
        let getHistoryData = JSON.parse(JSON.stringify(this.gethistory()));
        Object.keys(getHistoryData.nav || {}).forEach((key)=>{
                if(new RegExp(url).test(key)){
                    delete getHistoryData.nav[key]
                }
        });
        window.vm.$router.$R3_history.nav = getHistoryData.nav;
        window.localStorage.setItem('$R3_history_current', JSON.stringify( window.vm.$router.$R3_history));


    }
    clear($this) {
        // 清除所有历史记录
        $this.$R3_history = {};
        this.listener = false;
        window.localStorage.setItem('$R3_history_current', '{}');
    }
    setNavRouter($route,path){
        // 是否是导航跳转
        if (!$route.$R3_history || !$route.$R3_history.nav) {
            $route.$R3_history = {};
            $route.$R3_history.nav = {};
        }
        $route.$R3_history.nav[path] = path;
        window.localStorage.setItem('$R3_history_current', JSON.stringify($route.$R3_history));
    }
    exists(name) {
        // 是否存在是从功能清单跳转过来的菜单
        let getHistoryData = this.gethistory() || {};
        if (getHistoryData.nav && getHistoryData.nav[name]) {
            return true
        } else {
            return false;
        }

    }
    init() {
        this.router();
    }
}
export default RouterPush;