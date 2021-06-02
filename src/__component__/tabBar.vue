<template>
  <div class="r3-tab-nav">
    <Tabs
      ref="R3_Tabs"
      type="card"
      :value="currentIndex"
      @on-click="tabClick"
    >
      <TabPane
        v-for="(item, index) in data.multi_tab"
        :key="index"
        :label="item.tab_name"
      />
    </Tabs>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'TabBar',
    props: {
      data: {
        type: Object,
        default: () => { }
      },

    },
    data() {
      return {
        currentIndex: 0,
        lastIndex: null
      };
    },
    computed: {
      classes() {
        return [
          'r3-tab-nav',
        ];
      },
    },
    methods: {
      tabClick(index) {
        this.currentIndex = index;
        this.$emit('tabClick', {
          data: this.data.multi_tab[index],
          index
        });
      },
    },
  };
</script>

