<template>
  <div>
    <AgTable
      :pageAttribute="ag.pageAttribute"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import router from '../__config__/router.config';
  import AgTable from './StandardTable';
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';
  
  const { tableName, tableId } = router.currentRoute.params;
  const componentName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
  
  export default {
    components: {
      AgTable
    },
    computed: {
      ...mapState(componentName, {
        ag: ({ ag }) => ag
      })
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      ...mapActions(componentName, ['getQueryListForAg']),
    },
    activated() {
      this.getQueryListForAg();
      this.updateAccessHistory({ type: 'table', id: this.$route.params.tableId });
    }
  };
</script>
