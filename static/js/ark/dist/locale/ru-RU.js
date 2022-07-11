(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define("Ark/locale", ["vue"], factory);
	else if(typeof exports === 'object')
		exports["Ark/locale"] = factory(require("vue"));
	else
		root["Ark/locale"] = factory(root["Vue"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/locale/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (lang) {
    if (!isServer) {
        if (typeof window.Ark !== 'undefined') {
            if (!('langs' in Ark)) {
                Ark.langs = {};
            }
            Ark.langs[lang.i.locale] = lang;
        }
    }
};

var _vue = __webpack_require__(1);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isServer = _vue2.default.prototype.$isServer;

;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lang = __webpack_require__(0);

var _lang2 = _interopRequireDefault(_lang);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lang = {
    i: {
        locale: 'ru-RU',
        select: {
            placeholder: 'Выбрать',
            noMatch: 'Нет соответствующих данных',
            loading: 'Загрузка'
        },
        table: {
            noDataText: 'Нет данных',
            noFilteredDataText: 'Нет данных по фильтру',
            confirmFilter: 'Подтвердить',
            resetFilter: 'Сброс',
            clearFilter: 'Все'
        },
        datepicker: {
            selectDate: 'Выбрать дату',
            selectTime: 'Выбрать время',
            startTime: 'Начальное время',
            endTime: 'Конечное время',
            clear: 'Очистить',
            ok: 'OK',
            datePanelLabel: '[Mmmm] [yyyy]',
            month: '',
            month1: 'Январь',
            month2: 'Февраль',
            month3: 'Март',
            month4: 'Апрель',
            month5: 'Май',
            month6: 'Июнь',
            month7: 'Июль',
            month8: 'Август',
            month9: 'Сентябрь',
            month10: 'Октябрь',
            month11: 'Ноябрь',
            month12: 'Декабрь',
            year: '',
            weekStartDay: '1',
            weeks: {
                sun: 'Вс',
                mon: 'Пн',
                tue: 'Вт',
                wed: 'Ср',
                thu: 'Чт',
                fri: 'Пт',
                sat: 'Сб'
            },
            months: {
                m1: 'Янв',
                m2: 'Фев',
                m3: 'Мар',
                m4: 'Апр',
                m5: 'Май',
                m6: 'Июн',
                m7: 'Июл',
                m8: 'Авг',
                m9: 'Сен',
                m10: 'Окт',
                m11: 'Ноя',
                m12: 'Дек'
            }
        },
        transfer: {
            titles: {
                source: 'Источник',
                target: 'Цель'
            },
            filterPlaceholder: 'Искать здесь',
            notFoundText: 'Не Найдено'
        },
        modal: {
            okText: 'OK',
            cancelText: 'Отменить'
        },
        poptip: {
            okText: 'OK',
            cancelText: 'Отменить'
        },
        page: {
            prev: 'Пред. страница',
            next: 'След. страница',
            total: 'Всего',
            item: 'пункт',
            items: 'пункты',
            prev5: 'Пред. 5 страниц',
            next5: 'След. 5 страниц',
            page: '/page',
            goto: 'Идти к',
            p: ''
        },
        rate: {
            star: 'Звезда',
            stars: 'Звезды'
        },
        tree: {
            emptyText: 'Нет данных'
        }
    }
};

(0, _lang2.default)(lang);

exports.default = lang;

/***/ })

/******/ });
});
//# sourceMappingURL=ru-RU.js.map