import network, { urlSearchParams, GetTableName } from '../../../__utils__/network';
import { enableHistoryAndFavorite, enableInitializationRequest, getTouristRoute } from '../../../constants/global';
import { removeSessionObject } from '../../../__utils__/sessionStorage';
import router from '../../router.config';

export default {
  getHistoryAndFavorite({ commit }) {
    if (enableInitializationRequest()) {
      network.post('/p/cs/getHistoryAndFavorite').then((res) => {
        if (res.data && res.data.data) {
          const { history, favorite } = res.data.data;
          commit('updateHistoryAndFavorite', { history, favorite });
        }
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
      const times = 4;// 循环的次数
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
                  } else if (b.valuedata === '3') { // 异常终止
                    exportTask.exportedState = true;
                    clearInterval(timer);
                    // reject();
                    commit('updateExportedState', exportTask);
                  } else {
                    if (index === times) { // 已轮询4次之后，到我的任务查看
                      // exportTask.exportedState = true;
                      exportTask.dialog = true;
                      clearInterval(timer);
                      commit('updateExportedState', exportTask);
                      resolve();
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
                          const file = JSON.parse(exportTask.file);
                          // exportTask.file = JSON.parse(JSON.stringify(file));
                          const eleLink = document.createElement('a');
                          eleLink.download = 'download';
                          eleLink.style.display = 'none';
                          eleLink.href = file[0].url;
                          document.body.appendChild(eleLink);
                          eleLink.click();
                          document.body.removeChild(eleLink);
                        }
                      } else {
                        const errorList = [];
                        if (exportTask.file) {
                          reject();
                          // exportTask.file = JSON.parse(exportTask.file);

                          const file = JSON.parse(exportTask.file);
                          // exportTask.file = JSON.parse(JSON.stringify(file));
                          errorList.push({ message: `<a href="${file[0].url}" download="download" style="color: #0F8EE9">${exportTask.resultMsg.message}（下载报错信息）</a>` });
                        } else if (!exportTask.file) {
                          const message = JSON.stringify(exportTask.resultMsg);
                          window.vm.$Modal.fcError({
                            mask: true,
                            titleAlign: 'center',
                            title: '错误',
                            render: h => h('div', {
                              style: {
                                padding: '10px 20px 0',
                                display: 'flex',
                                lineHeight: '16px'
                              }
                            }, [
                              
                              h('i', {
                                props: {
                                },
                                style: {
                                  marginRight: '5px',
                                  display: 'inline-block',
                                  'font-size': '28px',
                                  'margin-right': ' 10px',
                                  'line-height': ' 1',
                                  padding: ' 10px 0',
                                  color: 'red'
                                },
                                class: 'iconfont iconbj_error fcError '
                              }),
                              h('div', {
                                style: `width: 80%;
                                    margin: 1px;
                                    margin-bottom: -8px;
                                    box-sizing: border-box;
                                    padding: 5px;
                                    resize: none;
                                    max-height: 100px;
                                    max-width: 300px;
                                    overflow: auto;
                                    `
                              }, message)
                            ])
                          });
                          commit('updateExportedState', exportTask);
                          reject();
                          return;
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
                        window.vm.$Modal.fcError({
                          mask: true,
                          titleAlign: 'center',
                          title: '错误',
                          render: h => h('div', {
                            style: {
                              padding: '10px 20px 0',
                              display: 'flex',
                              lineHeight: '16px'
                            }
                          }, [
                            
                            h('i', {
                              props: {
                              },
                              style: {
                                marginRight: '5px',
                                display: 'inline-block',
                                'font-size': '28px',
                                'margin-right': ' 10px',
                                'line-height': ' 1',
                                padding: ' 10px 0',
                                color: 'red'
                              },
                              class: 'iconfont iconbj_error fcError '
                            }),
                            h('div', {
                              style: `width: 80%;
                                  margin: 1px;
                                  margin-bottom: -8px;
                                  box-sizing: border-box;
                                  padding: 5px;
                                  resize: none;
                                  max-height: 100px;
                                  max-width: 300px;
                                  overflow: auto;
                                  `
                            }, [
                           
                              h('a', {
                                style: {
                                },
                                domProps: {
                                  innerHTML: errorList.length > 0 ? errorList[0].message : ''
                                }
                              },),
                              h('div', {
                                domProps: {
                                  innerHTML: errorList.length > 1 ? errorList[1].message : ''
                                }
                              }),
                              h('div', {
                                domProps: {
                                  innerHTML: errorList.length > 2 ? errorList[2].message : ''
                                }
                              },)
                            ])
                          ])
                        });
                      }
                    } else if (exportTask.file) {
                      // exportTask.file = JSON.parse(exportTask.file);
                      const file = JSON.parse(exportTask.file);
                      // exportTask.file = JSON.parse(JSON.stringify(file));

                      const eleLink = document.createElement('a');
                      eleLink.download = 'download';
                      eleLink.style.display = 'none';
                      eleLink.href = file[0].url;
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
            } else {
              reject();
            }
          });
        }
      }, 1000);
    }
  },
  updataTaskMessageCount({ commit }, { id, stopUpdataQuantity }) { // 更新我的任务数量
    network.post('/p/cs/ignoreMsg', urlSearchParams({ id })).then((res) => {
      const datas = res.data;
      if (datas.code === 0) { 
        if (!stopUpdataQuantity) {
          commit('updateIgnoreMsg');
        }
      }
    });
  },
   
  getTaskMessageCount({ commit }, userId) { // 获取我的任务数量
    network.post('/p/c/getMsgCnt', urlSearchParams({ userId })).then((res) => {
      if (res.data.code === 0) {
        commit('updateTaskMessageCount', res.data.data);
      }
    });
  },
  signout({ commit }) {
    network
      .get('/p/cs/logout')
      .then(() => {
        window.sessionStorage.setItem('loginStatus', false);
        commit('emptyTabs');
        router.push({ path: getTouristRoute() });
        removeSessionObject('saveNetwork');
        GetTableName('');
        commit('updataUserInfoMessage', {});
        window.localStorage.removeItem('userInfo');
        commit('updateJflowControlField', []);
        // 清空updataTreeId
        removeSessionObject('TreeId');
        commit('updateTreeTableListData', []);
      })
      .catch(() => {
        window.sessionStorage.setItem('loginStatus', false);
        commit('emptyTabs');
        commit('updataUserInfoMessage', {});
        router.push({ path: getTouristRoute() });
        removeSessionObject('saveNetwork');
        GetTableName('');
        commit('updataUserInfoMessage', {});
        window.localStorage.removeItem('userInfo');
        commit('updateJflowControlField', []);
        // 清空updataTreeId
        removeSessionObject('TreeId');
        commit('updateTreeTableListData', []);
      });
  },
 
};
