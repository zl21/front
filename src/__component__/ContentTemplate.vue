<template>
  <div style="height:100%"
  >
   <contentdiv/>
    <!-- <Contentverticalslot>
        <NavigatorVertical slot="R3-header"/>
        <NaVertical  slot="R3-left"/>
        <ContentDisplayArea slot="R3-content" />
    </Contentverticalslot>   -->
    
  </div>
</template>

<script>
import NavigatorVertical from '../__component__/NavigatorVertical';
import NaVertical from '../__component__/NaVertical';
import ContentDisplayArea from '../__component__/ContentDisplayArea';
import contentdiv from './Content.vue';

// import Contentverticalslot from './Contentverticalslot.vue';

  
  export default {
    data() {
      return {
        enableTabLists: true
      };
    },
    components: {
      contentdiv,
      NavigatorVertical,NaVertical,ContentDisplayArea

    },
    name: 'ContentTemplate',
  };
</script>


