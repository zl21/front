<template>
    <div>
            <p style="padding:20px"> {{parentdesc}}</p>
                <div slot="content">
                    <slot></slot>
                </div>
    </div>

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
