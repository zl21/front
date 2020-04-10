import network from '../utils/network';

let jflowRouter = {};

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

function pollBacklogData(store) {
  network.post('/jflow/p/cs/task/backlog/list', {
    page: 1, pageSize: 10, searchType: '0,1', excuStatus: 0, isPoll: true, userId: JSON.parse(window.localStorage.getItem('userInfo')).id
  }).then((res) => {
    if (res.data.resultCode === 0 && res.data.data.total > 0) {
      let data = store.state.global.navigatorSetting.concat([]);
      data = [{
        icon: 'iconlogo-jflow',
        callback: openTodoLists,
        count: res.data.data.total 
      }];
      window.changeNavigatorSetting(data);
    } else {
      let data = store.state.global.navigatorSetting.concat([]);
      data = [{
        icon: 'iconlogo-jflow',
        callback: openTodoLists,
        count: 0
      }];
      window.changeNavigatorSetting(data);
    }
  });
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


export const BacklogData = pollBacklogData;

function todoList(store, router) {
  jflowRouter = router;
  createIcon(store);
}

export default todoList;
