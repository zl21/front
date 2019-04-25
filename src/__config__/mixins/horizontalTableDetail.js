
import { mapActions, mapMutations, mapState } from 'vuex';
import getComponentName from '../../__utils__/getModuleName';

export default () => ({
  mounted() {
    this.moduleComponentName = getComponentName();
  },
  computed: {
    ...mapState(getComponentName(), {
      tabPanel: ({ tabPanels }) => tabPanels,
      tabCurrentIndex: ({ tabCurrentIndex }) => tabCurrentIndex,
      updateData: ({ updateData }) => updateData,
      childTableNames: ({ tabPanels }) => tabPanels.reduce((acc, cur, idx) => {
          if (idx > 0) {
            acc.push({ tableName: cur.tablename });
          }
          return acc;
        }, []),
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
        'getObjectTableItemForTableData',
        'performMainTableSaveAction',
        'performMainTableDeleteAction'
      ]),
    ...mapMutations(getComponentName(),
      [
        'updateTabCurrentIndex',
      ]),
  },
});
