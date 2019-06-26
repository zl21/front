import Vue from 'vue';
import Vuex from 'vuex';
import global from './store/global.store';

Vue.use(Vuex);


const store = new Vuex.Store({
  strict: true,
  modules: {
    global
  }
});

window.VueStore = store;

export default store;
