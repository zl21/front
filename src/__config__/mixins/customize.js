import { mapState, mapActions, mapMutations } from 'vuex';
// import router from '../window.vm.$router.config';
import {
  CUSTOMIZED_MODULE_COMPONENT_PREFIX, MODULE_COMPONENT_NAME, INSTANCE_ROUTE, INSTANCE_ROUTE_QUERY 
} from '../../constants/global';
// import store from '../window.vm.$store.config';

const getComponentName = () => {
  const { customizedModuleName, customizedModuleId } = window.vm.$router.currentRoute.params;
  return `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
};

export default () => ({
  provide: {
    [MODULE_COMPONENT_NAME]: getComponentName(),
    [INSTANCE_ROUTE]: window.vm.$router.currentRoute.fullPath,
    [INSTANCE_ROUTE_QUERY]: window.vm.$router.currentRoute.params,
  },
  created() {
    if (!this[MODULE_COMPONENT_NAME]) {
      this[MODULE_COMPONENT_NAME] = getComponentName();
    }
    if (!this[INSTANCE_ROUTE]) {
      this[INSTANCE_ROUTE] = window.vm.$router.currentRoute.fullPath;
    }
    if (!this[INSTANCE_ROUTE_QUERY]) {
      this[INSTANCE_ROUTE_QUERY] = window.vm.$router.currentRoute.params;
    }
  },
  mounted() {
  },
  activated() {
    const { customizedModuleId } = this.$route.params;
    if(customizedModuleId){
      this.updateAccessHistory({ type: 'action', id: customizedModuleId });
    }
  },
  methods: {
    ...mapActions('global',
      [
        'updateAccessHistory',
      ]),
    ...mapMutations(getComponentName(),
      [
        'updateAgConfig',
      ]),
  },
  computed: {
    ...mapState(getComponentName(), {
    }),
  },
  beforeDestroy() {
    try {
      if (this.$options.isKeepAliveModel) {
        window.vm.$store.unregisterModule(this.moduleComponentName);
      }
    } catch (e) {
      console.log(e);
    }
  },
  destroyed() {
    if (window.Vue) {
      if (this.$options.isKeepAliveModel) {
        delete window.Vue.options.components[this.$options._componentTag];
      }
    }
  }
});
