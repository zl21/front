export function scrollTo(dom, drag = 8) {
  let lastTop = null
  const scroll = () => {
    const top = dom.scrollTop
    // 如果还没滚到顶部，就回滚，则需要取消动画
    if (lastTop !== null && top > lastTop) {
        window.cancelAnimationFrame(scroll)
        return
    }
    if (top > 0) {
      dom.scrollTop = top - top / drag // 阻力，数值越大，滑动越慢
      lastTop = top
      window.requestAnimationFrame(scroll)
    }
  }

  scroll()
}
