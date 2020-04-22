import network from '../utils/network';
import { global } from '../utils/global.config';

// 点击图标打开待办列表
function openTodoLists() {
  // const obj = {
  //   orignalType: 'table', realMenuId: 'D_M_566', menuId: 566, id: 10057, label: '待办列表', serviceId: 'ad-app', type: 'table', value: 'GROUPS', dataSource: null, url: null
  // };
  // const { type, value, id } = obj;
  // routeTo({ type, info: { tableName: value, tableId: id } });
  window.vm.$router.push({
    path: '/PLUGIN/INSTANCEMANAGEMENTLIST'
  });
}

function pollBacklogData(total) {
  // network.post('/jflow/p/cs/task/backlog/list', {
  //   page: 1, pageSize: 10, searchType: '0,1', excuStatus: 0, isPoll: true, userId: global.userInfo.id
  // }).then((res) => {
  //   if (res.data.resultCode === 0 && res.data.data.total > 0) {
  //     const data = [{
  //       id: 'jflow',
  //       icon: 'iconlogo-jflow',
  //       callback: openTodoLists,
  //       count: res.data.data.total 
  //     }];
  //     window.changeNavigatorSetting(data);
  //   } else {
  //     const data = [{
  //       id: 'jflow',
  //       icon: 'iconlogo-jflow',
  //       callback: openTodoLists,
  //       count: 0
  //     }];
  //     window.changeNavigatorSetting(data);
  //   }
  // });
  const data = [{
    id: 'jflow',
    icon: 'iconlogo-jflow',
    callback: openTodoLists,
    count: total 
  }];
  window.changeNavigatorSetting(data);
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
  createIcon();
}

export default todoList;
