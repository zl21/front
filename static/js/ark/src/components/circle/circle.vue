<template>
    <div :style="wrapStyle" :class="wrapClasses">
        <!--<svg viewBox="0 0 100 100">-->
            <!--<path :d="pathString" :stroke="trailColor" :stroke-width="trailWidth" :fill-opacity="0" :style="trailStyle" />-->
            <!--<path :d="pathString" :stroke-linecap="strokeLinecap" :stroke="strokeColor" :stroke-width="computedStrokeWidth" fill-opacity="0" :style="pathStyle" />-->
        <!--</svg>-->
        <svg viewBox="0 0 200 200">
            <circle
                :style="{stroke: trailColor}"
                cx="100"
                cy="100"
                :r="r"
                :stroke-width="compuStrokeWidth"
                fill="transparent"></circle>
            <circle
                :class="frontCls"
                :style="{stroke: strokeColor}"
                cx="100"
                cy="100"
                :r="r"
                fill="transparent"
                :stroke-dasharray="dasharray"
                :stroke-width="width"
                :stroke-linecap="strokeLinecapTrans"></circle>
        </svg>
        <div :class="innerClasses">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    import { oneOf } from '../../utils/assist';
    import burgeonConfig from '../../assets/config';

    const prefixCls = `${burgeonConfig.prefixCls}chart-circle`;

    export default {
        name: 'iCircle',
        props: {
            percent: {
                type: Number,
                default: 0
            },
            styles: {
                type: Object
            },
            size: {
                type: Number,
                default: 100
            },
            strokeWidth: {
                type: Number,
                default: 8
            },
            strokeColor: {
                type: String,
                default: '#2d8cf0'
            },
            strokeLinecap: {
                validator (value) {
                    return oneOf(value, ['square', 'butt', 'round']);
                },
                default: 'round'
            },
            trailColor: {
                type: String,
                default: '#eaeef2'
            },
            dashboard: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            circleSize () {
                return {
                    width: `${this.size}px`,
                    height: `${this.size}px`
                };
            },
            wrapStyle() {
                return Object.assign({}, { width: `${this.size}px`, height: `${this.size}px` }, this.styles);
            },
            computedStrokeWidth () {
                return this.percent === 0 && this.dashboard ? 0 : this.strokeWidth;
            },
            trailStyle () {
                let style = {};
                if (this.dashboard) {
                    style = {
                        'stroke-dasharray': `${this.len - 75}px ${this.len}px`,
                        'stroke-dashoffset': `-${75 / 2}px`,
                        transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s'
                    };
                }
                return style;
            },
            wrapClasses () {
                return `${prefixCls}`;
            },
            frontCls () {
                return `${prefixCls}-front`;
            },
            innerClasses () {
                return `${prefixCls}-inner`;
            },

            compuStrokeWidth() {
                return this.strokeWidth * 2;
            },
            r() {
                return 100 - Math.ceil(((this.strokeWidth * 2) / this.size) * 100);
            },
            p() {
                return Math.PI * 2 * this.r;
            },

            dasharray() {
                return [this.p * (this.percent / 100), this.p * (1 - this.percent / 100)];
            },
            strokeLinecapTrans() {
                return this.strokeLinecap === 'square' || this.strokeLinecap === 'butt' ? 'butt' : 'round';
            },
            width() {
                return this.percent === 0 && this.strokeLinecap === 'round' ? 0 : this.strokeWidth * 2;
            }
        }
    };
    </script>
