<template>
  <div>
    <h5>ag-grid实现的表格</h5>

    <!-- <Button @click="change">修改事件</Button> -->

    <div class="container">
      <div class="content">
        <commonTableByAgGrid
          ref="agGrid"
          :options="options"
          :height="tableHeight? `${tableHeight}px` :'calc(100% - 10px)'"
          :columns="columns"
          :data="rows"
          :renderParams="renderParams"
          mode="commonTable"
          @on-selection-change="tableSelectedChange"
          @on-sort-change="tableSortChange"
          @on-row-dblclick="tableRowDbclick"
          @on-column-moved="moveFn"
          @grid-ready="ready"
        ></commonTableByAgGrid>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import commonTableByAgGrid from '../components/common-table-by-ag-grid'
import { http, urlSearchParams } from '../utils/network'

import Vue from 'vue'
import ImageComponent from '../components/common-table-by-ag-grid/renderComponents/ImageComponent.vue'
import FkComponent from '../components/common-table-by-ag-grid/renderComponents/FkComponent.vue'
import TextComponent from '../components/common-table-by-ag-grid/renderComponents/TextComponent.vue'
import MopFkComponent from '../components/common-table-by-ag-grid/renderComponents/MopFkComponent.vue'
import CustomerUrlComponent from '../components/common-table-by-ag-grid/renderComponents/CustomerUrlComponent.vue'
import SequenceComponent from '../components/common-table-by-ag-grid/renderComponents/SequenceComponent.vue'
import AttachmentComponent from '../components/common-table-by-ag-grid/renderComponents/AttachmentComponent'

const DISPLAY_ENUM = { // 标签映射
  // text: { tag: 'Input',  },
  // check: { tag: 'Checkbox',  },
  // select: { tag: 'Select',  },
  // radioGroup: { tag: 'Select',  },
  drp: { renderComponent: 'Demo', },
  // mrp: { tag: 'DropMultiSelectFilter', },
  // mop: { tag: 'ComAttachFilter',  },
  // pop: { tag: 'ComAttachFilter',  },
  // OBJ_DATENUMBER: { tag: 'DatePicker',  },
  // OBJ_DATE: { tag: 'DatePicker',  },
  // OBJ_TIME: { tag: 'TimePicker',  },
  // image: { tag: 'Poptip',  },
  // doc: { tag: 'Poptip',  }
}

export default {
  name: '',

  components: {
    commonTableByAgGrid,
    TextComponent,
    FkComponent,
    ImageComponent
  },

  data() {
    return {
      options: {
        getRowClass: this.getRowClass
      },
      columns: [],
      rows: [],
      tableHeight: 0
    }
  },

  methods: {
    // 自定义样式
    getRowClass(params) {
      const { rowIndex } = params;
      if(rowIndex === 2) {
        console.log('hgaol ')
        return 'highlight'
      }
      return ''
    },

    moveFn(params) {
      console.log('移动',params);
    },

    tableSelectedChange() {

    },

    tableSortChange() {

    },

    tableRowDbclick() { },

    change() {
      this.$refs.agGrid.columnApi.autoSizeAllColumns()
    },

    // 列组件筛选器
    renderParams(cellData) {
      let renderComponent = null;
      if (cellData.isfk && cellData.fkdisplay && DISPLAY_ENUM[cellData.fkdisplay]) {
        renderComponent = {
          renderComponent: FkComponent

          // renderComponent = {
          //   renderContainer: 'CellRenderByFunction',
          //   renderComponent: (h, params) => {
          //     console.log('回调', params);
          //     return h('div', {
          //       domProps: {
          //         innerHTML: `<h2>${params.index}</h2>`
          //       }
          //     })
          //   }

        }
      };


      // 默认返回字符串的时候，要判断其字符长度
      return renderComponent || {
        renderComponent: TextComponent
      }
    },

    ready() {
      console.log('准备huidaio ', this.$refs.agGrid)
      this.columns = [
        { field: 'name', displayName: '标题', checkboxSelection: true, tdAlign: 'left' },
        { field: 'age', displayName: '标222题', tdAlign: 'left' },
        { field: 'sex', displayName: '标题4444', tdAlign: 'right' },
        { field: 'phone', displayName: '地址', tdAlign: 'center', pinned: 'left' },
      ]
      this.rows = [
        {
          name: '测试cc',
          age: 12,
          sex: 'ss',
          phone: 12312222
        },
        {
          name: '测试dd',
          age: 1212,
          sex: '难',
          phone: 12313213
        },
        {
          name: '测试111',
          age: 1332,
          sex: 'mmmmmmm',
          phone: 123123123
        },
      ]
    }
  },

  beforeMount() {
    // this.options.columnDefs = [
    //   {
    //     field: 'make',
    //     maxWidth: 100,
    //     floatingFilter: true,
    //     cellRendererFramework: 'CellRender',
    //     cellRendererParams: {
    //       renderComponent: TextComponent
    //     }
    //   },
    //   {
    //     field: 'model',
    //     suppressFilter: false,
    //     webconf: {
    //       standard_width: 100
    //     },
    //     width: 100,
    //     minWidth: 100,
    //     maxWidth: 100,
    //     cellRendererFramework: 'CellRender',
    //     cellRendererParams: {
    //       renderComponent: TextComponent
    //     }
    //   },//cellRendererFramework: 'demo' 
    //   {
    //     field: 'price',
    //     width: 100,
    //     suppressFilter: true,
    //     cellRendererFramework: 'CellRender',
    //     cellRendererParams: {
    //       renderComponent: ImageComponent
    //     }
    //   }
    // ];

    // const arr = []

    // arr.push(
    //   { make: 'Toyota', model: 'Celica', price: 'http://r3-project-file.oss-cn-hangzhou.aliyuncs.com/haha/41da6d24-db48-4ce7-aee9-e7c026e3efcf.jpg' },
    //   { make: 'Ford', model: 'Mondeo', price: 'http://r3-project-file.oss-cn-hangzhou.aliyuncs.com/haha/41da6d24-db48-4ce7-aee9-e7c026e3efcf.jpg' },
    //   { make: 'Porsche', model: 'Boxter', price: 'http://r3-project-file.oss-cn-hangzhou.aliyuncs.com/haha/41da6d24-db48-4ce7-aee9-e7c026e3efcf.jpg' })
    // this.options.rowData = arr

    this.options.datas = {
      tabth: [],
      row: []
    }
  },


  mounted() {
    // http.post('/ad-app/p/cs/QueryList', urlSearchParams({ searchdata: { "table": "AD_TABLE", "startindex": 0, "fixedcolumns": { "ISACTIVE": ["=Y"] }, "column_include_uicontroller": true, "isolr": false } })).then(res => {
    //   console.log('接口', res.data.data);
    //   const data = res.data.data
    //   this.$set(this.options, 'datas', data)
    //   this.rows = data.row
    //   this.columns = data.tabth
    // })

    // http.post('/ad-app/p/cs/objectTableItem', urlSearchParams({ table: 'TESTTABLE', objid: 56, refcolid: 164803, searchdata: { "column_include_uicontroller": true, "startindex": 0, "range": 10, "fixedcolumns": {} } })).then(res => {
    //   console.log('接口', res.data.data);
    //   const data = res.data.data
    //   this.$set(this.options, 'datas', data)
    //   this.rows = data.row
    //   this.columns = data.tabth
    // })
  }
}
</script>

<style lang="scss">
.container {
  height: calc(100vh - 78px);
  display: flex;
  // border: 1px solid red;
  .content {
    flex: 1;
  }
}

.highlight {
  color: red;
}
</style>