import network, { urlSearchParams, GetTableName } from '../../../__utils__/network';
import {
  enableHistoryAndFavorite, enableInitializationRequest, getTouristRoute 
} from '../../../constants/global';
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
  updateAccessHistory({ commit, state }, { type, id }) {
    if (enableHistoryAndFavorite()) {
      if (id === 'New') {
        id = '-1';
      }
      network.post('/p/cs/recHistory', urlSearchParams({ type, id })).then((res) => {
        commit('updateHistoryAndFavorite', { history: res.data.data });
      });
    }
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
  }
  
};
