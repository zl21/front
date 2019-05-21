// import actions from '../actions/horizontalTableDetail.actions';
import mutations from '../mutations/horizontalTableDetail.mutations';
import { Version } from '../../constants/global';

const actions = require(`../actions/version_${Version}/horizontalTableDetail.actions`).default;


export default () => ({
  namespaced: true,
  state: {
    tabPanels: [], // tab数据
    tabCurrentIndex: 0, // 当前tab的index
    updateData: {}, // 更新的数据
    buttonsData: {
    },
    copy: false
  },
  actions,
  mutations
});
