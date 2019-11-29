import network, { urlSearchParams } from '../../../__utils__/network';
import { enableHistoryAndFavorite, enableInitializationRequest } from '../../../constants/global';

export default {
  getHistoryAndFavorite({ commit }) {
    if (enableInitializationRequest()) {
      network.post('/p/cs/getHistoryAndFavorite').then((res) => {
        const { history, favorite } = res.data.data;
        commit('updateHistoryAndFavorite', { history, favorite });
      });
    }
  },
  getMenuLists({ commit }) {
    if (enableInitializationRequest()) {
      network.post('/p/cs/getSubSystems').then((res) => {
        commit('updateMenuLists', res.data.data);
      });
    }
  },
  updateAccessHistory({ commit }, { type, id }) {
    if (enableHistoryAndFavorite()) {
      if (id === 'New') {
        id = '-1';
      }
      network.post('/p/cs/recHistory', urlSearchParams({ type, id })).then((res) => {
        commit('updateHistoryAndFavorite', { history: res.data.data });
      });
    }
  },
  
  getExportedState({ commit }, {
    objid, id, resolve, reject 
  }) { // 获取导出状态
    if (enableInitializationRequest()) {
      const times = 2;// 循环的次数
      let index = 0;// 当前次数
      let timer = 0;// 定时器
      const exportTask = {};

      timer = setInterval(() => {
        index++;
        if (index > times) {
          clearInterval(timer);
        } else {
          network.post('/p/cs/getObject', urlSearchParams({ table: 'CP_C_TASK', objid })).then((res) => {
            const data = res.data;
            if (data.code === 0) { 
              // 筛选信息验证导出是否成功
              data.data.addcolums.filter(item => item.parentdesc === '基本信息')[0].childs.forEach((b) => {
                if (b.colname === 'TASKSTATE') {
                  if (b.valuedata === '2') {
                    exportTask.exportedState = true;
                    clearInterval(timer);
                    resolve();
                    exportTask.successMsg = true;
                    commit('updateExportedState', exportTask);
                  } else {
                    if (index === times) { // 已轮询4次之后，到我的任务查看
                      exportTask.dialog = true;
                      clearInterval(timer);
                      resolve();
                      commit('updateExportedState', exportTask);
                    }
                    exportTask.exportedState = false;
                  }
                } else if (b.colname === 'URL') {
                  exportTask.file = b.valuedata; 
                } else if (b.colname === 'CONTENT') {
                  exportTask.resultMsg = b.valuedata; 
                }
              });
              if (exportTask.exportedState) { // 导出成功执行以下逻辑
                network.post('/p/cs/ignoreMsg', urlSearchParams({ id })).then((r) => {
                  const datas = r.data;
                  if (datas.code === 0) { 
                    if (exportTask.resultMsg.indexOf('{') >= 0) {
                      exportTask.resultMsg = JSON.parse(exportTask.resultMsg);
                      if (exportTask.resultMsg.code === 0) {
                        if (exportTask.file) {
                          exportTask.file = JSON.parse(exportTask.file);
                          const eleLink = document.createElement('a');
                          eleLink.download = 'download';
                          eleLink.style.display = 'none';
                          eleLink.href = exportTask.file[0].url;
                          document.body.appendChild(eleLink);
                          eleLink.click();
                          document.body.removeChild(eleLink);
                        }
                      } else {
                        const errorList = [];
                        if (exportTask.file) {
                          exportTask.file = JSON.parse(exportTask.file);
                          errorList.push({ message: `<a href="${exportTask.file[0].url}" download="download" style="color: #0F8EE9">${exportTask.resultMsg.message}（下载报错信息）</a>` });
                        } else {
                          errorList.push({ message: exportTask.resultMsg.message });
                        }
                
                        if (exportTask.resultMsg.data !== undefined && exportTask.resultMsg.data.length > 0) {
                          for (const msg of exportTask.resultMsg.data) {
                            if (msg.hasOwnProperty('rowIndex')) {
                              errorList.push({ message: `第${msg.rowIndex}条记录报错：${msg.message}` });
                            } else {
                              errorList.push({ message: msg.message });
                            }
                          }
                        }
                        const contents = {
                          mask: true,
                          title: '警告',
                          content: errorList
                        };
                        this.$Modal.fcWarning(contents);
                      }
                    } else if (exportTask.file) {
                      exportTask.file = JSON.parse(exportTask.file);
                      const eleLink = document.createElement('a');
                      eleLink.download = 'download';
                      eleLink.style.display = 'none';
                      eleLink.href = exportTask.file[0].url;
                      document.body.appendChild(eleLink);
                      eleLink.click();
                      document.body.removeChild(eleLink);
                    } else {
                      exportTask.successMsg = true;
                      commit('updateExportedState', exportTask);
                      resolve();
                    }
                  }
                });
              }
            } 
          });
        }
      }, 1000);
    }
  },
  updataTaskMessageCount({ commit }, id) { // 更新我的任务数量
    network.post('/p/cs/ignoreMsg', urlSearchParams({ id })).then((res) => {
      const datas = res.data;
      if (datas.code === 0) { 
        commit('updateIgnoreMsg');
      }
    });
  },
   
  getTaskMessageCount({ commit }, userId) { // 获取我的任务数量
    network.post('/p/c/getMsgCnt', urlSearchParams({ userId })).then((res) => {
      if (res.data.code === 0) {
        commit('updateTaskMessageCount', res.data.data);
      }
    });
  }
 
};
