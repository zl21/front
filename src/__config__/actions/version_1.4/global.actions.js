import network, { urlSearchParams, GetTableName } from '../../../__utils__/network';
import {
  enableHistoryAndFavorite, enableInitializationRequest, getTouristRoute, enableGateWay, Version, getGatewayValue, messageSwitch 
} from '../../../constants/global';
import { removeSessionObject } from '../../../__utils__/sessionStorage';
// import window.vm.$router.from '../../router.config';
import i18n from '../../../assets/js/i18n';

export default {
  getHistoryAndFavorite({ commit }) {
    if (enableInitializationRequest() && enableHistoryAndFavorite()) {
      network.post('/p/cs/getHistoryAndFavorite').then((res) => {
        if (res.data && res.data.data) {
          const { history, favorite } = res.data.data;
          setTimeout(()=>{
            commit('updateHistoryAndFavorite', { history, favorite });
          },200)
        }
      });
    }
  },
  async getMenuLists({ commit }) {
    if (enableInitializationRequest()) {
      console.log('测试');
      await network.post('/p/cs/getSubSystems').then((res) => {
        commit('updateMenuLists', res.data.data);
      });
    }
  },
  updateAccessHistory({ commit, state }, { type, id }) {
    // 过滤表的配置
    let name = window.vm.$router.currentRoute.params.tableName || window.vm.$router.currentRoute.params.customizedModuleName || window.vm.$router.currentRoute.params.pluginModuleName || window.vm.$router.currentRoute.params.linkModuleName;
      if(window.ProjectConfig.filterHistory && window.ProjectConfig.filterHistory.includes(name)){
        return;
      }
    if (enableHistoryAndFavorite()) {
      if (id === 'New') {
        id = '-1';
      }
      network.post('/p/cs/recHistory', urlSearchParams({ type, id })).then((res) => {
        setTimeout(()=>{
          commit('updateHistoryAndFavorite', { history: res.data.data });
        },200)
       
      });
    }
  },
  getExportedState({ commit }, {
    objid, id, resolve, reject 
  }) { // 获取导出状态
    if (enableInitializationRequest()) {
      const times = 5;// 循环的次数
      let index = 0;// 当前次数
      let timer = 0;// 定时器
      const exportTask = {};

      timer = setInterval(() => {
        index++;
        if (index > times) {
          clearInterval(timer);
        } else {
          network.post('/p/cs/getObject', urlSearchParams({ table: 'U_NOTE', objid }), {
            serviceId: enableGateWay() ? getGatewayValue('U_NOTE') : ''
          }).then((res) => {
            const data = res.data;
            // resolve();
            if (data.code === 0) { 
              // 筛选信息验证导出是否成功
              const baseInfo = data.data.addcolums.filter(item => item.parentdesc === '基础信息')
              const addcolum = baseInfo.length > 0 ? baseInfo[0].childs : [];
              addcolum.forEach((b) => {
                if (b.colname === 'TASK_STATE') {
                  if (b.valuedata === '2') {
                    exportTask.exportedState = true;
                    clearInterval(timer);
                    // resolve();
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
                } else if (b.colname === 'FILE_URL') {
                  exportTask.file = b.valuedata; 
                } else if (b.colname === 'MESSAGE') {
                  exportTask.resultMsg = b.valuedata; 
                }
              });
              if (exportTask.exportedState) { // 导出成功执行以下逻辑
                let obj = { objId: id };
                obj.id = obj.objId;
                network.post('/p/cs/u_note/ignoreMsg', obj, {
                  serviceId: enableGateWay() ? 'asynctask' : ''
                }).then((r) => {
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
                          const serviceId = window.localStorage.getItem('serviceId')
                          eleLink.href = serviceId ? `/${serviceId}${file[0].url}` : file[0].url;
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
                            title: i18n.t('feedback.error'),
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
                              errorList.push({ message: `${i18n.t('messages.recordError',{num:msg.rowIndex})}：${msg.message}` });
                            } else {
                              errorList.push({ message: msg.message });
                            }
                          }
                        }
                        window.vm.$Modal.fcError({
                          mask: true,
                          titleAlign: 'center',
                          title: i18n.t('feedback.error'),
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
                      const serviceId = window.localStorage.getItem('serviceId')
                      eleLink.href = serviceId ? `/${serviceId}${file[0].url}` : file[0].url;
                      document.body.appendChild(eleLink);
                      eleLink.click();
                      document.body.removeChild(eleLink);
                    } else {
                      exportTask.successMsg = true;
                      commit('updateExportedState', exportTask);
                      resolve();
                    }
                  }
                }).finally(() => {
                  resolve();
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
    const obj = Version() === '1.3' ? urlSearchParams({ id }) : { objId: id };
    obj.id = obj.objId;
    network.post(Version() === '1.3' ? '/p/cs/ignoreMsg' : '/p/cs/u_note/ignoreMsg', obj, {
      serviceId: enableGateWay() ? 'asynctask' : ''
    }).then((res) => {
      const datas = res.data;
      if (datas.code === 0) { 
        if (!stopUpdataQuantity) {
          commit('updateIgnoreMsg');
        }
      }
    });
  },
  getTaskMessageCount({ commit }, userId) { // 获取我的任务数量
    if (!messageSwitch()) {
      return;
    }
    network.post(Version() === '1.3' ? '/p/c/getMsgCnt' : '/p/c/u_note/getMsgCnt', urlSearchParams({ userId }), {
      serviceId: enableGateWay() ? 'asynctask' : ''
    }).then((res) => {
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
        window.localStorage.setItem('loginStatus', false);
  
        commit('emptyTabs');
        removeSessionObject('saveNetwork');
        GetTableName('');
        commit('updataUserInfoMessage', {});
        window.localStorage.removeItem('userInfo');
        window.localStorage.removeItem('sessionCookie');
        window.localStorage.removeItem('serviceIdMap');
      
        // 清空updataTreeId
        removeSessionObject('TreeId');
        removeSessionObject('routeMapRecordForCustomizePages');
        commit('updateTreeTableListData', []);
        // 清除plug
        removeSessionObject('dynamicRoutingIsBackForDelete');
        removeSessionObject('dynamicRoutingIsBack');
        removeSessionObject('keepAliveLabelMapsAll');
        window.vm.$router.push({ path: getTouristRoute() });
      })
      .catch(() => {
        window.sessionStorage.setItem('loginStatus', false);
        window.localStorage.setItem('loginStatus', false);

        commit('emptyTabs');
        commit('updataUserInfoMessage', {});
        removeSessionObject('saveNetwork');
        GetTableName('');
        commit('updataUserInfoMessage', {});
        window.localStorage.removeItem('userInfo');
        // 清空updataTreeId
        removeSessionObject('TreeId');
        commit('updateTreeTableListData', []);
        removeSessionObject('routeMapRecordForCustomizePages');
        removeSessionObject('keepAliveLabelMapsAll');
        window.vm.$router.push({ path: getTouristRoute() });
      });
  }
  
};
