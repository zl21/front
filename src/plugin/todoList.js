
let jflowRouter = {};
function todoListInit(store, router) {
  jflowRouter = router;
  createIcon(store);
}


function createIcon(store) {
  let data = store.state.global.navigatorSetting.concat([]);
  data = [{
    icon: 'iconlogo-jflow',
    callback: () => {
      openTodoLists();
    },
    count: 0
  }];
  store.commit('global/changeNavigatorSetting', data);
  pollBacklogData(store);
  setInterval(() => {
    pollBacklogData(store);
  }, 100000);
}
// 点击图标打开待办列表
function openTodoLists() {
  // const obj = {
  //   orignalType: 'table', realMenuId: 'D_M_566', menuId: 566, id: 10057, label: '待办列表', serviceId: 'ad-app', type: 'table', value: 'GROUPS', dataSource: null, url: null
  // };
  // const { type, value, id } = obj;
  // routeTo({ type, info: { tableName: value, tableId: id } });
  jflowRouter.push({
    path: '/PLUGIN/INSTANCEMANAGEMENTLIST'
  });
}

function pollBacklogData() {
  window.jflowPlugin.axios.post('/jflow/p/cs/task/backlog/list', {
    page: 1, pageSize: 10, searchType: '0,1', excuStatus: 0, isPoll: true, userId: JSON.parse(window.localStorage.getItem('userInfo')).id
  }).then((res) => {
    if (res.data.resultCode === 0 && res.data.data.total > 0) {
      let data = window.jflowPlugin.store.state.global.navigatorSetting.concat([]);
      data = [{
        icon: 'iconlogo-jflow',
        callback: openTodoLists,
        count: res.data.data.total 
      }];
      window.jflowPlugin.store.commit('global/changeNavigatorSetting', data);
    } else {
      let data = window.jflowPlugin.store.state.global.navigatorSetting.concat([]);
      data = [{
        icon: 'iconlogo-jflow',
        callback: openTodoLists,
        count: 0
      }];
      window.jflowPlugin.store.commit('global/changeNavigatorSetting', data);
    }
  });
}

export const BacklogData = pollBacklogData;

export const todoList = todoListInit;
