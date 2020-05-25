
import store from '../store.config';
import router from '../router.config';


export const singlePageNetworkConfig = () => {
  // urlArray内的接口需要重置数据
  const { tableId } = router.currentRoute.params;
  return store.state.global.JflowControlField.filter(item => item.tableId === tableId);
};

export default singlePageNetworkConfig;
