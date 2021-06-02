import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import {
  CUSTOMIZED_MODULE_COMPONENT_PREFIX, MODULE_COMPONENT_NAME, INSTANCE_ROUTE, INSTANCE_ROUTE_QUERY 
} from '../../constants/global';
import store from '../store.config';

const getComponentName = () => {
  const { customizedModuleName, customizedModuleId } = router.currentRoute.params;
  return `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
};

export default () => ({
  provide: {
    [MODULE_COMPONENT_NAME]: getComponentName(),
    [INSTANCE_ROUTE]: router.currentRoute.fullPath,
    [INSTANCE_ROUTE_QUERY]: router.currentRoute.params,
  },
  created() {
    if (!this[MODULE_COMPONENT_NAME]) {
      this[MODULE_COMPONENT_NAME] = getComponentName();
    }
    if (!this[INSTANCE_ROUTE]) {
      this[INSTANCE_ROUTE] = router.currentRoute.fullPath;
    }
    if (!this[INSTANCE_ROUTE_QUERY]) {
      this[INSTANCE_ROUTE_QUERY] = router.currentRoute.params;
    }
  },
  mounted() {
  },
  activated() {
    const { customizedModuleId } = this.$route.params;
    this.updateAccessHistory({ type: 'action', id: customizedModuleId });
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
        store.unregisterModule(this.moduleComponentName);
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
