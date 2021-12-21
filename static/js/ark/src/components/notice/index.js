import Vue from 'vue';

import burgeonConfig from '../../assets/config';
import NotificationCon from '../base/notification/notification.vue';

const NotificationConstructor = Vue.extend(NotificationCon);

const prefixCls = `${burgeonConfig.prefixCls}notice`;
const iconPrefixCls = `${burgeonConfig.prefixCls}icon`;
const prefixKey = `${burgeonConfig.prefixCls}notice_key_`;

let top = 24;
let defaultDuration = 4.5;
let noticeInstance;
let instance;
let instances = [];
let name = 1;
let seed = 1;

const iconTypes = {
    info: 'iconios-information-circle',
    success: 'iconios-checkmark-circle',
    warning: 'iconios-alert',
    error: 'iconios-close-circle'
};

const Notification = function(options) {
    options = Object.assign({}, options);
    const userOnClose = options.onClose;
    const id = `notification_${seed++}`;
    const position = options.position || 'top-right';

    const onClose = function() {
        Notification.close(id, userOnClose);
    };

    let verticalOffset = 0;
    instances.filter(item => item.position === position).forEach(item => {
        verticalOffset += item.$el.offsetHeight + 16;
    });

    verticalOffset += 16;
    instance = new NotificationConstructor({
        propsData: {
            id,
            position,
            verticalOffset,
            onClose,
            prefixCls: prefixCls
        }
    });

    instance.id = id;
    instance.position = position;
    instance.$mount();
    document.body.appendChild(instance.$el);
    instance.dom = instance.$el;
    instance.notice = (noticeProps) => instance.add(noticeProps);
    instance.remove = (name) => instance.close(name);
    instance.destroy = (element) => {
        instance.destroy();
        setTimeout(function() {
            document.body.removeChild(document.getElementsByClassName(element)[0]);
        }, 500);
    };
    instances.push(instance);
    // console.log('instance', instance)
    // console.log('instances', instances)

    return instance;
};

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

    let instance = Notification(options);

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


['open', 'success', 'warning', 'info', 'error'].forEach(type => {
    Notification[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options
            };
        }
        options.type = type === 'open' ? 'normal' : type;
        return notice(type, options);
    };
});

Notification.close = function(id, userOnClose) {
    let index = -1;
    const len = instances.length;
    const instance = instances.filter((instance, i) => {
        if (instance.id === id) {
            index = i;
            return true;
        }
        return false;
    })[0];
    if (!instance) return;

    if (typeof userOnClose === 'function') {
        userOnClose(instance);
    }
    instances.splice(index, 1);

    if (len <= 1) return;
    const position = instance.position;
    const removedHeight = instance.dom.offsetHeight;
    for (let i = index; i < len - 1 ; i++) {
        if (instances[i].position === position) {
            instances[i].dom.style[instance.verticalProperty] =
                window.parseInt16(instances[i].dom.style[instance.verticalProperty], 10) - removedHeight - 16 + 'px';
        }
    }
};

Notification.destroy = function() {
    for (let i = instances.length - 1; i >= 0; i--) {
        instances[i].close();
    }
};

export default Notification;
