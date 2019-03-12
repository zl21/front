import actions from '../actions/standardTableList.actions';
import mutations from '../mutations/standardTableList.mutations';

export default () => ({
  namespaced: true,
  state: {
    ag: {
      datas: {},
    }
  },
  actions,
  mutations
});
