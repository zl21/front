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
  updateAccessHistory({ commit, state }, { type, id }) {
    if (enableHistoryAndFavorite()) {
      if (id === 'NEW') {
        id = '-1';
      }
      network.post('/p/cs/recHistory', urlSearchParams({ type, id })).then((res) => {
        commit('updateHistoryAndFavorite', { history: res.data.data });
      });
    }
  },
};
