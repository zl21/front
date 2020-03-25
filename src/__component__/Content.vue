<script>
  import { layoutDirection } from '../constants/global';


  const appLayoutConfig = () => require(`../__config__/${layoutDirection() !== 'Vertical' ? 'layout.config.js' : `layout.${layoutDirection()}.config.js`}`);
  const appLayout = appLayoutConfig().default;
  /**
   * 高级函数：用于采用JSX渲染Vue的Html Template
   * @param h vue中render函数createElement的参数简写
   * @returns {function(*): *} 返回值同样是一个函数，用于生成递归布局结构
   */
  const renderSubLayout = h => layout => (
    <div
      style={{
        flexDirection: layout.direction,
        display: 'flex',
        height: '100%',
        width: '100%',
      }}>
      {
        layout.items.map(item => <div style={Object.assign(item.style || {}, {
          width: `${item.width}px`,
          height: `${item.height}px`,
          flexShrink: (item.width === undefined && item.height === undefined) ? item.weight : undefined,
          flexGrow: (item.width === undefined && item.height === undefined) ? item.weight : undefined,
          flexBasis: (item.width === undefined && item.height === undefined) ? `${item.weight}px` : undefined,
        })}>
          {item.component !== undefined ? h(item.component) : ''}
          {item.layout ? renderSubLayout(h)(item.layout) : ''}
        </div>)
      }
    </div>
  );

  export default {
    name: 'Content',
    render(h) {
      return renderSubLayout(h)(window.ProjectConfig && window.ProjectConfig.appLayout ? window.ProjectConfig.appLayout : appLayout);
    }
  };
</script>
