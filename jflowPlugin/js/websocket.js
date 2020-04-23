// 处理协同操作以及待办
import { global, globalChange } from '../utils/global.config';
import { BacklogData } from './todoList';

let websock = null; // websocket实例

function websocketonerror(e) { // 连接建立失败重连
  console.log('连接建立失败', e);
  websocketInit();
}

function websocketonmessage(e) { // 数据接收
  const redata = JSON.parse(e.data);
  console.log(redata);
  BacklogData(redata.data.count);
}

function websocketclose(e) { // 关闭
  console.log('断开连接', e);
}

function websocketonopen() { // 打开时发送数据
  const actions = {
    page: 1, 
    pageSize: 10, 
    searchType: '0,1', 
    excuStatus: 0, 
    isPoll: true, 
    userId: 893
  };
  websocketsend(JSON.stringify(actions));
}

function websocketsend(Data) { // 数据发送
  websock.send(Data);
}

function websocketInit() {
  if (global.localIp && global.userInfo) {
    const wsuri = 'ws://172.18.34.203:18081/upcoming/user';
    websock = new WebSocket(wsuri);
    websock.onmessage = websocketonmessage;
    websock.onopen = websocketonopen;
    websock.onerror = websocketonerror;
    websock.onclose = websocketclose;
  }
}


export default websocketInit;
