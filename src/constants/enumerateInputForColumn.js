import i18n from '../assets/js/i18n';

export default {
  enumerableLists: [
    {
      text: i18n.t('messages.visibleAddInterface'),
      value: 1,
      clickableWhenEdit: true

    }, {
      text: i18n.t('messages.editAddInterface'),
      value: 1,
      clickableWhenEdit: true

    }, {
      text: i18n.t('messages.visibleEditInterface'),
      value: 1,
      clickableWhenEdit: true
    }, {
      text: i18n.t('messages.editInEditInterface'),
      value: 1,
      clickableWhenEdit: true

    }, {
      text: i18n.t('messages.visibleListInterface'),
      value: 1,
      clickableWhenEdit: true
    }, {
      text: i18n.t('messages.invisibleAndDefault'),
      value: 1,
      clickableWhenEdit: true

    }, {
      text: i18n.t('messages.batchModifyVisible'),
      value: 1,
      clickableWhenEdit: true

    }, {
      text: '',
      value: 0,
      hide: true,
    }, {
      text: '',
      value: 0,
      hide: true,
    }, {
      text: '',
      value: 0,
      hide: true,
    },
  ],
  strictMode: true,
};
