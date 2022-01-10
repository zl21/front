import NavigatorVertical from '../__component__/NavigatorVertical';
import NaVertical from '../__component__/NaVertical';

import ContentDisplayArea from '../__component__/ContentDisplayArea';
import navAlert from '../__component__/nav/Alert.vue';

export default {
  direction: 'row',
  class:'r3-vertical-content',
  items: [
    {
      component: NavigatorVertical,
      name: 'NavigatorVertical', // global.showModule.Navigator = false时，此选项不渲染。
    },
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
            class:'r3-content-Alert',
            component: navAlert,
            name: 'Navigator-Alert',
          },
          {
            class:'r3-content-nav',
            style: { margin: '10px 10px 0 10px', backgroundColor: '#fff', overflow: 'hidden' },
            component: NaVertical,
          },
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
