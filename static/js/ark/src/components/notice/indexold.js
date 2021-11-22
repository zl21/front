import Notification from '../base/notification';
import burgeonConfig from '../../assets/config';

const prefixCls = `${burgeonConfig.prefixCls}notice`;
const iconPrefixCls = `${burgeonConfig.prefixCls}icon`;
const prefixKey = `${burgeonConfig.prefixCls}notice_key_`;

let top = 24;
let defaultDuration = 4.5;
let noticeInstance;
let instances = [];
let name = 1;
let seed = 1;

const iconTypes = {
    info: 'iconios-information-circle',
    success: 'iconios-checkmark-circle',
    warning: 'iconios-alert',
    error: 'iconios-close-circle'
};

function getNoticeInstance (position) {
    const id = `notification_${seed++}`;
    let ids = [];
    // console.log('====start===')

    // 当右上角的内容存在后，再重新构建
    // if (instances && instances.length > 0) {
    //     ids = instances.map(v => v.position);
    // }
    // if (ids.indexOf(position) === -1) {

    let verticalOffset = 0;
    instances.filter(item => item.component.$children.length > 0 && item.position === position).forEach(item => {
        verticalOffset += item.component.$el.offsetHeight + 16;
    });

    verticalOffset += 16;

    noticeInstance = Notification.newInstance({
        id,
        position,
        verticalOffset,
        prefixCls: prefixCls,
    });

    // console.log('verticalOffset', verticalOffset)
    // noticeInstance.component.styles = Object.assign({}, noticeInstance.component.styles, {
    //     top: `${verticalOffset}px`,
    //     right: 0
    // });
    instances.push(noticeInstance);
    // }
    // console.log('instances', instances);
    // console.log('noticeInstance-end', noticeInstance);

    // console.log('====end===')

    return noticeInstance;
}

function notice (type, options) {
    const title = options.title || '';
    const desc = options.desc || '';
    const position = options.position || 'top-right';
    const noticeKey = options.name || `${prefixKey}${name}`;
    const onClose = options.onClose || function () {};
    const {render} = options;
    const {contentComponent} = options;
    // todo const btn = options.btn || null;
    const duration = options.duration === 0 ? 0 : options.duration || defaultDuration;

    name++;

    let instance = getNoticeInstance(position);

    let content;

    let withIcon;

    const with_desc = options.render && !title ? '' : desc || options.render ? ` ${prefixCls}-with-desc` : '';

    if (type == 'normal') {
        withIcon = false;
        content = `
            <div class="${prefixCls}-custom-content ${prefixCls}-with-normal ${with_desc}">
                <div class="${prefixCls}-title">${title}</div>
                <div class="${prefixCls}-desc">${desc}</div>
            </div>
        `;
    } else {
        const iconType = iconTypes[type];
        const outlineIcon = with_desc === '' ? '' : '-outline';
        withIcon = true;
        content = `
            <div class="${prefixCls}-custom-content ${prefixCls}-with-icon ${prefixCls}-with-${type} ${with_desc}">
                <span class="${prefixCls}-icon ${prefixCls}-icon-${type}">
                    <i class="${iconPrefixCls} ${iconPrefixCls} ${iconType}${outlineIcon}"></i>
                </span>
                <div class="${prefixCls}-title">${title}</div>
                <div class="${prefixCls}-desc">${desc}</div>
            </div>
        `;
    }
    instance.notice({
        name: noticeKey.toString(),
        duration: duration,
        position: position,
        styles: {},
        transitionName: 'move-notice',
        content: content,
        withIcon: withIcon,
        render: render,
        hasTitle: !!title,
        onClose: onClose,
        closable: true,
        type: 'notice',
        contentComponent: contentComponent
    });
}

export default {
    open (options) {
        return notice('normal', options);
    },
    info (options) {
        return notice('info', options);
    },
    success (options) {
        return notice('success', options);
    },
    warning (options) {
        return notice('warning', options);
    },
    error (options) {
        return notice('error', options);
    },
    config (options) {
        if (options.top) {
            top = options.top;
        }
        if (options.duration || options.duration === 0) {
            defaultDuration = options.duration;
        }
    },
    close (name) {
        console.log('close')

        if (name) {
            name = name.toString();
            if (noticeInstance) {
                noticeInstance.remove(name);
            }
        } else {
            return false;
        }
    },
    destroy () {
        console.log('destroy')
        let instance = getNoticeInstance();
        noticeInstance = null;
        instance.destroy(`${burgeonConfig.prefixCls}notice`);
    }
};
