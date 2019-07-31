
function todoList(store) {
  createIcon(store);
}


function createIcon(store) {
  let data = store.state.global.navigatorSetting.concat([]);
  data = [{
    icon: 'iconmd-umbrella',
    callback: openTodoLists,
    count: 0
  }];
  store.commit('global/changeNavigatorSetting', data);
  setInterval(() => {
    pollBacklogData(store);
  }, 20000);
}
// 点击图标打开待办列表
function openTodoLists() {
  window.jflowPlugin.todoListsFun(true);
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
