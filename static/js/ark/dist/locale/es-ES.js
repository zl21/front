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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
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
        locale: 'es-ES',
        select: {
            placeholder: 'Seleccionar',
            noMatch: 'Sin coincidencias',
            loading: 'Cargando'
        },
        table: {
            noDataText: 'Sin Datos',
            noFilteredDataText: 'Sin Datos para el filtro',
            confirmFilter: 'Aceptar',
            resetFilter: 'Quitar filtro',
            clearFilter: 'Todos'
        },
        datepicker: {
            selectDate: 'Seleccionar fecha',
            selectTime: 'Seleccionar hora',
            startTime: 'Hora de inicio',
            endTime: 'Hora de fin',
            clear: 'Limpiar',
            ok: 'Aceptar',
            datePanelLabel: '[mmmm] [yyyy]',
            month: 'Mes',
            month1: 'Enero',
            month2: 'Febrero',
            month3: 'Marzo',
            month4: 'Abril',
            month5: 'Mayo',
            month6: 'Junio',
            month7: 'Julio',
            month8: 'Augosto',
            month9: 'Septiembre',
            month10: 'Octubre',
            month11: 'Noviembre',
            month12: 'Diciembre',
            year: 'Año',
            weekStartDay: '1',
            weeks: {
                sun: 'Dom',
                mon: 'Lun',
                tue: 'Mar',
                wed: 'Mié',
                thu: 'Jue',
                fri: 'Vie',
                sat: 'Sáb'
            },
            months: {
                m1: 'Ene',
                m2: 'Feb',
                m3: 'Mar',
                m4: 'Abr',
                m5: 'May',
                m6: 'Jun',
                m7: 'Jul',
                m8: 'Ago',
                m9: 'Sep',
                m10: 'Oct',
                m11: 'Nov',
                m12: 'Dic'
            }
        },
        transfer: {
            titles: {
                source: 'Origen',
                target: 'Destino'
            },
            filterPlaceholder: 'Buscar aquí',
            notFoundText: 'Sin resultados'
        },
        modal: {
            okText: 'Aceptar',
            cancelText: 'Cancelar'
        },
        poptip: {
            okText: 'Aceptar',
            cancelText: 'Cancelar'
        },
        page: {
            prev: 'Página Anterior',
            next: 'Página Siguiente',
            total: 'Total',
            item: 'Elemento',
            items: 'Elementos',
            prev5: '5 Páginas Anteriores',
            next5: '5 Páginas Siguientes',
            page: '/page',
            goto: 'Ir a',
            p: ''
        },
        rate: {
            star: 'Estrella',
            stars: 'Estrellas'
        },
        tree: {
            emptyText: 'Sin Datos'
        }
    }
};

(0, _lang2.default)(lang);

exports.default = lang;

/***/ })
/******/ ]);
});
//# sourceMappingURL=es-ES.js.map