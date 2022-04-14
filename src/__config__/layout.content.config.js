import ContentDisplayArea from '../__component__/ContentDisplayArea';
import navAlert from '../__component__/nav/Alert.vue';

export default {
  direction: 'row',
  class:'r3-vertical-content',
  items: [
    {
      weight: 1,
      class:'r3-content-div',
      style: {
        backgroundColor: '#f1f1f1',
        overflow: 'hidden'
      },
      layout: {
        class:'r3-content-box',
        direction: 'column',
        items: [
          {
            weight: 1,
            class:'r3-content-ContentDisplayArea',
            style: { margin: '10px', backgroundColor: '#fff', overflow: 'hidden' },
            component: ContentDisplayArea,
          }
        ]
      }
    }
  ],
};
