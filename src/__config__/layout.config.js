import NavigatorVertical from '../__component__/NavigatorVertical';
import ContentDisplayArea from '../__component__/ContentDisplayArea';
import HistoryAndFavorite from '../__component__/HistoryAndFavorite';

export default {
  direction: 'row',
  items: [
    {
      height: 50,
      component: NavigatorVertical,
      name: 'Navigator', // global.showModule.Navigator = false时，此选项不渲染。
    },
    {
      weight: 1,
      style: {
        backgroundColor: '#f1f1f1',
        overflow: 'hidden'
      },
      layout: {
        direction: 'row',
        items: [
          {
            component: HistoryAndFavorite,
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
