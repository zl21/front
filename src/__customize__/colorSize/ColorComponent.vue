<template>
  <div class="color_container">
    <div class="left_container">
        <div>
            <Button type="fcdefault">
                列出所有颜色
            </Button>
        </div>
        <div class="leftTable">
            <Table
                    :columns="leftTableColumns"
                    :data="leftTableData"
                    :height="true"
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
      <div class="">
          <!--<Table-->
                  <!--:columns="rightTableColumns"-->
                  <!--class="rightTable"-->
                  <!--:height="true"-->
                  <!--:data="rightTableData"-->
                  <!--@on-row-click="rightTableRowClick"-->
          <!--/>-->
      </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        leftTableColumns: [
          {title: 'xuhao', key: 'aaa'}
        ], // 左边表格的表头
        leftTableData: [], // 左边表格数据
        rightTableColumns: [], // 右边表格的表头
        rightTableData: [], // 右边表格数据
      };
    },
    name: 'ColorComponent',
    components: {},
    watch: {},
    computed: {},
    methods: {
      rightSingle() {

      }, // 单个向右的icon点击触发
      rightDouble() {

      }, // 两个向右的icon点击触发
      leftSingle() {

      }, // 单个向左的icon点击触发
      leftDouble() {

      }, // 两个向左的icon点击触发
      leftTableRowClick() {

      }, // 左边表格单选触发
      rightTableRowClick() {

      }, // 右边表格单选触发
    }
  };
</script>

<style lang="less">
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
            .leftTable {
               // padding-top: 8px;
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
            .rightTable {
                margin-top: 5px;
            }
        }
    }
</style>
