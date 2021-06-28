<template>
  <div style="height:100%"
  >
    <Contentslot>
      <contentdiv />
    </Contentslot>  
    
  </div>
</template>

<script>
  
  import content from './Content.vue';

  import Contentslot from './Contentslot.vue';

  
  export default {
    data() {
      return {
        enableTabLists: true
      };
    },
    components: {
      contentdiv:content,
      Contentslot:Contentslot
    },
    name: 'ContentTemplate',
  };
</script>


