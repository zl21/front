<template>
  <div>
    <tab-panels type="line" :tabMarginLeft="20" :tabPanels="tabPanels"></tab-panels>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import tabComponent from './SingleObjectTabComponent';

  export default {
    data() {
      return {
      };
    },
    computed: {
      ...mapState('global', {
        favorite: ({ favorite }) => favorite,
        activeTab: ({ activeTab }) => activeTab
      }),
      tabPanels() {
        const arr = [];
        this.tabPanel.forEach((item, index) => {
          const obj = { ...item };
          if (index === 0) {
            obj.label = this.activeTab.label;
          }
          obj.component = tabComponent;
          obj.cilckCallback = this.tabClick;
          arr.push(obj);
        });
        return arr;
      }
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      tabClick(index, name, instance) {
        console.log(index, name, instance);
      }
    },
    activated() {

    },
    mounted() {
    },
    created() {
      const { tableName, itemId } = this.$route.params;
      this.getObjectForMainTableForm({ table: tableName, objid: itemId });
      this.getObjectTabForMainTable({ table: tableName, objid: itemId });
    }
  };
</script>

<style scoped>

</style>
