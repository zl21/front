<template>
  <!-- v-if="newformList.addcolums" -->
  <div
    ref="modify"
    :class="classes"
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
      :is="'listsForm'"
      ref="listsForm"
      v-if="formItems.defaultFormItemsLists && formItems.defaultFormItemsLists.length > 0"
      :id="tableName+'pop'"
      :form-item-lists="formItems.defaultFormItemsLists"
      :default-column="Number(4)"
      :searchFoldnum="10"
      @onHandleEnter="searchForm"

    />
    <div class="pageInfo">
      <Page
        :total="selectOperation.totalRowCount"
        :page-size-opts="selectOperation.selectrange"
        :page-size="selectOperation.defaultrange"
        :current="selectOperation.currentPageIndex"
        class="table-page"
        size="small"
        show-total
        @on-change="pageChange"
      />
      <div class="button">
        <Button
          type="primary"
          style="margin:0 20px;"
          @click="searchForm"
        >
          {{$t('buttons.search')}}
        </Button>
        <Button
          type="fcdefault"
          @click="cancelDialog"
        >
          {{$t('buttons.cancel')}}
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
  import { Version, defaultrange, classFix } from '../constants/global';
  import { getTableName } from '../__utils__/urlParse'
  import i18n from '../assets/js/i18n'

  let fkHttpRequest = undefined
  import(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`).then(data => {
    fkHttpRequest = () => data
  })
  // const fkHttpRequest = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/fkHttpRequest.js`);
  // import listsForm from '../__component__/FormComponents/listsForm.vue';

  export default {
    name: 'PopDialog',
    components: {
    },
    data() {
      return {
        formList: {
          inpubobj: [],
          show: false,
          objviewcol: 4
        },
        formItems:{

        },
        showKey:'',
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
        ids: [],
        tableName: ''
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
    computed: {
      classes() {
        return [
          `${classFix}PopDialog`,
        ];
      },
    },
    created() {
      this.$t = i18n.t.bind(i18n)
      // fix: 表格里的表单，无法从$route里拿到表名，需要自己从url地址去取出
      this.tableName = getTableName()

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
              // Data.dataarry.forEach((item) => {
              //   item.name = item.coldesc;
              //   // 兼容数据
              //   if(item.fkobj){
              //     item = Object.assign(item,item.fkobj);
              //     item.fkobj.fkdisplay = item.fkobj.searchmodel;
              //   }
              //   item.defval = item.default;
              //   if (item.fkobj) {
              //     item.data = {};
              //   }
              // });
              this.formItems.defaultFormItemsLists = Data.dataarry;
              // this.formList.inpubobj = Data.dataarry;
              this.formList.show = true;
              this.formList.objviewcol = Data.searchFoldnum;
              setTimeout(()=>{
                this.$refs.listsForm.getFormData().then((res)=>{
                    this.formChangeData = res;
                    this.searchForm();
                });
              },200)
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

        searchObject.fixedcolumns = { ...this.formChangeData };
        fkHttpRequest().fkQueryListPop({
          searchObject,
          serviceId: this.fkobj.serviceId,
          success: (res) => {
            if (res.data.code === 0) {
              const data = res.data.data;
              // this.selectOperation.currentPageIndex = data.selectrange; // 当前页码
              this.selectOperation.pageSize = data.defaultrange; // 显示条数
              this.selectOperation.totalRowCount = data.totalRowCount;
              this.selectOperation.selectrange = data.selectrange;
              this.selectOperation.defaultrange = data.defaultrange;
              this.selectOperation.startindex = data.start;

              this.SelectionData.thead = data.tabth.reduce((arr, item) => {
                const title = data.tabth.find(x => x.colname === item.colname)
                  .name;
                  if(item.isak){
                  this.showKey = item.colname;
                  }
                if (title === 'ID') {
                  arr.unshift({
                    title: this.$t('table.index'),
                    key: `${item.colname}`,
                    render: (h, params) => h('div', {
                      domProps: {
                        innerHTML:
                          item.colname === 'ID'
                            ? data.start + params.index + 1
                            : params.row[item.colname] && params.row[item.colname].val
                      }
                    })
                  });
                } else {
                  arr.push({
                    title,
                    key: `${item.colname}`,
                    render: (h, params) => h('div', {
                      domProps: {
                        innerHTML: params.row[item.colname] && params.row[item.colname].val
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

         this.$refs.listsForm.getFormData().then((res)=>{
                    this.formChangeData = res;
                    this.selectOperation.startindex = 0;
        //this.getList();
                    this.selectOperation.currentPageIndex = 1;
                    this.getList();
          });

      },
      saveData() {

      },
      pageChange(index) {
        if (index === this.selectOperation.currentPageIndex) {
          return false;
        }
        this.selectOperation.currentPageIndex = index;
        this.selectOperation.startindex = (index - 1) * this.selectOperation.pageSize;

        this.getList();
      },
      pageSizeChange(index) {
        console.log(index,'indexindexindex=====');
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
      //   // form 修改的数据
      //   if (Object.keys(changeData).length > 0) {
      //     Object.keys(changeData).forEach((item) => {
      //       if (changeData[item] !== undefined) {
      //         // eslint-disable-next-line no-unused-vars
      //         //const dataSelect = this.checkForm(changeData, item);
      //         this.formChangeData = Object.assign(this.formChangeData,changeData);
      //       }
      //     });
      //   }
       },
      confirm() {
        // b保存提交
        this.saveData();
      }
    }
  };
</script>
