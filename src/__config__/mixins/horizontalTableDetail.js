// import { mapState, mapActions, mapMutations } from 'vuex';
import { mapActions, mapMutations, mapState } from 'vuex';
import router from '../router.config';
import { HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX } from '../../constants/global';
// import store from '../store.config';

const getComponentName = () => {
  const { tableName, tableId, itemId } = router.currentRoute.params;
  return `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
};

export default () => ({
  mounted() {
    this.moduleComponentName = getComponentName();
  },
  computed: {
    ...mapState(getComponentName(), {
      tabPanel: ({ tabPanels }) => tabPanels
    })
  },
  methods: {
    ...mapActions(getComponentName(),
      [
        'getObjectTabForMainTable',
        'getObjectForMainTableForm',
        'getObjectTabForChildTableButtons',
        'getInputForitemForChildTableForm',
        'getItemObjForChildTableForm',
        'getObjectTableItemForTableData'
      ]),
    ...mapMutations(getComponentName(),
      [
        'updateTabCurrentIndex'
      ]),
  },
});
