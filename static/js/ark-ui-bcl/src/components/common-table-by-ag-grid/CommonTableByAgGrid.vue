<template>
  <div>
    <ag-grid-table
      ref="agGridTable"
      :options="filteredOption"
      :height="height"
      :columns="columns"
      :data="data"
      :renderParams="renderFn"
      :mode="mode"
      :class="[border ? 'ag-border': '']"
      v-on="$listeners"
      @on-selection-change="tableSelectedChange"
      @on-sort-change="tableSortChange"
      @on-row-dblclick="tableRowDbclick"
      @grid-ready="tableGridReady"
    ></ag-grid-table>
  </div>
</template>

<script type="text/ecmascript-6">
import AgGridTable from './AgGridTable.vue'
import ImageComponent from './renderComponents/ImageComponent.vue'
import FkComponent from './renderComponents/FkComponent.vue'
import TextComponent from './renderComponents/TextComponent.vue'
import MopFkComponent from './renderComponents/MopFkComponent.vue'
import CustomerUrlComponent from './renderComponents/CustomerUrlComponent.vue'
import SequenceComponent from './renderComponents/SequenceComponent.vue'
import AttachmentComponent from './renderComponents/AttachmentComponent.vue'
import FieldMergeComponent from './renderComponents/FieldMergeComponent.vue'

const Common_Table_Mode = 'commonTable'

export default {
  name: 'CommonTableByAgGrid',

  inheritAttrs: false,

  components: {
    AgGridTable,
    ImageComponent,
    FkComponent,
    MopFkComponent,
    CustomerUrlComponent,
    SequenceComponent,
    AttachmentComponent,
    FieldMergeComponent
  },

  props: {
    // ag配置
    options: {
      type: Object,
      default: () => ({})
    },
    // 表格高度
    height: {
      type: [Number, String],
    },
    // 行数据
    data: {
      default: []
    },
    // 列数据
    columns: {
      default: []
    },
    // 列自定义组件渲染参数
    renderParams: {
      type: Function
    },
    // 表格展示模式，目前有commonTable(普通表格)
    mode: {
      type: String,
      default: ''
    },
    // 是否加边框
    border: {
      type: Boolean
    }
  },

  data() {
    return {
      api: null, // 表的api
      columnApi: null, // 表格列的api
    }
  },

  computed: {
    // 根据表格展示模式，重组表格参数
    filteredOption() {
      const option = {}
      const commonTableOptions = {
        floatingFilter: false
      }

      switch (this.mode) {
        case Common_Table_Mode:
          return Object.assign(option, commonTableOptions, this.options)
        default:
          return this.options
      }
    },

    // 获取自定义渲染函数
    renderFn() {
      return this.mode === 'r3-list' ? this.listRender : this.renderParams
    }
  },

  /**
   * ag被修改的方法统一用ag开头。避免和$listeners事件冲突
   */
  methods: {
    // 表格选中
    tableSelectedChange(e) {
      this.$emit('ag-selection-change', e)
    },

    // 表格排序
    tableSortChange(e) {
      if(this.mode === Common_Table_Mode) {
        this.$emit('ag-sort-change', {
          key: e[0].colId,
          order: e[0].sort
        })
      } else {
        this.$emit('ag-sort-change', e)
      }
    },

    // 行双击事件
    tableRowDbclick(e) {
      if(this.mode === Common_Table_Mode) {
        this.$emit('ag-row-dblclick', e.data)
      } else {
        this.$emit('ag-row-dblclick', e)
      }
    },

    // 表格渲染完毕
    tableGridReady(e) {
      this.api = this.$refs.agGridTable.api
      this.columnApi = this.$refs.agGridTable.columnApi
      this.$emit('grid-ready', e)
    },

    emptyAllFilters() {
      this.api && this.api.setFilterModel(null);
      if (this.$refs.agGridTable) {
        this.$refs.agGridTable.$el.querySelectorAll('.ag-floating-filter-input').forEach(e => { e.value = '' })
      }
    },

    fixAgRenderChoke() {
      this.$refs.agGridTable._fixAgRenderChoke()
    },

    // r3列表渲染逻辑
    listRender(cellData) {
      let renderObj = {
        renderComponent: TextComponent
      }
      if (cellData.display === 'doc') {
        renderObj.renderComponent = AttachmentComponent
      }
      if (cellData.colname === 'ID') {
        renderObj.renderComponent = SequenceComponent
      }
      if (cellData.customerurl) {
        renderObj.renderComponent = CustomerUrlComponent
      }
      if (cellData.isfk) {
        if (cellData.fkdisplay === 'mop') {
          renderObj.renderComponent = MopFkComponent
        } else if(cellData.fkdisplay === 'drp' || cellData.fkdisplay === 'pop') {
          renderObj.renderComponent = FkComponent
        }
      }
      if (cellData.display === 'image') {
        renderObj.renderComponent = ImageComponent
      }

      if(cellData.key_group && cellData.key_group.length > 0){
        renderObj.renderComponent = FieldMergeComponent
      }

      return renderObj
    }
  },
}
</script>
