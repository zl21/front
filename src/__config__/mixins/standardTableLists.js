import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import { STANDARD_TABLE_COMPONENT_PREFIX } from '../../constants/global';

const getComponentName = () => {
  const { tableName, tableId } = router.currentRoute.params;
  return `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
};

export default () => ({
  methods: {
    ...mapActions(getComponentName(),
      [
        'getQueryListForAg',
        'getTableQueryForForm',
        'getExportQueryForButtons',
        'getBatchDeleteForButtons',
        'getExeActionDataForButtons',
        'getToFavoriteDataForButtons',
        'getRemoveFavoriteDataForButtons',
        'importGetUploadParameters',
        'importGetUploadParametersForButtons'
      ]),
    ...mapMutations(getComponentName(),
      [
        'updateFormData',
        'updateFormLists',
        'updateDefaultButtonGroupData',
        'deleteTableData',
        'onSelectionChangedAssignment',
        'setActiveTabActionValue',
        'updateButtonExeActionData',
        'collectTablelist',
        'updateButtonSetFavoriteData',
        'setActiveTabActionValue',
        'setImportDialogTitle',
        'setErrorModalValue'
      ]),
  },
  computed: {
    ...mapState(getComponentName(), {
      ag: ({ ag }) => ag,
      pageAttribute: ({ ag }) => ({
        current: (ag.datas.start + ag.datas.defaultrange) / ag.datas.defaultrange,
        total: ag.datas.totalRowCount,
        'page-size-opts': ag.datas.selectrange,
        'show-elevator': true,
        'show-sizer': true,
        'show-total': true
      }),
      formItems: ({ formItems }) => formItems,
      buttons: ({ buttons }) => buttons
    }),
  },
});
