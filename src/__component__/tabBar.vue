<template>
  <div class="r3-tab-nav">
    <Tabs
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

<style lang="less">
@import url('../assets/theme/custom.less');
.r3-tab-nav {
  .ark-tabs-bar {
    margin-bottom: 0;
    border-bottom: none;
    width: 100%;
  }

  .ark-tabs-card {
    width: 100%;
  }

  .ark-tabs.ark-tabs-card > .ark-tabs-bar .ark-tabs-tab {
      background: #f5f7f7;
      color: @primary-color;
      border: none;
      line-height: 22px;
      width: auto;
      padding: 4px 20px;
      font-weight: bold;
      &:hover {
        color: @primary-color;
      }
      &:last-child {
        border-right: none;
      }
    }

  .ark-tabs.ark-tabs-card > .ark-tabs-bar .ark-tabs-tab-active {
      background: @primary-color;
      border-color: @primary-color;
      color: #f5f7f7;
      &:hover {
        color: #f5f7f7;
      }
    }
}
</style>
