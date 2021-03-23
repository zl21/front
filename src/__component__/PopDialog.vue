<template>
  <!-- v-if="newformList.addcolums" -->
  <div
    ref="modify"
    class="popDialog_pop"
  >
    <Spin
      v-if="loading"
      fix
    >
      <Icon
        type="ios-loading"
        size="18"
        class="demo-spin-icon-load" 
      />
    </Spin>
    <component
      :is="'CompositeFormpop'"
      v-if="formList.show"
      ref="CompositeForm"
      :default-data="formList"
      :default-column-col="formList.objviewcol"
      class="formPanel"
      :condition="Condition"
      @InitializationForm="InitializationForm"
      @formChange="formChange"
      @on-formEnter="searchForm"
    />
    <div class="pageInfo">
      <Page
        :total="selectOperation.totalRowCount"
        :page-size-opts="selectOperation.selectrange"
        :page-size="selectOperation.defaultrange"
        class="table-page"
        size="small"
        show-total
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
      <div class="button">
        <Button
          type="primary"
          style="margin:0 20px;"
          @click="searchForm"
        >
          查询
        </Button>
        <Button
          type="fcdefault"
          @click="cancelDialog"
        >
          取消
        </Button>
      </div>
    </div>

    <div class="table-outside">
      <Table
        ref="selection"
        class="table-in"
        :highlight-row="true"
        :height="200"
        border
        :columns="SelectionData.thead"
        :data="SelectionData.row"
        @on-row-dblclick="rowdblclick"
      />
    </div>
  </div>
</template>
<script>
  import { Version, defaultrange } from '../constants/global';

  const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);
  
  export default {
    name: 'PopDialog',
    components: {},
    data() {
      return {
        formList: {
          inpubobj: [],
          show: false,
          objviewcol: 4
        },
        newformList: {},
        Condition: 'list',
        parms: {},
        formChangeData: {},
        formChangeDataInt: {}, // 初始化
        SelectionData: {
          config: [],
          thead: [],
          row: [],
          item: '',
          tableAllDatas: {}
        },
        SingleSelect: {
          show: false
        },
        loading: false,
        params: {},
        selectOperation: {
          // 列表的分页
          currentPageIndex: 1, // 当前页码
          pageSize: 10, // 显示条数
          defaultrange: 10, // 分页下拉选中值
          totalRowCount: 0,
          startindex: 0,
          selectrange: [10, 20, 50, 100, 200]
        },
        ids: []
      };
    },
    props: {
      fkobj: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    created() {
      this.loading = true;
      const params = {
        tableid: this.fkobj.reftableid,
        getcmd: 'n',
        table: this.fkobj.reftable
      };
      this.params = params;
      
      this.getData(params);
    },
    mounted() {
    // this.$refs.CompositeForm.mountChecked = true;
    },
    watch: {
      formList: {
        handler(val) {
          this.newformList = Object.assign(this.newformList, val);
        },
        deep: true
      }
    },
    methods: {
      rowdblclick(parms) {
        this.parms = parms;
        this.$parent.ok();
        this.$parent.cancel();
      },
      getData(searchObject) {
        //  form 请求
        fkHttpRequest().getTableQuery({
          searchObject,
          serviceId: this.fkobj.serviceId,
          success: (res) => {
            if (res.data.code === 0) {
              this.loading = false;
              const Data = res.data.data.datas;
              Data.dataarry.forEach((item) => {
                item.name = item.coldesc;
                item.defval = item.default;
                if (item.fkobj) {
                  item.data = {};
                }
              });
              this.formList.inpubobj = Data.dataarry;
              this.formList.show = true;
              this.formList.objviewcol = Data.searchFoldnum;
              setTimeout(()=>{
                this.searchForm();
              },800)
            }
          }
        });
      },
      cancelDialog() {
        this.$parent.cancel();
      },
      getList() {
        //  table list 请求
        const searchObject = {
          refcolid: Number(this.fkobj.colid),
          isdroplistsearch: true,
          startindex: this.selectOperation.startindex,
          range: defaultrange() ? defaultrange() : this.selectOperation.pageSize
        };
        const fixedcolumns = Object.keys(this.formChangeData).reduce(
          (arr, item) => {
            if (Array.isArray(this.formChangeData[item])) {
              if (this.formChangeData[item][0] !== undefined) {
                arr[item] = this.formChangeData[item];
              }
            } else if (this.formChangeData[item] !== '') {
              arr[item] = this.formChangeData[item];
            }
            return arr;
          },
          {}
        );
        searchObject.fixedcolumns = { ...fixedcolumns };
        fkHttpRequest().fkQueryListPop({
          searchObject,
          serviceId: this.fkobj.serviceId,
          success: (res) => {
            if (res.data.code === 0) {
              const data = res.data.data;
              this.selectOperation.currentPageIndex = data.selectrange; // 当前页码
              this.selectOperation.pageSize = data.defaultrange; // 显示条数
              this.selectOperation.totalRowCount = data.totalRowCount;
              this.selectOperation.selectrange = data.selectrange;
              this.selectOperation.defaultrange = data.defaultrange;
              this.selectOperation.startindex = data.start;
              this.SelectionData.thead = data.tabth.reduce((arr, item) => {
                const title = data.tabth.find(x => x.colname === item.colname)
                  .name;
                if (title === 'ID') {
                  arr.unshift({
                    title: '序号',
                    key: `${item.colname}`,
                    render: (h, params) => h('div', {
                      domProps: {
                        innerHTML:
                          item.colname === 'ID'
                            ? data.start + params.index + 1
                            : params.row[item.colname].val
                      }
                    })
                  });
                } else {
                  arr.push({
                    title,
                    key: `${item.colname}`,
                    render: (h, params) => h('div', {
                      domProps: {
                        innerHTML: params.row[item.colname].val
                      }
                    })
                  });
                }
                return arr;
              }, []);
              this.SelectionData.row = data.row.concat([]);
            }
          }
        });
      },
      searchForm() {
        this.selectOperation.startindex = 0;
        this.getList();
      },
      saveData() {},
      pageChange(index) {
        if (index === this.selectOperation.currentPageIndex) {
          return false;
        }
        this.selectOperation.currentPageIndex = index;
        this.selectOperation.startindex = (index - 1) * this.selectOperation.pageSize;

        this.getList();
      },
      pageSizeChange(index) {
        this.selectOperation.defaultrange = index;
        this.selectOperation.pageSize = index;
        this.selectOperation.startindex = (this.selectOperation.currentPageIndex - 1) * this.selectOperation.pageSize;
        this.getList();
      },
      InitializationForm(data) {
        // 默认
        if (Object.keys(data).length > 0) {
          Object.keys(data).forEach((item) => {
            if (data[item] !== undefined) {
              const dataSelect = this.checkForm(data, item);
              this.formChangeDataInt = Object.assign(this.formChangeData, {
                [item]: dataSelect[item]
              });
            }
          });
        }
        // this.getList();
      },
      checkForm(data, item) {
        // 校验select
        const index = this.formList.inpubobj.findIndex(x => x.colname === item);
        if (
          index !== -1
          && this.formList.inpubobj[index]
          && this.formList.inpubobj[index].display
        ) {
          if (
            this.formList.inpubobj[index].display === 'OBJ_SELECT'
            || this.formList.inpubobj[index].display === 'select'
          ) {
            if (Array.isArray(data[item])) {
              const arr = data[item].reduce((cuurent, item) => {
                const string = `${item}`.toString().replace(/=/g, '');
                cuurent.push(`=${string}`.toString());
                return cuurent;
              }, []);
              data[item] = [...arr];
            } else {
              data[item] = [`=${data[item]}`.toString().replace(/=/g, '=')];
            }
            // console.log(data[item]);
            // data[item].forEach((item) =>{
            //   if (/=/.test(data[item][0]) !== true) {
            //   // data[item] = [`=${data[item]}`.toString().replace(/=/g, '=')];
            //   if (data[item][0]) {
            //     data[item] = [`=${data[item]}`.toString()];
            //   } else {
            //     delete data[item];
            //   }
            // }

            // },)
          }
        }
        return data;
      },
      formChange(changeData) {
        // form 修改的数据
        if (Object.keys(changeData).length > 0) {
          Object.keys(changeData).forEach((item) => {
            if (changeData[item] !== undefined) {
              // eslint-disable-next-line no-unused-vars
              const dataSelect = this.checkForm(changeData, item);
              this.formChangeData = changeData;
            }
          });
        }
      },
      confirm() {
        // b保存提交
        this.saveData();
      }
    }
  };
</script>
<style lang="less" scoped>
.modify-tip {
  display: inline-block;
  margin-left: 20px;
  font-size: 12px;
  margin: 0px 0 10px;
  height: 24px;
  line-height: 24px;
}
.popDialog_pop {
  padding: 20px;
}
.pageInfo {
  padding: 10px 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
</style>
