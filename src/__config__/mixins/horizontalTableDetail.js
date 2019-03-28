// import { mapState, mapActions, mapMutations } from 'vuex';
import { mapActions, mapMutations, mapState } from 'vuex';
import router from '../router.config';
import { HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX } from '../../constants/global';
import store from '../store.config';

import tabComponent from '../../__component__/SingleObjectTabComponent';

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
      tabPanels: ({ tabPanels }) => {
        const { activeTab } = store.state.global;
        const arr = [];
        tabPanels.forEach((item, index) => {
          const obj = { ...item };
          if (index === 0) {
            obj.label = activeTab.label;
          }
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
        'getObjectTabForMainTable',
        'getObjectForMainTableForm'
      ]),
    ...mapMutations(getComponentName(),
      []),
  },
});
