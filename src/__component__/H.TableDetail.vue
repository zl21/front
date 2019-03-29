<template>
  <div>
    <tab-panels type="line" :tabMarginLeft="20" :tabPanels="tabPanels"></tab-panels>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    data() {
      return {
      };
    },
    computed: {
      ...mapState('global', {
        favorite: ({ favorite }) => favorite
      }),
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory'])
    },
    activated() {

    },
    created() {
      console.log('created');
      const { tableName, itemId } = this.$route.params;
      this.getObjectForMainTableForm({ table: tableName, objid: itemId });
      this.getObjectTabForMainTable({ table: tableName, objid: itemId });
    }
  };
</script>

<style scoped>

</style>
