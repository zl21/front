import actions from '../actions/horizontalTableDetail.actions';
import mutations from '../mutations/horizontalTableDetail.mutations';

export default () => ({
  namespaced: true,
  state: {
    tabPanels: [], // tab数据
    tabCurrentIndex: 0, // 当前tab下标
  },
  actions,
  mutations
});
