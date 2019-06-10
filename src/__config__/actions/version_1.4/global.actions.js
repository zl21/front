import network, { urlSearchParams } from '../../../__utils__/network';

export default {
  getHistoryAndFavorite({ commit }) {
    network.post('/p/cs/getHistoryAndFavorite').then((res) => {
      const { history, favorite } = res.data.data;
      commit('updateHistoryAndFavorite', { history, favorite });
    });
  },
  getMenuLists({ commit }) {
    network.post('/p/cs/getSubSystems').then((res) => {
      commit('updateMenuLists', res.data.data);
    });
  },
  updateAccessHistory({ commit }, { type, id }) {
    network.post('/p/cs/recHistory', urlSearchParams({ type, id })).then((res) => {
      commit('updateHistoryAndFavorite', { history: res.data.data });
    });
  },
};
