import store from './store.config';
import router from './router.config';
import { STANDARD_TABLE_LIST_PREFIX, STANDARD_SINGLE_OBJECT_PREFIX } from '../constants/global';

export const hideMenu = () => {
  document.body.addEventListener('click', () => {
    store.commit('global/hideMenu');
  });
};

export const routeTo = (data) => {
  store.commit('global/hideMenu');
  switch (data.type) {
    case 'table':
      router.push({
        path: `${STANDARD_TABLE_LIST_PREFIX}/${data.value}/${data.id}`,
      });
      break;
    default:
      router.push({
        path: `${STANDARD_SINGLE_OBJECT_PREFIX}`,
      });
      break;
  }
};

export default { hideMenu, routeTo };
