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
      />
    </div>
  </div>
</template>

<script>
  import SizeComponent from './SizeComponent';
  import ColorComponent from './ColorComponent';
  import network, { urlSearchParams } from '../../__utils__/network';
  import custommizedRequestUrl from '../../__config__/custommizedRequestURL.config';

  export default {
    name: 'Standard',
    data() {
      return {
        actionFlag: { produceFlag: false }, // 动作权限
      
        colorData: [],
        sizeData: [],
        rightTableDataForSize: [],
        rightTableDataForColor: [],
      };
    },
    computed: {
      tabPanels() {
        const tabPanel = [
          {
            label: '颜色', // tab标签名字
            component: ColorComponent, // tab标签里的组件
            ref: 'color', // tab标签里的组件的ref
            componentAttribute: {
              getData: (val) => {
                this.getColorData(val);
              },
              rightTableDataForColor: this.rightTableDataForColor
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
              getData: (val) => {
                this.getSizeData(val);
              },
              rightTableDataForSize: this.rightTableDataForSize

            }, // 组件属性
            cilckCallback: (index, name, instance) => { // 点击标签时的回调方法，index为tabPanelsData数组下标，name为当前标签名称，instance为当前标签内的组件实例
              this.clickTabPanelsSize(index, name, instance);
            }
          }
        ];
        // tabPanel.concat([]);
        return tabPanel;
      }
    },

    components: {},
    created() {
      this.getSizeAndColorRightTableData();
    },
    mounted() {
      const params = {
        param: {
          AD_ACTION_NAME: 'PS_C_PRO',
          IsTable: true
        }
      };
      const URL = custommizedRequestUrl['/p/cs/fetchActionsInCustomizePage'];
      network.get(URL || '/p/cs/fetchActionsInCustomizePage', { params })
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
      getSizeAndColorRightTableData() {
        const { itemId } = this.$route.params;

        const params = {
          param: {
            PS_C_PRO_ID: itemId
          }
        };
        const URL = custommizedRequestUrl['/p/cs/cprospecload'];
        
        network.get(URL || '/p/cs/cprospecload', { params })
          .then((res) => {
            if (res.data.code === 0) {
              this.rightTableDataForSize = res.data.data.SIZE;
              this.rightTableDataForColor = res.data.data.COLOR;
            }
          });
      }, // 获取颜色和尺寸数据
      getColorData(val) {
        this.colorData = val;
        this.colorData = val.map((item) => {
          let obj = {};
          obj = {
            PS_C_CLR_ID: item.ID,
            MAINCOLOR: (item.MAINCOLOR === 'null' ? null : item.MAINCOLOR),
            FABCOLOR: item.FABCOLOR || null
          };
          return obj;
        });
      },
      getSizeData(val) {
        this.sizeData = val.map((item) => {
          const obj = {
            PS_C_SIZE_ID: item.ID
          };
          return obj;
        });
      },
      produceCode() {
        const { tableName, itemId } = this.$route.params;
        if (this.sizeData.length === 0) {
          this.getSizeData(this.rightTableDataForSize);
        }
        const params = {
          param: {
            table: tableName,
            objid: itemId,
            PS_C_PRO_ID: itemId,
            COLOR: this.colorData,
            SIZE: this.sizeData,
          },
          webaction: 'CskuGenerateCmd',
          actionid: '2005'
        };
        const URL = custommizedRequestUrl['/p/cs/exeAction'];
        
        network.post(URL || '/p/cs/exeAction', urlSearchParams(params))
          .then((res) => {
            if (res.data.code === 0) {
              // debugger;
              const result = res.data;
              const message = result.message;
              const data = {
                title: '成功',
                content: `${message}`
              };
              this.$Message.success(data);
            }
          });
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
        .ark-tabs-panels{
            height: 100%;
            display: flex;
            flex-direction: column;
            .ark-tabs-panels-content{
                flex: 1;
                overflow: hidden;
            }
        }
    }
</style>
