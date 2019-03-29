import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import { VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX } from '../../constants/global';
// import store from '../store.config';

const getComponentName = () => {
  const { tableName, tableId, itemId } = router.currentRoute.params;
  return `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
};

export default () => ({
  mounted() {
    this.moduleComponentName = getComponentName();
  },
  computed: {
    ...mapState(getComponentName(), {
      mainFormInfo: ({ mainFormInfo }) => mainFormInfo,
      tabPanels: ({ tabPanels }) => tabPanels,
      activaRefFormInfo: ({ activaRefFormInfo }) => activaRefFormInfo,

    }),
    
  },
  methods: {
    ...mapActions(getComponentName(),
      [
        'getObjectForMainTableForm',
        'getObjectTabForMainTable'
      ]),
    ...mapMutations(getComponentName(),
      []),
  },
  beforeDestroy() {
    store.unregisterModule(this.moduleComponentName);
  }
});
