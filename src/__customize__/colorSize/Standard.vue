<template>
  <div class="standard_container">
      <div class="button_group">
          <Button type="fcdefault">返回</Button>
      </div>
    <div class="tabs_container">
      <TabPanels
        type="singleCard"
        is-keep-alive
        :tab-margin-left="20"
        :tab-height="26"
        :tab-panels="tabPanels"
      />
    </div>
  </div>
</template>

<script>
  import SizeComponent from './SizeComponent';
  import ColorComponent from './ColorComponent';

  export default {
    data() {
      return {
        tabPanels: [
          {
            label: '颜色', // tab标签名字
            component: ColorComponent, // tab标签里的组件
            ref: 'test1', // tab标签里的组件的ref
            componentAttribute: {}, // 组件属性
            cilckCallback: (index, name, instance) => { // 点击标签时的回调方法，index为tabPanelsData数组下标，name为当前标签名称，instance为当前标签内的组件实例
              console.log(index, name, instance);
            }
          },
          {
            label: '尺寸', // tab标签名字
            component: SizeComponent, // tab标签里的组件
            ref: 'test1', // tab标签里的组件的ref
            componentAttribute: {}, // 组件属性
            cilckCallback: (index, name, instance) => { // 点击标签时的回调方法，index为tabPanelsData数组下标，name为当前标签名称，instance为当前标签内的组件实例
              console.log(index, name, instance);
            }
          }
        ]
      };
    },
    name: 'Standard',
    components: {},
    methods: {},
    watch: {},
    computed: {}
  };
</script>

<style lang="less">
    .standard_container {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px 0px;
        .button_group {

        }
        .tabs_container{
            flex: 1;
            margin-top: 10px;
        }
        .burgeon-tabs-panels{
            height: 100%;
            display: flex;
            flex-direction: column;
            .burgeon-tabs-panels-content{
                flex: 1;
                overflow: hidden;
            }
        }
    }
</style>
