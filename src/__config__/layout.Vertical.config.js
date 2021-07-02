import NavigatorVertical from '../__component__/NavigatorVertical';
import NaVertical from '../__component__/NaVertical';

import ContentDisplayArea from '../__component__/ContentDisplayArea';

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
      style: {
        backgroundColor: '#f1f1f1',
        overflow: 'hidden'
      },
      layout: {
        direction: 'column',
        items: [
          {
            style: { margin: '10px 10px 0 10px', backgroundColor: '#fff', overflow: 'hidden' },
            component: NaVertical,
          },
          {
            weight: 1,
            style: { margin: '10px', backgroundColor: '#fff', overflow: 'hidden' },
            component: ContentDisplayArea,
          }
        ]
      }
    }
  ],
};
