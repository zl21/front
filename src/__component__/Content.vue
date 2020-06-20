<script>
  import { layoutDirection, contentConfig } from '../constants/global';
  
 
  const appLayout = () => {
    const appLayoutSrc = layoutDirection() ? 'layout.Vertical.config.js' : 'layout.config.js';
    const appLayoutConfig = () => require(`../__config__/${appLayoutSrc}`);
    if (window.ProjectConfig && window.ProjectConfig.appLayout) {
      return window.ProjectConfig.appLayout;
    }
    const config = appLayoutConfig().default;
    if (typeof contentConfig() === 'object') {
      if (config.items[1].layout.items[1].component.name === 'ContentDisplayArea') {
        config.items[1].layout.items[1].component = contentConfig();
      }
    }
    
    return appLayoutConfig().default;
  };
  
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
        layout.items.map(item => <div id={item.id} style={Object.assign(item.style || {}, {
          width: item.width ? `${item.width}px` : Object.assign({}, item.style).width,
          height: item.height ? `${item.height}px` : Object.assign({}, item.style).height,
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
      return renderSubLayout(h)(appLayout());
    }
  };
</script>
