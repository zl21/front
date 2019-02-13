import store from './store.config';

export const hideMenu = () => {
  document.body.addEventListener('click', () => {
    store.commit('global/hideMenu');
  });
};
