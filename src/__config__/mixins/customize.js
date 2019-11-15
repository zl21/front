import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import { CUSTOMIZED_MODULE_COMPONENT_PREFIX, MODULE_COMPONENT_NAME, INSTANCE_ROUTE } from '../../constants/global';
import store from '../store.config';

const getComponentName = () => {
  const { customizedModuleName, customizedModuleId } = router.currentRoute.params;
  return `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
};

export default () => ({
  provide: {
    [MODULE_COMPONENT_NAME]: getComponentName(),
    [INSTANCE_ROUTE]: router.currentRoute.fullPath
  },
  created() {
    this[MODULE_COMPONENT_NAME] = getComponentName();
  },
  
  mounted() {
    // this.moduleComponentName = getComponentName();
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
  }
});
