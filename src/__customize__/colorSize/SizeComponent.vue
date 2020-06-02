<template>
  <div class="size_container">
    <div class="left_container">
      <div
        ref="leftTable"
        class="left_table"
      >
        <Table
          :columns="leftTableColumns"
          :height="leftTableHeight"
          :data="leftTableData"
          highlight-row
          @on-row-click="leftTableRowClick"
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
      <div
        ref="rightTable"
        class="right_table"
      >
        <Table
          :columns="rightTableColumns"
          :height="rightTableHeight"
          :data="rightTableData"
          highlight-row
          @on-row-click="rightTableRowClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import network, { urlSearchParams } from '../../__utils__/network';
  import { custommizedRequestUrl } from '../../constants/global';

  export default {
    name: 'SizeComponent',
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
            title: '尺寸编码',
            key: 'ECODE'
          },
          {
            title: '尺寸名称',
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
            title: '尺寸编码',
            key: 'ECODE'
          },
          {
            title: '尺寸名称',
            key: 'ENAME'
          }
        ], // 右边表格的表头
        rightTableData: [], // 右边表格数据
        rightTableHeight: 0, // 右边表格的高度
        rightTableSelectIndex: null, // 右侧的表格选中的下标
      };
    },
    props: {
      getData: {
        type: Function,
        default: () => {}
      },
      rightTableDataForSize: {
        type: Array,
        default: () => ([])
      }
    },
    components: {},
    watch: {
      rightTableDataForSize: {
        handler(val) {
          this.rightTableData = val;
          this.getData(val);
        },
        deep: true
      },
    },
    computed: {},
    mounted() {
      this.leftTableHeight = this.$refs.leftTable.offsetHeight + 1;
      this.rightTableHeight = this.$refs.rightTable.offsetHeight + 1;
      this.rightTableData = this.rightTableDataForSize;
      this.getData(this.rightTableDataForSize);
    },
    created() {
      this.getLeftTableData();
    },
    methods: {
      rightSingle() {
        if (this.leftTableSelectIndex !== null) {
          this.rightTableData.push(this.leftTableData[this.leftTableSelectIndex]);
          this.leftTableData.splice(this.leftTableSelectIndex, 1);
          this.leftTableSelectIndex = null;
        }
      }, // 单个向右的icon点击触发
      rightDouble() {
        this.rightTableData = this.rightTableData.concat(this.leftTableData);
        this.leftTableData = [];
      }, // 两个向右的icon点击触发
      leftSingle() {
        if (this.rightTableSelectIndex !== null) {
          this.leftTableData.push(this.rightTableData[this.rightTableSelectIndex]);
          this.rightTableData.splice(this.rightTableSelectIndex, 1);
          this.rightTableSelectIndex = null;
        }
      }, // 单个向左的icon点击触发
      leftDouble() {
        this.leftTableData = this.leftTableData.concat(this.rightTableData);
        this.rightTableData = [];
      }, // 两个向左的icon点击触发
      leftTableRowClick(val, index) {
        this.leftTableSelectIndex = index;
      }, // 左边表格单选触发
      rightTableRowClick(val, index) {
        this.rightTableSelectIndex = index;
      }, // 右边表格单选触发
      getLeftTableData() {
        const { itemId } = this.$route.params;
        const params = {
          param: {
            PS_C_PRO_ID: itemId,
            FLAG: 2
          }
        };
        const URL = custommizedRequestUrl()['/p/cs/cspecobjload'];

        network.get(URL || '/p/cs/cspecobjload', { params })
          .then((res) => {
            if (res.data.code === 0) {
              this.leftTableData = res.data.data;
            }
          });
      }, // 获取左边表格的数据
      // getSizeRightTableData() {
      //   const { itemId } = this.$route.params;

      //   const params = {
      //     param: {
      //       PS_C_PRO_ID: itemId
      //     }
      //   };
      //   network.get('/p/cs/cprospecload', { params })
      //     .then((res) => {
      //       if (res.data.code === 0) {
      //         this.rightTableData = res.data.data.SIZE;
      //       }
      //     });
      // }, // 获取右边表格的数据
    }
  };
</script>

<style lang="less">
    .size_container {
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
            .left_table {
                height: 100%;
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
            .right_table {
                height: 100%;
            }
        }
    }
</style>
