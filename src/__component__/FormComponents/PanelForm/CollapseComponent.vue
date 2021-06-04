<template>

  <Collapse :value="value">
    <Panel title-type="center"
           :isTitleShow="isTitleShow"
           :name="name">
            {{parentdesc}}
            <div slot="content">
                  <slot></slot>
            </div>
    </Panel>
  </Collapse>

</template>
<script>

export default {
  name: 'collapseComponent',
  props: {
    value: {
      type: [Array],
      default: []
    },
    isTitleShow: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    parentdesc: {
      type: String,
      default: ''
    }

  }
};
</script>
