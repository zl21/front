<template>
  <div class="r3-tab-nav">
    <div
      v-for="(item, index) in data.multi_tab"
      :id="`tab_${index}`"
      :key="index"
      class="r3-tab-item"
      :class="[index === currentIndex? 'r3-active-item' : '']"
      @click="tabClick(index, item.tab_name,item.tab_value)"
    >
      {{ item.tab_name }}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'TabBar',
    props: {
      data: {
        type: Object,
        default: () => {}
      },

    },
    data() {
      return {
        currentIndex: 0
      };
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
  padding: 8px 8px 0;
  margin-top: 20px;
}
  .r3-tab-item {
    border-radius: 4px 4px 0 0;
    font-size: 12px;
    font-weight: bold;
    color: @primary-color;
    background:#f5f7f7;
    padding: 0 14px;
    height: 25px;
    line-height: 25px;
    cursor: pointer;
    &.r3-active-item {
      background: @primary-color;
      color: #f5f7f7;
    }
  }
</style>
