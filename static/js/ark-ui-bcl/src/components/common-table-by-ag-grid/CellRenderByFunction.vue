<script type="text/ecmascript-6">
export default {
  name: 'CellRenderByFunction',

  render(h) {
    const params = {
      row: this.params.data,
      index: this.params.rowIndex,
      column: this.params.colDef
    };

    return this.params.renderComponent(h, params);
  },
}
</script>
