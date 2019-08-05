
let jflowRouter = {};
function todoList(store, router) {
  jflowRouter = router;
  createIcon(store);
}


function createIcon(store) {
  let data = store.state.global.navigatorSetting.concat([]);
  data = [{
    icon: 'iconmd-umbrella',
    callback: () => {
      openTodoLists();
    },
    count: 0
  }];
  store.commit('global/changeNavigatorSetting', data);
  setInterval(() => {
    pollBacklogData(store);
  }, 20000);
}
// 点击图标打开待办列表
function openTodoLists() {
  // const obj = {
  //   orignalType: 'table', realMenuId: 'D_M_566', menuId: 566, id: 10057, label: '待办列表', serviceId: 'ad-app', type: 'table', value: 'GROUPS', dataSource: null, url: null
  // };
  // const { type, value, id } = obj;
  // routeTo({ type, info: { tableName: value, tableId: id } });
  jflowRouter.push({
    path: '/InstanceManagementList'
  });
  // window.jflowPlugin.todoListsFun(true);
}

function pollBacklogData(store) {
  window.jflowPlugin.axios.post('/jflow/p/cs/task/backlog/list', {
    page: 1, pageSize: 10, searchType: '0,1', excuStatus: 0, userId: window.jflowPlugin.userInfo.id
  }).then((res) => {
    if (res.data.resultCode === 0 && res.data.data.total > 0) {
      let data = store.state.global.navigatorSetting.concat([]);
      data = [{
        icon: 'iconmd-umbrella',
        callback: openTodoLists,
        count: res.data.data.total 
      }];
      store.commit('global/changeNavigatorSetting', data);
    } else {
      let data = store.state.global.navigatorSetting.concat([]);
      data = [{
        icon: 'iconmd-umbrella',
        callback: openTodoLists,
        count: 0
      }];
      store.commit('global/changeNavigatorSetting', data);
    }
  });
}


export default todoList;
