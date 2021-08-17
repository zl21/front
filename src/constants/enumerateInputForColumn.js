import i18n from '../assets/js/i18n'

const list = {
  enumerableLists: [
    {
      text: () => {
        return i18n.t('messages.visibleAddInterface')
      },
      value: 1,
      clickableWhenEdit: true,
    },
    {
      text: () => {
        return i18n.t('messages.editAddInterface')
      },
      value: 1,
      clickableWhenEdit: true,
    },
    {
      text: () => {
        return i18n.t('messages.visibleEditInterface')
      },
      value: 1,
      clickableWhenEdit: true,
    },
    {
      text: () => {
        return i18n.t('messages.editInEditInterface')
      },
      value: 1,
      clickableWhenEdit: true,
    },
    {
      text: () => {
        return i18n.t('messages.visibleListInterface')
      },
      value: 1,
      clickableWhenEdit: true,
    },
    {
      text: () => {
        return i18n.t('messages.invisibleAndDefault')
      },
      value: 1,
      clickableWhenEdit: true,
    },
    {
      text: () => {
        return i18n.t('messages.batchModifyVisible')
      },
      value: 1,
      clickableWhenEdit: true,
    },
    {
      text: '',
      value: 0,
      hide: true,
    },
    {
      text: '',
      value: 0,
      hide: true,
    },
    {
      text: '',
      value: 0,
      hide: true,
    },
  ],
  strictMode: true,
}

// 为了保证切换语言包后拿到正确值，此处直接通过劫持属性获取函数返回值。避免再去引用文件中修改变量的使用方法
const proxyList = {
  enumerableLists: [],
  strictMode: true,
}
list.enumerableLists.forEach((item, index) => {
  proxyList.enumerableLists.push({...item})
  Object.defineProperty(proxyList.enumerableLists[index], 'text', {
    get() {
      return proxyList.enumerableLists[index].text()
    },
  })
})

export default proxyList
