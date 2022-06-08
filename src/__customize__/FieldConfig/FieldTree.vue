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
      ></Tree>
    </div>
    <div class="add-field-btn">
      <Poptip
        transfer
        placement="right"
        trigger="click"
        popper-class="ak-add-options"
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
        <span style="cursor: pointer;">{{$t('fieldConfig.add')}}</span>
      </Poptip>

    </div>
    <!-- <Dropdown
      transfer
      placement="top"
      trigger="click"
    >
      <div class="add-field-btn">
        <Icon type="ios-add-circle-outline" />
        <span>{{$t('fieldConfig.add')}}</span>
      </div>

      <DropdownMenu slot="list">
        <DropdownItem>驴打滚</DropdownItem>
        <DropdownItem>炸酱面</DropdownItem>
      </DropdownMenu>
    </Dropdown> -->
  </div>
</template>

<script type="text/ecmascript-6">
import i18n from '../../assets/js/i18n'

const prefixClass = `field-tree`;

export default {
  name: 'FieldTree',

  data() {
    return {
      prefixClass,
      data: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
            },
            {
              title: 'parent 1-2',
              expand: true,
            }
          ]
        },
        {
          title: 'parent 2',
          expand: true,
          children: [
            {
              title: 'parent 2-1',
              expand: true,
            },
            {
              title: 'parent 2-2',
              expand: true,
            }
          ]
        }
      ],
      query: ''
    }
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },

  methods: {
    add(option) {
      this.$emit('add-field', option)
    },
  },

  mounted() {
  }
}
</script>

<style lang="scss">
@import './index.less';
</style>