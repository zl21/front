<script>
  import appLayout from '../__config__/layout/app.config';

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
        overflow: 'hidden'
      }}>
      {
        layout.items.map(item => <div style={Object.assign(item.style || {}, {
          width: `${item.width}px`,
          height: `${item.height}px`,
          flexShrink: (item.width === undefined && item.height === undefined) ? item.weight : 'none',
          flexGrow: (item.width === undefined && item.height === undefined) ? item.weight : 'none',
          flexBasis: (item.width === undefined && item.height === undefined) ? '1px' : 'none',
          overflow: 'hidden'
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
      return renderSubLayout(h)(appLayout);
    }
  };
</script>
