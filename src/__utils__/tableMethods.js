// 获取固定列
export function getPinnedColumns(pinnedPosition) {
  let pinnedLeftColumns = []
  let pinnedRightColumns = []

  if (pinnedPosition) {
    // 举例：接口返回数据值为 ID, KEY | DATE, NUM ，其中 | 左侧的数据代表固定在右边， | 右侧的数据代表固定在右边
    const pinnedColumns = pinnedPosition.split('|');
    pinnedLeftColumns = pinnedColumns[0].split(',');
    if (pinnedColumns[1]) {
      pinnedRightColumns = pinnedColumns[1].split(',');
    }
  }
  return {
    pinnedLeftColumns,
    pinnedRightColumns
  }
}