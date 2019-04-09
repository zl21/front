import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import { VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX } from '../../constants/global';
import store from '../store.config';

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
      tabPanel: ({ tabPanels }) => tabPanels,
      tabCurrentIndex: ({ tabCurrentIndex }) => tabCurrentIndex,
    }),

  },
  methods: {
    ...mapActions(getComponentName(),
      [
        'getObjectForMainTableForm',
        'getObjectTabForMainTable',
        'getObjectTableItemForTableData',
        'getFormDataForRefTable',
        'getObjectTabForRefTable',
        'getItemObjForChildTableForm'
      ]),
    ...mapMutations(getComponentName(),
      [
        'updateTabCurrentIndex',
        'updateDefaultData',
        'updateAddData',
        'updateModifyData',
        'updateDeleteData',
        'updateCheckedInfoData',
        'updatePanelData'
      ]),
  },
  // beforeDestroy() {
  //   store.unregisterModule(this.moduleComponentName);
  // }
});
