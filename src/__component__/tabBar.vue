<template>
  <div :class="classes">
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
  import { classFix } from '../constants/global';

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
      classes () {
        return [
          `${classFix}TabBar`,
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

<style lang="less" scoped>
@import url('../assets/theme/custom.less');
.r3-tab-nav {
  display: flex;
  background: #f5f7f7;
  margin-top: 20px;
}
</style>
