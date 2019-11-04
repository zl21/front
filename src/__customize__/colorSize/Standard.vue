<template>
  <div class="standard_container">
    <div class="tabs_container">
      <div class="navButton">
        <button
          v-if="actionFlag.produceFlag"
          @click="produceCode"
        >
          生成条码
        </button>
        <button @click="backMainTab">
          返回
        </button>
      </div>
      <TabPanels
        ref="tabPanels"
        type="singleCard"
        is-keep-alive
        :tab-margin-left="20"
        :tab-height="26"
        :tab-panels="tabPanels"
        @getData="getData"
      />
    </div>
  </div>
</template>

<script>
  import SizeComponent from './SizeComponent';
  import ColorComponent from './ColorComponent';
  import network, { urlSearchParams } from '../../__utils__/network';

  export default {
    data() {
      return {
        actionFlag: { produceFlag: false }, // 动作权限
        tabPanels: [
          {
            label: '颜色', // tab标签名字
            component: ColorComponent, // tab标签里的组件
            ref: 'color', // tab标签里的组件的ref
            componentAttribute: {
              getData: (val) => {
                this.getData(val);
              }
            }, // 组件属性
            cilckCallback: (index, name, instance) => { // 点击标签时的回调方法，index为tabPanelsData数组下标，name为当前标签名称，instance为当前标签内的组件实例
              this.clickTabPanelsColor(index, name, instance);
            }
          },
          {
            label: '尺寸', // tab标签名字
            component: SizeComponent, // tab标签里的组件
            ref: 'size', // tab标签里的组件的ref
            componentAttribute: {

            }, // 组件属性
            cilckCallback: (index, name, instance) => { // 点击标签时的回调方法，index为tabPanelsData数组下标，name为当前标签名称，instance为当前标签内的组件实例
              this.clickTabPanelsSize(index, name, instance);
            }
          }
        ],
        colorData: [],
        sizeData: []
      };
    },
    name: 'Standard',
    components: {},
    mounted() {
      const params = {
        param: {
          AD_ACTION_NAME: 'PS_C_PRO',
          IsTable: true
        }
      };
      network.get('/p/cs/fetchActionsInCustomizePage', { params })
        .then((res) => {
          if (res.data.code === 0) {
            const result = res.data.data;
            result.forEach((item) => {
              if (item.webname === 'CskuGenerateCmd') this.actionFlag.produceFlag = true;
            });
          }
        });
    },
    methods: {
      getData(val) {
        this.colorData = val;
      },
      produceCode(val) {

      },
      clickTabPanelsColor(index, name, instance) {
        this.colorData = instance.rightTableData;
        console.log('🍓', this.colorData);
        console.log('🍓', this.sizeData);
      },
      clickTabPanelsSize(index, name, instance) {
        this.sizeData = instance.rightTableData;
      },
      backMainTab() {
        const { tableId, tableName } = this.$route.params;
        const param = {
          tableId,
          tableName,
          back: true,
        };
        this.$store.commit('global/tabHref', param);
      }
    },
    watch: {},
    
  };
</script>

<style lang="less">
    .standard_container {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px 0px;
        .tabs_container{
            flex: 1;
            margin-top: 10px;
              .navButton {
                padding: 0;
                flex: 1;
                height: 24px;
                width: 100%;
                margin-bottom: 10px;
                margin-top: -10px;
                button{
                  height: 24px;
                  width: auto;
                  margin: 0 8px 0 0;
                  padding: 0 8px;
                  background: #fff;
                  color: #fd6442;
                  border: 1px solid #fd6442;
                  border-radius: 2px;
                  float: left;
                }
              }
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
