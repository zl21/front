import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import { STANDARD_TABLE_COMPONENT_PREFIX, MODULE_COMPONENT_NAME } from '../../constants/global';
import store from '../store.config';

const getComponentName = () => {
  const { tableName, tableId } = router.currentRoute.params;
  return `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
};

export default () => ({
  provide: { [MODULE_COMPONENT_NAME]: getComponentName() },
  mounted() {
    this.moduleComponentName = getComponentName();
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
   
  }
});