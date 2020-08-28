import Vue from 'vue';
import Vuex from 'vuex';
import global from './store/global.store';
// import globalstore from './store/customizeGlobal';

Vue.use(Vuex);


const store = new Vuex.Store({
  strict: true,
  modules: {
    global: global(),
    // customize: globalstore

  }
});

window.VueStore = store;

export default store;
