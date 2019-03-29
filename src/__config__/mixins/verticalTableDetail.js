import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import { VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX } from '../../constants/global';
// import store from '../store.config';
import tabComponent from '../../__component__/SingleObjectTabComponent';

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
      tabPanels: ({ tabPanels }) => {
        const arr = [];
        tabPanels.forEach((item) => {
          const obj = { ...item };
          obj.component = tabComponent;
          arr.push(obj);
        });
        return arr;
      }
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
