import Vue from 'vue';
import Vuex from 'vuex';
import global from './store/global';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  modules: {
    global
  }
});

export default store;
