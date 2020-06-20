import Navigator from '../__component__/Navigator';
import ContentDisplayArea from '../__component__/ContentDisplayArea';
import HistoryAndFavorite from '../__component__/HistoryAndFavorite';

export default {
  direction: 'column',
  items: [
    {
      height: 50,
      component: Navigator,
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
            id: 'ContentDisplayArea',
            weight: 1,
            style: { margin: '10px', backgroundColor: '#fff', overflow: 'hidden' },
            component: ContentDisplayArea,
          }
        ]
      }
    }
  ],
};
