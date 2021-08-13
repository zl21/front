<template>
  <div :class="classes">
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
          @on-row-dblclick="leftSingle"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import network, { urlSearchParams } from '../../__utils__/network';
  import { custommizedRequestUrl, classFix } from '../../constants/global';

  export default {
    name: 'SizeComponent',
    data() {
      return {
        leftTableColumns: [
          {
            title: this.$t('table.index'),
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: this.$t('tips.sizeCode'),
            key: 'ECODE'
          },
          {
            title: this.$t('tips.sizeName'),
            key: 'ENAME'
          }
        ], // 左边表格的表头
        leftTableData: [], // 左边表格数据
        leftTableHeight: 0, // 左边表格的高度
        leftTableSelectIndex: null, // 左侧表格选中的下标

        rightTableColumns: [
          {
            title: this.$t('table.index'),
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: this.$t('tips.sizeCode'),
            key: 'ECODE'
          },
          {
            title: this.$t('tips.sizeName'),
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
    computed: {
      classes: () => `${classFix}size_container`
    },
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
          this.$parent.$parent.rightTableDataForSize = this.rightTableData;
        }
      }, // 单个向右的icon点击触发
      rightDouble() {
        this.rightTableData = this.rightTableData.concat(this.leftTableData);
        this.leftTableData = [];
        this.$parent.$parent.rightTableDataForSize = this.rightTableData;
      }, // 两个向右的icon点击触发
      leftSingle() {
        if (this.rightTableSelectIndex !== null) {
          this.leftTableData.push(this.rightTableData[this.rightTableSelectIndex]);
          this.rightTableData.splice(this.rightTableSelectIndex, 1);
          this.rightTableSelectIndex = null;
          this.$parent.$parent.rightTableDataForSize = this.rightTableData;
        }
      }, // 单个向左的icon点击触发
      leftDouble() {
        this.leftTableData = this.leftTableData.concat(this.rightTableData);
        this.rightTableData = [];
        this.$parent.$parent.rightTableDataForSize = this.rightTableData;
      }, // 两个向左的icon点击触发
      leftTableRowClick(val, index) {
        this.leftTableSelectIndex = index;
        this.$parent.$parent.rightTableDataForSize = this.rightTableData;
      }, // 左边表格单选触发
      rightTableRowClick(val, index) {
        this.rightTableSelectIndex = index;
        this.$parent.$parent.rightTableDataForSize = this.rightTableData;
      }, // 右边表格单选触发
      getLeftTableData() {
        const { itemId } = this.$route.params;
        if (itemId == 'New') {
          return;
        }
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
              let sizeData = res.data.data;
              if (this.rightTableData && this.rightTableData.length > 0) {
                if (sizeData && sizeData.length > 0) {
                  sizeData = sizeData.filter((item) => {
                    const idList = this.rightTableData.map(v => v.ID);
                    return !idList.includes(item.ID);
                  });
                  this.leftTableData = sizeData;
                }
              } else if (sizeData) {
                this.leftTableData = sizeData;
              }
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
