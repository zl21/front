<script>
  import appLayout from './__config__/layout/app.config';

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
        layout.items.map(item => <div style={Object.assign(item.style, {
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
    name: 'App',
    render(h) {
      return renderSubLayout(h)(appLayout);
    }
  };
</script>
