import network from '../utils/network';
import { global } from '../utils/global.config';

// 点击图标打开待办列表
function openTodoLists() {
  window.vm.$router.push({
    path: '/PLUGIN/INSTANCEMANAGEMENTLIST'
  });
}

function pollBacklogData(total) {
  if (total === undefined) {
    network.post('/jflow/p/cs/task/poll', {
      page: 1, pageSize: 10, searchType: '0,1', excuStatus: 0, isPoll: true, userId: global.userInfo.id
    }).then((res) => {
      if (res.data.resultCode === 0 && res.data.data.count > 0) {
        const data = [{
          id: 'jflow',
          icon: 'iconlogo-jflow',
          callback: openTodoLists,
          count: res.data.data.count 
        }];
        window.changeNavigatorSetting(data);
      } else {
        const data = [{
          id: 'jflow',
          icon: 'iconlogo-jflow',
          callback: openTodoLists,
          count: 0
        }];
        window.changeNavigatorSetting(data);
      }
    });
  } else {
    const data = [{
      id: 'jflow',
      icon: 'iconlogo-jflow',
      callback: openTodoLists,
      count: total 
    }];
    window.changeNavigatorSetting(data);
  }
}

function createIcon() {
  const data = [{
    id: 'jflow',
    icon: 'iconlogo-jflow',
    callback: () => {
      openTodoLists();
    },
    count: 0
  }];
  window.changeNavigatorSetting(data);
  pollBacklogData();
  setInterval(() => {
    pollBacklogData();
  }, 100000);
}


export const BacklogData = pollBacklogData;

function todoList() {
  const timer = setInterval(() => {
    if (global.userInfo && global.userInfo.id) {
      createIcon();
      clearInterval(timer);
    }
  }, 10);
}

export default todoList;
