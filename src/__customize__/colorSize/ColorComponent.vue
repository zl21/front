/* eslint-disable vue/html-self-closing */
<template>
  <div
    ref="colorComponent"
    class="color_container"
  >
    <div class="left_container">
      <div class="left_button">
        <Button
          type="fcdefault"
          @click="listAllColor"
        >
          列出所有颜色
        </Button>
      </div>
      <div
        ref="leftTable"
        class="left_table"
      >
        <Table
          :columns="leftTableColumns"
          :height="leftTableHeight"
          highlight-row
          :data="leftTableData"
          @on-row-click="leftTableRowClick"
          @on-row-dblclick="rightSingle"
        />
      </div>
    </div>
    <div class="center_container">
      <div class="right_single">
        <i
          class="iconfont iconbj_right"
          @click="rightSingle()"
        />
      </div>
      <div class="right_double">
        <i
          class="iconfont iconbj_transfer_right"
          @click="rightDouble()"
        />
      </div>
      <div class="left_single">
        <i
          class="iconfont iconbj_left"
          @click="leftSingle()"
        />
      </div>
      <div class="left_double">
        <i
          class="iconfont iconbj_transfer_left"
          @click="leftDouble()"
        />
      </div>
    </div>
    <div class="right_container">
      <div class="right_input">
        <Input
          v-model="addColorInputValue"
          placeholder="请输入颜色编码/颜色名称"
          icon="ios-add-circle-outline"
          @on-change="addColorInputChange"
          @on-click="addIconClick"
          @on-enter="addIconClick"
        />
        <Button
          slot="prepend"
          @click="addColor"
        >
          手动新增颜色
        </Button>
        </Input>
      </div>
      <div
        ref="rightTable"
        class="right_table"
      >
        <Table
          :columns="rightTableColumns"
          :data="rightTableData"
          highlight-row
          :height="rightTableHeight"
          @on-row-click="rightTableRowClick"
          @on-row-dblclick="leftSingle"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import network, { urlSearchParams } from '../../__utils__/network';
  import { custommizedRequestUrl } from '../../constants/global';

  export default {
    data() {
      return {
        leftTableColumns: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '颜色编码',
            key: 'ECODE'
          },
          {
            title: '颜色名称',
            key: 'ENAME'
          }
        ], // 左边表格的表头
        leftTableData: [], // 左边表格数据
        leftTableHeight: 0, // 左边表格的高度
        leftTableSelectIndex: null, // 左侧表格选中的下标

        rightTableColumns: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '颜色编码',
            key: 'ECODE'
          },
          {
            title: '颜色名称',
            key: 'ENAME'
          },
          {
            title: '主副色',
            render: this.mainColorRender()
          },
          {
            title: '布料颜色',
            render: this.fabColorRender()
          },
          {
            title: '颜色图片',
            render: this.mainImageRender()
            // key: 'image'
          },
        ], // 右边表格的表头
        rightTableData: [], // 右边表格数据
        rightTableHeight: 0, // 右边表格的高度
        addColorInputValue: '', // 手动新增颜色的输入框
        rightTableSelectIndex: null, // 右侧的表格选中的下标
      };
    },
    name: 'ColorComponent',
    components: {},
    props: {
      getData: {
        type: Function,
        default: () => {}
      },
      rightTableDataForColor: {
        type: Array,
        default: () => ([])
      },
      
    },
    watch: {
      rightTableDataForColor: {
        handler(val) {
          this.rightTableData = val;
          // this.getData(val);
        },
        deep: true
      },
    },
    computed: {},
    mounted() {
      this.leftTableHeight = this.$refs.leftTable.offsetHeight;
      this.rightTableHeight = this.$refs.rightTable.offsetHeight;
      this.rightTableData = this.rightTableDataForColor;
      this.getData(this.rightTableDataForColor);
    },
    created() {
      // this.getRightTableData();
    },
    methods: {
      rightSingle() {
        if (this.leftTableSelectIndex !== null) {
          this.rightTableData.push(this.leftTableData[this.leftTableSelectIndex]);
          this.leftTableData.splice(this.leftTableSelectIndex, 1);
          this.leftTableSelectIndex = null;
          this.$parent.$parent.rightTableDataForColor = this.rightTableData;
        }
      }, // 单个向右的icon点击触发
      rightDouble() {
        this.rightTableData = this.rightTableData.concat(this.leftTableData);
        this.leftTableData = [];
        this.$parent.$parent.rightTableDataForColor = this.rightTableData;
      }, // 两个向右的icon点击触发
      leftSingle() {
        if (this.rightTableSelectIndex !== null) {
          const currentData = this.rightTableData[this.rightTableSelectIndex];
          if (currentData.image) {
            delete currentData.image;
          }
          this.leftTableData.push(currentData);
          this.rightTableData.splice(this.rightTableSelectIndex, 1);
          this.rightTableSelectIndex = null;
          this.$parent.$parent.rightTableDataForColor = this.rightTableData;
        }
      }, // 单个向左的icon点击触发
      leftDouble() {
        //  const currentData = this.rightTableData[this.rightTableSelectIndex];
        //   if (currentData.image) {
        //     delete currentData.image;
        //   }
        this.rightTableData.map((item) => {
          if (item.image) {
            delete item.image;
          }
        });
        this.leftTableData = this.leftTableData.concat(this.rightTableData);
        this.rightTableData = [];
        this.$parent.$parent.rightTableDataForColor = this.rightTableData;
      }, // 两个向左的icon点击触发
      leftTableRowClick(val, index) {
        this.leftTableSelectIndex = index;
        this.$parent.$parent.rightTableDataForColor = this.rightTableData;
      }, // 左边表格单选触发
      rightTableRowClick(val, index) {
        this.rightTableSelectIndex = index;
        this.$parent.$parent.rightTableDataForColor = this.rightTableData;
      }, // 右边表格单选触发
      listAllColor() {
        const { itemId } = this.$route.params;
        if (itemId == 'New') {
          return;
        }
        const params = {
          param: {
            PS_C_PRO_ID: itemId,
            FLAG: 1
          }
        };
        const URL = custommizedRequestUrl()['/p/cs/cspecobjload'];
        network.get(URL || '/p/cs/cspecobjload', { params })
          .then((res) => {
            if (res.data.code === 0) {
              let colorData = res.data.data;
              if (this.rightTableData && this.rightTableData.length > 0) {
                if (colorData && colorData.length > 0) {
                  colorData = colorData.filter((item) => {
                    const idList = this.rightTableData.map(v => v.ID);
                    return !idList.includes(item.ID);
                  });
                  this.leftTableData = colorData;
                }
              } else if (colorData) {
                this.leftTableData = colorData;
              }
            }
          });
      }, // 列出所有颜色按钮点击
      addColor() {

      }, // 手动新增颜色点击触发
      addColorInputChange() {

      }, // 手动新增颜色输入框改变时触发
      addIconClick() {
        const { itemId } = this.$route.params;
        let ecodes = [];
        if (this.rightTableData.length > 0) {
          ecodes = this.rightTableData.map(item => item.ECODE);
        } else {
          ecodes = [];
        }
        if (this.addColorInputValue === '') {
          this.$Message.warning('输入框内容不能为空');
          return;
        }
        // const params = {
        //   PS_C_PRO_ID: itemId, // 主表表名
        //   COLOR: this.addColorInputValue,
        //   SELECTED: escape(JSON.stringify(ecodes))
        // };
        const URL = custommizedRequestUrl()['/p/cs/cclrquery'];
        const url = `${URL || '/p/cs/cclrquery'}?PS_C_PRO_ID=${itemId}&COLOR=${this.addColorInputValue}&SELECTED=${escape(JSON.stringify(ecodes))}`;
        network.get(url)
          .then((res) => {
            if (res.data.code === 0) {
              const result = res.data;
              const message = result.message;
              const data = {
                title: '成功',
                content: `${message}`
              };
              if (this.leftTableData.length > 0) {
                const resData = res.data.data.map(r => r.ID);
                this.leftTableData = this.leftTableData.filter(leftData => !resData.includes(leftData.ID));
              }
              this.addColorInputValue = '';
              this.rightTableData = this.rightTableData.concat(res.data.data);
              this.$Message.success(data);
            }
          });
      }, // 手动新增颜色，新增icon点击时触发
      // getRightTableData() {
      //   const { tableName, tableId, itemId } = this.$route.params;
      //   const params = {
      //     param: {
      //       PS_C_PRO_ID: itemId
      //     }
      //   };
      //   network.get('/p/cs/cprospecload', { params })
      //     .then((res) => {
      //       if (res.data.code === 0) {
      //         this.rightTableData = res.data.data.COLOR;
      //       }
      //     });
      // }, // 获取右边表格的数据
      mainImageRender() {
        return (h, params) => {
          const colname = params.row;
          if (colname.image) {
            return h('div', [
              h('Poptip', {
                style: {},
                props: {
                  trigger: 'hover',
                  transfer: true,
                  content: 'content',
                  placement: 'right'
                },
                scopedSlots: {
                  default: () => h('img', {
                    style: {
                      height: '46px',
                      width: '46px',
                      'margin-top': '4px'
                    },
                    domProps: {
                      src: colname.image
                    }
                  }),
                  content: () => h('img', {
                    style: {
                      width: '120px',
                      height: '120px',
                      margin: '8px 0px',
                      'vertical-align': 'middle',
                    },
                    domProps: {
                      src: colname.image
                    }
                  }),
                },
              })
            ]);
          }
        };
      }, // 图片render

      mainColorRender() {
        return (h, params) => h('Select', {
          style: {
            padding: '3px'
          },
          props: {
            transfer: true,
            clearable: true,
            value: params.row.MAINCOLOR,
          },
          nativeOn: {
            click: (e) => {
              e.stopPropagation();
            }
          },
          on: {
            'on-change': (event) => {
              params.row.MAINCOLOR = event;
              this.rightTableData[params.index].MAINCOLOR = event;
              // params.row.MAINCOLOR = event;
              // this.getData(params.row);
            }
          }
        }, this.selectOptionRender(h));
      }, // 右边表格主副色render
      selectOptionRender(h) {
        const colorType = [{ name: '主色', code: 1 }, { name: '副色', code: 2 }, { name: '配卖', code: 3 }];
        return colorType.map(item => h('Option', {
          props: {
            value: item.code,
            label: item.name
          }
        }));
      },
      fabColorRender() {
        return (h, params) => h('Input', {
          style: {
          },
          props: {
            value: params.row.FABCOLOR,

          },
          nativeOn: {
            click: (e) => {
              e.stopPropagation();
            }
          },
          on: {
            'on-blur': (event, e) => {
              params.row.FABCOLOR = e.currentValue;
              this.rightTableData[params.index].FABCOLOR = e.currentValue;
              // params.row.FABCOLOR = event.data;
              // this.getData(params.row);
            }
          }
        });
      }, // 右边表格主副色render
    }
  };
</script>

<style lang="less" scope="this api replaced by slot-scope in 2.5.0+">
    .color_container {
        height: 100%;
        padding: 10px;
        display: flex;
        .left_container {
            height: 100%;
            width: 27%;
            border: 1px solid #b4b4b4;
            border-radius: 6px;
            padding: 10px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            .left_button {
                margin-bottom: 8px;
            }
            .left_table {
                flex: 1;
                overflow: hidden;
            }
        }
        .center_container {
            height: 100%;
            width: 6%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            > div {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                height: 20px;
                width: 20px;
                border: 1px solid #b4b4b4;
                border-radius: 6px;
                margin: 20px 0px;
            }
            .right_single {
            }
            .right_double {
            }
            .left_single {
            }
            .right_double {
            }
        }
        .right_container {
            height: 100%;
            width: 67%;
            border: 1px solid #b4b4b4;
            border-radius: 6px;
            padding: 10px;
            overflow: auto;
            display: flex;
            flex-direction: column;
            .right_input {
                width: 50%;
                margin-bottom: 8px;
                .ark-input-group {
                    top: 0px;
                }
                .ark-input-group-prepend {
                    .ark-btn {
                        display: flex;
                        align-items: center;
                        span {
                            position: relative;
                        }
                    }
                }
            }
            .right_table {
                flex: 1;
                .ark-select-selection {
                    height: 22px;
                }
                .ark-input-wrapper > input {
                    height: 22px;
                }
            }
        }
    }
</style>
