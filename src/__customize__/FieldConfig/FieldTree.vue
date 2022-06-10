<template>
  <div :class="prefixClass">
    <Input
      suffix="ios-search"
      :placeholder="$t('fieldConfig.enterField')"
      class="field-search"
      v-model="query"
    />

    <div class="tree-wrap">
      <Tree
        :data="data"
        show-checkbox
        :query="query"
        :queryStyle="{
          color: 'red'
        }"
        @on-check-change="handleCheck"
      ></Tree>
    </div>
    <div class="add-field-btn">
      <Poptip
        transfer
        placement="right"
        trigger="click"
        popper-class="ak-add-options"
        v-if="!isDisabled"
      >
        <template slot="content">
          <div
            class="ak-add-option"
            @click="add(1)"
          >{{$t('fieldConfig.addTable')}}</div>
          <div
            class="ak-add-option"
            @click="add(2)"
          >{{$t('fieldConfig.addFilter')}}</div>
        </template>
        <Icon
          style="cursor: pointer;"
          type="ios-add-circle-outline"
        />
        <span style="cursor: pointer;margin-top: 4px;display: inline-block;">{{$t('fieldConfig.add')}}</span>
      </Poptip>


      <template v-else>
        <Icon
          style="margin-right: 4px;"
          type="ios-add-circle-outline"
          class="disable-color"
        />
        <span class="disable-color">{{$t('fieldConfig.add')}}</span>
      </template>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import i18n from '../../assets/js/i18n'

const prefixClass = `field-tree`;

export default {
  name: 'FieldTree',

  props: {
    data: {}
  },

  data() {
    return {
      prefixClass,
      query: '',
      checkedList: []
    }
  },

  computed: {
    isDisabled() {
      return this.checkedList.length === 0
    }
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },

  methods: {
    add(option) {
      this.$emit('add-field', option, JSON.parse(JSON.stringify(this.checkedList)))
      this.checkedList = []
    },
    
    handleCheck(e) {
      this.checkedList = e.filter(item => item.title !== this.$t('fieldConfig.availableFields'))
    }
  },

  mounted() {
  }
}
</script>

<style lang="scss">
</style>