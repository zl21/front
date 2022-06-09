<template>
  <DragList
    axis="y"
    :lock-to-container-edges="true"
    :press-delay="0"
    v-model="list"
    :class="prefixClass"
    :shouldCancelStart="shouldCancelStart"
    helper-class="field-drag"
  >
    <template v-slot="{item}">
      <div class="field-item">
        <div class="field-item-l">
          <Poptip
            transfer
            trigger="hover"
            popper-class="ak-drag-pop"
            :content="item.IS_ORDER ? $t('fieldConfig.disableSort') : $t('fieldConfig.enableSort')"
          >
            <i
              class="iconfont icon-sort1"
              :class="{'ark-btn-ghost ark-btn-primary': item.IS_ORDER}"
              v-if="enableSort"
              @click="toggleDrag(item)"
            ></i>
          </Poptip>
          <span
            :data-enable-drag="false"
            class="field-name"
            :title="item.value"
          >{{ item.value }}</span>
        </div>
        <i
          class="iconfont icon-md-close"
          @click="handleDelete($event, item.value)"
        ></i>
      </div>
    </template>
  </DragList>
</template>

<script type="text/ecmascript-6">
const prefixClass = `drag-panel`;
import i18n from '../../assets/js/i18n'

export default {
  name: 'DragPanel',

  components: {
    DragList: $Bcl.arkDragList
  },

  props: {
    value: {
      type: Array
    },
    enableSort: {
      type: Boolean
    }
  },

  data() {
    return {
      prefixClass
    }
  },

  model: {
    event: 'change',
    props: 'value'
  },

  computed: {
    list: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        this.$emit('change', newValue)
      }
    }
  },

  methods: {
    shouldCancelStart(e) {
      const enableDrag = e.target.dataset.enableDrag
      if (e.target.className.includes('field-name') && enableDrag) {
        return false
      } else {
        return true
      }
    },

    handleDelete(e, value) {
      const index = this.value.findIndex(item => {
        return item.value === value
      })
      this.value.splice(index, 1)
    },

    toggleDrag(row) {
      const index = this.value.findIndex(item => {
        return item.value === row.value
      })
      this.value[index].IS_ORDER = !this.value[index].IS_ORDER
    }
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },
}
</script>

<style lang="scss" scoped>
</style>