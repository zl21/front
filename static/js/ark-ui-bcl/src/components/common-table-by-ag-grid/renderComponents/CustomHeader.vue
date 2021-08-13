<template>
  <span
    v-if="params.column.colDef.checkboxSelection"
    :title="params.headerName || params.displayName"
    class="ag-header-index"
  >{{params.headerName || params.displayName}}</span>
  <div
    v-else
    class="ag-cell-label-container"
    @mouseenter="containerMouseenter"
    @mouseleave="containeroMouseleave"
    @click="headerClick"
  >
    <span
      ref="eMenu"
      class="ag-header-icon ag-header-cell-menu-button"
      :style="eMenuStyle"
      @click="menuClick"
    >
      <span class="ag-icon ag-icon-menu"></span>
    </span>
    <div
      ref="eLabel"
      class="ag-header-cell-label"
      role="presentation"
      :style="eLabelStyle"
    >
      <div
        class="one-line-flow ag-header-wrap"
        :class="[params.column.colDef.thAlign? `text-${params.column.colDef.thAlign}` : '']"
      >
        <!-- displayName被ag废弃了，做下兼容 -->
        <span
          ref="eText"
          class="ag-header-cell-text"
          role="columnheader"
          :title="params.headerName || params.displayName"
        >
          {{params.headerName || params.displayName}}
          <i
            :class="['iconfont', 'comment', 'iconios-information-circle-outline', cssFeatures.hover]"
            style="color: orangered"
            v-if="params.column.colDef.comment"
            @mouseenter="commentMouseenter"
            @mouseleave="commentMouseleave"
          ></i>
        </span>
        <!-- <span
        ref="eSortOrder"
        class="ag-header-icon ag-sort-order"
      ></span> -->
        <span
          ref="eSortAsc"
          :class="['ag-header-sort', 'ag-header-icon' ,'ag-sort-ascending-icon' ,params.column.colDef.isorder && params.column.colDef.sort === 'asc' ? '' : 'ag-hidden']"
        >
          <span class="ag-icon ag-icon-asc ${cssFeatures.hover} trigger-sorting"></span>
        </span>
        <span
          ref="eSortDesc"
          :class="['ag-header-sort', 'ag-header-icon' ,'ag-sort-descending-icon', params.column.colDef.isorder && params.column.colDef.sort === 'desc' ? '' : 'ag-hidden']"
        >
          <span class="ag-icon ag-icon-desc ${cssFeatures.hover} trigger-sorting"></span>
        </span>
        <span
          ref="eSortNone"
          :class="['ag-header-sort', 'ag-header-icon', 'ag-sort-none-icon', !params.column.colDef.sort && params.column.colDef.isorder ? '' : 'ag-hidden']"
        >
          <span class="ag-icon ag-icon-none ${cssFeatures.hover} trigger-sorting"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from '../../../utils/common'

const cssFeatures = {
  hover: 'ag-syman-hover',
  imagePreviewBox: 'image-preview-box',
  tooltipBox: 'tooltip-box',
  tooltipTopBox: 'tooltip-top-box',
  textRight: 'text-right',
  attachment: 'attachment',
};

export default {
  name: 'AgCustomHeader',

  data() {
    return {
      cssFeatures,
    }
  },

  computed: {
    eMenuStyle() {
      return `opacity: 0; ${this.params.enableMenu ? '' : 'display: none;'}`
    },

    eLabelStyle() {
      return `${this.params.enableMenu ? '' : 'width: 100%;'}`
    }
  },

  methods: {
    commentMouseenter(e) {
      const { target } = e;
      const offsetLeft = target.getBoundingClientRect().left;
      const offsetTop = target.getBoundingClientRect().top;
      const { tooltipTopBox, column } = this.params;
      tooltipTopBox.innerText = column.colDef.comment;
      tooltipTopBox.style.display = '';
      tooltipTopBox.style.top = `${offsetTop - tooltipTopBox.offsetHeight - 7}px`;
      tooltipTopBox.style.left = `${offsetLeft - (tooltipTopBox.offsetWidth / 2)}px`;
    },

    commentMouseleave() {
      const { tooltipTopBox } = this.params;
      tooltipTopBox.style.display = 'none';
    },

    containerMouseenter() {
      const { enableMenu } = this.params;
      if (enableMenu) {
        this.$refs.eMenu.style.opacity = 1;
      }
    },

    containeroMouseleave() {
      this.$refs.eMenu.style.opacity = 0;
    },

    menuClick() {
      if (this.params.enableMenu) {
        this.params.showColumnMenu(this.$refs.eMenu)
      }
    },

    headerClick(event) {
      if (this.params.column.colDef.isorder && event.target.getAttribute('class').indexOf('trigger-sorting') > -1) {
        this.params.progressSort(event.shiftKey);
      }
    },

    // 给列添加排序监听
    onSortChanged: debounce(function () {
      const { column } = this.params;
      const { eSortAsc, eSortDesc, eSortNone } = this.$refs;

      const sortState = column.getSort();
      if (sortState === 'asc') {
        eSortAsc && eSortAsc.classList.remove('ag-hidden');
      } else {
        eSortAsc && eSortAsc.classList.add('ag-hidden');
      }

      if (sortState === 'desc') {
        eSortDesc && eSortDesc.classList.remove('ag-hidden');
      } else {
        eSortDesc && eSortDesc.classList.add('ag-hidden');
      }

      if (sortState === null && column.colDef.isorder) {
        // 只有当此列允许排序，并且当前排序模式为null时，则显示图标
        eSortNone && eSortNone.classList.remove('ag-hidden');
      } else {
        eSortNone && eSortNone.classList.add('ag-hidden');
      }
    })
  },

  mounted() {
    // 处理排序信息
    const { enableSorting, column } = this.params
    if (enableSorting) {
      column.addEventListener('sortChanged', this.onSortChanged);
    }
  },

  beforeDestroy() {
    this.params.column.removeEventListener('sortChanged', this.onSortChanged)
  }
}
</script>

<style lang="scss" scoped>
@import url('../../../assets/tailwindcss/index.css');
.ag-syman-hover {
  cursor: pointer;
}

.ag-theme-balham .ag-header-cell-label span {
  height: 11px;
}

.ag-header-wrap {
  width: 100%;
}

.ag-header-cell-text .comment {
  vertical-align: -2px;
}

.ag-header-sort {
  vertical-align: -2px;
}

.ag-header-index {
  vertical-align: 10px;
}

// 菜单居右对齐不占位置
.ag-header-cell-menu-button {
  position: absolute;
  right: 3px;
  z-index: 1;
}

.ag-theme-balham .ag-header-cell-label {
  width: 100%;
}
</style>

<style lang="scss">
.ag-grid-table.ag-theme-balham .ag-header-cell,
.ag-theme-balham .ag-header-group-cell {
  padding-left: 16px;
  padding-right: 16px;
}
</style>