<template>
  <div :class="classes">
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
  import { custommizedRequestUrl, classFix } from '../../constants/global';

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
      classes: () => `${classFix}standard_container`,
      tabPanels() {
        const tabPanel = [
          {
            label: this.$t('tips.color'), // tab标签名字
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
            label: this.$t('tips.size'), // tab标签名字
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
      const URL = custommizedRequestUrl()['/p/cs/fetchActionsInCustomizePage'];
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

        // 新增主表数据时，颜色尺寸不调用接口
        if (itemId === 'New') {
          return;
        }

        const params = {
          param: {
            PS_C_PRO_ID: itemId
          }
        };
        const URL = custommizedRequestUrl()['/p/cs/cprospecload'];
        network.get(URL || '/p/cs/cprospecload', { params })
          .then((res) => {
            if (res.data.code === 0) {
              this.getImage(res.data.data.COLOR);
              this.rightTableDataForSize = res.data.data.SIZE;
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
        // this.rightTableDataForColor = this.colorData;
      },
      getSizeData(val) {
        this.sizeData = val.map((item) => {
          const obj = {
            PS_C_SIZE_ID: item.ID
          };
          return obj;
        });
      },
      getImage(colorData) {
        const { itemId } = this.$route.params;
        // 新增主表数据时，颜色尺寸不调用接口
        if (itemId === 'New') {
          return;
        }
        const url = custommizedRequestUrl()['/p/cs/proImage'];
        network.post(url || '/p/cs/proImage', urlSearchParams({
          param: {
            PS_C_PRO_ID: itemId
          }
        })).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.IMAGE_SKU) {
              const images = JSON.parse(res.data.data.IMAGE_SKU);
              if (images && images.length > 0 && colorData && colorData.length > 0) {
                colorData.map((color) => {
                  images.map((image) => {
                    if (color.ID === image.ID) {
                      color.image = image.URL;
                    }
                  });
                });
              }
              this.rightTableDataForColor = colorData;
            } else {
              this.rightTableDataForColor = colorData;
            }
          }
        });
      },
      produceCode() {
        const { tableName, itemId } = this.$route.params;
        if (itemId == 'New') {
          return;
        }
        let rightTableDataForColorRes = null;
        let rightTableDataForSizeRes = null;
        if (this.$refs.tabPanels.$refs.color) {
          rightTableDataForColorRes = this.$refs.tabPanels.$refs.color.rightTableData;
          // this.colorData = rightTableDataForColorRes;
          // if (this.colorData.length === 0) {
          this.getColorData(rightTableDataForColorRes);
          // }

          // if (this.sizeData.length === 0) {
          this.getSizeData(this.rightTableDataForSize);
          // }
        }

        if (this.$refs.tabPanels.$refs.size) {
          rightTableDataForSizeRes = this.$refs.tabPanels.$refs.size.rightTableData;
          this.getSizeData(rightTableDataForSizeRes);
          if (this.sizeData.length === 0) {
            this.getSizeData(this.rightTableDataForSize);
          }
          this.getColorData(this.rightTableDataForColor);
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
        console.log('tag', params);
        const URL = custommizedRequestUrl()['/p/cs/exeAction'];
        network.post(URL || '/p/cs/exeAction', urlSearchParams(params))
          .then((res) => {
            if (res.data.code === 0) {
              // debugger;
              const result = res.data;
              const message = result.message;
              const data = {
                title: this.$t('feedback.success'),
                content: `${message}`
              };
              this.$Message.success(data);
            }
          });
      },
      clickTabPanelsColor(index, name, instance) {
        this.colorData = instance.rightTableData;
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
        this.$store.commit('global/tabOpen', param);
      }
    },
    watch: {},

  };
</script>
