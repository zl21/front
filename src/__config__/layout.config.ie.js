// 此为文件为专为商飞定制的布局文件，目的是将body的全局滚动释放，不再采用一屏呈，布局内滚动的实现逻辑。此文件不会参与项目打包。
import Navigator from '../__component__/Navigator';
import ContentDisplayArea from '../__component__/ContentDisplayArea';
import HistoryAndFavorite from '../__component__/HistoryAndFavorite';

export default {
  direction: 'column',
  items: [
    {
      height: 50,
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: '999'
      },
      component: Navigator,
      name: 'Navigator', // global.showModule.Navigator = false时，此选项不渲染。
    },
    {
      weight: 1,
      style: {
        backgroundColor: '#f1f1f1',
        marginTop: '50px',
        // overflow: 'hidden'
      },
      layout: {
        direction: 'row',
        items: [
          {
            height: window.innerHeight - 50,
            component: HistoryAndFavorite,
            style: {
              position: 'fixed',
              top: '50px',
              zIndex: '999'
            }
          },
          {
            id: 'ContentDisplayArea',
            weight: 1,
            style: {
              minHeight: `${window.innerHeight - 70}px`,
              margin: '10px',
              backgroundColor: '#fff',
              overflow: 'hidden'
            },
            component: ContentDisplayArea,
          }
        ]
      }
    }
  ],
};
