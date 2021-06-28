<template>
  <div class=""
       style="height:100%">
    <slot></slot>
  </div>
</template>

<script>



export default {
  data () {
    return {
      enableTabLists: true
    };
  },
  components: {
  },
  name: 'Contentslot',
};
</script>


