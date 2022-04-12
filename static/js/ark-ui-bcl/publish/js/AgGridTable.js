(self.webpackChunk$Bcl=self.webpackChunk$Bcl||[]).push([[592],{1528:(M,E,w)=>{E=M.exports=w(3645)(!1),E.push([M.id,`/**
 ****************************
 * Generic Styles
 ****************************
*/
ag-grid, ag-grid-angular, ag-grid-ng2, ag-grid-polymer, ag-grid-aurelia {
  display: block;
}

.ag-hidden {
  display: none !important;
}

.ag-invisible {
  visibility: hidden !important;
}

.ag-drag-handle {
  cursor: move;
  cursor: -webkit-grab;
  cursor: grab;
}

.ag-column-drop-wrapper {
  display: flex;
}

.ag-column-drop-horizontal-half-width {
  display: inline-block;
  width: 50% !important;
}

.ag-unselectable {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.ag-selectable {
  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.ag-tab {
  position: relative;
}

.ag-tab-guard {
  position: absolute;
  width: 0;
  height: 0;
  display: block;
}

.ag-select-agg-func-popup {
  position: absolute;
}

.ag-input-wrapper, .ag-picker-field-wrapper {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  line-height: normal;
  position: relative;
}

.ag-shake-left-to-right {
  -webkit-animation-direction: alternate;
          animation-direction: alternate;
  -webkit-animation-duration: 0.2s;
          animation-duration: 0.2s;
  -webkit-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
  -webkit-animation-name: ag-shake-left-to-right;
          animation-name: ag-shake-left-to-right;
}

@-webkit-keyframes ag-shake-left-to-right {
  from {
    padding-left: 6px;
    padding-right: 2px;
  }
  to {
    padding-left: 2px;
    padding-right: 6px;
  }
}

@keyframes ag-shake-left-to-right {
  from {
    padding-left: 6px;
    padding-right: 2px;
  }
  to {
    padding-left: 2px;
    padding-right: 6px;
  }
}
.ag-root-wrapper {
  cursor: default;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.ag-root-wrapper.ag-layout-normal {
  height: 100%;
}

.ag-watermark {
  position: absolute;
  bottom: 20px;
  right: 25px;
  opacity: 0.5;
  transition: opacity 1s ease-out 3s;
}
.ag-watermark::before {
  content: "";
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDIzNSA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxuczpzZXJpZj0iaHR0cDovL3d3dy5zZXJpZi5jb20vIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjI7Ij4KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDAuNjM1NzIzLDAsMCwwLjYzNTcyMywtNDkyLjkyMSwtMzIzLjYwOCkiPgogICAgICAgIDxwYXRoIGQ9Ik0xMDk5LjQsNTQ5LjRMMTA5OS40LDUzNi45TDEwNzguMSw1MzYuOUwxMDY1LjYsNTQ5LjRMMTA5OS40LDU0OS40WiIgc3R5bGU9ImZpbGw6cmdiKDI0LDI5LDMxKTtmaWxsLXJ1bGU6bm9uemVybzsiLz4KICAgICAgICA8cGF0aCBkPSJNMTEyMy40LDUxOC40TDEwOTYuNyw1MTguNEwxMDg0LjEsNTMwLjlMMTEyMy40LDUzMC45TDExMjMuNCw1MTguNFoiIHN0eWxlPSJmaWxsOnJnYigyNCwyOSwzMSk7ZmlsbC1ydWxlOm5vbnplcm87Ii8+CiAgICAgICAgPHBhdGggZD0iTTEwNTMuMiw1NjEuOUwxMDU5LjYsNTU1LjVMMTA4MS4yLDU1NS41TDEwODEuMiw1NjhMMTA1My4yLDU2OEwxMDUzLjIsNTYxLjlaIiBzdHlsZT0iZmlsbDpyZ2IoMjQsMjksMzEpO2ZpbGwtcnVsZTpub256ZXJvOyIvPgogICAgICAgIDxwYXRoIGQ9Ik0xMDU3LjksNTQzLjNMMTA3MS43LDU0My4zTDEwODQuMyw1MzAuOEwxMDU3LjksNTMwLjhMMTA1Ny45LDU0My4zWiIgc3R5bGU9ImZpbGw6cmdiKDI0LDI5LDMxKTtmaWxsLXJ1bGU6bm9uemVybzsiLz4KICAgICAgICA8cGF0aCBkPSJNMTA0Mi44LDU2MS45TDEwNTMuMiw1NjEuOUwxMDY1LjYsNTQ5LjRMMTA0Mi44LDU0OS40TDEwNDIuOCw1NjEuOVoiIHN0eWxlPSJmaWxsOnJnYigyNCwyOSwzMSk7ZmlsbC1ydWxlOm5vbnplcm87Ii8+CiAgICAgICAgPHBhdGggZD0iTTEwOTYuNyw1MTguNEwxMDkwLjMsNTI0LjhMMTA0OS41LDUyNC44TDEwNDkuNSw1MTIuM0wxMDk2LjcsNTEyLjNMMTA5Ni43LDUxOC40WiIgc3R5bGU9ImZpbGw6cmdiKDI0LDI5LDMxKTtmaWxsLXJ1bGU6bm9uemVybzsiLz4KICAgICAgICA8cGF0aCBkPSJNODI4LjYsNTU5LjdMODA5LDU1OS43TDgwNS42LDU2OC4xTDc5Nyw1NjguMUw4MTUuMSw1MjUuN0w4MjIuNiw1MjUuN0w4NDAuNyw1NjguMUw4MzIsNTY4LjFMODI4LjYsNTU5LjdaTTgyNS45LDU1M0w4MTguOCw1MzUuN0w4MTEuNyw1NTNMODI1LjksNTUzWiIgc3R5bGU9ImZpbGw6cmdiKDI0LDI5LDMxKTtmaWxsLXJ1bGU6bm9uemVybzsiLz4KICAgICAgICA8cGF0aCBkPSJNOTYwLjEsNTQxLjNDOTYyLjYsNTM3LjYgOTY4LjksNTM3LjIgOTcxLjUsNTM3LjJMOTcxLjUsNTQ0LjRDOTY4LjMsNTQ0LjQgOTY1LjEsNTQ0LjUgOTYzLjIsNTQ1LjlDOTYxLjMsNTQ3LjMgOTYwLjMsNTQ5LjIgOTYwLjMsNTUxLjVMOTYwLjMsNTY4LjFMOTUyLjUsNTY4LjFMOTUyLjUsNTM3LjJMOTYwLDUzNy4yTDk2MC4xLDU0MS4zWiIgc3R5bGU9ImZpbGw6cmdiKDI0LDI5LDMxKTtmaWxsLXJ1bGU6bm9uemVybzsiLz4KICAgICAgICA8cmVjdCB4PSI5NzUuOCIgeT0iNTM3LjIiIHdpZHRoPSI3LjgiIGhlaWdodD0iMzAuOSIgc3R5bGU9ImZpbGw6cmdiKDI0LDI5LDMxKTsiLz4KICAgICAgICA8cmVjdCB4PSI5NzUuOCIgeT0iNTIzLjQiIHdpZHRoPSI3LjgiIGhlaWdodD0iOS4yIiBzdHlsZT0iZmlsbDpyZ2IoMjQsMjksMzEpOyIvPgogICAgICAgIDxwYXRoIGQ9Ik0xMDIyLjMsNTIzLjRMMTAyMi4zLDU2OC4xTDEwMTQuOCw1NjguMUwxMDE0LjYsNTYzLjRDMTAxMy41LDU2NSAxMDEyLjEsNTY2LjMgMTAxMC40LDU2Ny4zQzEwMDguNyw1NjguMiAxMDA2LjYsNTY4LjcgMTAwNC4yLDU2OC43QzEwMDIuMSw1NjguNyAxMDAwLjEsNTY4LjMgOTk4LjQsNTY3LjZDOTk2LjYsNTY2LjggOTk1LDU2NS44IDk5My43LDU2NC40Qzk5Mi40LDU2MyA5OTEuMyw1NjEuMyA5OTAuNiw1NTkuNEM5ODkuOCw1NTcuNSA5ODkuNSw1NTUuMyA5ODkuNSw1NTIuOUM5ODkuNSw1NTAuNSA5ODkuOSw1NDguMyA5OTAuNiw1NDYuM0M5OTEuNCw1NDQuMyA5OTIuNCw1NDIuNiA5OTMuNyw1NDEuMkM5OTUsNTM5LjggOTk2LjYsNTM4LjcgOTk4LjQsNTM3LjlDMTAwMC4yLDUzNy4xIDEwMDIuMSw1MzYuNyAxMDA0LjIsNTM2LjdDMTAwNi42LDUzNi43IDEwMDguNiw1MzcuMSAxMDEwLjMsNTM4QzEwMTIsNTM4LjkgMTAxMy40LDU0MC4xIDEwMTQuNSw1NDEuOEwxMDE0LjUsNTIzLjVMMTAyMi4zLDUyMy41TDEwMjIuMyw1MjMuNFpNMTAwNS45LDU2MkMxMDA4LjUsNTYyIDEwMTAuNSw1NjEuMSAxMDEyLjEsNTU5LjRDMTAxMy43LDU1Ny43IDEwMTQuNSw1NTUuNCAxMDE0LjUsNTUyLjZDMTAxNC41LDU0OS44IDEwMTMuNyw1NDcuNiAxMDEyLjEsNTQ1LjhDMTAxMC41LDU0NC4xIDEwMDguNSw1NDMuMiAxMDA1LjksNTQzLjJDMTAwMy40LDU0My4yIDEwMDEuMyw1NDQuMSA5OTkuOCw1NDUuOEM5OTguMiw1NDcuNSA5OTcuNCw1NDkuOCA5OTcuNCw1NTIuNkM5OTcuNCw1NTUuNCA5OTguMiw1NTcuNiA5OTkuOCw1NTkuM0MxMDAxLjQsNTYxLjEgMTAwMy40LDU2MiAxMDA1LjksNTYyIiBzdHlsZT0iZmlsbDpyZ2IoMjQsMjksMzEpO2ZpbGwtcnVsZTpub256ZXJvOyIvPgogICAgICAgIDxwYXRoIGQ9Ik04ODUuOCw1NDQuMkw4NjYuNSw1NDQuMkw4NjYuNSw1NTAuOUw4NzcuNSw1NTAuOUM4NzcuMiw1NTQuMyA4NzUuOSw1NTYuOSA4NzMuNyw1NTlDODcxLjUsNTYxIDg2OC43LDU2MiA4NjUuMSw1NjJDODYzLjEsNTYyIDg2MS4yLDU2MS42IDg1OS42LDU2MC45Qzg1Ny45LDU2MC4yIDg1Ni41LDU1OS4yIDg1NS4zLDU1Ny44Qzg1NC4xLDU1Ni41IDg1My4yLDU1NC45IDg1Mi41LDU1M0M4NTEuOCw1NTEuMSA4NTEuNSw1NDkuMSA4NTEuNSw1NDYuOEM4NTEuNSw1NDQuNSA4NTEuOCw1NDIuNSA4NTIuNSw1NDAuNkM4NTMuMSw1MzguNyA4NTQuMSw1MzcuMiA4NTUuMyw1MzUuOEM4NTYuNSw1MzQuNSA4NTcuOSw1MzMuNSA4NTkuNiw1MzIuN0M4NjEuMyw1MzIgODYzLjEsNTMxLjYgODY1LjIsNTMxLjZDODY5LjQsNTMxLjYgODcyLjYsNTMyLjYgODc0LjgsNTM0LjZMODgwLDUyOS40Qzg3Ni4xLDUyNi40IDg3MS4xLDUyNC44IDg2NS4yLDUyNC44Qzg2MS45LDUyNC44IDg1OC45LDUyNS4zIDg1Ni4yLDUyNi40Qzg1My41LDUyNy41IDg1MS4yLDUyOC45IDg0OS4zLDUzMC44Qzg0Ny40LDUzMi43IDg0NS45LDUzNSA4NDQuOSw1MzcuN0M4NDMuOSw1NDAuNCA4NDMuNCw1NDMuNCA4NDMuNCw1NDYuNkM4NDMuNCw1NDkuOCA4NDMuOSw1NTIuOCA4NDUsNTU1LjVDODQ2LjEsNTU4LjIgODQ3LjUsNTYwLjUgODQ5LjQsNTYyLjRDODUxLjMsNTY0LjMgODUzLjYsNTY1LjggODU2LjMsNTY2LjhDODU5LDU2Ny45IDg2Miw1NjguNCA4NjUuMiw1NjguNEM4NjguNCw1NjguNCA4NzEuMyw1NjcuOSA4NzMuOSw1NjYuOEM4NzYuNSw1NjUuNyA4NzguNyw1NjQuMyA4ODAuNSw1NjIuNEM4ODIuMyw1NjAuNSA4ODMuNyw1NTguMiA4ODQuNyw1NTUuNUM4ODUuNyw1NTIuOCA4ODYuMiw1NDkuOCA4ODYuMiw1NDYuNkw4ODYuMiw1NDUuM0M4ODUuOSw1NDUuMSA4ODUuOCw1NDQuNiA4ODUuOCw1NDQuMiIgc3R5bGU9ImZpbGw6cmdiKDI0LDI5LDMxKTtmaWxsLXJ1bGU6bm9uemVybzsiLz4KICAgICAgICA8cGF0aCBkPSJNOTQ2LjgsNTQ0LjJMOTI3LjUsNTQ0LjJMOTI3LjUsNTUwLjlMOTM4LjUsNTUwLjlDOTM4LjIsNTU0LjMgOTM2LjksNTU2LjkgOTM0LjcsNTU5QzkzMi41LDU2MSA5MjkuNyw1NjIgOTI2LjEsNTYyQzkyNC4xLDU2MiA5MjIuMiw1NjEuNiA5MjAuNiw1NjAuOUM5MTguOSw1NjAuMiA5MTcuNSw1NTkuMiA5MTYuMyw1NTcuOEM5MTUuMSw1NTYuNSA5MTQuMiw1NTQuOSA5MTMuNSw1NTNDOTEyLjgsNTUxLjEgOTEyLjUsNTQ5LjEgOTEyLjUsNTQ2LjhDOTEyLjUsNTQ0LjUgOTEyLjgsNTQyLjUgOTEzLjUsNTQwLjZDOTE0LjEsNTM4LjcgOTE1LjEsNTM3LjIgOTE2LjMsNTM1LjhDOTE3LjUsNTM0LjUgOTE4LjksNTMzLjUgOTIwLjYsNTMyLjdDOTIyLjMsNTMyIDkyNC4xLDUzMS42IDkyNi4yLDUzMS42QzkzMC40LDUzMS42IDkzMy42LDUzMi42IDkzNS44LDUzNC42TDk0MSw1MjkuNEM5MzcuMSw1MjYuNCA5MzIuMSw1MjQuOCA5MjYuMiw1MjQuOEM5MjIuOSw1MjQuOCA5MTkuOSw1MjUuMyA5MTcuMiw1MjYuNEM5MTQuNSw1MjcuNSA5MTIuMiw1MjguOSA5MTAuMyw1MzAuOEM5MDguNCw1MzIuNyA5MDYuOSw1MzUgOTA1LjksNTM3LjdDOTA0LjksNTQwLjQgOTA0LjQsNTQzLjQgOTA0LjQsNTQ2LjZDOTA0LjQsNTQ5LjggOTA0LjksNTUyLjggOTA2LDU1NS41QzkwNy4xLDU1OC4yIDkwOC41LDU2MC41IDkxMC40LDU2Mi40QzkxMi4zLDU2NC4zIDkxNC42LDU2NS44IDkxNy4zLDU2Ni44QzkyMCw1NjcuOSA5MjMsNTY4LjQgOTI2LjIsNTY4LjRDOTI5LjQsNTY4LjQgOTMyLjMsNTY3LjkgOTM0LjksNTY2LjhDOTM3LjUsNTY1LjcgOTM5LjcsNTY0LjMgOTQxLjUsNTYyLjRDOTQzLjMsNTYwLjUgOTQ0LjcsNTU4LjIgOTQ1LjcsNTU1LjVDOTQ2LjcsNTUyLjggOTQ3LjIsNTQ5LjggOTQ3LjIsNTQ2LjZMOTQ3LjIsNTQ1LjNDOTQ2LjksNTQ1LjEgOTQ2LjgsNTQ0LjYgOTQ2LjgsNTQ0LjIiIHN0eWxlPSJmaWxsOnJnYigyNCwyOSwzMSk7ZmlsbC1ydWxlOm5vbnplcm87Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=);
  background-repeat: no-repeat;
  background-size: 170px 40px;
  display: block;
  height: 40px;
  width: 170px;
  opacity: 0.5;
}

.ag-watermark-text {
  opacity: 0.5;
  font-weight: bold;
  font-family: Impact, sans-serif;
  font-size: 19px;
  padding-left: 0.7rem;
}

.ag-root-wrapper-body {
  display: flex;
  flex-direction: row;
}
.ag-root-wrapper-body.ag-layout-normal {
  flex: 1 1 auto;
  height: 0;
  min-height: 0;
}

.ag-root {
  position: relative;
  display: flex;
  flex-direction: column;
}
.ag-root.ag-layout-normal, .ag-root.ag-layout-auto-height {
  overflow: hidden;
  flex: 1 1 auto;
  width: 0;
}
.ag-root.ag-layout-normal {
  height: 100%;
}

/**
 ****************************
 * Viewports
 ****************************
*/
.ag-header-viewport,
.ag-floating-top-viewport,
.ag-body-viewport,
.ag-center-cols-viewport,
.ag-floating-bottom-viewport,
.ag-body-horizontal-scroll-viewport,
.ag-virtual-list-viewport {
  position: relative;
  height: 100%;
  min-width: 0px;
  overflow: hidden;
  flex: 1 1 auto;
}

.ag-body-viewport.ag-layout-print {
  flex: none;
}

@media print {
  .ag-root-wrapper.ag-layout-print,
.ag-root-wrapper.ag-layout-print .ag-root-wrapper-body,
.ag-root-wrapper.ag-layout-print .ag-root,
.ag-root-wrapper.ag-layout-print .ag-body-viewport,
.ag-root-wrapper.ag-layout-print .ag-center-cols-container,
.ag-root-wrapper.ag-layout-print .ag-center-cols-viewport,
.ag-root-wrapper.ag-layout-print .ag-center-cols-clipper,
.ag-root-wrapper.ag-layout-print .ag-body-horizontal-scroll-viewport,
.ag-root-wrapper.ag-layout-print .ag-virtual-list-viewport {
    height: auto !important;
    overflow: hidden !important;
    display: block !important;
  }
  .ag-root-wrapper.ag-layout-print .ag-row {
    page-break-inside: avoid;
  }
}
.ag-body-viewport {
  display: flex;
}
.ag-body-viewport.ag-layout-normal {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.ag-center-cols-viewport {
  width: 100%;
  overflow-x: auto;
}

.ag-body-horizontal-scroll-viewport {
  overflow-x: scroll;
}

.ag-virtual-list-viewport {
  overflow: auto;
  width: 100%;
}

/**
 ****************************
 * Containers
 ****************************
*/
.ag-header-container,
.ag-floating-top-container,
.ag-body-container,
.ag-pinned-right-cols-container,
.ag-center-cols-container,
.ag-pinned-left-cols-container,
.ag-floating-bottom-container,
.ag-body-horizontal-scroll-container,
.ag-full-width-container,
.ag-floating-bottom-full-width-container,
.ag-virtual-list-container {
  position: relative;
}

.ag-header-container, .ag-floating-top-container, .ag-floating-bottom-container {
  height: 100%;
  white-space: nowrap;
}

.ag-center-cols-container {
  display: block;
}

.ag-layout-print .ag-center-cols-clipper {
  min-width: 100%;
}

.ag-pinned-right-cols-container {
  display: block;
}

.ag-body-horizontal-scroll-container {
  height: 100%;
}

.ag-full-width-container,
.ag-floating-top-full-width-container,
.ag-floating-bottom-full-width-container {
  position: absolute;
  top: 0px;
  left: 0px;
  pointer-events: none;
}

.ag-full-width-container {
  width: 100%;
}

.ag-floating-bottom-full-width-container, .ag-floating-top-full-width-container {
  display: inline-block;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.ag-virtual-list-container {
  overflow: hidden;
}

/**
 ****************************
 * Scrollers
 ****************************
*/
.ag-center-cols-clipper {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  min-height: 100%;
  -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
}

.ag-body-horizontal-scroll {
  min-height: 0;
  min-width: 0;
  width: 100%;
  display: flex;
  position: relative;
}
.ag-body-horizontal-scroll.ag-invisible-scrollbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.ag-layout-print .ag-body-horizontal-scroll {
  display: none;
}

.ag-force-vertical-scroll {
  overflow-y: scroll !important;
}
.ag-force-vertical-scroll.ag-layout-print {
  overflow-y: visible !important;
}

.ag-horizontal-left-spacer, .ag-horizontal-right-spacer {
  height: 100%;
  min-width: 0;
  overflow-x: scroll;
}
.ag-horizontal-left-spacer.ag-scroller-corner, .ag-horizontal-right-spacer.ag-scroller-corner {
  overflow-x: hidden;
}

/**
 ****************************
 * Headers
 ****************************
*/
.ag-header, .ag-pinned-left-header, .ag-pinned-right-header {
  display: inline-block;
  overflow: hidden;
  position: relative;
}

.ag-header-cell-sortable {
  cursor: pointer;
}

.ag-header {
  display: flex;
  width: 100%;
  white-space: nowrap;
}

.ag-pinned-left-header {
  height: 100%;
}

.ag-pinned-right-header {
  height: 100%;
}

.ag-header-row {
  position: absolute;
  overflow: hidden;
}

.ag-header-cell {
  display: inline-flex;
  align-items: center;
  position: absolute;
  height: 100%;
  overflow: hidden;
}

.ag-header-cell.ag-header-active .ag-header-cell-menu-button {
  opacity: 1;
}

.ag-header-cell-menu-button:not(.ag-header-menu-always-show) {
  transition: opacity 0.2s;
  opacity: 0;
}

.ag-header-group-cell-label, .ag-header-cell-label {
  display: flex;
  flex: 1 1 auto;
  overflow: hidden;
  align-items: center;
  text-overflow: ellipsis;
  align-self: stretch;
}

.ag-header-cell-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ag-right-aligned-header .ag-header-cell-label {
  flex-direction: row-reverse;
}

.ag-header-group-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ag-header-cell-resize {
  position: absolute;
  z-index: 2;
  height: 100%;
  width: 8px;
  top: 0;
  cursor: ew-resize;
}
.ag-ltr .ag-header-cell-resize {
  right: -4px;
}
.ag-rtl .ag-header-cell-resize {
  left: -4px;
}

.ag-pinned-left-header .ag-header-cell-resize {
  right: -4px;
}

.ag-pinned-right-header .ag-header-cell-resize {
  left: -4px;
}

.ag-header-select-all {
  display: flex;
}

/**
 ****************************
 * Columns
 ****************************
*/
.ag-column-moving .ag-cell {
  transition: left 0.2s;
}
.ag-column-moving .ag-header-cell {
  transition: left 0.2s;
}
.ag-column-moving .ag-header-group-cell {
  transition: left 0.2s, width 0.2s;
}

/**
 ****************************
 * Column Panel
 ****************************
*/
.ag-column-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1 1 auto;
}

.ag-column-select {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 3 1 0px;
}

.ag-column-select-header {
  position: relative;
  display: flex;
  flex: none;
}

.ag-column-select-header-icon {
  position: relative;
}

.ag-column-select-header-filter-wrapper {
  flex: 1 1 auto;
}

.ag-column-select-header-filter {
  width: 100%;
}

.ag-column-select-list {
  flex: 1 1 0px;
  overflow: hidden;
}

.ag-column-drop {
  position: relative;
  display: inline-flex;
  align-items: center;
  overflow: auto;
  width: 100%;
}

.ag-column-drop-list {
  display: flex;
  align-items: center;
}

.ag-column-drop-cell {
  display: flex;
  align-items: center;
}

.ag-column-drop-cell-text {
  overflow: hidden;
  flex: 1 1 auto;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ag-column-drop-vertical {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: stretch;
  flex: 1 1 0px;
}

.ag-column-drop-vertical-title-bar {
  display: flex;
  align-items: center;
  flex: none;
}

.ag-column-drop-vertical-list {
  position: relative;
  align-items: stretch;
  flex-grow: 1;
  flex-direction: column;
  overflow-x: auto;
}
.ag-column-drop-vertical-list > * {
  flex: none;
}

.ag-column-drop-empty .ag-column-drop-vertical-list {
  overflow: hidden;
}

.ag-column-drop-vertical-empty-message {
  display: block;
}

.ag-column-drop.ag-column-drop-horizontal {
  white-space: nowrap;
  overflow: hidden;
}

.ag-column-drop-cell-button {
  cursor: pointer;
}

.ag-filter-toolpanel {
  flex: 1 1 0px;
  min-width: 0;
}

.ag-filter-toolpanel-header {
  position: relative;
}

.ag-filter-toolpanel-header, .ag-filter-toolpanel-search {
  display: flex;
  align-items: center;
}
.ag-filter-toolpanel-header > *, .ag-filter-toolpanel-search > * {
  display: flex;
  align-items: center;
}

.ag-filter-apply-panel {
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
}

/**
 ****************************
 * Rows
 ****************************
*/
/* .ag-row-animation .ag-row {
  transition: top 0.4s, height 0.4s, background-color 0.1s, opacity 0.2s, -webkit-transform 0.4s;
  transition: transform 0.4s, top 0.4s, height 0.4s, background-color 0.1s, opacity 0.2s;
  transition: transform 0.4s, top 0.4s, height 0.4s, background-color 0.1s, opacity 0.2s, -webkit-transform 0.4s;
} */

/* .ag-row-no-animation .ag-row {
  transition: background-color 0.1s;
} */

.ag-row {
  white-space: nowrap;
  width: 100%;
}

.ag-row-loading {
  display: flex;
  align-items: center;
}

.ag-row-position-absolute {
  position: absolute;
}

.ag-row-position-relative {
  position: relative;
}

.ag-full-width-row {
  overflow: hidden;
  pointer-events: all;
}

.ag-row-inline-editing {
  z-index: 1;
}

.ag-row-dragging {
  z-index: 2;
}

.ag-stub-cell {
  display: flex;
  align-items: center;
}

/**
 ****************************
 * Cells
 ****************************
*/
.ag-cell {
  display: inline-block;
  position: absolute;
  white-space: nowrap;
}

.ag-cell-value, .ag-group-value {
  overflow: hidden;
  text-overflow: ellipsis;
}

.ag-cell-wrap-text {
  white-space: normal;
  word-break: break-all;
}

.ag-cell-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}
.ag-cell-wrapper.ag-row-group {
  align-items: flex-start;
}

.ag-full-width-row .ag-cell-wrapper.ag-row-group {
  align-items: center;
}

.ag-cell-normal-height {
  height: 100%;
}

.ag-cell-inline-editing {
  z-index: 1;
}
.ag-cell-inline-editing .ag-cell-edit-wrapper,
.ag-cell-inline-editing .ag-cell-editor,
.ag-cell-inline-editing .ag-cell-editor .ag-wrapper,
.ag-cell-inline-editing .ag-cell-editor input {
  height: 100%;
  width: 100%;
  line-height: normal;
}

.ag-cell .ag-icon {
  display: inline-block;
  vertical-align: middle;
}

/**
 ****************************
 * Filters
 ****************************
*/
.ag-set-filter-item {
  display: flex;
  align-items: center;
  height: 100%;
}

.ag-set-filter-item-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ag-set-filter-item-checkbox {
  display: flex;
}

.ag-filter-body-wrapper {
  display: flex;
  flex-direction: column;
}

.ag-filter-filter {
  flex: 1 1 0px;
}

.ag-filter-condition {
  display: flex;
  justify-content: center;
}

/**
 ****************************
 * Floating Filter
 ****************************
*/
.ag-floating-filter-body {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  height: 100%;
}

.ag-floating-filter-full-body {
  display: flex;
  flex: 1 1 auto;
  height: 100%;
  width: 100%;
  align-items: center;
  overflow: hidden;
}

.ag-floating-filter-full-body > div {
  flex: 1 1 auto;
}

.ag-floating-filter-input {
  align-items: center;
  display: flex;
  width: 100%;
}
.ag-floating-filter-input > * {
  flex: 1 1 auto;
}

.ag-floating-filter-button {
  display: flex;
  flex: none;
}

/**
 ****************************
 * Drag & Drop
 ****************************
*/
.ag-dnd-ghost {
  position: absolute;
  display: inline-flex;
  align-items: center;
  cursor: move;
  white-space: nowrap;
  z-index: 9999;
}

/**
 ****************************
 * Overlay
 ****************************
*/
.ag-overlay {
  height: 100%;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
}

.ag-overlay-panel {
  display: flex;
  height: 100%;
  width: 100%;
}

.ag-overlay-wrapper {
  display: flex;
  flex: none;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.ag-overlay-loading-wrapper {
  pointer-events: all;
}

/**
 ****************************
 * Popup
 ****************************
*/
.ag-popup-child {
  z-index: 20;
  top: 0;
}

.ag-popup-editor {
  position: absolute;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  z-index: 1;
}

.ag-large-text-input {
  display: block;
}

/**
 ****************************
 * Virtual Lists
 ****************************
*/
.ag-virtual-list-item {
  position: absolute;
  width: 100%;
}

/**
 ****************************
 * Floating Top and Bottom
 ****************************
*/
.ag-floating-top {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  position: relative;
  display: flex;
}

.ag-pinned-left-floating-top {
  display: inline-block;
  overflow: hidden;
  position: relative;
  min-width: 0px;
}

.ag-pinned-right-floating-top {
  display: inline-block;
  overflow: hidden;
  position: relative;
  min-width: 0px;
}

.ag-floating-bottom {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  position: relative;
  display: flex;
}

.ag-pinned-left-floating-bottom {
  display: inline-block;
  overflow: hidden;
  position: relative;
  min-width: 0px;
}

.ag-pinned-right-floating-bottom {
  display: inline-block;
  overflow: hidden;
  position: relative;
  min-width: 0px;
}

/**
 ****************************
 * Dialog
 ****************************
*/
.ag-dialog, .ag-panel {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.ag-panel-title-bar {
  display: flex;
  flex: none;
  align-items: center;
  cursor: default;
}

.ag-panel-title-bar-title {
  flex: 1 1 auto;
}

.ag-panel-title-bar-buttons {
  display: flex;
}

.ag-panel-title-bar-button {
  cursor: pointer;
}

.ag-panel-content-wrapper {
  display: flex;
  flex: 1 1 auto;
  position: relative;
  overflow: hidden;
}

.ag-dialog {
  position: absolute;
}

.ag-resizer {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}
.ag-resizer.ag-resizer-topLeft {
  top: 0;
  left: 0;
  height: 5px;
  width: 5px;
  cursor: nwse-resize;
}
.ag-resizer.ag-resizer-top {
  top: 0;
  left: 5px;
  right: 5px;
  height: 5px;
  cursor: ns-resize;
}
.ag-resizer.ag-resizer-topRight {
  top: 0;
  right: 0;
  height: 5px;
  width: 5px;
  cursor: nesw-resize;
}
.ag-resizer.ag-resizer-right {
  top: 5px;
  right: 0;
  bottom: 5px;
  width: 5px;
  cursor: ew-resize;
}
.ag-resizer.ag-resizer-bottomRight {
  bottom: 0;
  right: 0;
  height: 5px;
  width: 5px;
  cursor: nwse-resize;
}
.ag-resizer.ag-resizer-bottom {
  bottom: 0;
  left: 5px;
  right: 5px;
  height: 5px;
  cursor: ns-resize;
}
.ag-resizer.ag-resizer-bottomLeft {
  bottom: 0;
  left: 0;
  height: 5px;
  width: 5px;
  cursor: nesw-resize;
}
.ag-resizer.ag-resizer-left {
  left: 0;
  top: 5px;
  bottom: 5px;
  width: 5px;
  cursor: ew-resize;
}

/**
 ****************************
 * Tooltip
 ****************************
*/
.ag-tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 99999;
}

/**
 ****************************
 * Animations
 ****************************
*/
.ag-value-slide-out {
  margin-right: 5px;
  opacity: 1;
  transition: opacity 3s, margin-right 3s;
  transition-timing-function: linear;
}

.ag-value-slide-out-end {
  margin-right: 10px;
  opacity: 0;
}

.ag-opacity-zero {
  opacity: 0 !important;
}

/**
 ****************************
 * Menu
 ****************************
*/
.ag-menu {
  max-height: 100%;
  overflow-y: auto;
  position: absolute;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

.ag-menu-column-select-wrapper {
  height: 265px;
  overflow: auto;
}
.ag-menu-column-select-wrapper .ag-column-select {
  height: 100%;
}

.ag-menu-list {
  display: table;
  width: 100%;
}

.ag-menu-option, .ag-menu-separator {
  display: table-row;
}

.ag-menu-option-part, .ag-menu-separator-part {
  display: table-cell;
  vertical-align: middle;
}

.ag-menu-option-text {
  white-space: nowrap;
}

.ag-compact-menu-option {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
}

.ag-compact-menu-option-text {
  white-space: nowrap;
  flex: 1 1 auto;
}

/**
 ****************************
 * Rich Select
 ****************************
*/
.ag-rich-select {
  cursor: default;
  outline: none;
}

.ag-rich-select-value {
  display: flex;
  align-items: center;
}

.ag-rich-select-value-icon {
  flex: 1 1 auto;
  order: 1;
}
.ag-ltr .ag-rich-select-value-icon {
  text-align: right;
}
.ag-rtl .ag-rich-select-value-icon {
  text-align: left;
}

.ag-rich-select-list {
  position: relative;
}

.ag-rich-select-virtual-list-item {
  display: flex;
}

.ag-rich-select-row {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  white-space: nowrap;
}

/**
 ****************************
 * Pagination
 ****************************
*/
.ag-paging-panel {
  align-items: center;
  display: flex;
  justify-content: flex-end;
}

.ag-paging-page-summary-panel {
  display: flex;
  align-items: center;
}

.ag-paging-button {
  position: relative;
}

.ag-disabled .ag-paging-page-summary-panel {
  pointer-events: none;
}

/**
 ****************************
 * Tool Panel
 ****************************
*/
.ag-tool-panel-wrapper {
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  cursor: default;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

.ag-column-select-column,
.ag-column-select-column-group {
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 100%;
}
.ag-column-select-column > *,
.ag-column-select-column-group > * {
  flex: none;
}

.ag-column-select-checkbox {
  display: flex;
}

.ag-tool-panel-horizontal-resize {
  cursor: ew-resize;
  height: 100%;
  position: absolute;
  top: 0;
  width: 5px;
  z-index: 1;
}

.ag-ltr .ag-side-bar-left .ag-tool-panel-horizontal-resize {
  right: -3px;
}
.ag-rtl .ag-side-bar-left .ag-tool-panel-horizontal-resize {
  left: -3px;
}

.ag-ltr .ag-side-bar-right .ag-tool-panel-horizontal-resize {
  left: -3px;
}
.ag-rtl .ag-side-bar-right .ag-tool-panel-horizontal-resize {
  right: -3px;
}

.ag-details-row {
  width: 100%;
}

.ag-details-row-fixed-height {
  height: 100%;
}

.ag-details-grid {
  width: 100%;
}

.ag-details-grid-fixed-height {
  height: 100%;
}

.ag-header-group-cell {
  display: flex;
  align-items: center;
  height: 100%;
  position: absolute;
}

.ag-cell-label-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ag-right-aligned-header .ag-cell-label-container {
  flex-direction: row;
}

/**
 ****************************
 * Side Bar
 ****************************
*/
.ag-side-bar {
  display: flex;
  flex-direction: row-reverse;
}

.ag-side-bar-left {
  order: -1;
  flex-direction: row;
}

.ag-side-button-button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  outline: none;
  cursor: pointer;
}

.ag-side-button-label {
  -webkit-writing-mode: vertical-lr;
      -ms-writing-mode: tb-lr;
          writing-mode: vertical-lr;
}

/**
 ****************************
 * Status Bar
 ****************************
*/
.ag-status-bar {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}

.ag-status-panel {
  display: inline-flex;
}

.ag-status-name-value {
  white-space: nowrap;
}

.ag-status-bar-left {
  display: inline-flex;
}

.ag-status-bar-center {
  display: inline-flex;
}

.ag-status-bar-right {
  display: inline-flex;
}

/**
 ****************************
 * Widgets
 ****************************
*/
.ag-icon {
  /* display: block; */
  display: inline-block;
  speak: none;
}

.ag-group {
  position: relative;
  width: 100%;
}

.ag-group-title-bar {
  display: flex;
  align-items: center;
}

.ag-group-title {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ag-group-title-bar .ag-group-title {
  cursor: default;
}

.ag-group-toolbar {
  display: flex;
  align-items: center;
}

.ag-group-container {
  display: flex;
}

.ag-disabled .ag-group-container {
  pointer-events: none;
}

.ag-group-container-horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.ag-group-container-vertical {
  flex-direction: column;
}

.ag-charts-font-size-color {
  display: flex;
  align-self: stretch;
  justify-content: space-between;
}

.ag-column-group-icons {
  display: block;
}
.ag-column-group-icons > * {
  cursor: pointer;
}

.ag-group-item-alignment-stretch .ag-group-item {
  align-items: stretch;
}

.ag-group-item-alignment-start .ag-group-item {
  align-items: flex-start;
}

.ag-group-item-alignment-end .ag-group-item {
  align-items: flex-end;
}

.ag-toggle-button-icon {
  transition: right 0.3s;
  position: absolute;
  top: -1px;
}

.ag-input-field, .ag-select {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ag-input-field-input {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
}

.ag-floating-filter-input .ag-input-field-input[type=date] {
  width: 1px;
}

.ag-range-field {
  display: flex;
  align-items: center;
}

.ag-angle-select {
  display: flex;
  align-items: center;
}

.ag-angle-select-wrapper {
  display: flex;
}

.ag-angle-select-parent-circle {
  display: block;
  position: relative;
}

.ag-angle-select-child-circle {
  position: absolute;
}

.ag-slider-wrapper {
  display: flex;
}
.ag-slider-wrapper .ag-input-field {
  flex: 1 1 auto;
}

.ag-picker-field-display {
  flex: 1 1 auto;
}

.ag-picker-field {
  display: flex;
  align-items: center;
}

.ag-picker-field-icon {
  display: flex;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

.ag-picker-field-wrapper {
  overflow: hidden;
}

.ag-label-align-right .ag-label {
  order: 1;
}
.ag-label-align-right > * {
  flex: none;
}

.ag-label-align-top {
  flex-direction: column;
  align-items: flex-start;
}
.ag-label-align-top > * {
  align-self: stretch;
}

.ag-color-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.ag-spectrum-color {
  flex: 1 1 auto;
  position: relative;
  overflow: hidden;
  cursor: default;
}

.ag-spectrum-fill {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.ag-spectrum-val {
  cursor: pointer;
}

.ag-spectrum-dragger {
  position: absolute;
  pointer-events: none;
  cursor: pointer;
}

.ag-spectrum-hue {
  cursor: default;
  background: linear-gradient(to left, #ff0000 3%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
}

.ag-spectrum-alpha {
  cursor: default;
}

.ag-spectrum-hue-background {
  width: 100%;
  height: 100%;
}

.ag-spectrum-alpha-background {
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), black);
  width: 100%;
  height: 100%;
}

.ag-spectrum-tool {
  cursor: pointer;
}

.ag-spectrum-slider {
  position: absolute;
  pointer-events: none;
}

.ag-recent-colors {
  display: flex;
}

.ag-recent-color {
  cursor: pointer;
}

.ag-ltr .ag-column-select-indent-1 {
  padding-left: 20px;
}
.ag-rtl .ag-column-select-indent-1 {
  padding-right: 20px;
}

.ag-ltr .ag-row-group-indent-1 {
  padding-left: 20px;
}
.ag-rtl .ag-row-group-indent-1 {
  padding-right: 20px;
}

.ag-ltr .ag-column-select-indent-2 {
  padding-left: 40px;
}
.ag-rtl .ag-column-select-indent-2 {
  padding-right: 40px;
}

.ag-ltr .ag-row-group-indent-2 {
  padding-left: 40px;
}
.ag-rtl .ag-row-group-indent-2 {
  padding-right: 40px;
}

.ag-ltr .ag-column-select-indent-3 {
  padding-left: 60px;
}
.ag-rtl .ag-column-select-indent-3 {
  padding-right: 60px;
}

.ag-ltr .ag-row-group-indent-3 {
  padding-left: 60px;
}
.ag-rtl .ag-row-group-indent-3 {
  padding-right: 60px;
}

.ag-ltr .ag-column-select-indent-4 {
  padding-left: 80px;
}
.ag-rtl .ag-column-select-indent-4 {
  padding-right: 80px;
}

.ag-ltr .ag-row-group-indent-4 {
  padding-left: 80px;
}
.ag-rtl .ag-row-group-indent-4 {
  padding-right: 80px;
}

.ag-ltr .ag-column-select-indent-5 {
  padding-left: 100px;
}
.ag-rtl .ag-column-select-indent-5 {
  padding-right: 100px;
}

.ag-ltr .ag-row-group-indent-5 {
  padding-left: 100px;
}
.ag-rtl .ag-row-group-indent-5 {
  padding-right: 100px;
}

.ag-ltr .ag-column-select-indent-6 {
  padding-left: 120px;
}
.ag-rtl .ag-column-select-indent-6 {
  padding-right: 120px;
}

.ag-ltr .ag-row-group-indent-6 {
  padding-left: 120px;
}
.ag-rtl .ag-row-group-indent-6 {
  padding-right: 120px;
}

.ag-ltr .ag-column-select-indent-7 {
  padding-left: 140px;
}
.ag-rtl .ag-column-select-indent-7 {
  padding-right: 140px;
}

.ag-ltr .ag-row-group-indent-7 {
  padding-left: 140px;
}
.ag-rtl .ag-row-group-indent-7 {
  padding-right: 140px;
}

.ag-ltr .ag-column-select-indent-8 {
  padding-left: 160px;
}
.ag-rtl .ag-column-select-indent-8 {
  padding-right: 160px;
}

.ag-ltr .ag-row-group-indent-8 {
  padding-left: 160px;
}
.ag-rtl .ag-row-group-indent-8 {
  padding-right: 160px;
}

.ag-ltr .ag-column-select-indent-9 {
  padding-left: 180px;
}
.ag-rtl .ag-column-select-indent-9 {
  padding-right: 180px;
}

.ag-ltr .ag-row-group-indent-9 {
  padding-left: 180px;
}
.ag-rtl .ag-row-group-indent-9 {
  padding-right: 180px;
}

.ag-ltr .ag-column-select-indent-10 {
  padding-left: 200px;
}
.ag-rtl .ag-column-select-indent-10 {
  padding-right: 200px;
}

.ag-ltr .ag-row-group-indent-10 {
  padding-left: 200px;
}
.ag-rtl .ag-row-group-indent-10 {
  padding-right: 200px;
}

.ag-ltr .ag-column-select-indent-11 {
  padding-left: 220px;
}
.ag-rtl .ag-column-select-indent-11 {
  padding-right: 220px;
}

.ag-ltr .ag-row-group-indent-11 {
  padding-left: 220px;
}
.ag-rtl .ag-row-group-indent-11 {
  padding-right: 220px;
}

.ag-ltr .ag-column-select-indent-12 {
  padding-left: 240px;
}
.ag-rtl .ag-column-select-indent-12 {
  padding-right: 240px;
}

.ag-ltr .ag-row-group-indent-12 {
  padding-left: 240px;
}
.ag-rtl .ag-row-group-indent-12 {
  padding-right: 240px;
}

.ag-ltr .ag-column-select-indent-13 {
  padding-left: 260px;
}
.ag-rtl .ag-column-select-indent-13 {
  padding-right: 260px;
}

.ag-ltr .ag-row-group-indent-13 {
  padding-left: 260px;
}
.ag-rtl .ag-row-group-indent-13 {
  padding-right: 260px;
}

.ag-ltr .ag-column-select-indent-14 {
  padding-left: 280px;
}
.ag-rtl .ag-column-select-indent-14 {
  padding-right: 280px;
}

.ag-ltr .ag-row-group-indent-14 {
  padding-left: 280px;
}
.ag-rtl .ag-row-group-indent-14 {
  padding-right: 280px;
}

.ag-ltr .ag-column-select-indent-15 {
  padding-left: 300px;
}
.ag-rtl .ag-column-select-indent-15 {
  padding-right: 300px;
}

.ag-ltr .ag-row-group-indent-15 {
  padding-left: 300px;
}
.ag-rtl .ag-row-group-indent-15 {
  padding-right: 300px;
}

.ag-ltr .ag-column-select-indent-16 {
  padding-left: 320px;
}
.ag-rtl .ag-column-select-indent-16 {
  padding-right: 320px;
}

.ag-ltr .ag-row-group-indent-16 {
  padding-left: 320px;
}
.ag-rtl .ag-row-group-indent-16 {
  padding-right: 320px;
}

.ag-ltr .ag-column-select-indent-17 {
  padding-left: 340px;
}
.ag-rtl .ag-column-select-indent-17 {
  padding-right: 340px;
}

.ag-ltr .ag-row-group-indent-17 {
  padding-left: 340px;
}
.ag-rtl .ag-row-group-indent-17 {
  padding-right: 340px;
}

.ag-ltr .ag-column-select-indent-18 {
  padding-left: 360px;
}
.ag-rtl .ag-column-select-indent-18 {
  padding-right: 360px;
}

.ag-ltr .ag-row-group-indent-18 {
  padding-left: 360px;
}
.ag-rtl .ag-row-group-indent-18 {
  padding-right: 360px;
}

.ag-ltr .ag-column-select-indent-19 {
  padding-left: 380px;
}
.ag-rtl .ag-column-select-indent-19 {
  padding-right: 380px;
}

.ag-ltr .ag-row-group-indent-19 {
  padding-left: 380px;
}
.ag-rtl .ag-row-group-indent-19 {
  padding-right: 380px;
}

.ag-ltr .ag-column-select-indent-20 {
  padding-left: 400px;
}
.ag-rtl .ag-column-select-indent-20 {
  padding-right: 400px;
}

.ag-ltr .ag-row-group-indent-20 {
  padding-left: 400px;
}
.ag-rtl .ag-row-group-indent-20 {
  padding-right: 400px;
}

.ag-ltr .ag-column-select-indent-21 {
  padding-left: 420px;
}
.ag-rtl .ag-column-select-indent-21 {
  padding-right: 420px;
}

.ag-ltr .ag-row-group-indent-21 {
  padding-left: 420px;
}
.ag-rtl .ag-row-group-indent-21 {
  padding-right: 420px;
}

.ag-ltr .ag-column-select-indent-22 {
  padding-left: 440px;
}
.ag-rtl .ag-column-select-indent-22 {
  padding-right: 440px;
}

.ag-ltr .ag-row-group-indent-22 {
  padding-left: 440px;
}
.ag-rtl .ag-row-group-indent-22 {
  padding-right: 440px;
}

.ag-ltr .ag-column-select-indent-23 {
  padding-left: 460px;
}
.ag-rtl .ag-column-select-indent-23 {
  padding-right: 460px;
}

.ag-ltr .ag-row-group-indent-23 {
  padding-left: 460px;
}
.ag-rtl .ag-row-group-indent-23 {
  padding-right: 460px;
}

.ag-ltr .ag-column-select-indent-24 {
  padding-left: 480px;
}
.ag-rtl .ag-column-select-indent-24 {
  padding-right: 480px;
}

.ag-ltr .ag-row-group-indent-24 {
  padding-left: 480px;
}
.ag-rtl .ag-row-group-indent-24 {
  padding-right: 480px;
}

.ag-ltr .ag-column-select-indent-25 {
  padding-left: 500px;
}
.ag-rtl .ag-column-select-indent-25 {
  padding-right: 500px;
}

.ag-ltr .ag-row-group-indent-25 {
  padding-left: 500px;
}
.ag-rtl .ag-row-group-indent-25 {
  padding-right: 500px;
}

.ag-ltr .ag-column-select-indent-26 {
  padding-left: 520px;
}
.ag-rtl .ag-column-select-indent-26 {
  padding-right: 520px;
}

.ag-ltr .ag-row-group-indent-26 {
  padding-left: 520px;
}
.ag-rtl .ag-row-group-indent-26 {
  padding-right: 520px;
}

.ag-ltr .ag-column-select-indent-27 {
  padding-left: 540px;
}
.ag-rtl .ag-column-select-indent-27 {
  padding-right: 540px;
}

.ag-ltr .ag-row-group-indent-27 {
  padding-left: 540px;
}
.ag-rtl .ag-row-group-indent-27 {
  padding-right: 540px;
}

.ag-ltr .ag-column-select-indent-28 {
  padding-left: 560px;
}
.ag-rtl .ag-column-select-indent-28 {
  padding-right: 560px;
}

.ag-ltr .ag-row-group-indent-28 {
  padding-left: 560px;
}
.ag-rtl .ag-row-group-indent-28 {
  padding-right: 560px;
}

.ag-ltr .ag-column-select-indent-29 {
  padding-left: 580px;
}
.ag-rtl .ag-column-select-indent-29 {
  padding-right: 580px;
}

.ag-ltr .ag-row-group-indent-29 {
  padding-left: 580px;
}
.ag-rtl .ag-row-group-indent-29 {
  padding-right: 580px;
}

.ag-ltr .ag-column-select-indent-30 {
  padding-left: 600px;
}
.ag-rtl .ag-column-select-indent-30 {
  padding-right: 600px;
}

.ag-ltr .ag-row-group-indent-30 {
  padding-left: 600px;
}
.ag-rtl .ag-row-group-indent-30 {
  padding-right: 600px;
}

.ag-ltr .ag-column-select-indent-31 {
  padding-left: 620px;
}
.ag-rtl .ag-column-select-indent-31 {
  padding-right: 620px;
}

.ag-ltr .ag-row-group-indent-31 {
  padding-left: 620px;
}
.ag-rtl .ag-row-group-indent-31 {
  padding-right: 620px;
}

.ag-ltr .ag-column-select-indent-32 {
  padding-left: 640px;
}
.ag-rtl .ag-column-select-indent-32 {
  padding-right: 640px;
}

.ag-ltr .ag-row-group-indent-32 {
  padding-left: 640px;
}
.ag-rtl .ag-row-group-indent-32 {
  padding-right: 640px;
}

.ag-ltr .ag-column-select-indent-33 {
  padding-left: 660px;
}
.ag-rtl .ag-column-select-indent-33 {
  padding-right: 660px;
}

.ag-ltr .ag-row-group-indent-33 {
  padding-left: 660px;
}
.ag-rtl .ag-row-group-indent-33 {
  padding-right: 660px;
}

.ag-ltr .ag-column-select-indent-34 {
  padding-left: 680px;
}
.ag-rtl .ag-column-select-indent-34 {
  padding-right: 680px;
}

.ag-ltr .ag-row-group-indent-34 {
  padding-left: 680px;
}
.ag-rtl .ag-row-group-indent-34 {
  padding-right: 680px;
}

.ag-ltr .ag-column-select-indent-35 {
  padding-left: 700px;
}
.ag-rtl .ag-column-select-indent-35 {
  padding-right: 700px;
}

.ag-ltr .ag-row-group-indent-35 {
  padding-left: 700px;
}
.ag-rtl .ag-row-group-indent-35 {
  padding-right: 700px;
}

.ag-ltr .ag-column-select-indent-36 {
  padding-left: 720px;
}
.ag-rtl .ag-column-select-indent-36 {
  padding-right: 720px;
}

.ag-ltr .ag-row-group-indent-36 {
  padding-left: 720px;
}
.ag-rtl .ag-row-group-indent-36 {
  padding-right: 720px;
}

.ag-ltr .ag-column-select-indent-37 {
  padding-left: 740px;
}
.ag-rtl .ag-column-select-indent-37 {
  padding-right: 740px;
}

.ag-ltr .ag-row-group-indent-37 {
  padding-left: 740px;
}
.ag-rtl .ag-row-group-indent-37 {
  padding-right: 740px;
}

.ag-ltr .ag-column-select-indent-38 {
  padding-left: 760px;
}
.ag-rtl .ag-column-select-indent-38 {
  padding-right: 760px;
}

.ag-ltr .ag-row-group-indent-38 {
  padding-left: 760px;
}
.ag-rtl .ag-row-group-indent-38 {
  padding-right: 760px;
}

.ag-ltr .ag-column-select-indent-39 {
  padding-left: 780px;
}
.ag-rtl .ag-column-select-indent-39 {
  padding-right: 780px;
}

.ag-ltr .ag-row-group-indent-39 {
  padding-left: 780px;
}
.ag-rtl .ag-row-group-indent-39 {
  padding-right: 780px;
}

.ag-ltr .ag-column-select-indent-40 {
  padding-left: 800px;
}
.ag-rtl .ag-column-select-indent-40 {
  padding-right: 800px;
}

.ag-ltr .ag-row-group-indent-40 {
  padding-left: 800px;
}
.ag-rtl .ag-row-group-indent-40 {
  padding-right: 800px;
}

.ag-ltr .ag-column-select-indent-41 {
  padding-left: 820px;
}
.ag-rtl .ag-column-select-indent-41 {
  padding-right: 820px;
}

.ag-ltr .ag-row-group-indent-41 {
  padding-left: 820px;
}
.ag-rtl .ag-row-group-indent-41 {
  padding-right: 820px;
}

.ag-ltr .ag-column-select-indent-42 {
  padding-left: 840px;
}
.ag-rtl .ag-column-select-indent-42 {
  padding-right: 840px;
}

.ag-ltr .ag-row-group-indent-42 {
  padding-left: 840px;
}
.ag-rtl .ag-row-group-indent-42 {
  padding-right: 840px;
}

.ag-ltr .ag-column-select-indent-43 {
  padding-left: 860px;
}
.ag-rtl .ag-column-select-indent-43 {
  padding-right: 860px;
}

.ag-ltr .ag-row-group-indent-43 {
  padding-left: 860px;
}
.ag-rtl .ag-row-group-indent-43 {
  padding-right: 860px;
}

.ag-ltr .ag-column-select-indent-44 {
  padding-left: 880px;
}
.ag-rtl .ag-column-select-indent-44 {
  padding-right: 880px;
}

.ag-ltr .ag-row-group-indent-44 {
  padding-left: 880px;
}
.ag-rtl .ag-row-group-indent-44 {
  padding-right: 880px;
}

.ag-ltr .ag-column-select-indent-45 {
  padding-left: 900px;
}
.ag-rtl .ag-column-select-indent-45 {
  padding-right: 900px;
}

.ag-ltr .ag-row-group-indent-45 {
  padding-left: 900px;
}
.ag-rtl .ag-row-group-indent-45 {
  padding-right: 900px;
}

.ag-ltr .ag-column-select-indent-46 {
  padding-left: 920px;
}
.ag-rtl .ag-column-select-indent-46 {
  padding-right: 920px;
}

.ag-ltr .ag-row-group-indent-46 {
  padding-left: 920px;
}
.ag-rtl .ag-row-group-indent-46 {
  padding-right: 920px;
}

.ag-ltr .ag-column-select-indent-47 {
  padding-left: 940px;
}
.ag-rtl .ag-column-select-indent-47 {
  padding-right: 940px;
}

.ag-ltr .ag-row-group-indent-47 {
  padding-left: 940px;
}
.ag-rtl .ag-row-group-indent-47 {
  padding-right: 940px;
}

.ag-ltr .ag-column-select-indent-48 {
  padding-left: 960px;
}
.ag-rtl .ag-column-select-indent-48 {
  padding-right: 960px;
}

.ag-ltr .ag-row-group-indent-48 {
  padding-left: 960px;
}
.ag-rtl .ag-row-group-indent-48 {
  padding-right: 960px;
}

.ag-ltr .ag-column-select-indent-49 {
  padding-left: 980px;
}
.ag-rtl .ag-column-select-indent-49 {
  padding-right: 980px;
}

.ag-ltr .ag-row-group-indent-49 {
  padding-left: 980px;
}
.ag-rtl .ag-row-group-indent-49 {
  padding-right: 980px;
}

.ag-ltr .ag-column-select-indent-50 {
  padding-left: 1000px;
}
.ag-rtl .ag-column-select-indent-50 {
  padding-right: 1000px;
}

.ag-ltr .ag-row-group-indent-50 {
  padding-left: 1000px;
}
.ag-rtl .ag-row-group-indent-50 {
  padding-right: 1000px;
}

.ag-ltr .ag-column-select-indent-51 {
  padding-left: 1020px;
}
.ag-rtl .ag-column-select-indent-51 {
  padding-right: 1020px;
}

.ag-ltr .ag-row-group-indent-51 {
  padding-left: 1020px;
}
.ag-rtl .ag-row-group-indent-51 {
  padding-right: 1020px;
}

.ag-ltr .ag-column-select-indent-52 {
  padding-left: 1040px;
}
.ag-rtl .ag-column-select-indent-52 {
  padding-right: 1040px;
}

.ag-ltr .ag-row-group-indent-52 {
  padding-left: 1040px;
}
.ag-rtl .ag-row-group-indent-52 {
  padding-right: 1040px;
}

.ag-ltr .ag-column-select-indent-53 {
  padding-left: 1060px;
}
.ag-rtl .ag-column-select-indent-53 {
  padding-right: 1060px;
}

.ag-ltr .ag-row-group-indent-53 {
  padding-left: 1060px;
}
.ag-rtl .ag-row-group-indent-53 {
  padding-right: 1060px;
}

.ag-ltr .ag-column-select-indent-54 {
  padding-left: 1080px;
}
.ag-rtl .ag-column-select-indent-54 {
  padding-right: 1080px;
}

.ag-ltr .ag-row-group-indent-54 {
  padding-left: 1080px;
}
.ag-rtl .ag-row-group-indent-54 {
  padding-right: 1080px;
}

.ag-ltr .ag-column-select-indent-55 {
  padding-left: 1100px;
}
.ag-rtl .ag-column-select-indent-55 {
  padding-right: 1100px;
}

.ag-ltr .ag-row-group-indent-55 {
  padding-left: 1100px;
}
.ag-rtl .ag-row-group-indent-55 {
  padding-right: 1100px;
}

.ag-ltr .ag-column-select-indent-56 {
  padding-left: 1120px;
}
.ag-rtl .ag-column-select-indent-56 {
  padding-right: 1120px;
}

.ag-ltr .ag-row-group-indent-56 {
  padding-left: 1120px;
}
.ag-rtl .ag-row-group-indent-56 {
  padding-right: 1120px;
}

.ag-ltr .ag-column-select-indent-57 {
  padding-left: 1140px;
}
.ag-rtl .ag-column-select-indent-57 {
  padding-right: 1140px;
}

.ag-ltr .ag-row-group-indent-57 {
  padding-left: 1140px;
}
.ag-rtl .ag-row-group-indent-57 {
  padding-right: 1140px;
}

.ag-ltr .ag-column-select-indent-58 {
  padding-left: 1160px;
}
.ag-rtl .ag-column-select-indent-58 {
  padding-right: 1160px;
}

.ag-ltr .ag-row-group-indent-58 {
  padding-left: 1160px;
}
.ag-rtl .ag-row-group-indent-58 {
  padding-right: 1160px;
}

.ag-ltr .ag-column-select-indent-59 {
  padding-left: 1180px;
}
.ag-rtl .ag-column-select-indent-59 {
  padding-right: 1180px;
}

.ag-ltr .ag-row-group-indent-59 {
  padding-left: 1180px;
}
.ag-rtl .ag-row-group-indent-59 {
  padding-right: 1180px;
}

.ag-ltr .ag-column-select-indent-60 {
  padding-left: 1200px;
}
.ag-rtl .ag-column-select-indent-60 {
  padding-right: 1200px;
}

.ag-ltr .ag-row-group-indent-60 {
  padding-left: 1200px;
}
.ag-rtl .ag-row-group-indent-60 {
  padding-right: 1200px;
}

.ag-ltr .ag-column-select-indent-61 {
  padding-left: 1220px;
}
.ag-rtl .ag-column-select-indent-61 {
  padding-right: 1220px;
}

.ag-ltr .ag-row-group-indent-61 {
  padding-left: 1220px;
}
.ag-rtl .ag-row-group-indent-61 {
  padding-right: 1220px;
}

.ag-ltr .ag-column-select-indent-62 {
  padding-left: 1240px;
}
.ag-rtl .ag-column-select-indent-62 {
  padding-right: 1240px;
}

.ag-ltr .ag-row-group-indent-62 {
  padding-left: 1240px;
}
.ag-rtl .ag-row-group-indent-62 {
  padding-right: 1240px;
}

.ag-ltr .ag-column-select-indent-63 {
  padding-left: 1260px;
}
.ag-rtl .ag-column-select-indent-63 {
  padding-right: 1260px;
}

.ag-ltr .ag-row-group-indent-63 {
  padding-left: 1260px;
}
.ag-rtl .ag-row-group-indent-63 {
  padding-right: 1260px;
}

.ag-ltr .ag-column-select-indent-64 {
  padding-left: 1280px;
}
.ag-rtl .ag-column-select-indent-64 {
  padding-right: 1280px;
}

.ag-ltr .ag-row-group-indent-64 {
  padding-left: 1280px;
}
.ag-rtl .ag-row-group-indent-64 {
  padding-right: 1280px;
}

.ag-ltr .ag-column-select-indent-65 {
  padding-left: 1300px;
}
.ag-rtl .ag-column-select-indent-65 {
  padding-right: 1300px;
}

.ag-ltr .ag-row-group-indent-65 {
  padding-left: 1300px;
}
.ag-rtl .ag-row-group-indent-65 {
  padding-right: 1300px;
}

.ag-ltr .ag-column-select-indent-66 {
  padding-left: 1320px;
}
.ag-rtl .ag-column-select-indent-66 {
  padding-right: 1320px;
}

.ag-ltr .ag-row-group-indent-66 {
  padding-left: 1320px;
}
.ag-rtl .ag-row-group-indent-66 {
  padding-right: 1320px;
}

.ag-ltr .ag-column-select-indent-67 {
  padding-left: 1340px;
}
.ag-rtl .ag-column-select-indent-67 {
  padding-right: 1340px;
}

.ag-ltr .ag-row-group-indent-67 {
  padding-left: 1340px;
}
.ag-rtl .ag-row-group-indent-67 {
  padding-right: 1340px;
}

.ag-ltr .ag-column-select-indent-68 {
  padding-left: 1360px;
}
.ag-rtl .ag-column-select-indent-68 {
  padding-right: 1360px;
}

.ag-ltr .ag-row-group-indent-68 {
  padding-left: 1360px;
}
.ag-rtl .ag-row-group-indent-68 {
  padding-right: 1360px;
}

.ag-ltr .ag-column-select-indent-69 {
  padding-left: 1380px;
}
.ag-rtl .ag-column-select-indent-69 {
  padding-right: 1380px;
}

.ag-ltr .ag-row-group-indent-69 {
  padding-left: 1380px;
}
.ag-rtl .ag-row-group-indent-69 {
  padding-right: 1380px;
}

.ag-ltr .ag-column-select-indent-70 {
  padding-left: 1400px;
}
.ag-rtl .ag-column-select-indent-70 {
  padding-right: 1400px;
}

.ag-ltr .ag-row-group-indent-70 {
  padding-left: 1400px;
}
.ag-rtl .ag-row-group-indent-70 {
  padding-right: 1400px;
}

.ag-ltr .ag-column-select-indent-71 {
  padding-left: 1420px;
}
.ag-rtl .ag-column-select-indent-71 {
  padding-right: 1420px;
}

.ag-ltr .ag-row-group-indent-71 {
  padding-left: 1420px;
}
.ag-rtl .ag-row-group-indent-71 {
  padding-right: 1420px;
}

.ag-ltr .ag-column-select-indent-72 {
  padding-left: 1440px;
}
.ag-rtl .ag-column-select-indent-72 {
  padding-right: 1440px;
}

.ag-ltr .ag-row-group-indent-72 {
  padding-left: 1440px;
}
.ag-rtl .ag-row-group-indent-72 {
  padding-right: 1440px;
}

.ag-ltr .ag-column-select-indent-73 {
  padding-left: 1460px;
}
.ag-rtl .ag-column-select-indent-73 {
  padding-right: 1460px;
}

.ag-ltr .ag-row-group-indent-73 {
  padding-left: 1460px;
}
.ag-rtl .ag-row-group-indent-73 {
  padding-right: 1460px;
}

.ag-ltr .ag-column-select-indent-74 {
  padding-left: 1480px;
}
.ag-rtl .ag-column-select-indent-74 {
  padding-right: 1480px;
}

.ag-ltr .ag-row-group-indent-74 {
  padding-left: 1480px;
}
.ag-rtl .ag-row-group-indent-74 {
  padding-right: 1480px;
}

.ag-ltr .ag-column-select-indent-75 {
  padding-left: 1500px;
}
.ag-rtl .ag-column-select-indent-75 {
  padding-right: 1500px;
}

.ag-ltr .ag-row-group-indent-75 {
  padding-left: 1500px;
}
.ag-rtl .ag-row-group-indent-75 {
  padding-right: 1500px;
}

.ag-ltr .ag-column-select-indent-76 {
  padding-left: 1520px;
}
.ag-rtl .ag-column-select-indent-76 {
  padding-right: 1520px;
}

.ag-ltr .ag-row-group-indent-76 {
  padding-left: 1520px;
}
.ag-rtl .ag-row-group-indent-76 {
  padding-right: 1520px;
}

.ag-ltr .ag-column-select-indent-77 {
  padding-left: 1540px;
}
.ag-rtl .ag-column-select-indent-77 {
  padding-right: 1540px;
}

.ag-ltr .ag-row-group-indent-77 {
  padding-left: 1540px;
}
.ag-rtl .ag-row-group-indent-77 {
  padding-right: 1540px;
}

.ag-ltr .ag-column-select-indent-78 {
  padding-left: 1560px;
}
.ag-rtl .ag-column-select-indent-78 {
  padding-right: 1560px;
}

.ag-ltr .ag-row-group-indent-78 {
  padding-left: 1560px;
}
.ag-rtl .ag-row-group-indent-78 {
  padding-right: 1560px;
}

.ag-ltr .ag-column-select-indent-79 {
  padding-left: 1580px;
}
.ag-rtl .ag-column-select-indent-79 {
  padding-right: 1580px;
}

.ag-ltr .ag-row-group-indent-79 {
  padding-left: 1580px;
}
.ag-rtl .ag-row-group-indent-79 {
  padding-right: 1580px;
}

.ag-ltr .ag-column-select-indent-80 {
  padding-left: 1600px;
}
.ag-rtl .ag-column-select-indent-80 {
  padding-right: 1600px;
}

.ag-ltr .ag-row-group-indent-80 {
  padding-left: 1600px;
}
.ag-rtl .ag-row-group-indent-80 {
  padding-right: 1600px;
}

.ag-ltr .ag-column-select-indent-81 {
  padding-left: 1620px;
}
.ag-rtl .ag-column-select-indent-81 {
  padding-right: 1620px;
}

.ag-ltr .ag-row-group-indent-81 {
  padding-left: 1620px;
}
.ag-rtl .ag-row-group-indent-81 {
  padding-right: 1620px;
}

.ag-ltr .ag-column-select-indent-82 {
  padding-left: 1640px;
}
.ag-rtl .ag-column-select-indent-82 {
  padding-right: 1640px;
}

.ag-ltr .ag-row-group-indent-82 {
  padding-left: 1640px;
}
.ag-rtl .ag-row-group-indent-82 {
  padding-right: 1640px;
}

.ag-ltr .ag-column-select-indent-83 {
  padding-left: 1660px;
}
.ag-rtl .ag-column-select-indent-83 {
  padding-right: 1660px;
}

.ag-ltr .ag-row-group-indent-83 {
  padding-left: 1660px;
}
.ag-rtl .ag-row-group-indent-83 {
  padding-right: 1660px;
}

.ag-ltr .ag-column-select-indent-84 {
  padding-left: 1680px;
}
.ag-rtl .ag-column-select-indent-84 {
  padding-right: 1680px;
}

.ag-ltr .ag-row-group-indent-84 {
  padding-left: 1680px;
}
.ag-rtl .ag-row-group-indent-84 {
  padding-right: 1680px;
}

.ag-ltr .ag-column-select-indent-85 {
  padding-left: 1700px;
}
.ag-rtl .ag-column-select-indent-85 {
  padding-right: 1700px;
}

.ag-ltr .ag-row-group-indent-85 {
  padding-left: 1700px;
}
.ag-rtl .ag-row-group-indent-85 {
  padding-right: 1700px;
}

.ag-ltr .ag-column-select-indent-86 {
  padding-left: 1720px;
}
.ag-rtl .ag-column-select-indent-86 {
  padding-right: 1720px;
}

.ag-ltr .ag-row-group-indent-86 {
  padding-left: 1720px;
}
.ag-rtl .ag-row-group-indent-86 {
  padding-right: 1720px;
}

.ag-ltr .ag-column-select-indent-87 {
  padding-left: 1740px;
}
.ag-rtl .ag-column-select-indent-87 {
  padding-right: 1740px;
}

.ag-ltr .ag-row-group-indent-87 {
  padding-left: 1740px;
}
.ag-rtl .ag-row-group-indent-87 {
  padding-right: 1740px;
}

.ag-ltr .ag-column-select-indent-88 {
  padding-left: 1760px;
}
.ag-rtl .ag-column-select-indent-88 {
  padding-right: 1760px;
}

.ag-ltr .ag-row-group-indent-88 {
  padding-left: 1760px;
}
.ag-rtl .ag-row-group-indent-88 {
  padding-right: 1760px;
}

.ag-ltr .ag-column-select-indent-89 {
  padding-left: 1780px;
}
.ag-rtl .ag-column-select-indent-89 {
  padding-right: 1780px;
}

.ag-ltr .ag-row-group-indent-89 {
  padding-left: 1780px;
}
.ag-rtl .ag-row-group-indent-89 {
  padding-right: 1780px;
}

.ag-ltr .ag-column-select-indent-90 {
  padding-left: 1800px;
}
.ag-rtl .ag-column-select-indent-90 {
  padding-right: 1800px;
}

.ag-ltr .ag-row-group-indent-90 {
  padding-left: 1800px;
}
.ag-rtl .ag-row-group-indent-90 {
  padding-right: 1800px;
}

.ag-ltr .ag-column-select-indent-91 {
  padding-left: 1820px;
}
.ag-rtl .ag-column-select-indent-91 {
  padding-right: 1820px;
}

.ag-ltr .ag-row-group-indent-91 {
  padding-left: 1820px;
}
.ag-rtl .ag-row-group-indent-91 {
  padding-right: 1820px;
}

.ag-ltr .ag-column-select-indent-92 {
  padding-left: 1840px;
}
.ag-rtl .ag-column-select-indent-92 {
  padding-right: 1840px;
}

.ag-ltr .ag-row-group-indent-92 {
  padding-left: 1840px;
}
.ag-rtl .ag-row-group-indent-92 {
  padding-right: 1840px;
}

.ag-ltr .ag-column-select-indent-93 {
  padding-left: 1860px;
}
.ag-rtl .ag-column-select-indent-93 {
  padding-right: 1860px;
}

.ag-ltr .ag-row-group-indent-93 {
  padding-left: 1860px;
}
.ag-rtl .ag-row-group-indent-93 {
  padding-right: 1860px;
}

.ag-ltr .ag-column-select-indent-94 {
  padding-left: 1880px;
}
.ag-rtl .ag-column-select-indent-94 {
  padding-right: 1880px;
}

.ag-ltr .ag-row-group-indent-94 {
  padding-left: 1880px;
}
.ag-rtl .ag-row-group-indent-94 {
  padding-right: 1880px;
}

.ag-ltr .ag-column-select-indent-95 {
  padding-left: 1900px;
}
.ag-rtl .ag-column-select-indent-95 {
  padding-right: 1900px;
}

.ag-ltr .ag-row-group-indent-95 {
  padding-left: 1900px;
}
.ag-rtl .ag-row-group-indent-95 {
  padding-right: 1900px;
}

.ag-ltr .ag-column-select-indent-96 {
  padding-left: 1920px;
}
.ag-rtl .ag-column-select-indent-96 {
  padding-right: 1920px;
}

.ag-ltr .ag-row-group-indent-96 {
  padding-left: 1920px;
}
.ag-rtl .ag-row-group-indent-96 {
  padding-right: 1920px;
}

.ag-ltr .ag-column-select-indent-97 {
  padding-left: 1940px;
}
.ag-rtl .ag-column-select-indent-97 {
  padding-right: 1940px;
}

.ag-ltr .ag-row-group-indent-97 {
  padding-left: 1940px;
}
.ag-rtl .ag-row-group-indent-97 {
  padding-right: 1940px;
}

.ag-ltr .ag-column-select-indent-98 {
  padding-left: 1960px;
}
.ag-rtl .ag-column-select-indent-98 {
  padding-right: 1960px;
}

.ag-ltr .ag-row-group-indent-98 {
  padding-left: 1960px;
}
.ag-rtl .ag-row-group-indent-98 {
  padding-right: 1960px;
}

.ag-ltr .ag-column-select-indent-99 {
  padding-left: 1980px;
}
.ag-rtl .ag-column-select-indent-99 {
  padding-right: 1980px;
}

.ag-ltr .ag-row-group-indent-99 {
  padding-left: 1980px;
}
.ag-rtl .ag-row-group-indent-99 {
  padding-right: 1980px;
}

.ag-ltr {
  direction: ltr;
}
.ag-ltr .ag-body, .ag-ltr .ag-floating-top, .ag-ltr .ag-floating-bottom, .ag-ltr .ag-header, .ag-ltr .ag-body-viewport, .ag-ltr .ag-body-horizontal-scroll {
  flex-direction: row;
}

.ag-rtl {
  direction: rtl;
}
.ag-rtl .ag-body, .ag-rtl .ag-floating-top, .ag-rtl .ag-floating-bottom, .ag-rtl .ag-header, .ag-rtl .ag-body-viewport, .ag-rtl .ag-body-horizontal-scroll {
  flex-direction: row-reverse;
}
.ag-rtl .ag-icon-contracted,
.ag-rtl .ag-icon-tree-closed {
  display: block;
  -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
}

.ag-body .ag-body-viewport {
  -webkit-overflow-scrolling: touch;
}

.ag-chart {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.ag-chart-components-wrapper {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  overflow: hidden;
}

.ag-chart-title-edit {
  position: absolute;
  display: none;
  top: 0;
  left: 0;
  text-align: center;
}

.ag-chart-title-edit.currently-editing {
  display: inline-block;
}

.ag-chart-canvas-wrapper {
  position: relative;
  flex: 1 1 auto;
  overflow: hidden;
}

.ag-charts-canvas {
  display: block;
}

.ag-chart-menu {
  position: absolute;
  top: 10px;
  width: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.ag-ltr .ag-chart-menu {
  right: 20px;
}
.ag-rtl .ag-chart-menu {
  left: 20px;
}

.ag-chart-docked-container {
  position: relative;
  width: 0;
  min-width: 0;
  transition: min-width 0.4s;
}

.ag-chart-menu-hidden ~ .ag-chart-docked-container {
  max-width: 0;
  overflow: hidden;
}

.ag-chart-tabbed-menu {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ag-chart-tabbed-menu-header {
  flex: none;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  cursor: default;
}

.ag-chart-tabbed-menu-body {
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
  overflow: hidden;
}

.ag-chart-tab {
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
}

.ag-chart-settings {
  overflow-x: hidden;
}

.ag-chart-settings-wrapper {
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

.ag-chart-settings-nav-bar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  padding: 0 10px;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

.ag-chart-settings-card-selector {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex: 1 1 auto;
  height: 100%;
  padding: 0 10px;
}

.ag-chart-settings-card-item {
  cursor: pointer;
  width: 10px;
  height: 10px;
  background-color: #000;
  position: relative;
}
.ag-chart-settings-card-item.ag-not-selected {
  opacity: 0.2;
}
.ag-chart-settings-card-item::before {
  content: " ";
  display: block;
  position: absolute;
  background-color: transparent;
  left: 50%;
  top: 50%;
  margin-left: -10px;
  margin-top: -10px;
  width: 20px;
  height: 20px;
}

.ag-chart-settings-prev,
.ag-chart-settings-next {
  position: relative;
  flex: none;
}

.ag-chart-settings-prev-button,
.ag-chart-settings-next-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}

.ag-chart-settings-mini-charts-container {
  position: relative;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
}

.ag-chart-settings-mini-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
}
.ag-chart-settings-mini-wrapper.ag-animating {
  transition: left 0.3s;
  transition-timing-function: ease-in-out;
}

.ag-chart-mini-thumbnail {
  cursor: pointer;
}

.ag-chart-mini-thumbnail-canvas {
  display: block;
}

.ag-chart-data-wrapper,
.ag-chart-format-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

.ag-chart-data-section,
.ag-chart-format-section {
  display: flex;
  margin: 0;
}

.ag-charts-font-panel-controls {
  justify-content: space-between;
}

.ag-chart-empty-text {
  display: flex;
  top: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.ag-chart .ag-chart-menu {
  opacity: 0;
  pointer-events: none;
}

.ag-chart-menu-hidden:hover .ag-chart-menu {
  opacity: 1;
  pointer-events: all;
}

.ag-date-time-list-page-title-bar {
  display: flex;
}

.ag-date-time-list-page-column-labels-row,
.ag-date-time-list-page-entries-row {
  display: flex;
}

.ag-date-time-list-page-column-label,
.ag-date-time-list-page-entry {
  flex-basis: 0;
  flex-grow: 1;
}

.ag-date-time-list-page-entry {
  cursor: pointer;
}
`,""])},1509:(M,E,w)=>{E=M.exports=w(3645)(!1),E.push([M.id,`.ag-theme-balham {
  -webkit-font-smoothing: antialiased;
  color: #000;
  color: var(--ag-foreground-color, #000);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-size: 12px;
  line-height: normal;
}
@font-face {
  font-family: "agGridBalham";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABgoAAsAAAAALEgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAmMAAAR2YfRkQU9TLzIAAANsAAAAQQAAAFZWUFLwY21hcAAAA7AAAAIMAAAFnGSNxkJnbHlmAAAFvAAADpIAABo4y6JNTGhlYWQAABRQAAAANAAAADZ2zcSBaGhlYQAAFIQAAAAaAAAAJAfQBDFobXR4AAAUoAAAABoAAAEgs7L//WxvY2EAABS8AAAAawAAAJJHu0GKbWF4cAAAFSgAAAAfAAAAIAFeAKpuYW1lAAAVSAAAATUAAAJG0OP3eXBvc3QAABaAAAABqAAAAm9qOX49eJx9lM1SE1EQhc8wAYFEoDQqRkRQ/IvKMD8Zk/CTkJBoWS5cWJYLN1hWWVZRrngOH8AnYOkT+AAufAIfwIVL15ZfdwaDLMitTO50n+4+fW7fKJA0qw3taGJv+Pyl5g72Dz+qppJGH/Of3AcHH97va/r4DV/Jf6cVlCqa00291qG+BXPBYXA0UQ1r4avwXfg5/BL+UghqReugy1TcUKyEZ6RUmRrKNaEpbDH7x2qCDnm23HpBVzXpnp76WqRmTEzfM9b1THe0QJ6u5+loG1TKspwdnkPWXc2fgch1j/wZbDaxllBkmf2WqprRHiw7MGkT38R/kZo71I6I6uLrwm4SS4t9W5fgZBElV/Wp3ugRfuvUsmRFTMo31q6/R/5WZh2jWuRpUMty12FwbG9QNSHiIdkzUFuFonVUL+NNwUTEtl1Biy6DTOCWapWd9ZnAtaI1MC/01qvuFjEd13SkQB32Y3vX8+V0ftLaJtcQ7AM4jK12PvepFWngXS2COdAnHemrvuuHfuq3/uicLlMn8R62yb5zpjbTKHga3cPb+me1XqeYgdOo/xEzdN5wdWJ8/UJDq1amM1MnZR9hTR0/C0/D92CTcx4lakRe1056krXJewz6fDGdTVbFle4zBfM+wQOfhRoTlui6ZxzNYY7WS2S03YhfzXVrku+an5upazdswd/sLth51zj/ZX4jOsxcpyd4V7BYprHlhkflsLcc6/hzWI+rGaslWGU+0TZjA78dPSrdop8Rk0S3/WYMfL7WYJAVN7XKGRr7dnFiVxwXe1TAP0FU3PDUtbOZ7sLN5mP4F/iHapMAeJxjYGSqZ5zAwMrAwFTFtIeBgaEHQjM+YDBkZAKKMrAyM2AFAWmuKQwHGHQ/GjG/AHKjmN8wsABpRpAcANz2CuAAAAB4nLXUZ1IbQRCG4VeBKIEDOeNEVkAgssjhh0+BM4UDhTPn8Nl8jz4B/ma7fQBc5al61Duzo9FMrb4F2oCCLEkR8p3kdEUur9FcNl6gOxsv8lv9Mp3kdV3hgiturHF7q9EK51xybbms97flNLvMODOsqbdHjRab7NPglDrbrLLDFge62+SIZTZY4ZAT1tnlmDN9P+2iqD2206Hf7dJOSlqxh17u84A++hlgkCGGGWGUMf3WBJNMMa15j3jME57yTPNmmGWOeRZ0XWJRpyppzwtUtcl27tb27jg/tVprc79xWt/WibcO1po67MbK4cn67vHZPyz2H1o5fRR+Re856Ym6dNrzUJMXoSUvw6a8CvvyOjTkTTiVt6Eu78K2XIRVuQw78j5syYdwIB9D+ld9Ck25CkdyHZblc9iQL2FFvoZD+RZO5HtYlx9hV36GY7kJeoCWcykvlnekWnApX1Z0KWPW5lL2rN2Raocj1U5Hql2OVLtdyqSVHKmWXXqS1uNItdeR6j2n7GBBKcKCsoE9dEoW1ueUMazfKW3YgFPusEGnBGJDTlnEhp1SiY045RMbdUoqNuaUWWzcKb3YhFOOsUmnRGNTLjvvtFPKsaC8Y0HJx4LeAVjQ2wAL2XlnHKnOOlKdc6Q670h1wZHqosvWWXLZ3iqOdL/q0vvVai6bU3cpY7bssjUbjuofQy2jW3ic7VlrkBzVde5ze2d6et7d04+Z2Z33a3deu/OWZnd79EDL7gr0YldCBqQoEnKwVhgpwsJCC7ZwBBI4JlIBdkXxq8qmoCouJ65QlC3ZKeKCpYIWhUAShCs/sBML4mAcq1LljaaVc3t6VlqhAPa/VLLT3ff07XvPPfecc8/57l2GZfCP/Q77HUZlSsx2hoEwUUXWTbieVJFkiE8jjaQlbvWAVZbUMKg9KQ0aIluETDoRt1oStYSsqObPyhk/uVKryLFMtVFvYNt6o57O0F8txgr9a7LQ0wPZNf36T/WfXnmDkP7z1DIAtodUExCGcKJKHA6kp+5a8V/wZGsBfI5o2K04vHa/J5p2qwst/Rj0cLJ7pVu2WsORITEEcJB95nqsIWS8raqnbv/6+j/6VJe1OQzLLrRYj+hUFKdP7FuluPwht+ptzToG5aTkHHL6PEKfPylFE6upqsDQ15fZLzMRhvGpXKahcjHBKDJCzCgaMcEoVGFuPH/yZH4cXEtL/dfm+xvXr1/87jLHIy+yEmPDF3OcBLxxtPDaa4WjGjl1NP/aa/mj+jIqliHbHnYPIzEDTA3bx6k5JGqaMrVDldqBK9N3iX4x7FKnX3zIFzkj/0wDLu7eMl2uVMrTW17pErunJ8ayuVx2bOJZSkAWqelvFb797cK3jCe7Z0lzg9CWNjco/dfdHvhkFmX2s36kOMaBOq0ICXo3KnLi3OzsuwcOvHPvveQu/ZNkvP38woLR/PJlfFxg32F8TIZBNgMQL0JNqGpQiZXDIAuSG9hY3E2pMK3T6NcicID6A7ba/lzplqGhW0qkUw62Z0PlEF7kIaPs17e9UvkKfPpKi5LRg/1mqBRqH8YHXuQL+PgVtix/Be65Vqbcx5eJjeG6+CiJVrZ/TEY+Why9OG64y2X8Q1kuGLIw0B0+EVsUyXI9SapXMaeDHblGCvbC1V9pOXatBKY972N3MRb0WD/D8MCpPLCNCHRig6SU6zXqiOTf9O3NnXobtLm5l77rcAQ8SmlNSfEE4AX4xjB+0P8GRufmNJcr3JsOxEuleCDVF6bse4wxCqzb9BkPw6QSQsVn3kDv51qtH2ja6VarfVbT3iLl9vyVe3Edk5OsBeVEGanfkxP6+/mf/SwPFzulOZebcT35mAQzREfpKnB4UaksRkEkFKyp46c0jm7YXI5hPfnzi7mJXHYiT4vcRPpSul43HnrPiuxEDp7QP5mqzeI3qBgNcvpZfJByPa3/mDaFkXRddxIxN55r1VJX5H6RvEjXCixZtVctRxK9eplZGebyJfZu9heMF2cSYsaZzzF/hr3p8rd0pEcvqNfYRA2EmGpVcTK+lOQmON2eWlUjFTpZyRpPZ4pAp4tuU6axvayo1K3iWF2r1sthtkJti6mhSKgOymFidur0iYCihklDxYBT0qgCJdkDboI6HWSxu8Lu5XbfY9HXZRqNDKlnGmPf01fBMQKsxXue6Nt5MSx5Vclrt7j8MZ+a9Nldth6b5FH7nGpUsRKb2/4XYlwJCS4v77ZxNo9TUByiV+oVxIgi+gWb3cX1WDxh0eqwiKLDJdpHclnCEpvDZiE1wtk9TiupsGAXbeTnts8csZBlmUuvGsIcO3fpOHvfGwFeaD/+j85I2GcTe6MpOV5LS30ZkffYXbJULUdzit9v97g9gQHF40iJDrcjIDhV0S3YrJwvVkz5XLJf9todHtHn4h08y3EWzhf64x+c5h1WO+eyW/jXeY+Nd/PzHt7uFamp/992/3tttzR3m5igQnxm7oabOrkb5joxbYmdJz7Sxg2avKv1SlmJQItQkymy5AHEaGjXeHoQOOoE6Vr1w01T2LqW5yySR/B5R1bY3VaXzeOT10057bwoiT23bunhBaz5MKXOfXaP2+VQvD7/Jz7hES0Wr1MI7f2sRxbdPG998JDVZhU8IvN/ZI5L8gqmPo4HcgKTif4+eMk/0eziBS82sRi55Wm2iZllOXMTM81sw/b1RgXhdwdF08juhkwHOzcMlIZhXnWDBwywTV+tRkKqNkCDFhQJ9ql31juXMlZtpdwCY1Un4hwktt8l3v7M55MuQewNRtOj+Ym1z26cumFjyevjHQ6vN98ayWtDN6mQ3rh+x523K1Jfc2Jk13AeHh5aq0L4wBNfW5toTgzf2czp88HcjbnBTD6YHc8OZsivSiy77pFb++LhbF8sgIxToiSXmpt7i5JfDsujudH8U5Fba2SrNirJYau9Lze8a3iiqf9ddGuNjN89ysbjWDMy0TzfP4gcg/nMYA6LK7n+aTbB9DJFZhg1ZexQTBVZr1YP7jVUN+lqp6MRrtxxlSJgUFOpJhD3hIAGQUQ90F7Ux9q9n/r0/q0byqYuWn89Azd98e6IqYuNn09QBYw3dzSbOw7sWL58xz9kx6fGs8aDTSxOfl0y4fasaG4xJz69q6dFRmfWdCYeCt67ns42shxZdPj8PWQpkyzpFNR1TGxTwP0Yokgw5xkCrlE3J5sehZhFMvdccqPWcQ1cOgUY8K9q+G2nAQhw/vqqwADZ1z5rMyh0kc5XciEzFBoeCvLOP3xsen/TYQuURsNDyTUtgQ+WRkNDqSODU9iiWQrygikPWTD8me96tEVICOQ3plfrv6ctOraiO+Ei4+zMgby3iM98OJte3DElDGw8yDCNRK2iXnWnPuJ9wcByVxDd9V8WZjt/LbPUzBLFsS3Z59ZwzY0yK5k1Rgz6rXa8PpTGgpg9dU35O+5tT83OwkH9JViuH1uknEhd1Cfhud9tO9v+d03TWubNMB+wYQftUpRMcibi/WdN66Le9n+iBbt+uJ/tRc0J1O4IaKnpWbWRwdlieMy04Jh+sHVcPw/p+fnSLLyth2dL5HHttHYc0pDWz8+X0QLlLq99iKOzzBbDp1GtHCoYwxvVar0FtXSmhH7uBnTpMDSwRqOhzxc3WmEljXZF8wPtLeEHrC4Z697gkiB+3GvEeu32vpnQLf3JKmdVAqKTFVPePo/bm8gdXp6NzBT8ITW7K3tzaM+g2qfmwjbgUgHZIdIuuQaokggOVky4+yS7Y3UxnSVreKeld9NAOrQn5HO5RtOJsaDIJlJiUs7sHColc72qJ7qn+PBwMQJ8FLl+YXgoGuYdlsiugopcfW7P+mKoJhl9Yr7kHYXSep+364+Pso9+YI0w1KMoprfgbXgX3g3znUMaPVS7Zy4/By/k5/IQWFhozy8srEWabMNaXCnbFiJI4JUvowdswxKvuWcWrvhCm7QRWbpwtx2hzsClBgF3Eo1fsG+O7d+4H/7WLOfOs7T8aqcw90MF8mp3rw7oCd0fW2h/CaONeUOghbZvdW0fx/htjGcOZA4Lr/YYA/1JZ7z/eLMHi33wozfZsX2b9pt9n8V9XscHuwgKXbdzEALNx4pvnS8+thL+aiVSbw0+Bhseyp09m3sIzrTn4UyHphga+RxhDzIKRp8G02LWMlPIj7qaqhhul0kb3tXQiEpfOavphxh0qW9hK1qZQcTBg2KE20FATAJGp3pDNYK02kjDwh2bN+61O7Ppmyeev/WO1aMrCElF73505YbxG27j+VR607oz66azCZtt69jkU1Grdf3oqslqKQOH9F9WZgayCFHOrFrerx9NOvzBenMTr1XLsiJejrCfIdXS09vuvG3DslpKVlrLvjq1ZXLlznqL5LNf3DB98/pizpItbJ6Y3vh4rvDy6MTYbDzJWYIK3K8/5e1NpavN4VdIWNGPtk6sXD1QsGjsQP+INnzZvngGM8Pej97Xz4ygZoyDIuPwSE588KAgwZUVujmo1iGG4Euo1odBjtUoOBMkK9nndAcimyMBt3M2vjyOF1zslAtCIBAPBMChO4PJZLAFB7VgKsWGRMnvFkW3XxKxkT5pdnoOH4I/6ser/fVUAJ4LJmdnk0F9MpBajE+HDZmbKHEXIdXRCFhQY3E0QdIwg4uJ5tEIcGmcEnSs11CVioGhYOMJID0WPtQcbOx0N0NRCMsr1vwB5lBWkgvqkxge/8XHO23eU/X+sgBBm0rARp6w4VbALXpfhwdOIGLwOPsdvGNHcTQs62/3TTvvtFoCtdyQ6sDu5Eter8+tnHKzbK/+r1Yp46+KT2Iw52zi64z9qrwURe2vZMYM77yN2cHs/h9yU0xQjINVC01PEYQxndUgI9DhEp0jScVQRkpSK7WMlavUGllARVQwscoV6tEpa4KTK410Qq58WOKCQ+2XfvkeZhW+bQPMMVH4vj0/PZXns2P9B/j89HTeviJZDoah/TIcvh9gtlVdi5nuUAvOHKLtURfLsw/+aNmND35oKrvUftnKY/P3zgpeHAzuB4/BnL+n/8Yc4fNTOA7gdkvJhseWPfDDydqDv6mntrcOH47ThAdweBYeWPQJeu5Fzz/N008v9YIoVYf3mtPPuLG5oF/g4iMH9q2+4YbV+w6At0s9cnD3zubISHPn7veQGB5Ggr1AP+jvL22sLWlDiZHumurKov1W0lxzNmu0+bgiwnevc+r6seXWJ6eX9qTMrsUCFD9gwMdkpCIowGieYffp54+39INwrHW8NKuH4e3Z0vw8IorzxykaOE5hwPy8yYeeT7swEjO4z0Mcae77BEs3urP+9vO3lOJkPF7SvzfTPHeuOTOFrH4CSf0n9BQQkn0zw+fODc/AycXzeAs5aZzj0QMKtkd/34AyZDeFp0gw17YDemaGeCzfga1HOuVimxe6Z4IqttFP/CVu0VeRJ5AoPAyrFnkViESt7EMdnDaSnk9bjKV72Rm0ew7xJeOLI5BEtI6Zhm7GMLJiPvEhpgkTBDMZ7goGygBFO6qxtOk/Uzq0cW7zNCFJQv4Ulr1LLAalz71LvEU1pGz6/Z1JraAl7sr6Y5xNDmoF+MbAuhBWCYXA4GZRECJIR6JWpXfnMnYPdraQU/rcO8gQrOQUNN4l+n0IX7B9xGDk7PUW+5KTvchoMmrwUVhLOd+/Ffm0Iptv7y8N4wz/G4A9L1cAAHicY2BkYGAAYgWvvDnx/DZfGbiZXwAFojgf72uA0f/////D/IL5DVAlBwMTkGQAAHb/DvN4nGNgZGBgfsHAACL//wezGRlQgQcAdFMFCgAAeJxjYGBgYH6BDf//j8C41AwspgcAANyGMDUAAHicY2AAghkMFxieMTowRjEuYXzFpMEUxVTD1Md0g+kT8wWWdSxHWM1YV7DuYQtgO8EuwK7FXsL+iYOHw4hjD8cPTjFOA04/ziIuJq4YrgPcadxreIR4zHgSeEp42nhm8azglSEdAgCdlRu1AHicY2BkYGDwYJjHwMMAAkxAzAWEDAz/wXwGACBkAgkAeJx1jz9OwzAYxV9oWkSLEBISYsMTC1L6Z2Do2KHZO3RgcxsnbZXEkeNW6sYxOAHHYOQInIJD8BK+oUKqLTk///zeJwXALb4QoFkBrtuzWRe45O2PO6Q74ZD8KNzFAM/CPfoX4T7tTHjAZsEJQXhF84A34Qvc4F24Q/8hHJI/hbu4x7dwj/5HuI9lEAoP8BS86ix222Sm840uFibb59qdqlNeGldvbanG0ehUx6Y0TnuTqNVR1Yds4n2qUmcLNbelN3luVeXszqx9tPG+mg6HqfhobQtoZIjhsEXCP9fIseFZYAHDlz3vmq/nUuf8km2Hmt6ihMIYEUZn0zHTZdvQ8PwmbKxw5FnjwM6E1iPlPWXGsqEwbyc36Zzb0lTt245mTR9xdtOqMMWQO/2Xj5jipF9al2jJAAAAeJxtkQdv2zAQhf3Fku3YaeO6bbr3Hmrr7p3upj+DpmiZiEQKJOWRX18iLgIE6AE8vPdwvHu4a2201tFv/T/22KBNQkqHLj026TNgixOcZJshpxhxmjOcZYdznOcCF7nEZa5wlWtc5wY3ucVt7nCXe9znAQ95xGMynvCUZ4x5zgte8orXvOEt73jPBz7yic/s8oWvfOM7P/jJL36zx5/WQBSFU4UI2pqOcM4ufFt42ZHCSFWmciZcGMqZkvsTu8wOgcp3jgRtchWUq7QRQY2O5Mb8q9yStrQuq3UkrhtJUxnfl9YEJ2RQeSJtvUqls963pZ+n8WXjJFdepmoZDXQPczbuqWUt4qx8U61U5kvhZ+2IOlNdxvHpVDsfksLpOi2cbeokFoSkVNPQKbWJPrqlFbk2Ra8SS13pA5VUyjS96HvNjDVqYGzIRFnahcrTOjZQ7VqbtNZzG4YufrfZpAnBmsxOp9vHBZM6XcxC4sVc9X0Vu2S5XZjeGkZDIW5gFJxSx1fWa8zaIIIChyKgsRgWeCQlM/aZsIwnzqloqFkxZ8pBq/UXq/Gj5g==") format("woff");
  font-weight: normal;
  font-style: normal;
}
.ag-theme-balham .ag-icon {
  font-family: "agGridBalham";
  font-size: 16px;
  line-height: 16px;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.ag-theme-balham .ag-icon-aggregation::before {
  content: "\\f101";
}
.ag-theme-balham .ag-icon-arrows::before {
  content: "\\f102";
}
.ag-theme-balham .ag-icon-asc::before {
  content: "\\f103";
}
.ag-theme-balham .ag-icon-cancel::before {
  content: "\\f104";
}
.ag-theme-balham .ag-icon-chart::before {
  content: "\\f105";
}
.ag-theme-balham .ag-icon-color-picker::before {
  content: "\\f109";
}
.ag-theme-balham .ag-icon-columns::before {
  content: "\\f10a";
}
.ag-theme-balham .ag-icon-contracted::before {
  content: "\\f10b";
}
.ag-theme-balham .ag-icon-copy::before {
  content: "\\f10c";
}
.ag-theme-balham .ag-icon-cross::before {
  content: "\\f10d";
}
.ag-theme-balham .ag-icon-csv::before {
  content: "\\f10e";
}
.ag-theme-balham .ag-icon-desc::before {
  content: "\\f10f";
}
.ag-theme-balham .ag-icon-excel::before {
  content: "\\f110";
}
.ag-theme-balham .ag-icon-expanded::before {
  content: "\\f111";
}
.ag-theme-balham .ag-icon-eye-slash::before {
  content: "\\f112";
}
.ag-theme-balham .ag-icon-eye::before {
  content: "\\f113";
}
.ag-theme-balham .ag-icon-filter::before {
  content: "\\f114";
}
.ag-theme-balham .ag-icon-first::before {
  content: "\\f115";
}
.ag-theme-balham .ag-icon-grip::before {
  content: "\\f116";
}
.ag-theme-balham .ag-icon-group::before {
  content: "\\f117";
}
.ag-theme-balham .ag-icon-last::before {
  content: "\\f118";
}
.ag-theme-balham .ag-icon-left::before {
  content: "\\f119";
}
.ag-theme-balham .ag-icon-linked::before {
  content: "\\f11a";
}
.ag-theme-balham .ag-icon-loading::before {
  content: "\\f11b";
}
.ag-theme-balham .ag-icon-maximize::before {
  content: "\\f11c";
}
.ag-theme-balham .ag-icon-menu::before {
  content: "\\f11d";
}
.ag-theme-balham .ag-icon-minimize::before {
  content: "\\f11e";
}
.ag-theme-balham .ag-icon-next::before {
  content: "\\f11f";
}
.ag-theme-balham .ag-icon-none::before {
  content: "\\f120";
}
.ag-theme-balham .ag-icon-not-allowed::before {
  content: "\\f121";
}
.ag-theme-balham .ag-icon-paste::before {
  content: "\\f122";
}
.ag-theme-balham .ag-icon-pin::before {
  content: "\\f123";
}
.ag-theme-balham .ag-icon-pivot::before {
  content: "\\f124";
}
.ag-theme-balham .ag-icon-previous::before {
  content: "\\f125";
}
.ag-theme-balham .ag-icon-right::before {
  content: "\\f128";
}
.ag-theme-balham .ag-icon-save::before {
  content: "\\f129";
}
.ag-theme-balham .ag-icon-small-down::before {
  content: "\\f12a";
}
.ag-theme-balham .ag-icon-small-left::before {
  content: "\\f12b";
}
.ag-theme-balham .ag-icon-small-right::before {
  content: "\\f12c";
}
.ag-theme-balham .ag-icon-small-up::before {
  content: "\\f12d";
}
.ag-theme-balham .ag-icon-tick::before {
  content: "\\f12e";
}
.ag-theme-balham .ag-icon-tree-closed::before {
  content: "\\f12f";
}
.ag-theme-balham .ag-icon-tree-indeterminate::before {
  content: "\\f130";
}
.ag-theme-balham .ag-icon-tree-open::before {
  content: "\\f131";
}
.ag-theme-balham .ag-icon-unlinked::before {
  content: "\\f132";
}
.ag-theme-balham .ag-icon-row-drag::before {
  content: "\\f116";
}
.ag-theme-balham .ag-left-arrow::before {
  content: "\\f119";
}
.ag-theme-balham .ag-right-arrow::before {
  content: "\\f128";
}
.ag-theme-balham .ag-root-wrapper {
  background-color: white;
  background-color: var(--ag-background-color, white);
}
.ag-theme-balham [class^=ag-], .ag-theme-balham [class^=ag-]:focus, .ag-theme-balham [class^=ag-]:after, .ag-theme-balham [class^=ag-]:before {
  box-sizing: border-box;
  outline: none;
}
.ag-theme-balham [class^=ag-]::-ms-clear {
  display: none;
}
.ag-theme-balham .ag-checkbox .ag-input-wrapper,
.ag-theme-balham .ag-radio-button .ag-input-wrapper {
  overflow: visible;
}
.ag-theme-balham .ag-range-field .ag-input-wrapper {
  height: 100%;
}
.ag-theme-balham .ag-toggle-button {
  flex: none;
  width: unset;
  min-width: unset;
}
.ag-theme-balham .ag-ltr .ag-label-align-right .ag-label {
  margin-left: 4px;
}

.ag-theme-balham .ag-rtl .ag-label-align-right .ag-label {
  margin-right: 4px;
}

.ag-theme-balham input[class^=ag-] {
  margin: 0;
  background-color: white;
  background-color: var(--ag-background-color, white);
}
.ag-theme-balham textarea[class^=ag-],
.ag-theme-balham select[class^=ag-] {
  background-color: white;
  background-color: var(--ag-background-color, white);
}
.ag-theme-balham input[class^=ag-]:not([type]),
.ag-theme-balham input[class^=ag-][type=text],
.ag-theme-balham input[class^=ag-][type=number],
.ag-theme-balham input[class^=ag-][type=tel],
.ag-theme-balham input[class^=ag-][type=date],
.ag-theme-balham input[class^=ag-][type=datetime-local],
.ag-theme-balham textarea[class^=ag-] {
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  border-width: 1px;
  border-style: solid;
  /* border-color: #95a5a6;
  border-color: var(--ag-input-border-color, #95a5a6); */
  border-color: rgba(149, 165, 166, 0.3);
  border-color: var(--ag-input-disabled-border-color, rgba(149, 165, 166, 0.3));
}
.ag-theme-balham input[class^=ag-]:not([type]):disabled,
.ag-theme-balham input[class^=ag-][type=text]:disabled,
.ag-theme-balham input[class^=ag-][type=number]:disabled,
.ag-theme-balham input[class^=ag-][type=tel]:disabled,
.ag-theme-balham input[class^=ag-][type=date]:disabled,
.ag-theme-balham input[class^=ag-][type=datetime-local]:disabled,
.ag-theme-balham textarea[class^=ag-]:disabled {
  color: rgba(0, 0, 0, 0.38);
  color: var(--ag-disabled-foreground-color, rgba(0, 0, 0, 0.38));
  background-color: #ebebeb;
  background-color: var(--ag-input-disabled-background-color, #ebebeb);
  border-color: rgba(149, 165, 166, 0.3);
  border-color: var(--ag-input-disabled-border-color, rgba(149, 165, 166, 0.3));
}
.ag-theme-balham input[class^=ag-]:not([type]):focus,
.ag-theme-balham input[class^=ag-][type=text]:focus,
.ag-theme-balham input[class^=ag-][type=number]:focus,
.ag-theme-balham input[class^=ag-][type=tel]:focus,
.ag-theme-balham input[class^=ag-][type=date]:focus,
.ag-theme-balham input[class^=ag-][type=datetime-local]:focus,
.ag-theme-balham textarea[class^=ag-]:focus {
  outline: none;
  box-shadow: 0 0 2px 1px #719ECE;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham input[class^=ag-][type=number] {
  -moz-appearance: textfield;
}
.ag-theme-balham input[class^=ag-][type=number]::-webkit-outer-spin-button, .ag-theme-balham input[class^=ag-][type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.ag-theme-balham input[class^=ag-][type=range] {
  padding: 0;
}
.ag-theme-balham input[class^=ag-][type=button]:focus, .ag-theme-balham button[class^=ag-]:focus {
  box-shadow: 0 0 2px 1px #719ECE;
}
.ag-theme-balham .ag-drag-handle {
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-list-item, .ag-theme-balham .ag-virtual-list-item {
  height: 24px;
}
.ag-theme-balham .ag-keyboard-focus .ag-virtual-list-item:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-virtual-list-item:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 4px;
  left: 4px;
  display: block;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-select-list {
  background-color: white;
  background-color: var(--ag-background-color, white);
  overflow-y: auto;
  overflow-x: hidden;
}
.ag-theme-balham .ag-list-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ag-theme-balham .ag-list-item.ag-active-item {
  background-color: #ecf0f1;
  background-color: var(--ag-row-hover-color, #ecf0f1);
}
.ag-theme-balham .ag-select-list-item {
  padding-left: 4px;
  padding-right: 4px;
  cursor: default;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.ag-theme-balham .ag-select-list-item span {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.ag-theme-balham .ag-select .ag-picker-field-wrapper {
  background-color: white;
  background-color: var(--ag-background-color, white);
  min-height: 24px;
  cursor: default;
}
.ag-theme-balham .ag-select.ag-disabled .ag-picker-field-wrapper:focus {
  box-shadow: none;
}
.ag-theme-balham .ag-select:not(.ag-cell-editor) {
  height: 24px;
}
.ag-theme-balham .ag-select .ag-picker-field-display {
  margin: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ag-theme-balham .ag-select .ag-picker-field-icon {
  display: flex;
  align-items: center;
}
.ag-theme-balham .ag-select.ag-disabled {
  opacity: 0.5;
}
.ag-theme-balham .ag-rich-select {
  background-color: #f5f7f7;
  background-color: var(--ag-control-panel-background-color, #f5f7f7);
}
.ag-theme-balham .ag-rich-select-list {
  width: 100%;
  min-width: 200px;
  height: 182px;
}
.ag-theme-balham .ag-rich-select-value {
  padding: 0 4px 0 12px;
  height: 28px;
  border-bottom: solid 1px;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-secondary-border-color, var(--ag-border-color, #bdc3c7));
}
.ag-theme-balham .ag-rich-select-virtual-list-item {
  cursor: default;
  height: 24px;
}
.ag-theme-balham .ag-rich-select-virtual-list-item:hover {
  background-color: #ecf0f1;
  background-color: var(--ag-row-hover-color, #ecf0f1);
}
.ag-theme-balham .ag-rich-select-row {
  padding-left: 12px;
}
.ag-theme-balham .ag-rich-select-row-selected {
  background-color: #b7e4ff;
  background-color: var(--ag-selected-row-background-color, #b7e4ff);
}
.ag-theme-balham .ag-row-drag,
.ag-theme-balham .ag-selection-checkbox,
.ag-theme-balham .ag-group-expanded,
.ag-theme-balham .ag-group-contracted {
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-ltr .ag-row-drag, .ag-theme-balham .ag-ltr .ag-selection-checkbox, .ag-theme-balham .ag-ltr .ag-group-expanded, .ag-theme-balham .ag-ltr .ag-group-contracted {
  margin-right: 12px;
}

.ag-theme-balham .ag-rtl .ag-row-drag, .ag-theme-balham .ag-rtl .ag-selection-checkbox, .ag-theme-balham .ag-rtl .ag-group-expanded, .ag-theme-balham .ag-rtl .ag-group-contracted {
  margin-left: 12px;
}

.ag-theme-balham .ag-cell-wrapper > *:not(.ag-cell-value):not(.ag-group-value) {
  height: 26px;
  display: flex;
  align-items: center;
  flex: none;
}
.ag-theme-balham .ag-group-expanded,
.ag-theme-balham .ag-group-contracted {
  cursor: pointer;
}
.ag-theme-balham .ag-group-title-bar-icon {
  cursor: pointer;
  flex: none;
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-ltr .ag-group-child-count {
  margin-left: 2px;
}

.ag-theme-balham .ag-rtl .ag-group-child-count {
  margin-right: 2px;
}

.ag-theme-balham .ag-group-title-bar {
  background-color: #e2e9eb;
  background-color: var(--ag-subheader-background-color, #e2e9eb);
  padding: 4px;
}
.ag-theme-balham .ag-group-toolbar {
  padding: 4px;
}
.ag-theme-balham .ag-disabled-group-title-bar, .ag-theme-balham .ag-disabled-group-container {
  opacity: 0.5;
}
.ag-theme-balham .group-item {
  margin: 2px 0;
}
.ag-theme-balham .ag-label {
  white-space: nowrap;
}
.ag-theme-balham .ag-ltr .ag-label {
  margin-right: 4px;
}

.ag-theme-balham .ag-rtl .ag-label {
  margin-left: 4px;
}

.ag-theme-balham .ag-label-align-top .ag-label {
  margin-bottom: 2px;
}
.ag-theme-balham .ag-ltr .ag-slider-field, .ag-theme-balham .ag-ltr .ag-angle-select-field {
  margin-right: 8px;
}

.ag-theme-balham .ag-rtl .ag-slider-field, .ag-theme-balham .ag-rtl .ag-angle-select-field {
  margin-left: 8px;
}

.ag-theme-balham .ag-angle-select-parent-circle {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  background-color: white;
  background-color: var(--ag-background-color, white);
}
.ag-theme-balham .ag-angle-select-child-circle {
  top: 4px;
  left: 12px;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  margin-top: -4px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.54);
  background-color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-picker-field-wrapper {
  border: 1px solid;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  border-radius: 5px;
}
.ag-theme-balham .ag-picker-field-wrapper:focus {
  box-shadow: 0 0 2px 1px #719ECE;
}
.ag-theme-balham .ag-picker-field-button {
  background-color: white;
  background-color: var(--ag-background-color, white);
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-dialog.ag-color-dialog {
  border-radius: 5px;
}
.ag-theme-balham .ag-color-picker .ag-picker-field-display {
  height: 16px;
}
.ag-theme-balham .ag-color-panel {
  padding: 4px;
}
.ag-theme-balham .ag-spectrum-color {
  background-color: red;
  border-radius: 2px;
}
.ag-theme-balham .ag-spectrum-tools {
  padding: 10px;
}
.ag-theme-balham .ag-spectrum-sat {
  background-image: linear-gradient(to right, white, rgba(204, 154, 129, 0));
}
.ag-theme-balham .ag-spectrum-val {
  background-image: linear-gradient(to top, black, rgba(204, 154, 129, 0));
}
.ag-theme-balham .ag-spectrum-dragger {
  border-radius: 12px;
  height: 12px;
  width: 12px;
  border: 1px solid white;
  background: black;
  box-shadow: 0 0 2px 0px rgba(0, 0, 0, 0.24);
}
.ag-theme-balham .ag-spectrum-hue-background {
  border-radius: 2px;
}
.ag-theme-balham .ag-spectrum-alpha-background {
  border-radius: 2px;
}
.ag-theme-balham .ag-spectrum-tool {
  margin-bottom: 10px;
  height: 11px;
  border-radius: 2px;
}
.ag-theme-balham .ag-spectrum-slider {
  margin-top: -12px;
  width: 13px;
  height: 13px;
  border-radius: 13px;
  background-color: #f8f8f8;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
.ag-theme-balham .ag-recent-color {
  margin: 0 3px;
}
.ag-theme-balham .ag-recent-color:first-child {
  margin-left: 0;
}
.ag-theme-balham .ag-recent-color:last-child {
  margin-right: 0;
}
.ag-theme-balham.ag-dnd-ghost {
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  background: white;
  background: var(--ag-background-color, white);
  border-radius: 2px;
  box-shadow: none;
  padding: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-secondary-border-color, var(--ag-border-color, #bdc3c7));
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
  height: 32px !important;
  line-height: 32px;
  margin: 0;
  padding: 0 8px;
  -webkit-transform: translateY(8px);
          transform: translateY(8px);
}
.ag-theme-balham .ag-dnd-ghost-icon {
  margin-right: 4px;
  color: #000;
  color: var(--ag-foreground-color, #000);
}
.ag-theme-balham .ag-popup-child:not(.ag-tooltip-custom) {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}
.ag-dragging-range-handle .ag-theme-balham .ag-dialog, .ag-dragging-fill-handle .ag-theme-balham .ag-dialog {
  opacity: 0.7;
  pointer-events: none;
}
.ag-theme-balham .ag-dialog {
  border-radius: 2px;
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-panel {
  background-color: white;
  background-color: var(--ag-background-color, white);
}
.ag-theme-balham .ag-panel-title-bar {
  background-color: #f5f7f7;
  background-color: var(--ag-header-background-color, #f5f7f7);
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-header-foreground-color, var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54)));
  height: 32px;
  padding: 4px 12px;
  border-bottom: solid 1px;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-ltr .ag-panel-title-bar-button {
  margin-left: 4px;
}

.ag-theme-balham .ag-rtl .ag-panel-title-bar-button {
  margin-right: 4px;
}

.ag-theme-balham .ag-tooltip {
  background-color: #f5f7f7;
  background-color: var(--ag-header-background-color, #f5f7f7);
  color: #000;
  color: var(--ag-foreground-color, #000);
  padding: 4px;
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  border-radius: 2px;
  transition: opacity 1s;
  white-space: normal;
}
.ag-theme-balham .ag-tooltip.ag-tooltip-hiding {
  opacity: 0;
}
.ag-theme-balham .ag-ltr .ag-column-select-indent-1 {
  padding-left: 20px;
}

.ag-theme-balham .ag-rtl .ag-column-select-indent-1 {
  padding-right: 20px;
}

.ag-theme-balham .ag-ltr .ag-column-select-indent-2 {
  padding-left: 40px;
}

.ag-theme-balham .ag-rtl .ag-column-select-indent-2 {
  padding-right: 40px;
}

.ag-theme-balham .ag-ltr .ag-column-select-indent-3 {
  padding-left: 60px;
}

.ag-theme-balham .ag-rtl .ag-column-select-indent-3 {
  padding-right: 60px;
}

.ag-theme-balham .ag-ltr .ag-column-select-indent-4 {
  padding-left: 80px;
}

.ag-theme-balham .ag-rtl .ag-column-select-indent-4 {
  padding-right: 80px;
}

.ag-theme-balham .ag-ltr .ag-column-select-indent-5 {
  padding-left: 100px;
}

.ag-theme-balham .ag-rtl .ag-column-select-indent-5 {
  padding-right: 100px;
}

.ag-theme-balham .ag-ltr .ag-column-select-indent-6 {
  padding-left: 120px;
}

.ag-theme-balham .ag-rtl .ag-column-select-indent-6 {
  padding-right: 120px;
}

.ag-theme-balham .ag-ltr .ag-column-select-indent-7 {
  padding-left: 140px;
}

.ag-theme-balham .ag-rtl .ag-column-select-indent-7 {
  padding-right: 140px;
}

.ag-theme-balham .ag-ltr .ag-column-select-indent-8 {
  padding-left: 160px;
}

.ag-theme-balham .ag-rtl .ag-column-select-indent-8 {
  padding-right: 160px;
}

.ag-theme-balham .ag-ltr .ag-column-select-indent-9 {
  padding-left: 180px;
}

.ag-theme-balham .ag-rtl .ag-column-select-indent-9 {
  padding-right: 180px;
}

.ag-theme-balham .ag-column-select-header-icon {
  cursor: pointer;
}
.ag-theme-balham .ag-keyboard-focus .ag-column-select-header-icon:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-column-select-header-icon:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 0px;
  left: 0px;
  display: block;
  width: calc(100% - 0px);
  height: calc(100% - 0px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-ltr .ag-column-group-icons:not(:last-child), .ag-theme-balham .ag-ltr .ag-column-select-header-icon:not(:last-child), .ag-theme-balham .ag-ltr .ag-column-select-header-checkbox:not(:last-child), .ag-theme-balham .ag-ltr .ag-column-select-header-filter-wrapper:not(:last-child), .ag-theme-balham .ag-ltr .ag-column-select-checkbox:not(:last-child), .ag-theme-balham .ag-ltr .ag-column-select-column-drag-handle:not(:last-child), .ag-theme-balham .ag-ltr .ag-column-select-column-group-drag-handle:not(:last-child), .ag-theme-balham .ag-ltr .ag-column-select-column-label:not(:last-child) {
  margin-right: 6px;
}

.ag-theme-balham .ag-rtl .ag-column-group-icons:not(:last-child), .ag-theme-balham .ag-rtl .ag-column-select-header-icon:not(:last-child), .ag-theme-balham .ag-rtl .ag-column-select-header-checkbox:not(:last-child), .ag-theme-balham .ag-rtl .ag-column-select-header-filter-wrapper:not(:last-child), .ag-theme-balham .ag-rtl .ag-column-select-checkbox:not(:last-child), .ag-theme-balham .ag-rtl .ag-column-select-column-drag-handle:not(:last-child), .ag-theme-balham .ag-rtl .ag-column-select-column-group-drag-handle:not(:last-child), .ag-theme-balham .ag-rtl .ag-column-select-column-label:not(:last-child) {
  margin-left: 6px;
}

.ag-theme-balham .ag-keyboard-focus .ag-column-select-virtual-list-item:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-column-select-virtual-list-item:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 1px;
  left: 1px;
  display: block;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-column-select-column-group:not(:last-child),
.ag-theme-balham .ag-column-select-column:not(:last-child) {
  margin-bottom: 4px;
}
.ag-theme-balham .ag-column-select-column-readonly,
.ag-theme-balham .ag-column-select-column-group-readonly {
  color: rgba(0, 0, 0, 0.38);
  color: var(--ag-disabled-foreground-color, rgba(0, 0, 0, 0.38));
  pointer-events: none;
}
.ag-theme-balham .ag-ltr .ag-column-select-add-group-indent {
  margin-left: 24px;
}

.ag-theme-balham .ag-rtl .ag-column-select-add-group-indent {
  margin-right: 24px;
}

.ag-theme-balham .ag-column-select-virtual-list-viewport {
  padding: 3px 0px;
}
.ag-theme-balham .ag-column-select-virtual-list-item {
  margin: 0 6px;
}
.ag-theme-balham .ag-rtl {
  text-align: right;
}
.ag-theme-balham .ag-root-wrapper {
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-1 {
  padding-left: 40px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-1 {
  padding-right: 40px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-1 {
  padding-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-1 {
  padding-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row-level-1 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-1 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-2 {
  padding-left: 68px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-2 {
  padding-right: 68px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-2 {
  padding-left: 56px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-2 {
  padding-right: 56px;
}

.ag-theme-balham .ag-ltr .ag-row-level-2 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-2 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-3 {
  padding-left: 96px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-3 {
  padding-right: 96px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-3 {
  padding-left: 84px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-3 {
  padding-right: 84px;
}

.ag-theme-balham .ag-ltr .ag-row-level-3 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-3 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-4 {
  padding-left: 124px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-4 {
  padding-right: 124px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-4 {
  padding-left: 112px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-4 {
  padding-right: 112px;
}

.ag-theme-balham .ag-ltr .ag-row-level-4 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-4 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-5 {
  padding-left: 152px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-5 {
  padding-right: 152px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-5 {
  padding-left: 140px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-5 {
  padding-right: 140px;
}

.ag-theme-balham .ag-ltr .ag-row-level-5 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-5 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-6 {
  padding-left: 180px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-6 {
  padding-right: 180px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-6 {
  padding-left: 168px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-6 {
  padding-right: 168px;
}

.ag-theme-balham .ag-ltr .ag-row-level-6 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-6 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-7 {
  padding-left: 208px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-7 {
  padding-right: 208px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-7 {
  padding-left: 196px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-7 {
  padding-right: 196px;
}

.ag-theme-balham .ag-ltr .ag-row-level-7 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-7 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-8 {
  padding-left: 236px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-8 {
  padding-right: 236px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-8 {
  padding-left: 224px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-8 {
  padding-right: 224px;
}

.ag-theme-balham .ag-ltr .ag-row-level-8 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-8 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-9 {
  padding-left: 264px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-9 {
  padding-right: 264px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-9 {
  padding-left: 252px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-9 {
  padding-right: 252px;
}

.ag-theme-balham .ag-ltr .ag-row-level-9 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-9 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-10 {
  padding-left: 292px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-10 {
  padding-right: 292px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-10 {
  padding-left: 280px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-10 {
  padding-right: 280px;
}

.ag-theme-balham .ag-ltr .ag-row-level-10 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-10 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-11 {
  padding-left: 320px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-11 {
  padding-right: 320px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-11 {
  padding-left: 308px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-11 {
  padding-right: 308px;
}

.ag-theme-balham .ag-ltr .ag-row-level-11 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-11 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-12 {
  padding-left: 348px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-12 {
  padding-right: 348px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-12 {
  padding-left: 336px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-12 {
  padding-right: 336px;
}

.ag-theme-balham .ag-ltr .ag-row-level-12 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-12 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-13 {
  padding-left: 376px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-13 {
  padding-right: 376px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-13 {
  padding-left: 364px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-13 {
  padding-right: 364px;
}

.ag-theme-balham .ag-ltr .ag-row-level-13 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-13 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-14 {
  padding-left: 404px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-14 {
  padding-right: 404px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-14 {
  padding-left: 392px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-14 {
  padding-right: 392px;
}

.ag-theme-balham .ag-ltr .ag-row-level-14 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-14 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-15 {
  padding-left: 432px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-15 {
  padding-right: 432px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-15 {
  padding-left: 420px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-15 {
  padding-right: 420px;
}

.ag-theme-balham .ag-ltr .ag-row-level-15 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-15 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-16 {
  padding-left: 460px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-16 {
  padding-right: 460px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-16 {
  padding-left: 448px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-16 {
  padding-right: 448px;
}

.ag-theme-balham .ag-ltr .ag-row-level-16 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-16 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-17 {
  padding-left: 488px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-17 {
  padding-right: 488px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-17 {
  padding-left: 476px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-17 {
  padding-right: 476px;
}

.ag-theme-balham .ag-ltr .ag-row-level-17 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-17 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-18 {
  padding-left: 516px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-18 {
  padding-right: 516px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-18 {
  padding-left: 504px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-18 {
  padding-right: 504px;
}

.ag-theme-balham .ag-ltr .ag-row-level-18 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-18 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-19 {
  padding-left: 544px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-19 {
  padding-right: 544px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-19 {
  padding-left: 532px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-19 {
  padding-right: 532px;
}

.ag-theme-balham .ag-ltr .ag-row-level-19 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-19 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-20 {
  padding-left: 572px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-20 {
  padding-right: 572px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-20 {
  padding-left: 560px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-20 {
  padding-right: 560px;
}

.ag-theme-balham .ag-ltr .ag-row-level-20 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-20 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-21 {
  padding-left: 600px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-21 {
  padding-right: 600px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-21 {
  padding-left: 588px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-21 {
  padding-right: 588px;
}

.ag-theme-balham .ag-ltr .ag-row-level-21 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-21 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-22 {
  padding-left: 628px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-22 {
  padding-right: 628px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-22 {
  padding-left: 616px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-22 {
  padding-right: 616px;
}

.ag-theme-balham .ag-ltr .ag-row-level-22 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-22 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-23 {
  padding-left: 656px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-23 {
  padding-right: 656px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-23 {
  padding-left: 644px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-23 {
  padding-right: 644px;
}

.ag-theme-balham .ag-ltr .ag-row-level-23 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-23 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-24 {
  padding-left: 684px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-24 {
  padding-right: 684px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-24 {
  padding-left: 672px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-24 {
  padding-right: 672px;
}

.ag-theme-balham .ag-ltr .ag-row-level-24 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-24 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-25 {
  padding-left: 712px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-25 {
  padding-right: 712px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-25 {
  padding-left: 700px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-25 {
  padding-right: 700px;
}

.ag-theme-balham .ag-ltr .ag-row-level-25 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-25 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-26 {
  padding-left: 740px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-26 {
  padding-right: 740px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-26 {
  padding-left: 728px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-26 {
  padding-right: 728px;
}

.ag-theme-balham .ag-ltr .ag-row-level-26 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-26 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-27 {
  padding-left: 768px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-27 {
  padding-right: 768px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-27 {
  padding-left: 756px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-27 {
  padding-right: 756px;
}

.ag-theme-balham .ag-ltr .ag-row-level-27 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-27 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-28 {
  padding-left: 796px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-28 {
  padding-right: 796px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-28 {
  padding-left: 784px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-28 {
  padding-right: 784px;
}

.ag-theme-balham .ag-ltr .ag-row-level-28 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-28 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-29 {
  padding-left: 824px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-29 {
  padding-right: 824px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-29 {
  padding-left: 812px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-29 {
  padding-right: 812px;
}

.ag-theme-balham .ag-ltr .ag-row-level-29 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-29 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-30 {
  padding-left: 852px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-30 {
  padding-right: 852px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-30 {
  padding-left: 840px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-30 {
  padding-right: 840px;
}

.ag-theme-balham .ag-ltr .ag-row-level-30 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-30 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-31 {
  padding-left: 880px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-31 {
  padding-right: 880px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-31 {
  padding-left: 868px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-31 {
  padding-right: 868px;
}

.ag-theme-balham .ag-ltr .ag-row-level-31 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-31 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-32 {
  padding-left: 908px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-32 {
  padding-right: 908px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-32 {
  padding-left: 896px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-32 {
  padding-right: 896px;
}

.ag-theme-balham .ag-ltr .ag-row-level-32 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-32 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-33 {
  padding-left: 936px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-33 {
  padding-right: 936px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-33 {
  padding-left: 924px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-33 {
  padding-right: 924px;
}

.ag-theme-balham .ag-ltr .ag-row-level-33 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-33 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-34 {
  padding-left: 964px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-34 {
  padding-right: 964px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-34 {
  padding-left: 952px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-34 {
  padding-right: 952px;
}

.ag-theme-balham .ag-ltr .ag-row-level-34 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-34 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-35 {
  padding-left: 992px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-35 {
  padding-right: 992px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-35 {
  padding-left: 980px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-35 {
  padding-right: 980px;
}

.ag-theme-balham .ag-ltr .ag-row-level-35 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-35 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-36 {
  padding-left: 1020px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-36 {
  padding-right: 1020px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-36 {
  padding-left: 1008px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-36 {
  padding-right: 1008px;
}

.ag-theme-balham .ag-ltr .ag-row-level-36 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-36 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-37 {
  padding-left: 1048px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-37 {
  padding-right: 1048px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-37 {
  padding-left: 1036px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-37 {
  padding-right: 1036px;
}

.ag-theme-balham .ag-ltr .ag-row-level-37 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-37 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-38 {
  padding-left: 1076px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-38 {
  padding-right: 1076px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-38 {
  padding-left: 1064px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-38 {
  padding-right: 1064px;
}

.ag-theme-balham .ag-ltr .ag-row-level-38 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-38 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-39 {
  padding-left: 1104px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-39 {
  padding-right: 1104px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-39 {
  padding-left: 1092px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-39 {
  padding-right: 1092px;
}

.ag-theme-balham .ag-ltr .ag-row-level-39 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-39 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-40 {
  padding-left: 1132px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-40 {
  padding-right: 1132px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-40 {
  padding-left: 1120px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-40 {
  padding-right: 1120px;
}

.ag-theme-balham .ag-ltr .ag-row-level-40 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-40 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-41 {
  padding-left: 1160px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-41 {
  padding-right: 1160px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-41 {
  padding-left: 1148px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-41 {
  padding-right: 1148px;
}

.ag-theme-balham .ag-ltr .ag-row-level-41 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-41 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-42 {
  padding-left: 1188px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-42 {
  padding-right: 1188px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-42 {
  padding-left: 1176px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-42 {
  padding-right: 1176px;
}

.ag-theme-balham .ag-ltr .ag-row-level-42 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-42 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-43 {
  padding-left: 1216px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-43 {
  padding-right: 1216px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-43 {
  padding-left: 1204px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-43 {
  padding-right: 1204px;
}

.ag-theme-balham .ag-ltr .ag-row-level-43 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-43 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-44 {
  padding-left: 1244px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-44 {
  padding-right: 1244px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-44 {
  padding-left: 1232px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-44 {
  padding-right: 1232px;
}

.ag-theme-balham .ag-ltr .ag-row-level-44 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-44 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-45 {
  padding-left: 1272px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-45 {
  padding-right: 1272px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-45 {
  padding-left: 1260px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-45 {
  padding-right: 1260px;
}

.ag-theme-balham .ag-ltr .ag-row-level-45 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-45 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-46 {
  padding-left: 1300px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-46 {
  padding-right: 1300px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-46 {
  padding-left: 1288px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-46 {
  padding-right: 1288px;
}

.ag-theme-balham .ag-ltr .ag-row-level-46 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-46 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-47 {
  padding-left: 1328px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-47 {
  padding-right: 1328px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-47 {
  padding-left: 1316px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-47 {
  padding-right: 1316px;
}

.ag-theme-balham .ag-ltr .ag-row-level-47 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-47 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-48 {
  padding-left: 1356px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-48 {
  padding-right: 1356px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-48 {
  padding-left: 1344px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-48 {
  padding-right: 1344px;
}

.ag-theme-balham .ag-ltr .ag-row-level-48 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-48 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-49 {
  padding-left: 1384px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-49 {
  padding-right: 1384px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-49 {
  padding-left: 1372px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-49 {
  padding-right: 1372px;
}

.ag-theme-balham .ag-ltr .ag-row-level-49 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-49 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-50 {
  padding-left: 1412px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-50 {
  padding-right: 1412px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-50 {
  padding-left: 1400px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-50 {
  padding-right: 1400px;
}

.ag-theme-balham .ag-ltr .ag-row-level-50 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-50 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-51 {
  padding-left: 1440px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-51 {
  padding-right: 1440px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-51 {
  padding-left: 1428px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-51 {
  padding-right: 1428px;
}

.ag-theme-balham .ag-ltr .ag-row-level-51 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-51 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-52 {
  padding-left: 1468px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-52 {
  padding-right: 1468px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-52 {
  padding-left: 1456px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-52 {
  padding-right: 1456px;
}

.ag-theme-balham .ag-ltr .ag-row-level-52 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-52 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-53 {
  padding-left: 1496px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-53 {
  padding-right: 1496px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-53 {
  padding-left: 1484px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-53 {
  padding-right: 1484px;
}

.ag-theme-balham .ag-ltr .ag-row-level-53 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-53 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-54 {
  padding-left: 1524px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-54 {
  padding-right: 1524px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-54 {
  padding-left: 1512px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-54 {
  padding-right: 1512px;
}

.ag-theme-balham .ag-ltr .ag-row-level-54 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-54 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-55 {
  padding-left: 1552px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-55 {
  padding-right: 1552px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-55 {
  padding-left: 1540px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-55 {
  padding-right: 1540px;
}

.ag-theme-balham .ag-ltr .ag-row-level-55 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-55 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-56 {
  padding-left: 1580px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-56 {
  padding-right: 1580px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-56 {
  padding-left: 1568px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-56 {
  padding-right: 1568px;
}

.ag-theme-balham .ag-ltr .ag-row-level-56 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-56 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-57 {
  padding-left: 1608px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-57 {
  padding-right: 1608px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-57 {
  padding-left: 1596px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-57 {
  padding-right: 1596px;
}

.ag-theme-balham .ag-ltr .ag-row-level-57 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-57 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-58 {
  padding-left: 1636px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-58 {
  padding-right: 1636px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-58 {
  padding-left: 1624px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-58 {
  padding-right: 1624px;
}

.ag-theme-balham .ag-ltr .ag-row-level-58 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-58 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-59 {
  padding-left: 1664px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-59 {
  padding-right: 1664px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-59 {
  padding-left: 1652px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-59 {
  padding-right: 1652px;
}

.ag-theme-balham .ag-ltr .ag-row-level-59 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-59 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-60 {
  padding-left: 1692px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-60 {
  padding-right: 1692px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-60 {
  padding-left: 1680px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-60 {
  padding-right: 1680px;
}

.ag-theme-balham .ag-ltr .ag-row-level-60 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-60 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-61 {
  padding-left: 1720px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-61 {
  padding-right: 1720px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-61 {
  padding-left: 1708px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-61 {
  padding-right: 1708px;
}

.ag-theme-balham .ag-ltr .ag-row-level-61 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-61 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-62 {
  padding-left: 1748px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-62 {
  padding-right: 1748px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-62 {
  padding-left: 1736px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-62 {
  padding-right: 1736px;
}

.ag-theme-balham .ag-ltr .ag-row-level-62 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-62 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-63 {
  padding-left: 1776px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-63 {
  padding-right: 1776px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-63 {
  padding-left: 1764px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-63 {
  padding-right: 1764px;
}

.ag-theme-balham .ag-ltr .ag-row-level-63 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-63 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-64 {
  padding-left: 1804px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-64 {
  padding-right: 1804px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-64 {
  padding-left: 1792px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-64 {
  padding-right: 1792px;
}

.ag-theme-balham .ag-ltr .ag-row-level-64 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-64 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-65 {
  padding-left: 1832px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-65 {
  padding-right: 1832px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-65 {
  padding-left: 1820px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-65 {
  padding-right: 1820px;
}

.ag-theme-balham .ag-ltr .ag-row-level-65 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-65 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-66 {
  padding-left: 1860px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-66 {
  padding-right: 1860px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-66 {
  padding-left: 1848px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-66 {
  padding-right: 1848px;
}

.ag-theme-balham .ag-ltr .ag-row-level-66 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-66 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-67 {
  padding-left: 1888px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-67 {
  padding-right: 1888px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-67 {
  padding-left: 1876px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-67 {
  padding-right: 1876px;
}

.ag-theme-balham .ag-ltr .ag-row-level-67 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-67 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-68 {
  padding-left: 1916px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-68 {
  padding-right: 1916px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-68 {
  padding-left: 1904px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-68 {
  padding-right: 1904px;
}

.ag-theme-balham .ag-ltr .ag-row-level-68 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-68 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-69 {
  padding-left: 1944px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-69 {
  padding-right: 1944px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-69 {
  padding-left: 1932px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-69 {
  padding-right: 1932px;
}

.ag-theme-balham .ag-ltr .ag-row-level-69 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-69 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-70 {
  padding-left: 1972px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-70 {
  padding-right: 1972px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-70 {
  padding-left: 1960px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-70 {
  padding-right: 1960px;
}

.ag-theme-balham .ag-ltr .ag-row-level-70 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-70 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-71 {
  padding-left: 2000px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-71 {
  padding-right: 2000px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-71 {
  padding-left: 1988px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-71 {
  padding-right: 1988px;
}

.ag-theme-balham .ag-ltr .ag-row-level-71 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-71 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-72 {
  padding-left: 2028px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-72 {
  padding-right: 2028px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-72 {
  padding-left: 2016px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-72 {
  padding-right: 2016px;
}

.ag-theme-balham .ag-ltr .ag-row-level-72 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-72 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-73 {
  padding-left: 2056px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-73 {
  padding-right: 2056px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-73 {
  padding-left: 2044px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-73 {
  padding-right: 2044px;
}

.ag-theme-balham .ag-ltr .ag-row-level-73 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-73 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-74 {
  padding-left: 2084px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-74 {
  padding-right: 2084px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-74 {
  padding-left: 2072px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-74 {
  padding-right: 2072px;
}

.ag-theme-balham .ag-ltr .ag-row-level-74 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-74 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-75 {
  padding-left: 2112px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-75 {
  padding-right: 2112px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-75 {
  padding-left: 2100px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-75 {
  padding-right: 2100px;
}

.ag-theme-balham .ag-ltr .ag-row-level-75 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-75 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-76 {
  padding-left: 2140px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-76 {
  padding-right: 2140px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-76 {
  padding-left: 2128px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-76 {
  padding-right: 2128px;
}

.ag-theme-balham .ag-ltr .ag-row-level-76 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-76 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-77 {
  padding-left: 2168px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-77 {
  padding-right: 2168px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-77 {
  padding-left: 2156px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-77 {
  padding-right: 2156px;
}

.ag-theme-balham .ag-ltr .ag-row-level-77 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-77 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-78 {
  padding-left: 2196px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-78 {
  padding-right: 2196px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-78 {
  padding-left: 2184px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-78 {
  padding-right: 2184px;
}

.ag-theme-balham .ag-ltr .ag-row-level-78 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-78 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-79 {
  padding-left: 2224px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-79 {
  padding-right: 2224px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-79 {
  padding-left: 2212px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-79 {
  padding-right: 2212px;
}

.ag-theme-balham .ag-ltr .ag-row-level-79 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-79 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-80 {
  padding-left: 2252px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-80 {
  padding-right: 2252px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-80 {
  padding-left: 2240px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-80 {
  padding-right: 2240px;
}

.ag-theme-balham .ag-ltr .ag-row-level-80 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-80 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-81 {
  padding-left: 2280px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-81 {
  padding-right: 2280px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-81 {
  padding-left: 2268px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-81 {
  padding-right: 2268px;
}

.ag-theme-balham .ag-ltr .ag-row-level-81 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-81 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-82 {
  padding-left: 2308px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-82 {
  padding-right: 2308px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-82 {
  padding-left: 2296px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-82 {
  padding-right: 2296px;
}

.ag-theme-balham .ag-ltr .ag-row-level-82 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-82 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-83 {
  padding-left: 2336px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-83 {
  padding-right: 2336px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-83 {
  padding-left: 2324px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-83 {
  padding-right: 2324px;
}

.ag-theme-balham .ag-ltr .ag-row-level-83 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-83 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-84 {
  padding-left: 2364px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-84 {
  padding-right: 2364px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-84 {
  padding-left: 2352px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-84 {
  padding-right: 2352px;
}

.ag-theme-balham .ag-ltr .ag-row-level-84 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-84 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-85 {
  padding-left: 2392px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-85 {
  padding-right: 2392px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-85 {
  padding-left: 2380px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-85 {
  padding-right: 2380px;
}

.ag-theme-balham .ag-ltr .ag-row-level-85 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-85 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-86 {
  padding-left: 2420px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-86 {
  padding-right: 2420px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-86 {
  padding-left: 2408px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-86 {
  padding-right: 2408px;
}

.ag-theme-balham .ag-ltr .ag-row-level-86 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-86 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-87 {
  padding-left: 2448px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-87 {
  padding-right: 2448px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-87 {
  padding-left: 2436px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-87 {
  padding-right: 2436px;
}

.ag-theme-balham .ag-ltr .ag-row-level-87 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-87 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-88 {
  padding-left: 2476px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-88 {
  padding-right: 2476px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-88 {
  padding-left: 2464px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-88 {
  padding-right: 2464px;
}

.ag-theme-balham .ag-ltr .ag-row-level-88 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-88 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-89 {
  padding-left: 2504px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-89 {
  padding-right: 2504px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-89 {
  padding-left: 2492px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-89 {
  padding-right: 2492px;
}

.ag-theme-balham .ag-ltr .ag-row-level-89 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-89 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-90 {
  padding-left: 2532px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-90 {
  padding-right: 2532px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-90 {
  padding-left: 2520px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-90 {
  padding-right: 2520px;
}

.ag-theme-balham .ag-ltr .ag-row-level-90 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-90 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-91 {
  padding-left: 2560px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-91 {
  padding-right: 2560px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-91 {
  padding-left: 2548px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-91 {
  padding-right: 2548px;
}

.ag-theme-balham .ag-ltr .ag-row-level-91 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-91 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-92 {
  padding-left: 2588px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-92 {
  padding-right: 2588px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-92 {
  padding-left: 2576px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-92 {
  padding-right: 2576px;
}

.ag-theme-balham .ag-ltr .ag-row-level-92 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-92 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-93 {
  padding-left: 2616px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-93 {
  padding-right: 2616px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-93 {
  padding-left: 2604px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-93 {
  padding-right: 2604px;
}

.ag-theme-balham .ag-ltr .ag-row-level-93 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-93 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-94 {
  padding-left: 2644px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-94 {
  padding-right: 2644px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-94 {
  padding-left: 2632px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-94 {
  padding-right: 2632px;
}

.ag-theme-balham .ag-ltr .ag-row-level-94 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-94 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-95 {
  padding-left: 2672px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-95 {
  padding-right: 2672px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-95 {
  padding-left: 2660px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-95 {
  padding-right: 2660px;
}

.ag-theme-balham .ag-ltr .ag-row-level-95 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-95 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-96 {
  padding-left: 2700px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-96 {
  padding-right: 2700px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-96 {
  padding-left: 2688px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-96 {
  padding-right: 2688px;
}

.ag-theme-balham .ag-ltr .ag-row-level-96 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-96 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-97 {
  padding-left: 2728px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-97 {
  padding-right: 2728px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-97 {
  padding-left: 2716px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-97 {
  padding-right: 2716px;
}

.ag-theme-balham .ag-ltr .ag-row-level-97 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-97 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-98 {
  padding-left: 2756px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-98 {
  padding-right: 2756px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-98 {
  padding-left: 2744px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-98 {
  padding-right: 2744px;
}

.ag-theme-balham .ag-ltr .ag-row-level-98 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-98 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row > .ag-cell-wrapper.ag-row-group-indent-99 {
  padding-left: 2784px;
}

.ag-theme-balham .ag-rtl .ag-row > .ag-cell-wrapper.ag-row-group-indent-99 {
  padding-right: 2784px;
}

.ag-theme-balham .ag-ltr .ag-row-group-indent-99 {
  padding-left: 2772px;
}

.ag-theme-balham .ag-rtl .ag-row-group-indent-99 {
  padding-right: 2772px;
}

.ag-theme-balham .ag-ltr .ag-row-level-99 .ag-pivot-leaf-group {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-level-99 .ag-pivot-leaf-group {
  margin-right: 28px;
}

.ag-theme-balham .ag-ltr .ag-row-group-leaf-indent {
  margin-left: 28px;
}

.ag-theme-balham .ag-rtl .ag-row-group-leaf-indent {
  margin-right: 28px;
}

.ag-theme-balham .ag-value-change-delta {
  padding-right: 2px;
}
.ag-theme-balham .ag-value-change-delta-up {
  color: #43a047;
  color: var(--ag-value-change-delta-up-color, #43a047);
}
.ag-theme-balham .ag-value-change-delta-down {
  color: #e53935;
  color: var(--ag-value-change-delta-down-color, #e53935);
}
/* .ag-theme-balham .ag-value-change-value {
  background-color: transparent;
  border-radius: 1px;
  padding-left: 1px;
  padding-right: 1px;
  transition: background-color 1s;
}
.ag-theme-balham .ag-value-change-value-highlight {
  background-color: rgba(22, 160, 133, 0.5);
  background-color: var(--ag-value-change-value-highlight-background-color, rgba(22, 160, 133, 0.5));
  transition: background-color 0.1s;
}
.ag-theme-balham .ag-cell-data-changed {
  background-color: rgba(22, 160, 133, 0.5) !important;
  background-color: var(--ag-value-change-value-highlight-background-color, rgba(22, 160, 133, 0.5)) !important;
}
.ag-theme-balham .ag-cell-data-changed-animation {
  background-color: transparent;
} */
.ag-theme-balham .ag-cell-highlight {
  background-color: #0091ea !important;
  background-color: var(--ag-range-selection-highlight-color, var(--ag-balham-active-color, #0091ea)) !important;
}
.ag-theme-balham .ag-row {
  height: 28px;
  background-color: white;
  background-color: var(--ag-background-color, white);
  /* color: #000;
  color: var(--ag-data-color, var(--ag-foreground-color, #000)); */
  border-width: 1px;
  border-color: #d9dcde;
  border-color: var(--ag-row-border-color, #d9dcde);
  border-bottom-style: solid;
}
.ag-theme-balham .ag-row-highlight-above::after, .ag-theme-balham .ag-row-highlight-below::after {
  content: "";
  position: absolute;
  width: calc(100% - 1px);
  height: 1px;
  background-color: #0091ea;
  background-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
  left: 1px;
}
.ag-theme-balham .ag-row-highlight-above::after {
  top: -1px;
}
.ag-theme-balham .ag-row-highlight-above.ag-row-first::after {
  top: 0;
}
.ag-theme-balham .ag-row-highlight-below::after {
  bottom: 0px;
}
.ag-theme-balham .ag-row-odd {
  background-color: #fcfdfe;
  background-color: var(--ag-odd-row-background-color, #fcfdfe);
}
.ag-theme-balham .ag-horizontal-left-spacer:not(.ag-scroller-corner) {
  border-right: solid 1px;
  border-right-color: #bdc3c7;
  border-right-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-horizontal-right-spacer:not(.ag-scroller-corner) {
  border-left: solid 1px;
  border-left-color: #bdc3c7;
  border-left-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-row-hover {
  background-color: #ecf0f1;
  background-color: var(--ag-row-hover-color, #ecf0f1);
}
.ag-theme-balham .ag-column-hover {
  background-color: #ecf0f1;
  background-color: var(--ag-column-hover-color, #ecf0f1);
}
.ag-theme-balham .ag-ltr .ag-right-aligned-cell {
  text-align: right;
}

.ag-theme-balham .ag-rtl .ag-right-aligned-cell {
  text-align: left;
}

.ag-theme-balham .ag-ltr .ag-right-aligned-cell .ag-cell-value, .ag-theme-balham .ag-ltr .ag-right-aligned-cell .ag-group-value {
  margin-left: auto;
}

.ag-theme-balham .ag-rtl .ag-right-aligned-cell .ag-cell-value, .ag-theme-balham .ag-rtl .ag-right-aligned-cell .ag-group-value {
  margin-right: auto;
}

.ag-theme-balham .ag-cell, .ag-theme-balham .ag-full-width-row .ag-cell-wrapper.ag-row-group {
  border: 1px solid transparent;
  line-height: 26px;
  padding-left: 11px;
  padding-right: 11px;
  -webkit-font-smoothing: subpixel-antialiased;
}
.ag-theme-balham .ag-row > .ag-cell-wrapper {
  padding-left: 11px;
  padding-right: 11px;
}
.ag-theme-balham .ag-row-dragging {
  cursor: move;
  opacity: 0.5;
}
.ag-theme-balham .ag-cell-inline-editing {
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  background: white;
  background: var(--ag-background-color, white);
  border-radius: 2px;
  box-shadow: none;
  padding: 4px;
  padding: 0;
  height: 28px;
  background-color: #f5f7f7;
  background-color: var(--ag-control-panel-background-color, #f5f7f7);
}
.ag-theme-balham .ag-popup-editor {
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  background: white;
  background: var(--ag-background-color, white);
  border-radius: 2px;
  box-shadow: none;
  padding: 4px;
  background-color: #f5f7f7;
  background-color: var(--ag-control-panel-background-color, #f5f7f7);
  padding: 0;
}
.ag-theme-balham .ag-large-text-input {
  height: auto;
  padding: 12px;
}
.ag-theme-balham .ag-details-row {
  padding: 20px;
  background-color: white;
  background-color: var(--ag-background-color, white);
}
.ag-theme-balham .ag-layout-auto-height .ag-center-cols-clipper, .ag-theme-balham .ag-layout-auto-height .ag-center-cols-container, .ag-theme-balham .ag-layout-print .ag-center-cols-clipper, .ag-theme-balham .ag-layout-print .ag-center-cols-container {
  min-height: 50px;
}
.ag-theme-balham .ag-overlay-loading-wrapper {
  background-color: rgba(255, 255, 255, 0.66);
  background-color: var(--ag-modal-overlay-background-color, rgba(255, 255, 255, 0.66));
}
.ag-theme-balham .ag-overlay-loading-center {
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  background: white;
  background: var(--ag-background-color, white);
  border-radius: 2px;
  box-shadow: none;
  padding: 4px;
}
.ag-theme-balham .ag-overlay-no-rows-wrapper.ag-layout-auto-height {
  padding-top: 30px;
}
.ag-theme-balham .ag-loading {
  padding-left: 12px;
  display: flex;
  height: 100%;
  align-items: center;
}
.ag-theme-balham .ag-loading-icon {
  padding-right: 12px;
}
.ag-theme-balham .ag-icon-loading {
  -webkit-animation-name: spin;
          animation-name: spin;
  -webkit-animation-duration: 1000ms;
          animation-duration: 1000ms;
  -webkit-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
}
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
@keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
.ag-theme-balham .ag-floating-top {
  border-bottom: solid 1px;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-floating-bottom {
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-ltr .ag-cell {
  border-right: solid transparent;
}

.ag-theme-balham .ag-rtl .ag-cell {
  border-left: solid transparent;
}

.ag-theme-balham .ag-ltr .ag-cell {
  border-right-width: 1px;
}

.ag-theme-balham .ag-rtl .ag-cell {
  border-left-width: 1px;
}

.ag-theme-balham .ag-cell.ag-cell-first-right-pinned:not(.ag-cell-range-left):not(.ag-cell-range-single-cell) {
  border-left: solid 1px;
  border-left-color: #bdc3c7;
  border-left-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-cell.ag-cell-last-left-pinned:not(.ag-cell-range-right):not(.ag-cell-range-single-cell) {
  border-right: solid 1px;
  border-right-color: #bdc3c7;
  border-right-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-row-selected {
  background-color: #e6eaef;
  /* background-color: #b7e4ff;
  background-color: var(--ag-selected-row-background-color, #b7e4ff); */
}
.ag-theme-balham .ag-cell-range-selected:not(.ag-cell-focus),
.ag-theme-balham .ag-body-viewport:not(.ag-has-focus) .ag-cell-range-single-cell:not(.ag-cell-inline-editing) {
  background-color: rgba(0, 145, 234, 0.2);
  background-color: var(--ag-range-selection-background-color, rgba(0, 145, 234, 0.2));
}
.ag-theme-balham .ag-cell-range-selected:not(.ag-cell-focus).ag-cell-range-chart,
.ag-theme-balham .ag-body-viewport:not(.ag-has-focus) .ag-cell-range-single-cell:not(.ag-cell-inline-editing).ag-cell-range-chart {
  background-color: rgba(0, 88, 255, 0.1) !important;
  background-color: var(--ag-range-selection-chart-background-color, rgba(0, 88, 255, 0.1)) !important;
}
.ag-theme-balham .ag-cell-range-selected:not(.ag-cell-focus).ag-cell-range-chart.ag-cell-range-chart-category,
.ag-theme-balham .ag-body-viewport:not(.ag-has-focus) .ag-cell-range-single-cell:not(.ag-cell-inline-editing).ag-cell-range-chart.ag-cell-range-chart-category {
  background-color: rgba(0, 255, 132, 0.1) !important;
  background-color: var(--ag-range-selection-chart-category-background-color, rgba(0, 255, 132, 0.1)) !important;
}
.ag-theme-balham .ag-cell-range-selected-1:not(.ag-cell-focus),
.ag-theme-balham .ag-root:not(.ag-context-menu-open) .ag-body-viewport:not(.ag-has-focus) .ag-cell-range-selected-1:not(.ag-cell-inline-editing) {
  background-color: rgba(0, 145, 234, 0.2);
  background-color: var(--ag-range-selection-background-color-1, var(--ag-range-selection-background-color, rgba(0, 145, 234, 0.2)));
}
.ag-theme-balham .ag-cell-range-selected-2:not(.ag-cell-focus),
.ag-theme-balham .ag-body-viewport:not(.ag-has-focus) .ag-cell-range-selected-2 {
  background-color: rgba(0, 145, 234, 0.36);
  background-color: var(--ag-range-selection-background-color-2, rgba(0, 145, 234, 0.36));
}
.ag-theme-balham .ag-cell-range-selected-3:not(.ag-cell-focus),
.ag-theme-balham .ag-body-viewport:not(.ag-has-focus) .ag-cell-range-selected-3 {
  background-color: rgba(0, 145, 234, 0.488);
  background-color: var(--ag-range-selection-background-color-3, rgba(0, 145, 234, 0.488));
}
.ag-theme-balham .ag-cell-range-selected-4:not(.ag-cell-focus),
.ag-theme-balham .ag-body-viewport:not(.ag-has-focus) .ag-cell-range-selected-4 {
  background-color: rgba(0, 145, 234, 0.5904);
  background-color: var(--ag-range-selection-background-color-4, rgba(0, 145, 234, 0.5904));
}
.ag-theme-balham .ag-cell.ag-cell-range-selected:not(.ag-cell-range-single-cell).ag-cell-range-top {
  border-top-color: #0091ea;
  border-top-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}
.ag-theme-balham .ag-cell.ag-cell-range-selected:not(.ag-cell-range-single-cell).ag-cell-range-right {
  border-right-color: #0091ea;
  border-right-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}
.ag-theme-balham .ag-cell.ag-cell-range-selected:not(.ag-cell-range-single-cell).ag-cell-range-bottom {
  border-bottom-color: #0091ea;
  border-bottom-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}
.ag-theme-balham .ag-cell.ag-cell-range-selected:not(.ag-cell-range-single-cell).ag-cell-range-left {
  border-left-color: #0091ea;
  border-left-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}
.ag-theme-balham .ag-ltr .ag-has-focus .ag-cell-focus:not(.ag-cell-range-selected),
.ag-theme-balham .ag-ltr .ag-context-menu-open .ag-cell-focus:not(.ag-cell-range-selected),
.ag-theme-balham .ag-ltr .ag-has-focus .ag-full-width-row.ag-row-focus .ag-cell-wrapper.ag-row-group,
.ag-theme-balham .ag-ltr .ag-cell-range-single-cell,
.ag-theme-balham .ag-ltr .ag-cell-range-single-cell.ag-cell-range-handle, .ag-theme-balham .ag-rtl .ag-has-focus .ag-cell-focus:not(.ag-cell-range-selected),
.ag-theme-balham .ag-rtl .ag-context-menu-open .ag-cell-focus:not(.ag-cell-range-selected),
.ag-theme-balham .ag-rtl .ag-has-focus .ag-full-width-row.ag-row-focus .ag-cell-wrapper.ag-row-group,
.ag-theme-balham .ag-rtl .ag-cell-range-single-cell,
.ag-theme-balham .ag-rtl .ag-cell-range-single-cell.ag-cell-range-handle {
  border: 1px solid;
  border-color: #0091ea;
  border-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
  outline: initial;
}
.ag-theme-balham .ag-cell.ag-selection-fill-top,
.ag-theme-balham .ag-cell.ag-selection-fill-top.ag-cell-range-selected {
  border-top: 1px dashed;
  border-top-color: #0091ea;
  border-top-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}
.ag-theme-balham .ag-ltr .ag-cell.ag-selection-fill-right, .ag-theme-balham .ag-ltr .ag-cell.ag-selection-fill-right.ag-cell-range-selected {
  border-right: 1px dashed;
  border-right-color: #0091ea;
  border-right-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}

.ag-theme-balham .ag-rtl .ag-cell.ag-selection-fill-right, .ag-theme-balham .ag-rtl .ag-cell.ag-selection-fill-right.ag-cell-range-selected {
  border-left: 1px dashed;
  border-left-color: #0091ea;
  border-left-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}

.ag-theme-balham .ag-cell.ag-selection-fill-bottom,
.ag-theme-balham .ag-cell.ag-selection-fill-bottom.ag-cell-range-selected {
  border-bottom: 1px dashed;
  border-bottom-color: #0091ea;
  border-bottom-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}
.ag-theme-balham .ag-ltr .ag-cell.ag-selection-fill-left, .ag-theme-balham .ag-ltr .ag-cell.ag-selection-fill-left.ag-cell-range-selected {
  border-left: 1px dashed;
  border-left-color: #0091ea;
  border-left-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}

.ag-theme-balham .ag-rtl .ag-cell.ag-selection-fill-left, .ag-theme-balham .ag-rtl .ag-cell.ag-selection-fill-left.ag-cell-range-selected {
  border-right: 1px dashed;
  border-right-color: #0091ea;
  border-right-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}

.ag-theme-balham .ag-range-handle, .ag-theme-balham .ag-fill-handle {
  position: absolute;
  width: 6px;
  height: 6px;
  bottom: -1px;
  background-color: #0091ea;
  background-color: var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea));
}
.ag-theme-balham .ag-ltr .ag-range-handle, .ag-theme-balham .ag-ltr .ag-fill-handle {
  right: -1px;
}

.ag-theme-balham .ag-rtl .ag-range-handle, .ag-theme-balham .ag-rtl .ag-fill-handle {
  left: -1px;
}

.ag-theme-balham .ag-fill-handle {
  cursor: cell;
}
.ag-theme-balham .ag-range-handle {
  cursor: nwse-resize;
}
.ag-theme-balham .ag-cell-inline-editing {
  border-color: #719ECE !important;
  border-color: var(--ag-input-focus-border-color, #719ECE) !important;
}
.ag-theme-balham .ag-menu {
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  background: white;
  background: var(--ag-background-color, white);
  border-radius: 2px;
  box-shadow: none;
  padding: 4px;
  padding: 0;
}
.ag-theme-balham .ag-menu-list {
  cursor: default;
  padding: 4px 0;
}
.ag-theme-balham .ag-menu-separator {
  height: 9px;
}
.ag-theme-balham .ag-menu-separator-part::after {
  content: "";
  display: block;
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-menu-option-active, .ag-theme-balham .ag-compact-menu-option-active {
  background-color: #ecf0f1;
  background-color: var(--ag-row-hover-color, #ecf0f1);
}
.ag-theme-balham .ag-menu-option-part, .ag-theme-balham .ag-compact-menu-option-part {
  line-height: 16px;
  padding: 6px 0;
}
.ag-theme-balham .ag-menu-option-disabled, .ag-theme-balham .ag-compact-menu-option-disabled {
  opacity: 0.5;
}
.ag-theme-balham .ag-menu-option-icon, .ag-theme-balham .ag-compact-menu-option-icon {
  width: 16px;
}
.ag-theme-balham .ag-ltr .ag-menu-option-icon, .ag-theme-balham .ag-ltr .ag-compact-menu-option-icon {
  padding-left: 8px;
}

.ag-theme-balham .ag-rtl .ag-menu-option-icon, .ag-theme-balham .ag-rtl .ag-compact-menu-option-icon {
  padding-right: 8px;
}

.ag-theme-balham .ag-menu-option-text, .ag-theme-balham .ag-compact-menu-option-text {
  padding-left: 8px;
  padding-right: 8px;
}
.ag-theme-balham .ag-ltr .ag-menu-option-shortcut, .ag-theme-balham .ag-ltr .ag-compact-menu-option-shortcut {
  padding-right: 4px;
}

.ag-theme-balham .ag-rtl .ag-menu-option-shortcut, .ag-theme-balham .ag-rtl .ag-compact-menu-option-shortcut {
  padding-left: 4px;
}

.ag-theme-balham .ag-menu-option-popup-pointer, .ag-theme-balham .ag-compact-menu-option-popup-pointer {
  padding-right: 4px;
}
.ag-theme-balham .ag-tabs {
  min-width: 220px;
}
.ag-theme-balham .ag-tabs-header {
  width: 100%;
  display: flex;
}
.ag-theme-balham .ag-tab {
  border-bottom: 0 solid transparent;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.ag-theme-balham .ag-keyboard-focus .ag-tab:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-tab:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 4px;
  left: 4px;
  display: block;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-tab-selected {
  border-bottom-color: #0091ea;
  border-bottom-color: var(--ag-selected-tab-underline-color, var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea)));
}
.ag-theme-balham .ag-menu-header {
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-filter-separator {
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-filter-condition-operator {
  height: 17px;
}
.ag-theme-balham .ag-ltr .ag-filter-condition-operator-or {
  margin-left: 8px;
}

.ag-theme-balham .ag-rtl .ag-filter-condition-operator-or {
  margin-right: 8px;
}

.ag-theme-balham .ag-set-filter-select-all {
  padding-top: 6px;
}
.ag-theme-balham .ag-set-filter-list, .ag-theme-balham .ag-filter-no-matches {
  height: 144px;
}
.ag-theme-balham .ag-set-filter-filter {
  margin-top: 6px;
  margin-left: 6px;
  margin-right: 6px;
}
.ag-theme-balham .ag-filter-to {
  margin-top: 4px;
}
.ag-theme-balham .ag-mini-filter {
  margin: 6px 6px;
}
.ag-theme-balham .ag-set-filter-item {
  margin: 0px 6px;
}
.ag-theme-balham .ag-ltr .ag-set-filter-item-value {
  margin-left: 6px;
}

.ag-theme-balham .ag-rtl .ag-set-filter-item-value {
  margin-right: 6px;
}

.ag-theme-balham .ag-filter-apply-panel {
  padding: 6px 6px;
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-secondary-border-color, var(--ag-border-color, #bdc3c7));
}
.ag-theme-balham .ag-filter-apply-panel-button {
  line-height: 1.5;
}
.ag-theme-balham .ag-ltr .ag-filter-apply-panel-button {
  margin-left: 8px;
}

.ag-theme-balham .ag-rtl .ag-filter-apply-panel-button {
  margin-right: 8px;
}

.ag-theme-balham .ag-simple-filter-body-wrapper {
  padding: 6px 6px;
  padding-bottom: 2px;
}
.ag-theme-balham .ag-simple-filter-body-wrapper > * {
  margin-bottom: 4px;
}
.ag-theme-balham .ag-filter-no-matches {
  padding: 6px 6px;
}
.ag-theme-balham .ag-multi-filter-menu-item {
  margin: 4px 0;
}
.ag-theme-balham .ag-multi-filter-group-title-bar {
  padding: 8px 4px;
  background-color: transparent;
}
.ag-theme-balham .ag-keyboard-focus .ag-multi-filter-group-title-bar:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-multi-filter-group-title-bar:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 4px;
  left: 4px;
  display: block;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-side-bar {
  position: relative;
}
.ag-theme-balham .ag-tool-panel-wrapper {
  width: 200px;
  background-color: #f5f7f7;
  background-color: var(--ag-control-panel-background-color, #f5f7f7);
}
.ag-theme-balham .ag-side-buttons {
  padding-top: 16px;
  width: 20px;
  position: relative;
  color: #000;
  color: var(--ag-foreground-color, #000);
  overflow: hidden;
}
.ag-theme-balham button.ag-side-button-button {
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  background: transparent;
  padding: 8px 0 8px 0;
  width: calc(100% + 1px);
  margin: 0;
  min-height: 72px;
  background-position-y: center;
  background-position-x: center;
  background-repeat: no-repeat;
  border: none;
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-border-color, #bdc3c7);
  border-bottom: solid 1px;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham button.ag-side-button-button:focus {
  box-shadow: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-side-button-button:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-side-button-button:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 4px;
  left: 4px;
  display: block;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-selected .ag-side-button-button {
  background-color: #f5f7f7;
  background-color: var(--ag-control-panel-background-color, #f5f7f7);
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-border-color, #bdc3c7);
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-side-button-icon-wrapper {
  margin-bottom: 3px;
}
.ag-theme-balham .ag-ltr .ag-side-bar-left,
.ag-theme-balham .ag-rtl .ag-side-bar-right {
  border-right: solid 1px;
  border-right-color: #bdc3c7;
  border-right-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-ltr .ag-side-bar-left .ag-tool-panel-wrapper,
.ag-theme-balham .ag-rtl .ag-side-bar-right .ag-tool-panel-wrapper {
  border-left: solid 1px;
  border-left-color: #bdc3c7;
  border-left-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-ltr .ag-side-bar-left .ag-side-button-button,
.ag-theme-balham .ag-rtl .ag-side-bar-right .ag-side-button-button {
  border-right: 0 solid transparent;
  margin-right: -1px;
  padding-right: 1px;
}
.ag-theme-balham .ag-ltr .ag-side-bar-left .ag-selected .ag-side-button-button,
.ag-theme-balham .ag-rtl .ag-side-bar-right .ag-selected .ag-side-button-button {
  border-right-color: #0091ea;
  border-right-color: var(--ag-selected-tab-underline-color, var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea)));
}
.ag-theme-balham .ag-rtl .ag-side-bar-left,
.ag-theme-balham .ag-ltr .ag-side-bar-right {
  border-left: solid 1px;
  border-left-color: #bdc3c7;
  border-left-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-rtl .ag-side-bar-left .ag-tool-panel-wrapper,
.ag-theme-balham .ag-ltr .ag-side-bar-right .ag-tool-panel-wrapper {
  border-right: solid 1px;
  border-right-color: #bdc3c7;
  border-right-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-rtl .ag-side-bar-left .ag-side-button-button,
.ag-theme-balham .ag-ltr .ag-side-bar-right .ag-side-button-button {
  border-left: 0 solid transparent;
  margin-left: -1px;
  padding-left: 1px;
}
.ag-theme-balham .ag-rtl .ag-side-bar-left .ag-selected .ag-side-button-button,
.ag-theme-balham .ag-ltr .ag-side-bar-right .ag-selected .ag-side-button-button {
  border-left-color: #0091ea;
  border-left-color: var(--ag-selected-tab-underline-color, var(--ag-range-selection-border-color, var(--ag-balham-active-color, #0091ea)));
}
.ag-theme-balham .ag-filter-toolpanel-header {
  height: 24px;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-header, .ag-theme-balham .ag-ltr .ag-filter-toolpanel-search {
  padding-left: 4px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-header, .ag-theme-balham .ag-rtl .ag-filter-toolpanel-search {
  padding-right: 4px;
}

.ag-theme-balham .ag-keyboard-focus .ag-filter-toolpanel-header:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-filter-toolpanel-header:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 4px;
  left: 4px;
  display: block;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-filter-toolpanel-group.ag-has-filter > .ag-group-title-bar .ag-group-title::after {
  font-family: "agGridBalham";
  font-size: 16px;
  line-height: 16px;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: "\\f114";
  position: absolute;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group.ag-has-filter > .ag-group-title-bar .ag-group-title::after {
  padding-left: 4px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group.ag-has-filter > .ag-group-title-bar .ag-group-title::after {
  padding-right: 4px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-0-header {
  height: 32px;
}
.ag-theme-balham .ag-filter-toolpanel-group-item {
  margin-top: 2px;
  margin-bottom: 2px;
}
.ag-theme-balham .ag-filter-toolpanel-search {
  height: 32px;
}
.ag-theme-balham .ag-filter-toolpanel-search-input {
  flex-grow: 1;
  height: 16px;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-search-input {
  margin-right: 4px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-search-input {
  margin-left: 4px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-0 {
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-secondary-border-color, var(--ag-border-color, #bdc3c7));
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-expand, .ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-title-bar-icon {
  margin-right: 4px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-expand, .ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-title-bar-icon {
  margin-left: 4px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-1 .ag-filter-toolpanel-group-level-1-header.ag-filter-toolpanel-group-title-bar {
  background-color: transparent;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-level-1 .ag-filter-toolpanel-group-level-2-header {
  padding-left: 20px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-level-1 .ag-filter-toolpanel-group-level-2-header {
  padding-right: 20px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-2 .ag-filter-toolpanel-group-level-2-header.ag-filter-toolpanel-group-title-bar {
  background-color: transparent;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-level-2 .ag-filter-toolpanel-group-level-3-header {
  padding-left: 36px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-level-2 .ag-filter-toolpanel-group-level-3-header {
  padding-right: 36px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-3 .ag-filter-toolpanel-group-level-3-header.ag-filter-toolpanel-group-title-bar {
  background-color: transparent;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-level-3 .ag-filter-toolpanel-group-level-4-header {
  padding-left: 52px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-level-3 .ag-filter-toolpanel-group-level-4-header {
  padding-right: 52px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-4 .ag-filter-toolpanel-group-level-4-header.ag-filter-toolpanel-group-title-bar {
  background-color: transparent;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-level-4 .ag-filter-toolpanel-group-level-5-header {
  padding-left: 68px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-level-4 .ag-filter-toolpanel-group-level-5-header {
  padding-right: 68px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-5 .ag-filter-toolpanel-group-level-5-header.ag-filter-toolpanel-group-title-bar {
  background-color: transparent;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-level-5 .ag-filter-toolpanel-group-level-6-header {
  padding-left: 84px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-level-5 .ag-filter-toolpanel-group-level-6-header {
  padding-right: 84px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-6 .ag-filter-toolpanel-group-level-6-header.ag-filter-toolpanel-group-title-bar {
  background-color: transparent;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-level-6 .ag-filter-toolpanel-group-level-7-header {
  padding-left: 100px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-level-6 .ag-filter-toolpanel-group-level-7-header {
  padding-right: 100px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-7 .ag-filter-toolpanel-group-level-7-header.ag-filter-toolpanel-group-title-bar {
  background-color: transparent;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-level-7 .ag-filter-toolpanel-group-level-8-header {
  padding-left: 116px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-level-7 .ag-filter-toolpanel-group-level-8-header {
  padding-right: 116px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-8 .ag-filter-toolpanel-group-level-8-header.ag-filter-toolpanel-group-title-bar {
  background-color: transparent;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-level-8 .ag-filter-toolpanel-group-level-9-header {
  padding-left: 132px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-level-8 .ag-filter-toolpanel-group-level-9-header {
  padding-right: 132px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-9 .ag-filter-toolpanel-group-level-9-header.ag-filter-toolpanel-group-title-bar {
  background-color: transparent;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-level-9 .ag-filter-toolpanel-group-level-10-header {
  padding-left: 148px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-level-9 .ag-filter-toolpanel-group-level-10-header {
  padding-right: 148px;
}

.ag-theme-balham .ag-filter-toolpanel-group-level-10 .ag-filter-toolpanel-group-level-10-header.ag-filter-toolpanel-group-title-bar {
  background-color: transparent;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-group-level-10 .ag-filter-toolpanel-group-level-11-header {
  padding-left: 164px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-group-level-10 .ag-filter-toolpanel-group-level-11-header {
  padding-right: 164px;
}

.ag-theme-balham .ag-filter-toolpanel-instance-header.ag-filter-toolpanel-group-level-1-header {
  padding-left: 4px;
}
.ag-theme-balham .ag-filter-toolpanel-instance-filter {
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-border-color, #bdc3c7);
  border-bottom: solid 1px;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-border-color, #bdc3c7);
  margin-top: 4px;
}
.ag-theme-balham .ag-ltr .ag-filter-toolpanel-instance-header-icon {
  margin-left: 4px;
}

.ag-theme-balham .ag-rtl .ag-filter-toolpanel-instance-header-icon {
  margin-right: 4px;
}

.ag-theme-balham .ag-pivot-mode-panel {
  min-height: 32px;
  height: 32px;
  display: flex;
}
.ag-theme-balham .ag-pivot-mode-select {
  display: flex;
  align-items: center;
}
.ag-theme-balham .ag-ltr .ag-pivot-mode-select {
  margin-left: 6px;
}

.ag-theme-balham .ag-rtl .ag-pivot-mode-select {
  margin-right: 6px;
}

.ag-theme-balham .ag-keyboard-focus .ag-column-select-header:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-column-select-header:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 4px;
  left: 4px;
  display: block;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-column-select-header {
  height: 32px;
  align-items: center;
  padding: 0 6px;
  border-bottom: solid 1px;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-secondary-border-color, var(--ag-border-color, #bdc3c7));
}
.ag-theme-balham .ag-column-panel-column-select {
  border-bottom: solid 1px;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-secondary-border-color, var(--ag-border-color, #bdc3c7));
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-secondary-border-color, var(--ag-border-color, #bdc3c7));
}
.ag-theme-balham .ag-column-group-icons,
.ag-theme-balham .ag-column-select-header-icon {
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-header {
  background-color: #f5f7f7;
  background-color: var(--ag-header-background-color, #f5f7f7);
  border-bottom: solid 1px;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-header-row {
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-header-foreground-color, var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54)));
  height: 32px;
}
.ag-theme-balham .ag-pinned-right-header {
  border-left: solid 1px;
  border-left-color: #bdc3c7;
  border-left-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-pinned-left-header {
  border-right: solid 1px;
  border-right-color: #bdc3c7;
  border-right-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-ltr .ag-header-cell:not(.ag-right-aligned-header) .ag-header-label-icon {
  margin-left: 4px;
}

.ag-theme-balham .ag-rtl .ag-header-cell:not(.ag-right-aligned-header) .ag-header-label-icon {
  margin-right: 4px;
}

.ag-theme-balham .ag-ltr .ag-header-cell.ag-right-aligned-header .ag-header-label-icon {
  margin-right: 4px;
}

.ag-theme-balham .ag-rtl .ag-header-cell.ag-right-aligned-header .ag-header-label-icon {
  margin-left: 4px;
}

.ag-theme-balham .ag-header-cell,
.ag-theme-balham .ag-header-group-cell {
  padding-left: 12px;
  padding-right: 12px;
}
.ag-theme-balham .ag-header-cell.ag-header-cell-moving,
.ag-theme-balham .ag-header-group-cell.ag-header-cell-moving {
  background-color: white;
  background-color: var(--ag-header-cell-moving-background-color, var(--ag-background-color, white));
}
.ag-theme-balham .ag-keyboard-focus .ag-header-cell:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-header-cell:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 4px;
  left: 4px;
  display: block;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-keyboard-focus .ag-header-group-cell:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-header-group-cell:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 4px;
  left: 4px;
  display: block;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-header-icon {
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-header-expand-icon {
  cursor: pointer;
}
.ag-theme-balham .ag-ltr .ag-header-expand-icon {
  padding-left: 4px;
}

.ag-theme-balham .ag-rtl .ag-header-expand-icon {
  padding-right: 4px;
}

.ag-theme-balham .ag-header-row:not(:first-child) .ag-header-cell,
.ag-theme-balham .ag-header-row:not(:first-child) .ag-header-group-cell.ag-header-group-cell-with-group {
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-header-cell::after,
.ag-theme-balham .ag-header-group-cell::after {
  content: "";
  position: absolute;
  z-index: 1;
  display: block;
  width: 1px;
  height: 50%;
  top: calc(50% - 25%);
  background-color: rgba(189, 195, 199, 0.5);
  background-color: var(--ag-header-column-separator-color, rgba(189, 195, 199, 0.5));
}
.ag-theme-balham .ag-ltr .ag-header-cell::after, .ag-theme-balham .ag-ltr .ag-header-group-cell::after {
  right: 0;
}

.ag-theme-balham .ag-rtl .ag-header-cell::after, .ag-theme-balham .ag-rtl .ag-header-group-cell::after {
  left: 0;
}

.ag-theme-balham .ag-ltr .ag-header-select-all {
  margin-right: 12px;
}

.ag-theme-balham .ag-rtl .ag-header-select-all {
  margin-left: 12px;
}

.ag-theme-balham .ag-ltr .ag-floating-filter-button {
  margin-left: 12px;
}

.ag-theme-balham .ag-rtl .ag-floating-filter-button {
  margin-right: 12px;
}

.ag-theme-balham .ag-floating-filter-button-button {
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  background: transparent;
  border: none;
  height: 16px;
  padding: 0;
  width: 16px;
}
.ag-theme-balham .ag-filter-loading {
  background-color: #f5f7f7;
  background-color: var(--ag-control-panel-background-color, #f5f7f7);
  height: 100%;
  padding: 6px 6px;
  position: absolute;
  width: 100%;
  z-index: 1;
}
.ag-theme-balham .ag-paging-panel {
  border-top: 1px solid;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-border-color, #bdc3c7);
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
  height: 32px;
}
.ag-theme-balham .ag-paging-panel > * {
  margin: 0 12px;
}
.ag-theme-balham .ag-paging-button {
  cursor: pointer;
}
.ag-theme-balham .ag-paging-button.ag-disabled {
  cursor: default;
  color: rgba(0, 0, 0, 0.38);
  color: var(--ag-disabled-foreground-color, rgba(0, 0, 0, 0.38));
}
.ag-theme-balham .ag-keyboard-focus .ag-paging-button:focus {
  outline: none;
}
.ag-theme-balham .ag-keyboard-focus .ag-paging-button:focus::after {
  content: "";
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  top: 0px;
  left: 0px;
  display: block;
  width: calc(100% - 0px);
  height: calc(100% - 0px);
  border: 1px solid;
  border-color: #719ECE;
  border-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham .ag-paging-button, .ag-theme-balham .ag-paging-description {
  margin: 0 4px;
}
.ag-theme-balham .ag-status-bar {
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-border-color, #bdc3c7);
  color: rgba(0, 0, 0, 0.38);
  color: var(--ag-disabled-foreground-color, rgba(0, 0, 0, 0.38));
  padding-right: 16px;
  padding-left: 16px;
  line-height: 1.5;
}
.ag-theme-balham .ag-status-name-value-value {
  color: #000;
  color: var(--ag-foreground-color, #000);
}
.ag-theme-balham .ag-status-bar-center {
  text-align: center;
}
.ag-theme-balham .ag-status-name-value {
  margin-left: 4px;
  margin-right: 4px;
  padding-top: 8px;
  padding-bottom: 8px;
}
.ag-theme-balham .ag-column-drop-cell {
  background: #dddede;
  background: var(--ag-chip-background-color, #dddede);
  border-radius: 16px;
  height: 16px;
  padding: 0 2px;
}
.ag-theme-balham .ag-column-drop-cell-text {
  margin: 0 4px;
}
.ag-theme-balham .ag-column-drop-cell-button {
  min-width: 16px;
  margin: 0 2px;
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-column-drop-cell-drag-handle {
  margin-left: 8px;
}
.ag-theme-balham .ag-column-drop-cell-ghost {
  opacity: 0.5;
}
.ag-theme-balham .ag-column-drop-horizontal {
  background-color: #f5f7f7;
  background-color: var(--ag-control-panel-background-color, #f5f7f7);
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
  height: 28px;
  border-bottom: solid 1px;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-ltr .ag-column-drop-horizontal {
  padding-left: 12px;
}

.ag-theme-balham .ag-rtl .ag-column-drop-horizontal {
  padding-right: 12px;
}

.ag-theme-balham .ag-ltr .ag-column-drop-horizontal-half-width:not(:last-child) {
  border-right: solid 1px;
  border-right-color: #bdc3c7;
  border-right-color: var(--ag-border-color, #bdc3c7);
}

.ag-theme-balham .ag-rtl .ag-column-drop-horizontal-half-width:not(:last-child) {
  border-left: solid 1px;
  border-left-color: #bdc3c7;
  border-left-color: var(--ag-border-color, #bdc3c7);
}

.ag-theme-balham .ag-column-drop-horizontal-cell-separator {
  margin: 0 4px;
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-column-drop-horizontal-empty-message {
  color: rgba(0, 0, 0, 0.38);
  color: var(--ag-disabled-foreground-color, rgba(0, 0, 0, 0.38));
}
.ag-theme-balham .ag-ltr .ag-column-drop-horizontal-icon {
  margin-right: 12px;
}

.ag-theme-balham .ag-rtl .ag-column-drop-horizontal-icon {
  margin-left: 12px;
}

.ag-theme-balham .ag-column-drop-vertical-list {
  padding-bottom: 4px;
  padding-right: 4px;
  padding-left: 4px;
}
.ag-theme-balham .ag-column-drop-vertical-cell {
  margin-top: 4px;
}
.ag-theme-balham .ag-column-drop-vertical {
  min-height: 50px;
  border-bottom: solid 1px;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-secondary-border-color, var(--ag-border-color, #bdc3c7));
}
.ag-theme-balham .ag-column-drop-vertical.ag-last-column-drop {
  border-bottom: none;
}
.ag-theme-balham .ag-column-drop-vertical-icon {
  margin-left: 4px;
  margin-right: 4px;
}
.ag-theme-balham .ag-column-drop-vertical-empty-message {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.38);
  color: var(--ag-disabled-foreground-color, rgba(0, 0, 0, 0.38));
  margin-top: 4px;
}
.ag-theme-balham .ag-select-agg-func-popup {
  border: solid 1px;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  background: white;
  background: var(--ag-background-color, white);
  border-radius: 2px;
  box-shadow: none;
  padding: 4px;
  background: white;
  background: var(--ag-background-color, white);
  height: 70px;
  padding: 0;
}
.ag-theme-balham .ag-select-agg-func-virtual-list-item {
  cursor: default;
  line-height: 20px;
  padding-left: 8px;
}
.ag-theme-balham .ag-select-agg-func-virtual-list-item:hover {
  background-color: #b7e4ff;
  background-color: var(--ag-selected-row-background-color, #b7e4ff);
}
.ag-theme-balham .ag-chart-menu {
  border-radius: 2px;
  background: white;
  background: var(--ag-background-color, white);
}
.ag-theme-balham .ag-chart-menu-icon {
  opacity: 0.5;
  line-height: 24px;
  font-size: 24px;
  width: 24px;
  height: 24px;
  margin: 2px 0;
  cursor: pointer;
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-chart-menu-icon:hover {
  opacity: 1;
}
.ag-theme-balham .ag-chart-mini-thumbnail {
  border: 1px solid;
  border-color: #bdc3c7;
  border-color: var(--ag-secondary-border-color, var(--ag-border-color, #bdc3c7));
  border-radius: 5px;
  margin: 5px;
}
.ag-theme-balham .ag-chart-mini-thumbnail:nth-last-child(3), .ag-theme-balham .ag-chart-mini-thumbnail:nth-last-child(3) ~ .ag-chart-mini-thumbnail {
  margin-left: auto;
  margin-right: auto;
}
.ag-theme-balham .ag-ltr .ag-chart-mini-thumbnail:first-child {
  margin-left: 0;
}

.ag-theme-balham .ag-rtl .ag-chart-mini-thumbnail:first-child {
  margin-right: 0;
}

.ag-theme-balham .ag-ltr .ag-chart-mini-thumbnail:last-child {
  margin-right: 0;
}

.ag-theme-balham .ag-rtl .ag-chart-mini-thumbnail:last-child {
  margin-left: 0;
}

.ag-theme-balham .ag-chart-mini-thumbnail.ag-selected {
  border-color: #0091ea;
  border-color: var(--ag-minichart-selected-chart-color, var(--ag-checkbox-checked-color, var(--ag-balham-active-color, #0091ea)));
}
.ag-theme-balham .ag-chart-settings-card-item {
  background: #000;
  background: var(--ag-foreground-color, #000);
  width: 8px;
  height: 8px;
  border-radius: 4px;
}
.ag-theme-balham .ag-chart-settings-card-item.ag-selected {
  background-color: #0091ea;
  background-color: var(--ag-minichart-selected-page-color, var(--ag-checkbox-checked-color, var(--ag-balham-active-color, #0091ea)));
}
.ag-theme-balham .ag-chart-data-column-drag-handle {
  margin-left: 4px;
}
.ag-theme-balham .ag-charts-settings-group-title-bar,
.ag-theme-balham .ag-charts-data-group-title-bar,
.ag-theme-balham .ag-charts-format-top-level-group-title-bar {
  border-top: solid 1px;
  border-top-color: #bdc3c7;
  border-top-color: var(--ag-secondary-border-color, var(--ag-border-color, #bdc3c7));
}
.ag-theme-balham .ag-charts-settings-group-container {
  padding: 4px;
}
.ag-theme-balham .ag-charts-data-group-container {
  padding: 6px 6px;
  padding-bottom: 2px;
}
.ag-theme-balham .ag-charts-data-group-container > * {
  margin-bottom: 4px;
}
.ag-theme-balham .ag-charts-format-top-level-group-container {
  margin-left: 8px;
  padding: 4px;
}
.ag-theme-balham .ag-charts-format-top-level-group-item {
  margin: 4px 0;
}
.ag-theme-balham .ag-charts-format-sub-level-group-container {
  padding: 6px 6px;
  padding-bottom: 2px;
}
.ag-theme-balham .ag-charts-format-sub-level-group-container > * {
  margin-bottom: 4px;
}
.ag-theme-balham .ag-charts-group-container.ag-group-container-horizontal {
  padding: 4px;
}
.ag-theme-balham .ag-chart-data-section,
.ag-theme-balham .ag-chart-format-section {
  display: flex;
  margin: 0;
}
.ag-theme-balham .ag-chart-menu-panel {
  background-color: #f5f7f7;
  background-color: var(--ag-control-panel-background-color, #f5f7f7);
}
.ag-theme-balham .ag-ltr .ag-chart-menu-panel {
  border-left: solid 1px;
  border-left-color: #bdc3c7;
  border-left-color: var(--ag-border-color, #bdc3c7);
}

.ag-theme-balham .ag-rtl .ag-chart-menu-panel {
  border-right: solid 1px;
  border-right-color: #bdc3c7;
  border-right-color: var(--ag-border-color, #bdc3c7);
}

.ag-theme-balham .ag-date-time-list-page-title {
  flex-grow: 1;
  text-align: center;
}
.ag-theme-balham .ag-date-time-list-page-column-label {
  text-align: center;
}
.ag-theme-balham .ag-date-time-list-page-entry {
  text-align: center;
}
.ag-theme-balham .ag-checkbox-input-wrapper {
  font-family: "agGridBalham";
  font-size: 14px;
  line-height: 14px;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 14px;
  height: 14px;
  background-color: white;
  background-color: var(--ag-checkbox-background-color, var(--ag-background-color, white));
  border-radius: 3px;
  display: inline-block;
  vertical-align: middle;
  flex: none;
}
.ag-theme-balham .ag-checkbox-input-wrapper input, .ag-theme-balham .ag-checkbox-input-wrapper input {
  -webkit-appearance: none;
  opacity: 0;
  width: 100%;
  height: 100%;
}
.ag-theme-balham .ag-checkbox-input-wrapper:focus-within, .ag-theme-balham .ag-checkbox-input-wrapper:active {
  outline: none;
  /* box-shadow: 0 0 2px 1px #719ECE; */
}
.ag-theme-balham .ag-checkbox-input-wrapper.ag-disabled {
  opacity: 0.5;
}
.ag-theme-balham .ag-checkbox-input-wrapper::after {
  content: "\\f108";
  /* color: #7f8c8d;
  color: var(--ag-checkbox-unchecked-color, #7f8c8d); */
  color: rgb(172, 179, 181);
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.ag-theme-balham .ag-checkbox-input-wrapper.ag-checked::after {
  content: "\\f106";
  color: #0091ea;
  color: var(--ag-checkbox-checked-color, var(--ag-balham-active-color, #0091ea));
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.ag-theme-balham .ag-checkbox-input-wrapper.ag-indeterminate::after {
  content: "\\f107";
  color: #7f8c8d;
  color: var(--ag-checkbox-indeterminate-color, var(--ag-checkbox-unchecked-color, #7f8c8d));
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.ag-theme-balham .ag-toggle-button-input-wrapper {
  box-sizing: border-box;
  width: 32px;
  height: 16px;
  background-color: #7f8c8d;
  background-color: var(--ag-toggle-button-off-background-color, var(--ag-checkbox-unchecked-color, #7f8c8d));
  border-radius: 8px;
  position: relative;
  flex: none;
  border: 1px solid;
  border-color: #7f8c8d;
  border-color: var(--ag-toggle-button-off-border-color, var(--ag-checkbox-unchecked-color, #7f8c8d));
}
.ag-theme-balham .ag-toggle-button-input-wrapper input {
  opacity: 0;
  height: 100%;
  width: 100%;
}
.ag-theme-balham .ag-toggle-button-input-wrapper:focus-within {
  outline: none;
  box-shadow: 0 0 2px 1px #719ECE;
}
.ag-theme-balham .ag-toggle-button-input-wrapper.ag-disabled {
  opacity: 0.5;
}
.ag-theme-balham .ag-toggle-button-input-wrapper.ag-checked {
  background-color: #0091ea;
  background-color: var(--ag-toggle-button-on-background-color, var(--ag-checkbox-checked-color, var(--ag-balham-active-color, #0091ea)));
  border-color: #0091ea;
  border-color: var(--ag-toggle-button-on-border-color, var(--ag-checkbox-checked-color, var(--ag-balham-active-color, #0091ea)));
}
.ag-theme-balham .ag-toggle-button-input-wrapper::before {
  content: " ";
  position: absolute;
  top: -1px;
  left: -1px;
  display: block;
  box-sizing: border-box;
  height: 16px;
  width: 16px;
  background-color: white;
  background-color: var(--ag-toggle-button-switch-background-color, var(--ag-background-color, white));
  border-radius: 8px;
  transition: left 100ms;
  border: 1px solid;
  border-color: #7f8c8d;
  border-color: var(--ag-toggle-button-switch-border-color, var(--ag-toggle-button-off-border-color, var(--ag-checkbox-unchecked-color, #7f8c8d)));
}
.ag-theme-balham .ag-toggle-button-input-wrapper.ag-checked::before {
  left: calc(100% - 16px );
  border-color: #0091ea;
  border-color: var(--ag-toggle-button-on-border-color, var(--ag-checkbox-checked-color, var(--ag-balham-active-color, #0091ea)));
}
.ag-theme-balham .ag-radio-button-input-wrapper {
  font-family: "agGridBalham";
  font-size: 16px;
  line-height: 16px;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 16px;
  height: 16px;
  background-color: white;
  background-color: var(--ag-checkbox-background-color, var(--ag-background-color, white));
  border-radius: 3px;
  display: inline-block;
  vertical-align: middle;
  flex: none;
  border-radius: 16px;
}
.ag-theme-balham .ag-radio-button-input-wrapper input, .ag-theme-balham .ag-radio-button-input-wrapper input {
  -webkit-appearance: none;
  opacity: 0;
  width: 100%;
  height: 100%;
}
.ag-theme-balham .ag-radio-button-input-wrapper:focus-within, .ag-theme-balham .ag-radio-button-input-wrapper:active {
  outline: none;
  box-shadow: 0 0 2px 1px #719ECE;
}
.ag-theme-balham .ag-radio-button-input-wrapper.ag-disabled {
  opacity: 0.5;
}
.ag-theme-balham .ag-radio-button-input-wrapper::after {
  content: "\\f126";
  color: #7f8c8d;
  color: var(--ag-checkbox-unchecked-color, #7f8c8d);
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.ag-theme-balham .ag-radio-button-input-wrapper.ag-checked::after {
  content: "\\f127";
  color: #0091ea;
  color: var(--ag-checkbox-checked-color, var(--ag-balham-active-color, #0091ea));
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.ag-theme-balham input[class^=ag-][type=range] {
  -webkit-appearance: none;
  width: 100%;
  height: 100%;
  background: none;
  overflow: visible;
}
.ag-theme-balham input[class^=ag-][type=range]::-webkit-slider-runnable-track {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 3px;
  background-color: #bdc3c7;
  background-color: var(--ag-border-color, #bdc3c7);
  border-radius: 2px;
  border-radius: 3px;
}
.ag-theme-balham input[class^=ag-][type=range]::-moz-range-track {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 3px;
  background-color: #bdc3c7;
  background-color: var(--ag-border-color, #bdc3c7);
  border-radius: 2px;
  border-radius: 3px;
}
.ag-theme-balham input[class^=ag-][type=range]::-ms-track {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 3px;
  background-color: #bdc3c7;
  background-color: var(--ag-border-color, #bdc3c7);
  border-radius: 2px;
  border-radius: 3px;
  color: transparent;
  width: calc(100% - 2px);
}
.ag-theme-balham input[class^=ag-][type=range]::-webkit-slider-thumb {
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background-color: white;
  background-color: var(--ag-background-color, white);
  border: 1px solid;
  border-color: #7f8c8d;
  border-color: var(--ag-checkbox-unchecked-color, #7f8c8d);
  border-radius: 16px;
  -webkit-transform: translateY(-6.5px);
          transform: translateY(-6.5px);
}
.ag-theme-balham input[class^=ag-][type=range]::-ms-thumb {
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background-color: white;
  background-color: var(--ag-background-color, white);
  border: 1px solid;
  border-color: #7f8c8d;
  border-color: var(--ag-checkbox-unchecked-color, #7f8c8d);
  border-radius: 16px;
}
.ag-theme-balham input[class^=ag-][type=range]::-moz-ag-range-thumb {
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background-color: white;
  background-color: var(--ag-background-color, white);
  border: 1px solid;
  border-color: #7f8c8d;
  border-color: var(--ag-checkbox-unchecked-color, #7f8c8d);
  border-radius: 16px;
}
.ag-theme-balham input[class^=ag-][type=range]:focus {
  outline: none;
}
.ag-theme-balham input[class^=ag-][type=range]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 2px 1px #719ECE;
  border-color: #0091ea;
  border-color: var(--ag-checkbox-checked-color, var(--ag-balham-active-color, #0091ea));
}
.ag-theme-balham input[class^=ag-][type=range]:focus::-ms-thumb {
  box-shadow: 0 0 2px 1px #719ECE;
  border-color: #0091ea;
  border-color: var(--ag-checkbox-checked-color, var(--ag-balham-active-color, #0091ea));
}
.ag-theme-balham input[class^=ag-][type=range]:focus::-moz-ag-range-thumb {
  box-shadow: 0 0 2px 1px #719ECE;
  border-color: #0091ea;
  border-color: var(--ag-checkbox-checked-color, var(--ag-balham-active-color, #0091ea));
}
.ag-theme-balham input[class^=ag-][type=range]:active::-webkit-slider-runnable-track {
  background-color: #719ECE;
  background-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham input[class^=ag-][type=range]:active::-moz-ag-range-track {
  background-color: #719ECE;
  background-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham input[class^=ag-][type=range]:active::-ms-track {
  background-color: #719ECE;
  background-color: var(--ag-input-focus-border-color, #719ECE);
}
.ag-theme-balham input[class^=ag-][type=range]:disabled {
  opacity: 0.5;
}
.ag-theme-balham .ag-filter-toolpanel-header,
.ag-theme-balham .ag-filter-toolpanel-search,
.ag-theme-balham .ag-status-bar,
.ag-theme-balham .ag-header-row,
.ag-theme-balham .ag-multi-filter-group-title-bar {
  /* font-weight: 600; */
  font-weight: normal;
  color: #575757;
  /* color: rgba(0, 0, 0, 0.54);
  color: var(--ag-header-foreground-color, var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54))); */
}
.ag-theme-balham .ag-ltr input[class^=ag-]:not([type]),
.ag-theme-balham .ag-ltr input[class^=ag-][type=text],
.ag-theme-balham .ag-ltr input[class^=ag-][type=number],
.ag-theme-balham .ag-ltr input[class^=ag-][type=tel],
.ag-theme-balham .ag-ltr input[class^=ag-][type=date],
.ag-theme-balham .ag-ltr input[class^=ag-][type=datetime-local],
.ag-theme-balham .ag-ltr textarea[class^=ag-] {
  padding-left: 4px;
}

.ag-theme-balham .ag-rtl input[class^=ag-]:not([type]),
.ag-theme-balham .ag-rtl input[class^=ag-][type=text],
.ag-theme-balham .ag-rtl input[class^=ag-][type=number],
.ag-theme-balham .ag-rtl input[class^=ag-][type=tel],
.ag-theme-balham .ag-rtl input[class^=ag-][type=date],
.ag-theme-balham .ag-rtl input[class^=ag-][type=datetime-local],
.ag-theme-balham .ag-rtl textarea[class^=ag-] {
  padding-right: 4px;
}

.ag-theme-balham .ag-column-drop-vertical-empty-message, .ag-theme-balham .ag-status-bar {
  /* font-weight: 600; */
  font-weight: normal;
  color: rgba(0, 0, 0, 0.38);
  color: var(--ag-disabled-foreground-color, rgba(0, 0, 0, 0.38));
}
.ag-theme-balham .ag-dnd-ghost {
  /* font-weight: 600; */
  font-weight: normal;
}
.ag-theme-balham .ag-tab {
  border: 1px solid transparent;
  padding: 4px 8px;
  margin: 4px;
  margin-bottom: -1px;
}
.ag-theme-balham .ag-tab-selected {
  background-color: white;
  background-color: var(--ag-background-color, white);
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  border-bottom-color: transparent;
}
.ag-theme-balham .ag-tabs-header {
  border-bottom: 1px solid;
  border-bottom-color: #bdc3c7;
  border-bottom-color: var(--ag-border-color, #bdc3c7);
}
.ag-theme-balham .ag-column-drop-cell {
  height: 24px;
}
.ag-theme-balham .ag-column-drop-vertical-title {
  color: #000;
  color: var(--ag-foreground-color, #000);
}
.ag-theme-balham .ag-column-drop-vertical-cell {
  margin-left: 8px;
  margin-right: 8px;
}
.ag-theme-balham .ag-column-drop-vertical-cell-text {
  margin-left: 8px;
}
.ag-theme-balham .ag-column-drop-vertical-icon {
  color: rgba(0, 0, 0, 0.54);
  color: var(--ag-secondary-foreground-color, rgba(0, 0, 0, 0.54));
}
.ag-theme-balham .ag-ltr .ag-column-drop-vertical-empty-message {
  padding-left: 24px;
  padding-right: 4px;
}

.ag-theme-balham .ag-rtl .ag-column-drop-vertical-empty-message {
  padding-right: 24px;
  padding-left: 4px;
}

.ag-theme-balham .ag-column-drop-horizontal {
  height: 32px;
}
.ag-theme-balham .ag-column-drop-empty {
  color: rgba(0, 0, 0, 0.38);
  color: var(--ag-disabled-foreground-color, rgba(0, 0, 0, 0.38));
}
.ag-theme-balham .ag-column-drop-horizontal-cell-text {
  margin-left: 8px;
}
.ag-theme-balham .ag-column-drop-vertical {
  padding-top: 8px;
}
.ag-theme-balham .ag-menu-header {
  background-color: #f5f7f7;
  background-color: var(--ag-header-background-color, #f5f7f7);
}
.ag-theme-balham .ag-overlay-loading-center {
  background-color: white;
  background-color: var(--ag-background-color, white);
  border: 1px solid;
  border-color: #bdc3c7;
  border-color: var(--ag-border-color, #bdc3c7);
  color: #000;
  color: var(--ag-foreground-color, #000);
  padding: 16px;
}
.ag-theme-balham .ag-tooltip {
  border: none;
  background-color: #cbd0d3;
}
.ag-theme-balham .ag-panel-title-bar-button-icon {
  font-size: 20px;
}
.ag-theme-balham .ag-chart-data-section,
.ag-theme-balham .ag-chart-format-section {
  padding-bottom: 2px;
}
.ag-theme-balham .ag-group-toolbar {
  background-color: rgba(226, 233, 235, 0.5);
  background-color: var(--ag-subheader-toolbar-background-color, rgba(226, 233, 235, 0.5));
}
.ag-theme-balham .ag-chart-tab {
  padding-top: 2px;
}
.ag-theme-balham .ag-charts-format-sub-level-group-item {
  margin-bottom: 6px;
}
`,""])},9277:(M,E,w)=>{"use strict";w.d(E,{qq:()=>C,kJ:()=>Y});function C(_,j,K){return j.find(K)[_]}function V(_){return _.length===0}function Y(_){return Object.prototype.toString.call(_)==="[object Array]"}},8192:(M,E,w)=>{"use strict";w.d(E,{Ds:()=>C,mf:()=>Y});function C(_,j=200){let K;return function(...l){const be=this,te=l;clearTimeout(K),K=setTimeout(()=>_.apply(be,te),j)}}function V(){return window.navigator.userAgent.indexOf("MSIE")>=1}function Y(_){return typeof _=="function"}},7731:(M,E,w)=>{M.exports=w.p+"css/fonts/30945f38ebfe5435f0a974a05796ec0d.svg"},7912:(M,E,w)=>{var C=w(1528);typeof C=="string"&&(C=[[M.id,C,""]]);var V,Y,_={hmr:!0};_.transform=V,_.insertInto=void 0;var j=w(6723)(C,_);C.locals&&(M.exports=C.locals)},8480:(M,E,w)=>{var C=w(1509);typeof C=="string"&&(C=[[M.id,C,""]]);var V,Y,_={hmr:!0};_.transform=V,_.insertInto=void 0;var j=w(6723)(C,_);C.locals&&(M.exports=C.locals)},4086:(M,E,w)=>{"use strict";w.r(E),w.d(E,{default:()=>Ga});var C=function(){var o=this,n=o.$createElement,e=o._self._c||n;return e("div",{ref:"tableContainer",staticClass:"ag-grid-table-wrap",style:o.tableStyle},[o.columns.length>0?e("ag-grid-vue",o._g(o._b({ref:"table",staticClass:"ag-grid-table ag-theme-balham",attrs:{gridOptions:o.realAgOptions,modules:o.modules}},"ag-grid-vue",o.$attrs,!1),o.$listeners)):o._e()],1)},V=[],Y=w(7912),_=w(8480),j=w(809),K=w(6324),l=w(340),be=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),te=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},ke=function(o){be(n,o);function n(){var t=o!==null&&o.apply(this,arguments)||this;return t.watermarkMessage=void 0,t}e=n,n.prototype.validateLicense=function(){if(l._.missingOrEmpty(e.licenseKey))this.outputMissingLicenseKey();else if(e.licenseKey.length>32){var t=e.extractLicenseComponents(e.licenseKey),a=t.md5,r=t.license,i=t.version,g=t.isTrial;a===this.md5.md5(r)?this.validateLicenseKeyForVersion(i,!!g,r):this.outputInvalidLicenseKey()}else this.outputInvalidLicenseKey()},n.extractExpiry=function(t){var a=t.substring(t.lastIndexOf("_")+1,t.length);return new Date(parseInt(e.decode(a),10))},n.extractLicenseComponents=function(t){var a=t.replace(/[\u200B-\u200D\uFEFF]/g,"");a=a.replace(/\r?\n|\r/g,"");var r=a.length-32,i=a.substring(r),g=a.substring(0,r),p=e.extractBracketedInformation(a),s=p[0],d=p[1];return{md5:i,license:g,version:s,isTrial:d}},n.prototype.getLicenseDetails=function(t){var a=e.extractLicenseComponents(t),r=a.md5,i=a.license,g=a.version,p=a.isTrial,s=r===this.md5.md5(i),d=null;return s&&(d=e.extractExpiry(i),s=!isNaN(d.getTime())),{licenseKey:t,valid:s,expiry:s?e.formatDate(d):null,version:g||"legacy",isTrial:p}},n.prototype.isDisplayWatermark=function(){return!l._.missingOrEmpty(this.watermarkMessage)},n.prototype.getWatermarkMessage=function(){return this.watermarkMessage||""},n.formatDate=function(t){var a=["January","February","March","April","May","June","July","August","September","October","November","December"],r=t.getDate(),i=t.getMonth(),g=t.getFullYear();return r+" "+a[i]+" "+g},n.getGridReleaseDate=function(){return new Date(parseInt(e.decode(e.RELEASE_INFORMATION),10))},n.decode=function(t){for(var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r="",i,g,p,s,d,c,u,h=0,m=t.replace(/[^A-Za-z0-9+/=]/g,"");h<m.length;)s=a.indexOf(m.charAt(h++)),d=a.indexOf(m.charAt(h++)),c=a.indexOf(m.charAt(h++)),u=a.indexOf(m.charAt(h++)),i=s<<2|d>>4,g=(d&15)<<4|c>>2,p=(c&3)<<6|u,r=r+String.fromCharCode(i),c!=64&&(r=r+String.fromCharCode(g)),u!=64&&(r=r+String.fromCharCode(p));return r=e.utf8_decode(r),r},n.utf8_decode=function(t){t=t.replace(/rn/g,"n");for(var a="",r=0;r<t.length;r++){var i=t.charCodeAt(r);i<128?a+=String.fromCharCode(i):i>127&&i<2048?(a+=String.fromCharCode(i>>6|192),a+=String.fromCharCode(i&63|128)):(a+=String.fromCharCode(i>>12|224),a+=String.fromCharCode(i>>6&63|128),a+=String.fromCharCode(i&63|128))}return a},n.setLicenseKey=function(t){e.licenseKey=t},n.extractBracketedInformation=function(t){var a=t.split("[").filter(function(g){return g.indexOf("]")>-1}).map(function(g){return g.split("]")[0]});if(!a||a.length===0)return[null,null];var r=a.filter(function(g){return g==="TRIAL"}).length===1,i=a.filter(function(g){return g.indexOf("v")===0}).map(function(g){return g.replace(/^v/,"")})[0];return[i,r]},n.prototype.validateLicenseKeyForVersion=function(t,a,r){a?this.validateForTrial(r):this.validateLegacyKey(r)},n.prototype.validateLegacyKey=function(t){var a=e.getGridReleaseDate(),r=e.extractExpiry(t),i=!1,g=!1;if(isNaN(r.getTime())||(i=!0,g=a<r),i=!0,g=!0,!i)this.outputInvalidLicenseKey();else if(!g){var p=e.formatDate(r),s=e.formatDate(a);this.outputIncompatibleVersion(p,s)}},n.prototype.validateForTrial=function(t){var a=e.extractExpiry(t),r=new Date,i=!1,g=!1;if(isNaN(a.getTime())||(i=!0,g=a>r),!i)this.outputInvalidLicenseKey();else if(!g){var p=e.formatDate(a);this.outputExpiredTrialKey(p)}},n.prototype.outputInvalidLicenseKey=function(){this.watermarkMessage="Invalid License"},n.prototype.outputExpiredTrialKey=function(t){this.watermarkMessage="Trial Period Expired"},n.prototype.outputMissingLicenseKey=function(){this.watermarkMessage="For Trial Use Only"},n.prototype.outputIncompatibleVersion=function(t,a){this.watermarkMessage="License Expired"};var e;return n.RELEASE_INFORMATION="MTYzMjgzMjEzNDg4Mw==",te([(0,l.fsG)("md5")],n.prototype,"md5",void 0),te([l.$j7],n.prototype,"validateLicense",null),n=e=te([(0,l.Vu6)("licenseManager")],n),n}(l.AS9),Cn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Ve=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},_n=function(o){Cn(n,o);function n(){var e=o!==null&&o.apply(this,arguments)||this;return e.ieCompatibility=!1,e}return n.prototype.init=function(){this.ieCompatibility=this.md5("hello")!="5d41402abc4b2a76b9719d911017c592"},n.prototype.md5cycle=function(e,t){var a=e[0],r=e[1],i=e[2],g=e[3];a=this.ff(a,r,i,g,t[0],7,-680876936),g=this.ff(g,a,r,i,t[1],12,-389564586),i=this.ff(i,g,a,r,t[2],17,606105819),r=this.ff(r,i,g,a,t[3],22,-1044525330),a=this.ff(a,r,i,g,t[4],7,-176418897),g=this.ff(g,a,r,i,t[5],12,1200080426),i=this.ff(i,g,a,r,t[6],17,-1473231341),r=this.ff(r,i,g,a,t[7],22,-45705983),a=this.ff(a,r,i,g,t[8],7,1770035416),g=this.ff(g,a,r,i,t[9],12,-1958414417),i=this.ff(i,g,a,r,t[10],17,-42063),r=this.ff(r,i,g,a,t[11],22,-1990404162),a=this.ff(a,r,i,g,t[12],7,1804603682),g=this.ff(g,a,r,i,t[13],12,-40341101),i=this.ff(i,g,a,r,t[14],17,-1502002290),r=this.ff(r,i,g,a,t[15],22,1236535329),a=this.gg(a,r,i,g,t[1],5,-165796510),g=this.gg(g,a,r,i,t[6],9,-1069501632),i=this.gg(i,g,a,r,t[11],14,643717713),r=this.gg(r,i,g,a,t[0],20,-373897302),a=this.gg(a,r,i,g,t[5],5,-701558691),g=this.gg(g,a,r,i,t[10],9,38016083),i=this.gg(i,g,a,r,t[15],14,-660478335),r=this.gg(r,i,g,a,t[4],20,-405537848),a=this.gg(a,r,i,g,t[9],5,568446438),g=this.gg(g,a,r,i,t[14],9,-1019803690),i=this.gg(i,g,a,r,t[3],14,-187363961),r=this.gg(r,i,g,a,t[8],20,1163531501),a=this.gg(a,r,i,g,t[13],5,-1444681467),g=this.gg(g,a,r,i,t[2],9,-51403784),i=this.gg(i,g,a,r,t[7],14,1735328473),r=this.gg(r,i,g,a,t[12],20,-1926607734),a=this.hh(a,r,i,g,t[5],4,-378558),g=this.hh(g,a,r,i,t[8],11,-2022574463),i=this.hh(i,g,a,r,t[11],16,1839030562),r=this.hh(r,i,g,a,t[14],23,-35309556),a=this.hh(a,r,i,g,t[1],4,-1530992060),g=this.hh(g,a,r,i,t[4],11,1272893353),i=this.hh(i,g,a,r,t[7],16,-155497632),r=this.hh(r,i,g,a,t[10],23,-1094730640),a=this.hh(a,r,i,g,t[13],4,681279174),g=this.hh(g,a,r,i,t[0],11,-358537222),i=this.hh(i,g,a,r,t[3],16,-722521979),r=this.hh(r,i,g,a,t[6],23,76029189),a=this.hh(a,r,i,g,t[9],4,-640364487),g=this.hh(g,a,r,i,t[12],11,-421815835),i=this.hh(i,g,a,r,t[15],16,530742520),r=this.hh(r,i,g,a,t[2],23,-995338651),a=this.ii(a,r,i,g,t[0],6,-198630844),g=this.ii(g,a,r,i,t[7],10,1126891415),i=this.ii(i,g,a,r,t[14],15,-1416354905),r=this.ii(r,i,g,a,t[5],21,-57434055),a=this.ii(a,r,i,g,t[12],6,1700485571),g=this.ii(g,a,r,i,t[3],10,-1894986606),i=this.ii(i,g,a,r,t[10],15,-1051523),r=this.ii(r,i,g,a,t[1],21,-2054922799),a=this.ii(a,r,i,g,t[8],6,1873313359),g=this.ii(g,a,r,i,t[15],10,-30611744),i=this.ii(i,g,a,r,t[6],15,-1560198380),r=this.ii(r,i,g,a,t[13],21,1309151649),a=this.ii(a,r,i,g,t[4],6,-145523070),g=this.ii(g,a,r,i,t[11],10,-1120210379),i=this.ii(i,g,a,r,t[2],15,718787259),r=this.ii(r,i,g,a,t[9],21,-343485551),e[0]=this.add32(a,e[0]),e[1]=this.add32(r,e[1]),e[2]=this.add32(i,e[2]),e[3]=this.add32(g,e[3])},n.prototype.cmn=function(e,t,a,r,i,g){return t=this.add32(this.add32(t,e),this.add32(r,g)),this.add32(t<<i|t>>>32-i,a)},n.prototype.ff=function(e,t,a,r,i,g,p){return this.cmn(t&a|~t&r,e,t,i,g,p)},n.prototype.gg=function(e,t,a,r,i,g,p){return this.cmn(t&r|a&~r,e,t,i,g,p)},n.prototype.hh=function(e,t,a,r,i,g,p){return this.cmn(t^a^r,e,t,i,g,p)},n.prototype.ii=function(e,t,a,r,i,g,p){return this.cmn(a^(t|~r),e,t,i,g,p)},n.prototype.md51=function(e){var t=e.length,a=[1732584193,-271733879,-1732584194,271733878],r;for(r=64;r<=e.length;r+=64)this.md5cycle(a,this.md5blk(e.substring(r-64,r)));e=e.substring(r-64);var i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(r=0;r<e.length;r++)i[r>>2]|=e.charCodeAt(r)<<(r%4<<3);if(i[r>>2]|=128<<(r%4<<3),r>55)for(this.md5cycle(a,i),r=0;r<16;r++)i[r]=0;return i[14]=t*8,this.md5cycle(a,i),a},n.prototype.md5blk=function(e){for(var t=[],a=0;a<64;a+=4)t[a>>2]=e.charCodeAt(a)+(e.charCodeAt(a+1)<<8)+(e.charCodeAt(a+2)<<16)+(e.charCodeAt(a+3)<<24);return t},n.prototype.rhex=function(e){for(var t="0123456789abcdef".split(""),a="",r=0;r<4;r++)a+=t[e>>r*8+4&15]+t[e>>r*8&15];return a},n.prototype.hex=function(e){for(var t=0;t<e.length;t++)e[t]=this.rhex(e[t]);return e.join("")},n.prototype.md5=function(e){return this.hex(this.md51(e))},n.prototype.add32=function(e,t){return this.ieCompatibility?this.add32Compat(e,t):this.add32Std(e,t)},n.prototype.add32Std=function(e,t){return e+t&4294967295},n.prototype.add32Compat=function(e,t){var a=(e&65535)+(t&65535),r=(e>>16)+(t>>16)+(a>>16);return r<<16|a&65535},Ve([l.NqP],n.prototype,"init",null),n=Ve([(0,l.Vu6)("md5")],n),n}(l.AS9),An=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),we=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Mn=function(o){An(n,o);function n(){return o.call(this,`<div class="ag-watermark">
                    <div ref="eLicenseTextRef" class="ag-watermark-text"></div>
               </div>`)||this}return n.prototype.postConstruct=function(){var e=this,t=this.shouldDisplayWatermark();l._.addOrRemoveCssClass(this.getGui(),"ag-hidden",!t),t&&(this.eLicenseTextRef.innerText=this.licenseManager.getWatermarkMessage(),window.setTimeout(function(){return e.addCssClass("ag-opacity-zero")},0),window.setTimeout(function(){return e.addCssClass("ag-hidden")},5e3))},n.prototype.shouldDisplayWatermark=function(){var e=this.licenseManager.isDisplayWatermark(),t=location.hostname.match("^(?:127.0.0.1|localhost|(?:w+.)?ag-grid.com)$")!=null,a=location.pathname?location.pathname.indexOf("forceWatermark")!==-1:!1;return a||e&&!t},we([(0,l.fsG)("licenseManager")],n.prototype,"licenseManager",void 0),we([(0,l.cqo)("eLicenseTextRef")],n.prototype,"eLicenseTextRef",void 0),we([l.NqP],n.prototype,"postConstruct",null),n}(l.wA2),z={moduleName:l.GXE.EnterpriseCoreModule,beans:[ke,_n],agStackComponents:[{componentName:"AgWatermark",componentClass:Mn}]},En=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),ae=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},O;(function(o){o[o.EXPANDED=0]="EXPANDED",o[o.COLLAPSED=1]="COLLAPSED",o[o.INDETERMINATE=2]="INDETERMINATE"})(O||(O={}));var Tn=function(o){En(n,o);function n(){return o.call(this,n.TEMPLATE)||this}return n.prototype.postConstruct=function(){var e=this;this.createExpandIcons(),this.addManagedListener(this.eExpand,"click",this.onExpandClicked.bind(this)),this.addManagedListener(this.eExpand,"keydown",function(a){a.keyCode===l.VDZ.SPACE&&e.onExpandClicked()}),this.addManagedListener(this.eSelect.getInputElement(),"click",this.onSelectClicked.bind(this)),this.eFilterTextField.onValueChange(function(){return e.onFilterTextChanged()}),this.addManagedListener(this.eFilterTextField.getInputElement(),"keypress",this.onMiniFilterKeyPress.bind(this)),this.addManagedListener(this.eventService,l.zW2.EVENT_NEW_COLUMNS_LOADED,this.showOrHideOptions.bind(this));var t=this.gridOptionsWrapper.getLocaleTextFunc();this.eSelect.setInputAriaLabel(t("ariaColumnSelectAll","Toggle Select All Columns")),this.eFilterTextField.setInputAriaLabel(t("ariaFilterColumnsInput","Filter Columns Input"))},n.prototype.init=function(e){this.params=e,this.columnModel.isReady()&&this.showOrHideOptions()},n.prototype.createExpandIcons=function(){this.eExpand.appendChild(this.eExpandChecked=l._.createIconNoSpan("columnSelectOpen",this.gridOptionsWrapper)),this.eExpand.appendChild(this.eExpandUnchecked=l._.createIconNoSpan("columnSelectClosed",this.gridOptionsWrapper)),this.eExpand.appendChild(this.eExpandIndeterminate=l._.createIconNoSpan("columnSelectIndeterminate",this.gridOptionsWrapper)),this.setExpandState(O.EXPANDED)},n.prototype.showOrHideOptions=function(){var e=!this.params.suppressColumnFilter,t=!this.params.suppressColumnSelectAll,a=!this.params.suppressColumnExpandAll,r=this.columnModel.isPrimaryColumnGroupsPresent(),i=this.gridOptionsWrapper.getLocaleTextFunc();this.eFilterTextField.setInputPlaceholder(i("searchOoo","Search...")),l._.setDisplayed(this.eFilterTextField.getGui(),e),l._.setDisplayed(this.eSelect.getGui(),t),l._.setDisplayed(this.eExpand,a&&r)},n.prototype.onFilterTextChanged=function(){var e=this;this.onFilterTextChangedDebounced||(this.onFilterTextChangedDebounced=l._.debounce(function(){var t=e.eFilterTextField.getValue();e.dispatchEvent({type:"filterChanged",filterText:t})},n.DEBOUNCE_DELAY)),this.onFilterTextChangedDebounced()},n.prototype.onMiniFilterKeyPress=function(e){var t=this;l._.isKeyPressed(e,l.VDZ.ENTER)&&setTimeout(function(){return t.onSelectClicked()},n.DEBOUNCE_DELAY)},n.prototype.onSelectClicked=function(){this.dispatchEvent({type:this.selectState?"unselectAll":"selectAll"})},n.prototype.onExpandClicked=function(){this.dispatchEvent({type:this.expandState===O.EXPANDED?"collapseAll":"expandAll"})},n.prototype.setExpandState=function(e){this.expandState=e,l._.setDisplayed(this.eExpandChecked,this.expandState===O.EXPANDED),l._.setDisplayed(this.eExpandUnchecked,this.expandState===O.COLLAPSED),l._.setDisplayed(this.eExpandIndeterminate,this.expandState===O.INDETERMINATE)},n.prototype.setSelectionState=function(e){this.selectState=e,this.eSelect.setValue(this.selectState)},n.DEBOUNCE_DELAY=300,n.TEMPLATE=`<div class="ag-column-select-header" role="presentation" tabindex="-1">
            <div ref="eExpand" class="ag-column-select-header-icon" tabindex="0"></div>
            <ag-checkbox ref="eSelect" class="ag-column-select-header-checkbox"></ag-checkbox>
            <ag-input-text-field class="ag-column-select-header-filter-wrapper" ref="eFilterTextField"></ag-input-text-field>
        </div>`,ae([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),ae([(0,l.cqo)("eExpand")],n.prototype,"eExpand",void 0),ae([(0,l.cqo)("eSelect")],n.prototype,"eSelect",void 0),ae([(0,l.cqo)("eFilterTextField")],n.prototype,"eFilterTextField",void 0),ae([l.NqP],n.prototype,"postConstruct",null),n}(l.wA2),re=function(){function o(n,e,t,a,r){a===void 0&&(a=!1),this.eventService=new l.POd,this.displayName=n,this.dept=t,this.group=a,a?(this.columnGroup=e,this.expanded=r,this.children=[]):this.column=e}return o.prototype.isGroup=function(){return this.group},o.prototype.getDisplayName=function(){return this.displayName},o.prototype.getColumnGroup=function(){return this.columnGroup},o.prototype.getColumn=function(){return this.column},o.prototype.getDept=function(){return this.dept},o.prototype.isExpanded=function(){return!!this.expanded},o.prototype.getChildren=function(){return this.children},o.prototype.isPassesFilter=function(){return this.passesFilter},o.prototype.setExpanded=function(n){n!==this.expanded&&(this.expanded=n,this.eventService.dispatchEvent({type:o.EVENT_EXPANDED_CHANGED}))},o.prototype.setPassesFilter=function(n){this.passesFilter=n},o.prototype.addEventListener=function(n,e){this.eventService.addEventListener(n,e)},o.prototype.removeEventListener=function(n,e){this.eventService.removeEventListener(n,e)},o.EVENT_EXPANDED_CHANGED="expandedChanged",o}(),Dn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),R=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},je=function(o){Dn(n,o);function n(e,t,a,r){var i=o.call(this)||this;return i.modelItem=e,i.allowDragging=t,i.eventType=a,i.focusWrapper=r,i.processingColumnStateChange=!1,i.modelItem=e,i.columnGroup=e.getColumnGroup(),i.columnDept=e.getDept(),i.allowDragging=t,i}return n.prototype.init=function(){var e=this;this.setTemplate(n.TEMPLATE),this.eDragHandle=l._.createIconNoSpan("columnDrag",this.gridOptionsWrapper),l._.addCssClass(this.eDragHandle,"ag-drag-handle"),l._.addCssClass(this.eDragHandle,"ag-column-select-column-group-drag-handle");var t=this.cbSelect.getGui(),a=this.cbSelect.getInputElement();t.insertAdjacentElement("afterend",this.eDragHandle),a.setAttribute("tabindex","-1"),this.displayName=this.columnModel.getDisplayNameForOriginalColumnGroup(null,this.columnGroup,this.eventType),l._.missing(this.displayName)&&(this.displayName=">>"),this.eLabel.innerHTML=this.displayName?this.displayName:"",this.setupExpandContract(),this.addCssClass("ag-column-select-indent-"+this.columnDept),this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_PIVOT_MODE_CHANGED,this.onColumnStateChanged.bind(this)),this.addManagedListener(this.eLabel,"click",this.onLabelClicked.bind(this)),this.addManagedListener(this.cbSelect,l.jkc.EVENT_CHANGED,this.onCheckboxChanged.bind(this)),this.addManagedListener(this.modelItem,re.EVENT_EXPANDED_CHANGED,this.onExpandChanged.bind(this)),this.addManagedListener(this.focusWrapper,"keydown",this.handleKeyDown.bind(this)),this.setOpenClosedIcons(),this.setupDragging(),this.onColumnStateChanged(),this.addVisibilityListenersToAllChildren(),this.refreshAriaExpanded(),this.refreshAriaLabel(),this.setupTooltip();var r=l.fQL.getToolPanelClassesFromColDef(this.columnGroup.getColGroupDef(),this.gridOptionsWrapper,null,this.columnGroup);r.forEach(function(i){return e.addOrRemoveCssClass(i,!0)})},n.prototype.getColumns=function(){return this.columnGroup.getLeafColumns()},n.prototype.setupTooltip=function(){var e=this,t=this.columnGroup.getColGroupDef();if(!!t){var a=function(){var r=t.headerTooltip;e.setTooltip(r)};a(),this.addManagedListener(this.eventService,l.zW2.EVENT_NEW_COLUMNS_LOADED,a)}},n.prototype.getTooltipParams=function(){var e=o.prototype.getTooltipParams.call(this);return e.location="columnToolPanelColumnGroup",e},n.prototype.handleKeyDown=function(e){switch(e.keyCode){case l.VDZ.LEFT:e.preventDefault(),this.modelItem.setExpanded(!1);break;case l.VDZ.RIGHT:e.preventDefault(),this.modelItem.setExpanded(!0);break;case l.VDZ.SPACE:e.preventDefault(),this.isSelectable()&&this.onSelectAllChanged(!this.isSelected());break}},n.prototype.addVisibilityListenersToAllChildren=function(){var e=this;this.columnGroup.getLeafColumns().forEach(function(t){e.addManagedListener(t,l.sgG.EVENT_VISIBLE_CHANGED,e.onColumnStateChanged.bind(e)),e.addManagedListener(t,l.sgG.EVENT_VALUE_CHANGED,e.onColumnStateChanged.bind(e)),e.addManagedListener(t,l.sgG.EVENT_PIVOT_CHANGED,e.onColumnStateChanged.bind(e)),e.addManagedListener(t,l.sgG.EVENT_ROW_GROUP_CHANGED,e.onColumnStateChanged.bind(e))})},n.prototype.setupDragging=function(){var e=this;if(!this.allowDragging){l._.setDisplayed(this.eDragHandle,!1);return}var t={type:l.rvo.ToolPanel,eElement:this.eDragHandle,dragItemName:this.displayName,getDragItem:function(){return e.createDragItem()},onDragStarted:function(){var a={type:l.zW2.EVENT_COLUMN_PANEL_ITEM_DRAG_START,column:e.columnGroup};e.eventService.dispatchEvent(a)},onDragStopped:function(){var a={type:l.zW2.EVENT_COLUMN_PANEL_ITEM_DRAG_END};e.eventService.dispatchEvent(a)}};this.dragAndDropService.addDragSource(t,!0),this.addDestroyFunc(function(){return e.dragAndDropService.removeDragSource(t)})},n.prototype.createDragItem=function(){var e={};return this.columnGroup.getLeafColumns().forEach(function(t){e[t.getId()]=t.isVisible()}),{columns:this.columnGroup.getLeafColumns(),visibleState:e}},n.prototype.setupExpandContract=function(){this.eGroupClosedIcon.appendChild(l._.createIcon("columnSelectClosed",this.gridOptionsWrapper,null)),this.eGroupOpenedIcon.appendChild(l._.createIcon("columnSelectOpen",this.gridOptionsWrapper,null)),this.addManagedListener(this.eGroupClosedIcon,"click",this.onExpandOrContractClicked.bind(this)),this.addManagedListener(this.eGroupOpenedIcon,"click",this.onExpandOrContractClicked.bind(this));var e=new l.rwP(this.eColumnGroupIcons,!0);this.addManagedListener(e,l.rwP.EVENT_TAP,this.onExpandOrContractClicked.bind(this)),this.addDestroyFunc(e.destroy.bind(e))},n.prototype.onLabelClicked=function(){var e=!this.cbSelect.getValue();this.onChangeCommon(e)},n.prototype.onCheckboxChanged=function(e){this.onChangeCommon(e.selected)},n.prototype.getVisibleLeafColumns=function(){var e=[],t=function(a){a.forEach(function(r){!r.isPassesFilter()||(r.isGroup()?t(r.getChildren()):e.push(r.getColumn()))})};return t(this.modelItem.getChildren()),e},n.prototype.onChangeCommon=function(e){this.refreshAriaLabel(),!this.processingColumnStateChange&&this.modelItemUtils.selectAllChildren(this.modelItem.getChildren(),e,this.eventType)},n.prototype.refreshAriaLabel=function(){var e=this.gridOptionsWrapper.getLocaleTextFunc(),t=e("ariaColumnGroup","Column Group"),a=this.cbSelect.getValue()?e("ariaVisible","visible"):e("ariaHidden","hidden"),r=e("ariaToggleVisibility","Press SPACE to toggle visibility");l._.setAriaLabel(this.focusWrapper,this.displayName+" "+t),this.cbSelect.setInputAriaLabel(r+" ("+a+")"),l._.setAriaDescribedBy(this.focusWrapper,this.cbSelect.getInputElement().id)},n.prototype.onColumnStateChanged=function(){var e=this.workOutSelectedValue(),t=this.workOutReadOnlyValue();this.processingColumnStateChange=!0,this.cbSelect.setValue(e),this.cbSelect.setReadOnly(t),l._.addOrRemoveCssClass(this.getGui(),"ag-column-select-column-group-readonly",t),this.processingColumnStateChange=!1},n.prototype.workOutSelectedValue=function(){var e=this,t=this.columnModel.isPivotMode(),a=this.getVisibleLeafColumns(),r=0,i=0;if(a.forEach(function(g){!t&&g.getColDef().lockVisible||(e.isColumnChecked(g,t)?r++:i++)}),!(r>0&&i>0))return r>0},n.prototype.workOutReadOnlyValue=function(){var e=this.columnModel.isPivotMode(),t=0;return this.columnGroup.getLeafColumns().forEach(function(a){e?a.isAnyFunctionAllowed()&&t++:a.getColDef().lockVisible||t++}),t===0},n.prototype.isColumnChecked=function(e,t){if(t){var a=e.isPivotActive(),r=e.isRowGroupActive(),i=e.isValueActive();return a||r||i}return e.isVisible()},n.prototype.onExpandOrContractClicked=function(){var e=this.modelItem.isExpanded();this.modelItem.setExpanded(!e)},n.prototype.onExpandChanged=function(){this.setOpenClosedIcons(),this.refreshAriaExpanded()},n.prototype.setOpenClosedIcons=function(){var e=this.modelItem.isExpanded();l._.setDisplayed(this.eGroupClosedIcon,!e),l._.setDisplayed(this.eGroupOpenedIcon,e)},n.prototype.refreshAriaExpanded=function(){l._.setAriaExpanded(this.focusWrapper,this.modelItem.isExpanded())},n.prototype.getDisplayName=function(){return this.displayName},n.prototype.onSelectAllChanged=function(e){var t=this.cbSelect.getValue(),a=this.cbSelect.isReadOnly();!a&&(e&&!t||!e&&t)&&this.cbSelect.toggle()},n.prototype.isSelected=function(){return this.cbSelect.getValue()},n.prototype.isSelectable=function(){return!this.cbSelect.isReadOnly()},n.prototype.setSelected=function(e){this.cbSelect.setValue(e,!0)},n.TEMPLATE=`<div class="ag-column-select-column-group" aria-hidden="true">
            <span class="ag-column-group-icons" ref="eColumnGroupIcons" >
                <span class="ag-column-group-closed-icon" ref="eGroupClosedIcon"></span>
                <span class="ag-column-group-opened-icon" ref="eGroupOpenedIcon"></span>
            </span>
            <ag-checkbox ref="cbSelect" class="ag-column-select-checkbox"></ag-checkbox>
            <span class="ag-column-select-column-label" ref="eLabel"></span>
        </div>`,R([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),R([(0,l.fsG)("dragAndDropService")],n.prototype,"dragAndDropService",void 0),R([(0,l.fsG)("modelItemUtils")],n.prototype,"modelItemUtils",void 0),R([(0,l.cqo)("cbSelect")],n.prototype,"cbSelect",void 0),R([(0,l.cqo)("eLabel")],n.prototype,"eLabel",void 0),R([(0,l.cqo)("eGroupOpenedIcon")],n.prototype,"eGroupOpenedIcon",void 0),R([(0,l.cqo)("eGroupClosedIcon")],n.prototype,"eGroupClosedIcon",void 0),R([(0,l.cqo)("eColumnGroupIcons")],n.prototype,"eColumnGroupIcons",void 0),R([l.NqP],n.prototype,"init",null),n}(l.wA2),Sn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),xe=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},ye="ag-column-list-item-hovered",Pn=function(o){Sn(n,o);function n(e,t){var a=o.call(this)||this;return a.comp=e,a.virtualList=t,a.currentDragColumn=null,a.lastHoveredColumnItem=null,a}return n.prototype.postConstruct=function(){this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_PANEL_ITEM_DRAG_START,this.columnPanelItemDragStart.bind(this)),this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_PANEL_ITEM_DRAG_END,this.columnPanelItemDragEnd.bind(this)),this.createDropTarget(),this.createAutoScrollService()},n.prototype.columnPanelItemDragStart=function(e){var t=e.column;this.currentDragColumn=t;var a=this.getCurrentColumns(),r=l._.find(a,function(i){var g=i.getColDef();return!!g.suppressMovable||!!g.lockPosition});r&&(this.moveBlocked=!0)},n.prototype.columnPanelItemDragEnd=function(){var e=this;window.setTimeout(function(){e.currentDragColumn=null,e.moveBlocked=!1},10)},n.prototype.createDropTarget=function(){var e=this,t={isInterestedIn:function(a){return a===l.rvo.ToolPanel},getIconName:function(){return l.jUB[e.moveBlocked?"ICON_NOT_ALLOWED":"ICON_MOVE"]},getContainer:function(){return e.comp.getGui()},onDragging:function(a){return e.onDragging(a)},onDragStop:function(){return e.onDragStop()},onDragLeave:function(){return e.onDragLeave()}};this.dragAndDropService.addDropTarget(t)},n.prototype.createAutoScrollService=function(){var e=this.virtualList.getGui();this.autoScrollService=new l.Cvn({scrollContainer:e,scrollAxis:"y",getVerticalPosition:function(){return e.scrollTop},setVerticalPosition:function(t){return e.scrollTop=t}})},n.prototype.onDragging=function(e){if(!(!this.currentDragColumn||this.moveBlocked)){var t=this.getDragColumnItem(e),a=this.virtualList.getComponentAt(t.rowIndex);if(!!a){var r=a.getGui().parentElement;this.lastHoveredColumnItem&&this.lastHoveredColumnItem.rowIndex===t.rowIndex&&this.lastHoveredColumnItem.position===t.position||(this.autoScrollService.check(e.event),this.clearHoveredItems(),this.lastHoveredColumnItem=t,l._.radioCssClass(r,""+ye),l._.radioCssClass(r,"ag-item-highlight-"+t.position))}}},n.prototype.getDragColumnItem=function(e){var t=this.virtualList.getGui(),a=parseFloat(window.getComputedStyle(t).paddingTop),r=this.virtualList.getRowHeight(),i=this.virtualList.getScrollTop(),g=Math.max(0,(e.y-a+i)/r),p=this.comp.getDisplayedColsList().length-1,s=Math.min(p,g)|0;return{rowIndex:s,position:Math.round(g)>g||g>p?"bottom":"top",component:this.virtualList.getComponentAt(s)}},n.prototype.onDragStop=function(){if(!this.moveBlocked){var e=this.getTargetIndex(),t=this.getCurrentColumns();e!=null&&this.columnModel.moveColumns(t,e),this.clearHoveredItems(),this.autoScrollService.ensureCleared()}},n.prototype.getMoveDiff=function(e){var t=this.columnModel.getAllGridColumns(),a=this.getCurrentColumns(),r=a[0],i=a.length,g=t.indexOf(r);return g<e?i:0},n.prototype.getCurrentColumns=function(){return this.currentDragColumn instanceof l.KTm?this.currentDragColumn.getLeafColumns():[this.currentDragColumn]},n.prototype.getTargetIndex=function(){if(!this.lastHoveredColumnItem)return null;var e=this.lastHoveredColumnItem.component,t=this.lastHoveredColumnItem.position==="top",a;if(e instanceof je){var r=e.getColumns();a=r[0],t=!0}else a=e.getColumn();var i=this.columnModel.getAllGridColumns().indexOf(a),g=t?i:i+1,p=this.getMoveDiff(g);return g-p},n.prototype.onDragLeave=function(){this.clearHoveredItems(),this.autoScrollService.ensureCleared()},n.prototype.clearHoveredItems=function(){var e=this.virtualList.getGui();e.querySelectorAll("."+ye).forEach(function(t){[ye,"ag-item-highlight-top","ag-item-highlight-bottom"].forEach(function(a){l._.removeCssClass(t,a)})}),this.lastHoveredColumnItem=null},xe([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),xe([(0,l.fsG)("dragAndDropService")],n.prototype,"dragAndDropService",void 0),xe([l.NqP],n.prototype,"postConstruct",null),n}(l.AS9),On=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Q=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Ln=function(o){On(n,o);function n(e,t,a,r,i){var g=o.call(this)||this;return g.column=e,g.columnDept=t,g.allowDragging=a,g.groupsExist=r,g.focusWrapper=i,g.processingColumnStateChange=!1,g}return n.prototype.init=function(){var e=this;this.setTemplate(n.TEMPLATE),this.eDragHandle=l._.createIconNoSpan("columnDrag",this.gridOptionsWrapper),l._.addCssClass(this.eDragHandle,"ag-drag-handle"),l._.addCssClass(this.eDragHandle,"ag-column-select-column-drag-handle");var t=this.cbSelect.getGui(),a=this.cbSelect.getInputElement();t.insertAdjacentElement("afterend",this.eDragHandle),a.setAttribute("tabindex","-1"),this.displayName=this.columnModel.getDisplayNameForColumn(this.column,"columnToolPanel");var r=l._.escapeString(this.displayName);this.eLabel.innerHTML=r;var i=this.columnDept;this.groupsExist&&this.addCssClass("ag-column-select-add-group-indent"),this.addCssClass("ag-column-select-indent-"+i),this.setupDragging(),this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_PIVOT_MODE_CHANGED,this.onColumnStateChanged.bind(this)),this.addManagedListener(this.column,l.sgG.EVENT_VALUE_CHANGED,this.onColumnStateChanged.bind(this)),this.addManagedListener(this.column,l.sgG.EVENT_PIVOT_CHANGED,this.onColumnStateChanged.bind(this)),this.addManagedListener(this.column,l.sgG.EVENT_ROW_GROUP_CHANGED,this.onColumnStateChanged.bind(this)),this.addManagedListener(this.column,l.sgG.EVENT_VISIBLE_CHANGED,this.onColumnStateChanged.bind(this)),this.addManagedListener(this.focusWrapper,"keydown",this.handleKeyDown.bind(this)),this.addManagedListener(this.gridOptionsWrapper,"functionsReadOnly",this.onColumnStateChanged.bind(this)),this.addManagedListener(this.cbSelect,l.jkc.EVENT_CHANGED,this.onCheckboxChanged.bind(this)),this.addManagedListener(this.eLabel,"click",this.onLabelClicked.bind(this)),this.onColumnStateChanged(),this.refreshAriaLabel(),this.setupTooltip();var g=l.fQL.getToolPanelClassesFromColDef(this.column.getColDef(),this.gridOptionsWrapper,this.column,null);g.forEach(function(p){return e.addOrRemoveCssClass(p,!0)})},n.prototype.getColumn=function(){return this.column},n.prototype.setupTooltip=function(){var e=this,t=function(){var a=e.column.getColDef().headerTooltip;e.setTooltip(a)};t(),this.addManagedListener(this.eventService,l.zW2.EVENT_NEW_COLUMNS_LOADED,t)},n.prototype.getTooltipParams=function(){var e=o.prototype.getTooltipParams.call(this);return e.location="columnToolPanelColumn",e.colDef=this.column.getColDef(),e},n.prototype.handleKeyDown=function(e){e.keyCode===l.VDZ.SPACE&&(e.preventDefault(),this.isSelectable()&&this.onSelectAllChanged(!this.isSelected()))},n.prototype.onLabelClicked=function(){if(!this.gridOptionsWrapper.isFunctionsReadOnly()){var e=!this.cbSelect.getValue();this.onChangeCommon(e)}},n.prototype.onCheckboxChanged=function(e){this.onChangeCommon(e.selected)},n.prototype.onChangeCommon=function(e){this.cbSelect.isReadOnly()||(this.refreshAriaLabel(),!this.processingColumnStateChange&&this.modelItemUtils.setColumn(this.column,e,"toolPanelUi"))},n.prototype.refreshAriaLabel=function(){var e=this.gridOptionsWrapper.getLocaleTextFunc(),t=e("ariaColumn","Column"),a=this.cbSelect.getValue()?e("ariaVisible","visible"):e("ariaHidden","hidden"),r=e("ariaToggleVisibility","Press SPACE to toggle visibility");l._.setAriaLabel(this.focusWrapper,this.displayName+" "+t),this.cbSelect.setInputAriaLabel(r+" ("+a+")"),l._.setAriaDescribedBy(this.focusWrapper,this.cbSelect.getInputElement().id)},n.prototype.setupDragging=function(){var e=this;if(!this.allowDragging){l._.setDisplayed(this.eDragHandle,!1);return}var t={type:l.rvo.ToolPanel,eElement:this.eDragHandle,dragItemName:this.displayName,getDragItem:function(){return e.createDragItem()},onDragStarted:function(){var a={type:l.zW2.EVENT_COLUMN_PANEL_ITEM_DRAG_START,column:e.column};e.eventService.dispatchEvent(a)},onDragStopped:function(){var a={type:l.zW2.EVENT_COLUMN_PANEL_ITEM_DRAG_END};e.eventService.dispatchEvent(a)}};this.dragAndDropService.addDragSource(t,!0),this.addDestroyFunc(function(){return e.dragAndDropService.removeDragSource(t)})},n.prototype.createDragItem=function(){var e={};return e[this.column.getId()]=this.column.isVisible(),{columns:[this.column],visibleState:e}},n.prototype.onColumnStateChanged=function(){this.processingColumnStateChange=!0;var e=this.columnModel.isPivotMode();if(e){var t=this.column.isAnyFunctionActive();this.cbSelect.setValue(t)}else this.cbSelect.setValue(this.column.isVisible());var a;if(e){var r=this.gridOptionsWrapper.isFunctionsReadOnly(),i=!this.column.isAnyFunctionAllowed();a=r||i}else a=!!this.column.getColDef().lockVisible;this.cbSelect.setReadOnly(a),l._.addOrRemoveCssClass(this.getGui(),"ag-column-select-column-readonly",a);var g=e&&this.gridOptionsWrapper.isFunctionsPassive();this.cbSelect.setPassive(g),this.processingColumnStateChange=!1},n.prototype.getDisplayName=function(){return this.displayName},n.prototype.onSelectAllChanged=function(e){e!==this.cbSelect.getValue()&&(this.cbSelect.isReadOnly()||this.cbSelect.toggle())},n.prototype.isSelected=function(){return this.cbSelect.getValue()},n.prototype.isSelectable=function(){return!this.cbSelect.isReadOnly()},n.prototype.isExpandable=function(){return!1},n.prototype.setExpanded=function(e){},n.TEMPLATE=`<div class="ag-column-select-column" aria-hidden="true">
            <ag-checkbox ref="cbSelect" class="ag-column-select-checkbox"></ag-checkbox>
            <span class="ag-column-select-column-label" ref="eLabel"></span>
        </div>`,Q([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),Q([(0,l.fsG)("dragAndDropService")],n.prototype,"dragAndDropService",void 0),Q([(0,l.fsG)("modelItemUtils")],n.prototype,"modelItemUtils",void 0),Q([(0,l.cqo)("eLabel")],n.prototype,"eLabel",void 0),Q([(0,l.cqo)("cbSelect")],n.prototype,"cbSelect",void 0),Q([l.NqP],n.prototype,"init",null),n}(l.wA2),Nn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),ge=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},In=function(){function o(n){this.items=n}return o.prototype.getRowCount=function(){return this.items.length},o.prototype.getRow=function(n){return this.items[n]},o}(),Gn="ag-column-select-list",Rn=function(o){Nn(n,o);function n(){var e=o.call(this,n.TEMPLATE)||this;return e.destroyColumnItemFuncs=[],e}return n.prototype.destroyColumnTree=function(){this.allColsTree=[],this.destroyColumnItemFuncs.forEach(function(e){return e()}),this.destroyColumnItemFuncs=[]},n.prototype.init=function(e,t,a){var r=this;this.params=e,this.allowDragging=t,this.eventType=a,this.params.suppressSyncLayoutWithGrid||this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_MOVED,this.onColumnsChanged.bind(this)),this.addManagedListener(this.eventService,l.zW2.EVENT_NEW_COLUMNS_LOADED,this.onColumnsChanged.bind(this));var i=[l.zW2.EVENT_COLUMN_PIVOT_CHANGED,l.zW2.EVENT_COLUMN_PIVOT_MODE_CHANGED,l.zW2.EVENT_COLUMN_ROW_GROUP_CHANGED,l.zW2.EVENT_COLUMN_VALUE_CHANGED,l.zW2.EVENT_COLUMN_VISIBLE,l.zW2.EVENT_NEW_COLUMNS_LOADED];i.forEach(function(g){r.addManagedListener(r.eventService,g,r.fireSelectionChangedEvent.bind(r))}),this.expandGroupsByDefault=!this.params.contractColumnSelection,this.virtualList=this.createManagedBean(new l.CPJ("column-select","tree")),this.appendChild(this.virtualList.getGui()),this.virtualList.setComponentCreator(function(g,p){return l._.setAriaLevel(p,g.getDept()+1),r.createComponentFromItem(g,p)}),this.columnModel.isReady()&&this.onColumnsChanged(),!e.suppressColumnMove&&!this.gridOptionsWrapper.isSuppressMovableColumns()&&this.createManagedBean(new Pn(this,this.virtualList))},n.prototype.createComponentFromItem=function(e,t){if(e.isGroup()){var a=new je(e,this.allowDragging,this.eventType,t);return this.getContext().createBean(a),a}var r=new Ln(e.getColumn(),e.getDept(),this.allowDragging,this.groupsExist,t);return this.getContext().createBean(r),r},n.prototype.onColumnsChanged=function(){var e=this.getExpandedStates(),t=this.columnModel.isPivotMode(),a=!this.params.suppressSyncLayoutWithGrid&&!t;a?this.buildTreeFromWhatGridIsDisplaying():this.buildTreeFromProvidedColumnDefs(),this.setExpandedStates(e),this.markFilteredColumns(),this.flattenAndFilterModel()},n.prototype.getDisplayedColsList=function(){return this.displayedColsList},n.prototype.getExpandedStates=function(){if(!this.allColsTree)return{};var e={};return this.forEachItem(function(t){if(!!t.isGroup()){var a=t.getColumnGroup();a&&(e[a.getId()]=t.isExpanded())}}),e},n.prototype.setExpandedStates=function(e){!this.allColsTree||this.forEachItem(function(t){if(!!t.isGroup()){var a=t.getColumnGroup();if(a){var r=e[a.getId()],i=r!=null;i&&t.setExpanded(r)}}})},n.prototype.buildTreeFromWhatGridIsDisplaying=function(){this.colDefService.syncLayoutWithGrid(this.setColumnLayout.bind(this))},n.prototype.setColumnLayout=function(e){var t=this.colDefService.createColumnTree(e);this.buildListModel(t),this.groupsExist=e.some(function(a){return a&&typeof a.children<"u"}),this.markFilteredColumns(),this.flattenAndFilterModel()},n.prototype.buildTreeFromProvidedColumnDefs=function(){this.buildListModel(this.columnModel.getPrimaryColumnTree()),this.groupsExist=this.columnModel.isPrimaryColumnGroupsPresent()},n.prototype.buildListModel=function(e){var t=this,a=this.onColumnExpanded.bind(this),r=function(s){s.addEventListener(re.EVENT_EXPANDED_CHANGED,a);var d=s.removeEventListener.bind(s,re.EVENT_EXPANDED_CHANGED,a);t.destroyColumnItemFuncs.push(d)},i=function(s,d,c){s.forEach(function(u){u instanceof l.KTm?g(u,d,c):p(u,d,c)})},g=function(s,d,c){var u=s.getColGroupDef(),h=u&&u.suppressColumnsToolPanel;if(!h){if(s.isPadding()){i(s.getChildren(),d,c);return}var m=t.columnModel.getDisplayNameForOriginalColumnGroup(null,s,t.eventType),f=new re(m,s,d,!0,t.expandGroupsByDefault);c.push(f),r(f),i(s.getChildren(),d+1,f.getChildren())}},p=function(s,d,c){var u=s.getColDef()&&s.getColDef().suppressColumnsToolPanel;if(!u){var h=t.columnModel.getDisplayNameForColumn(s,"columnToolPanel");c.push(new re(h,s,d))}};this.destroyColumnTree(),i(e,0,this.allColsTree)},n.prototype.onColumnExpanded=function(){this.flattenAndFilterModel()},n.prototype.flattenAndFilterModel=function(){var e=this;this.displayedColsList=[];var t=function(r){!r.isPassesFilter()||(e.displayedColsList.push(r),r.isGroup()&&r.isExpanded()&&r.getChildren().forEach(t))};this.allColsTree.forEach(t),this.virtualList.setModel(new In(this.displayedColsList));var a=this.virtualList.getLastFocusedRow();this.virtualList.refresh(),a!=null&&this.focusRowIfAlive(a),this.notifyListeners()},n.prototype.focusRowIfAlive=function(e){var t=this;window.setTimeout(function(){t.isAlive()&&t.virtualList.focusRow(e)},0)},n.prototype.forEachItem=function(e){var t=function(a){a.forEach(function(r){e(r),r.isGroup()&&t(r.getChildren())})};t(this.allColsTree)},n.prototype.doSetExpandedAll=function(e){this.forEachItem(function(t){t.isGroup()&&t.setExpanded(e)})},n.prototype.setGroupsExpanded=function(e,t){if(!t){this.doSetExpandedAll(e);return}var a=[];this.forEachItem(function(i){if(!!i.isGroup()){var g=i.getColumnGroup().getId();t.indexOf(g)>=0&&(i.setExpanded(e),a.push(g))}});var r=t.filter(function(i){return!l._.includes(a,i)});r.length>0},n.prototype.getExpandState=function(){var e=0,t=0;return this.forEachItem(function(a){!a.isGroup()||(a.isExpanded()?e++:t++)}),e>0&&t>0?O.INDETERMINATE:t>0?O.COLLAPSED:O.EXPANDED},n.prototype.doSetSelectedAll=function(e){this.modelItemUtils.selectAllChildren(this.allColsTree,e,this.eventType)},n.prototype.getSelectionState=function(){var e=0,t=0,a=this.columnModel.isPivotMode();if(this.forEachItem(function(r){if(!r.isGroup()&&!!r.isPassesFilter()){var i=r.getColumn(),g=i.getColDef(),p;if(a){var s=!i.isAllowPivot()&&!i.isAllowRowGroup()&&!i.isAllowValue();if(s)return;p=i.isValueActive()||i.isPivotActive()||i.isRowGroupActive()}else{if(g.lockVisible)return;p=i.isVisible()}p?e++:t++}}),!(e>0&&t>0))return!(e===0||t>0)},n.prototype.setFilterText=function(e){this.filterText=l._.exists(e)?e.toLowerCase():null,this.markFilteredColumns(),this.flattenAndFilterModel()},n.prototype.markFilteredColumns=function(){var e=this,t=function(r){if(!l._.exists(e.filterText))return!0;var i=r.getDisplayName();return i==null||i.toLowerCase().indexOf(e.filterText)!==-1},a=function(r,i){var g=!1;if(r.isGroup()){var p=t(r);r.getChildren().forEach(function(d){var c=a(d,p||i);c&&(g=c)})}var s=i||g?!0:t(r);return r.setPassesFilter(s),s};this.allColsTree.forEach(function(r){return a(r,!1)})},n.prototype.notifyListeners=function(){this.fireGroupExpandedEvent(),this.fireSelectionChangedEvent()},n.prototype.fireGroupExpandedEvent=function(){var e=this.getExpandState();this.dispatchEvent({type:"groupExpanded",state:e})},n.prototype.fireSelectionChangedEvent=function(){var e=this.getSelectionState();this.dispatchEvent({type:"selectionChanged",state:e})},n.TEMPLATE='<div class="'+Gn+'" role="presentation"></div>',ge([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),ge([(0,l.fsG)("toolPanelColDefService")],n.prototype,"colDefService",void 0),ge([(0,l.fsG)("modelItemUtils")],n.prototype,"modelItemUtils",void 0),ge([l.FXL],n.prototype,"destroyColumnTree",null),n}(l.wA2),Fn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Ce=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},ze=function(o){Fn(n,o);function n(){return o!==null&&o.apply(this,arguments)||this}return n.prototype.createTemplate=function(){return`<div class="ag-pivot-mode-panel">
                <ag-toggle-button ref="cbPivotMode" class="ag-pivot-mode-select"></ag-toggle-button>
            </div>`},n.prototype.init=function(){this.setTemplate(this.createTemplate()),this.cbPivotMode.setValue(this.columnModel.isPivotMode());var e=this.gridOptionsWrapper.getLocaleTextFunc();this.cbPivotMode.setLabel(e("pivotMode","Pivot Mode")),this.addManagedListener(this.cbPivotMode,l.jkc.EVENT_CHANGED,this.onBtPivotMode.bind(this)),this.addManagedListener(this.eventService,l.zW2.EVENT_NEW_COLUMNS_LOADED,this.onPivotModeChanged.bind(this)),this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_PIVOT_MODE_CHANGED,this.onPivotModeChanged.bind(this))},n.prototype.onBtPivotMode=function(){var e=!!this.cbPivotMode.getValue();if(e!==this.columnModel.isPivotMode()){this.columnModel.setPivotMode(e,"toolPanelUi");var t=this.gridOptionsWrapper.getApi();t&&t.refreshHeader()}},n.prototype.onPivotModeChanged=function(){var e=this.columnModel.isPivotMode();this.cbPivotMode.setValue(e)},Ce([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),Ce([(0,l.cqo)("cbPivotMode")],n.prototype,"cbPivotMode",void 0),Ce([l.$j7],n.prototype,"init",null),n}(l.wA2),kn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),W=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Vn=function(o){kn(n,o);function n(){return o!==null&&o.apply(this,arguments)||this}return n.prototype.execute=function(e){var t=l._.missingOrEmpty(this.columnModel.getValueColumns()),a=!this.gridOptionsWrapper.getGroupRowAggNodesFunc(),r=e.changedPath&&e.changedPath.isActive();if(!(t&&a&&r)){var i=this.createAggDetails(e);this.recursivelyCreateAggData(i)}},n.prototype.createAggDetails=function(e){var t=this.columnModel.isPivotActive(),a=this.columnModel.getValueColumns(),r=t?this.columnModel.getPivotColumns():[],i={changedPath:e.changedPath,valueColumns:a,pivotColumns:r};return i},n.prototype.recursivelyCreateAggData=function(e){var t=this;this.filteredOnly=!this.gridOptionsWrapper.isSuppressAggFilteredOnly();var a=function(r){var i=!r.hasChildren();if(i){r.aggData&&r.setAggData(null);return}var g=r.level===-1;if(g){var p=!t.columnModel.isPivotMode(),s=t.gridOptionsWrapper.isSuppressAggAtRootLevel();if(s&&p)return}t.aggregateRowNode(r,e)};e.changedPath.forEachChangedNodeDepthFirst(a,!0)},n.prototype.aggregateRowNode=function(e,t){var a=t.valueColumns.length===0,r=t.pivotColumns.length===0,i=this.gridOptionsWrapper.getGroupRowAggNodesFunc(),g;i?g=i(e.childrenAfterFilter):a?g=null:r?g=this.aggregateRowNodeUsingValuesOnly(e,t):g=this.aggregateRowNodeUsingValuesAndPivot(e),e.setAggData(g),e.sibling&&e.sibling.setAggData(g)},n.prototype.aggregateRowNodeUsingValuesAndPivot=function(e){var t=this,a={},r=this.pivotStage.getPivotColumnDefs();return r.filter(function(i){return!l._.exists(i.pivotTotalColumnIds)}).forEach(function(i){var g=i.pivotKeys||[],p,s=i.pivotValueColumn,d=i.colId;e.leafGroup?p=t.getValuesFromMappedSet(e.childrenMapped,g,s):p=t.getValuesPivotNonLeaf(e,d),a[d]=t.aggregateValues(p,s.getAggFunc(),s,e)}),r.filter(function(i){return l._.exists(i.pivotTotalColumnIds)}).forEach(function(i){var g=[],p=i.pivotValueColumn,s=i.pivotTotalColumnIds,d=i.colId;!s||!s.length||(s.forEach(function(c){g.push(a[c])}),a[d]=t.aggregateValues(g,p.getAggFunc(),p,e))}),a},n.prototype.aggregateRowNodeUsingValuesOnly=function(e,t){var a=this,r={},i=t.changedPath.isActive()?t.changedPath.getValueColumnsForNode(e,t.valueColumns):t.valueColumns,g=t.changedPath.isActive()?t.changedPath.getNotValueColumnsForNode(e,t.valueColumns):null,p=this.getValuesNormal(e,i),s=e.aggData;return i.forEach(function(d,c){r[d.getId()]=a.aggregateValues(p[c],d.getAggFunc(),d,e)}),g&&s&&g.forEach(function(d){r[d.getId()]=s[d.getId()]}),r},n.prototype.getValuesPivotNonLeaf=function(e,t){var a=[];return e.childrenAfterFilter.forEach(function(r){var i=r.aggData[t];a.push(i)}),a},n.prototype.getValuesFromMappedSet=function(e,t,a){var r=this,i=e;if(t.forEach(function(p){return i=i?i[p]:null}),!i)return[];var g=[];return i.forEach(function(p){var s=r.valueService.getValue(a,p);g.push(s)}),g},n.prototype.getValuesNormal=function(e,t){var a=[];t.forEach(function(){return a.push([])});for(var r=t.length,i=this.filteredOnly?e.childrenAfterFilter:e.childrenAfterGroup,g=i.length,p=0;p<g;p++)for(var s=i[p],d=0;d<r;d++){var c=t[d],u=this.valueService.getValue(c,s);a[d].push(u)}return a},n.prototype.aggregateValues=function(e,t,a,r){var i=typeof t=="string"?this.aggFuncService.getAggFunc(t):t;if(typeof i!="function")return null;var g=function(){l._.doOnce(function(){},"aggregationStage.aggregateValues Deprecation")},p=i,s={values:e,column:a,colDef:a?a.getColDef():void 0,rowNode:r,data:r?r.data:void 0,api:this.gridApi,columnApi:this.columnApi,context:this.gridOptionsWrapper.getContext(),forEach:function(d,c){return g(),e.forEach(d,c)},get length(){return g(),e.length},set length(d){g(),e.length=d}};return p(s)},W([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),W([(0,l.fsG)("valueService")],n.prototype,"valueService",void 0),W([(0,l.fsG)("pivotStage")],n.prototype,"pivotStage",void 0),W([(0,l.fsG)("aggFuncService")],n.prototype,"aggFuncService",void 0),W([(0,l.fsG)("gridApi")],n.prototype,"gridApi",void 0),W([(0,l.fsG)("columnApi")],n.prototype,"columnApi",void 0),n=W([(0,l.Vu6)("aggregationStage")],n),n}(l.AS9),_e=function(){function o(){this.allSets={},this.allParents=[]}return o.prototype.removeFromChildrenAfterGroup=function(n,e){var t=this.getSet(n);t.removeFromChildrenAfterGroup[e.id]=!0},o.prototype.removeFromAllLeafChildren=function(n,e){var t=this.getSet(n);t.removeFromAllLeafChildren[e.id]=!0},o.prototype.getSet=function(n){return this.allSets[n.id]||(this.allSets[n.id]={removeFromAllLeafChildren:{},removeFromChildrenAfterGroup:{}},this.allParents.push(n)),this.allSets[n.id]},o.prototype.getAllParents=function(){return this.allParents},o.prototype.flush=function(){var n=this;this.allParents.forEach(function(e){var t=n.allSets[e.id];e.childrenAfterGroup=e.childrenAfterGroup.filter(function(a){return!t.removeFromChildrenAfterGroup[a.id]}),e.allLeafChildren=e.allLeafChildren.filter(function(a){return!t.removeFromAllLeafChildren[a.id]}),e.updateHasChildren()}),this.allSets={},this.allParents.length=0},o}(),jn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),U=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},zn=function(o){jn(n,o);function n(){var e=o!==null&&o.apply(this,arguments)||this;return e.groupIdSequence=new l.at1,e}return n.prototype.postConstruct=function(){this.usingTreeData=this.gridOptionsWrapper.isTreeData(),this.usingTreeData&&(this.getDataPath=this.gridOptionsWrapper.getDataPathFunc())},n.prototype.execute=function(e){var t=this.createGroupingDetails(e);if(t.transactions)this.handleTransaction(t);else{var a=e.afterColumnsChanged===!0;this.shotgunResetEverything(t,a)}this.sortGroupsWithComparator(t.rootNode),this.selectableService.updateSelectableAfterGrouping(t.rootNode)},n.prototype.createGroupingDetails=function(e){var t=e.rowNode,a=e.changedPath,r=e.rowNodeTransactions,i=e.rowNodeOrder,g=this.usingTreeData?null:this.columnModel.getRowGroupColumns(),p={includeParents:!this.gridOptionsWrapper.isSuppressParentsInRowNodes(),expandByDefault:this.gridOptionsWrapper.getGroupDefaultExpanded(),groupedCols:g,rootNode:t,pivotMode:this.columnModel.isPivotMode(),groupedColCount:this.usingTreeData||!g?0:g.length,rowNodeOrder:i,transactions:r,changedPath:a};return p},n.prototype.handleTransaction=function(e){var t=this;e.transactions.forEach(function(a){var r=t.usingTreeData?void 0:new _e;if(l._.existsAndNotEmpty(a.remove)&&t.removeNodes(a.remove,e,r),l._.existsAndNotEmpty(a.update)&&t.moveNodesInWrongPath(a.update,e,r),l._.existsAndNotEmpty(a.add)&&t.insertNodes(a.add,e,!1),r){var i=r.getAllParents().slice();r.flush(),t.removeEmptyGroups(i,e)}}),e.rowNodeOrder&&this.sortChildren(e)},n.prototype.sortChildren=function(e){e.changedPath.forEachChangedNodeDepthFirst(function(t){l._.sortRowNodesByOrder(t.childrenAfterGroup,e.rowNodeOrder)})},n.prototype.sortGroupsWithComparator=function(e){if(this.usingTreeData)return;var t=this.gridOptionsWrapper.getDefaultGroupOrderComparator();l._.exists(t)&&a(e);function a(r){var i=l._.exists(r.childrenAfterGroup)&&!r.leafGroup;i&&(r.childrenAfterGroup.sort(t),r.childrenAfterGroup.forEach(function(g){return a(g)}))}},n.prototype.getExistingPathForNode=function(e,t){for(var a=[],r=this.usingTreeData?e:e.parent;r&&r!==t.rootNode;)a.push({key:r.key,rowGroupColumn:r.rowGroupColumn,field:r.field}),r=r.parent;return a.reverse(),a},n.prototype.moveNodesInWrongPath=function(e,t,a){var r=this;e.forEach(function(i){t.changedPath.isActive()&&t.changedPath.addParentNode(i.parent);var g=function(c){return c.key},p=r.getExistingPathForNode(i,t).map(g),s=r.getGroupInfo(i,t).map(g),d=l._.areEqual(p,s);d||r.moveNode(i,t,a)})},n.prototype.moveNode=function(e,t,a){if(this.removeNodesInStages([e],t,a),this.insertOneNode(e,t,!0),e.setData(e.data),t.changedPath.isActive()){var r=e.parent;t.changedPath.addParentNode(r)}},n.prototype.removeNodes=function(e,t,a){this.removeNodesInStages(e,t,a),t.changedPath.isActive()&&e.forEach(function(r){return t.changedPath.addParentNode(r.parent)})},n.prototype.removeNodesInStages=function(e,t,a){if(this.removeNodesFromParents(e,t,a),this.usingTreeData){this.postRemoveCreateFillerNodes(e,t);var r=e.map(function(i){return i.parent});this.removeEmptyGroups(r,t)}},n.prototype.forEachParentGroup=function(e,t,a){for(var r=t;r&&r!==e.rootNode;)a(r),r=r.parent},n.prototype.removeNodesFromParents=function(e,t,a){var r=this,i=a==null,g=a||new _e;e.forEach(function(p){r.removeFromParent(p,g),r.forEachParentGroup(t,p.parent,function(s){g.removeFromAllLeafChildren(s,p)})}),i&&g.flush()},n.prototype.postRemoveCreateFillerNodes=function(e,t){var a=this;e.forEach(function(r){var i=r.hasChildren();if(i){var g=a.getExistingPathForNode(r,t),p=a.findParentForNode(r,g,t);p.expanded=r.expanded,p.allLeafChildren=r.allLeafChildren,p.childrenAfterGroup=r.childrenAfterGroup,p.childrenMapped=r.childrenMapped,p.updateHasChildren(),p.childrenAfterGroup.forEach(function(s){return s.parent=p})}})},n.prototype.removeEmptyGroups=function(e,t){for(var a=this,r=!0,i=function(p){var s=a.getChildrenMappedKey(p.key,p.rowGroupColumn),d=p.parent,c=d&&d.childrenMapped?!d.childrenMapped[s]:!0;return c?!1:!!p.isEmptyRowGroupNode()},g=function(){r=!1;var p=new _e;e.forEach(function(s){a.forEachParentGroup(t,s,function(d){i(d)&&(r=!0,a.removeFromParent(d,p),d.setSelected(!1))})}),p.flush()};r;)g()},n.prototype.removeFromParent=function(e,t){e.parent&&(t?t.removeFromChildrenAfterGroup(e.parent,e):(l._.removeFromArray(e.parent.childrenAfterGroup,e),e.parent.updateHasChildren()));var a=this.getChildrenMappedKey(e.key,e.rowGroupColumn);e.parent&&e.parent.childrenMapped&&(e.parent.childrenMapped[a]=void 0),e.setRowTop(null),e.setRowIndex(null)},n.prototype.addToParent=function(e,t){var a=this.getChildrenMappedKey(e.key,e.rowGroupColumn);if(t){var r=t.childrenMapped!=null;r&&(t.childrenMapped[a]=e),t.childrenAfterGroup.push(e),t.updateHasChildren()}},n.prototype.areGroupColsEqual=function(e,t){return e==null||t==null||e.pivotMode!==t.pivotMode?!1:l._.areEqual(e.groupedCols,t.groupedCols)},n.prototype.checkAllGroupDataAfterColsChanged=function(e){var t=this,a=function(r){!r||r.forEach(function(i){var g=!t.usingTreeData&&!i.group;if(!g){var p={field:i.field,key:i.key,rowGroupColumn:i.rowGroupColumn};t.setGroupData(i,p),a(i.childrenAfterGroup)}})};a(e.rootNode.childrenAfterGroup)},n.prototype.shotgunResetEverything=function(e,t){this.noChangeInGroupingColumns(e,t)||(this.selectionService.removeGroupsFromSelection(),e.rootNode.leafGroup=this.usingTreeData?!1:e.groupedCols.length===0,e.rootNode.childrenAfterGroup=[],e.rootNode.childrenMapped={},e.rootNode.updateHasChildren(),this.insertNodes(e.rootNode.allLeafChildren,e,!1))},n.prototype.noChangeInGroupingColumns=function(e,t){var a=!1,r=this.columnModel.getGroupDisplayColumns(),i=r?r.map(function(g){return g.getId()}).join("-"):"";return t&&(a=this.usingTreeData||this.areGroupColsEqual(e,this.oldGroupingDetails),this.oldGroupDisplayColIds!==i&&this.checkAllGroupDataAfterColsChanged(e)),this.oldGroupingDetails=e,this.oldGroupDisplayColIds=i,a},n.prototype.insertNodes=function(e,t,a){var r=this;e.forEach(function(i){r.insertOneNode(i,t,a),t.changedPath.isActive()&&t.changedPath.addParentNode(i.parent)})},n.prototype.insertOneNode=function(e,t,a){var r=this.getGroupInfo(e,t),i=this.findParentForNode(e,r,t);i.group,this.usingTreeData?this.swapGroupWithUserNode(i,e,a):(e.parent=i,e.level=r.length,i.childrenAfterGroup.push(e),i.updateHasChildren())},n.prototype.findParentForNode=function(e,t,a){var r=this,i=a.rootNode;return t.forEach(function(g,p){i=r.getOrCreateNextNode(i,g,p,a),i.allLeafChildren.push(e)}),i},n.prototype.swapGroupWithUserNode=function(e,t,a){t.parent=e.parent,t.key=e.key,t.field=e.field,t.groupData=e.groupData,t.level=e.level,a||(t.expanded=e.expanded),t.leafGroup=e.leafGroup,t.rowGroupIndex=e.rowGroupIndex,t.allLeafChildren=e.allLeafChildren,t.childrenAfterGroup=e.childrenAfterGroup,t.childrenMapped=e.childrenMapped,t.updateHasChildren(),this.removeFromParent(e),t.childrenAfterGroup.forEach(function(r){return r.parent=t}),this.addToParent(t,e.parent)},n.prototype.getOrCreateNextNode=function(e,t,a,r){var i=this.getChildrenMappedKey(t.key,t.rowGroupColumn),g=e.childrenMapped?e.childrenMapped[i]:void 0;return g||(g=this.createGroup(t,e,a,r),this.addToParent(g,e)),g},n.prototype.createGroup=function(e,t,a,r){var i=new l.Fxk(this.beans);return i.group=!0,i.field=e.field,i.rowGroupColumn=e.rowGroupColumn,this.setGroupData(i,e),i.id=l.Fxk.ID_PREFIX_ROW_GROUP+this.groupIdSequence.next(),i.key=e.key,i.level=a,i.leafGroup=this.usingTreeData?!1:a===r.groupedColCount-1,i.allLeafChildren=[],i.setAllChildrenCount(0),i.rowGroupIndex=this.usingTreeData?null:a,i.childrenAfterGroup=[],i.childrenMapped={},i.updateHasChildren(),i.parent=r.includeParents?t:null,this.setExpandedInitialValue(r,i),i},n.prototype.setGroupData=function(e,t){var a=this;e.groupData={};var r=this.columnModel.getGroupDisplayColumns();r.forEach(function(i){var g=a.usingTreeData||(e.rowGroupColumn?i.isRowGroupDisplayed(e.rowGroupColumn.getId()):!1);g&&(e.groupData[i.getColId()]=t.key)})},n.prototype.getChildrenMappedKey=function(e,t){return t?t.getId()+"-"+e:e},n.prototype.setExpandedInitialValue=function(e,t){if(e.pivotMode&&t.leafGroup){t.expanded=!1;return}var a=this.gridOptionsWrapper.getIsGroupOpenByDefaultFunc();if(a){var r={rowNode:t,field:t.field,key:t.key,level:t.level,rowGroupColumn:t.rowGroupColumn};t.expanded=a(r)==!0;return}var i=e.expandByDefault;if(e.expandByDefault===-1){t.expanded=!0;return}t.expanded=t.level<i},n.prototype.getGroupInfo=function(e,t){return this.usingTreeData?this.getGroupInfoFromCallback(e):this.getGroupInfoFromGroupColumns(e,t)},n.prototype.getGroupInfoFromCallback=function(e){var t=this.getDataPath?this.getDataPath(e.data):null;(t==null||t.length===0)&&l._.doOnce(function(){},"groupStage.getGroupInfoFromCallback");var a=function(r){return{key:r,field:null,rowGroupColumn:null}};return t?t.map(a):[]},n.prototype.getGroupInfoFromGroupColumns=function(e,t){var a=this,r=[];return t.groupedCols.forEach(function(i){var g=a.valueService.getKeyForNode(i,e),p=g!=null;if(t.pivotMode&&!p&&(g=" ",p=!0),p){var s={key:g,field:i.getColDef().field,rowGroupColumn:i};r.push(s)}}),r},U([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),U([(0,l.fsG)("selectableService")],n.prototype,"selectableService",void 0),U([(0,l.fsG)("valueService")],n.prototype,"valueService",void 0),U([(0,l.fsG)("beans")],n.prototype,"beans",void 0),U([(0,l.fsG)("selectionService")],n.prototype,"selectionService",void 0),U([l.NqP],n.prototype,"postConstruct",null),n=U([(0,l.Vu6)("groupStage")],n),n}(l.AS9),Wn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),We=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Ue=function(){for(var o=0,n=0,e=arguments.length;n<e;n++)o+=arguments[n].length;for(var t=Array(o),a=0,n=0;n<e;n++)for(var r=arguments[n],i=0,g=r.length;i<g;i++,a++)t[a]=r[i];return t},Un=function(o){Wn(n,o);function n(){return o!==null&&o.apply(this,arguments)||this}e=n,n.prototype.createPivotColumnDefs=function(t){var a=[],r=[],i=this.columnModel.getPivotColumns(),g=this.columnModel.getValueColumns(),p=i.length,s=new l.at1;this.recursivelyAddGroup(a,r,1,t,[],s,p,i),this.addRowGroupTotals(a,r,g,s),this.addExpandablePivotGroups(a,r,s),this.addPivotTotalsToGroups(a,r,s);var d=r.map(function(c){return l._.cloneObject(c)});return{pivotColumnGroupDefs:a,pivotColumnDefs:d}},n.prototype.recursivelyAddGroup=function(t,a,r,i,g,p,s,d){var c=this;l._.iterateObject(i,function(f,b){var x=Ue(g,[f]),y=r!==s;if(y){var S={children:[],headerName:f,pivotKeys:x,columnGroupShow:"open",groupId:"pivot"+p.next()};t.push(S),c.recursivelyAddGroup(S.children,a,r+1,b,x,p,s,d)}else{var G=c.columnModel.getValueColumns(),Z={children:[],headerName:f,pivotKeys:x,columnGroupShow:"open",groupId:"pivot"+p.next()};if(G.length===0){var xn=c.createColDef(null,"-",x,p);Z.children.push(xn),a.push(xn)}else G.forEach(function(yn){var Ra=c.columnModel.getDisplayNameForColumn(yn,"header"),Fe=c.createColDef(yn,Ra,x,p);Fe.columnGroupShow="open",Z.children.push(Fe),a.push(Fe)});t.push(Z)}});var u=d[r-1].getColDef(),h=u.pivotComparator,m=this.headerNameComparator.bind(this,h);t.sort(m)},n.prototype.addExpandablePivotGroups=function(t,a,r){var i=this;if(!(this.gridOptionsWrapper.isSuppressExpandablePivotGroups()||this.gridOptionsWrapper.getPivotColumnGroupTotals())){var g=function(p,s,d,c){var u=p;if(u.children){var h=new Map;u.children.forEach(function(y){g(y,s,d,h)});var m=!u.children.some(function(y){return y.children});i.columnModel.getValueColumns().forEach(function(y){var S=i.columnModel.getDisplayNameForColumn(y,"header"),G=i.createColDef(y,S,p.pivotKeys,d);if(G.pivotTotalColumnIds=h.get(y.getColId()),G.columnGroupShow="closed",G.aggFunc=y.getAggFunc(),!m){var Z=p.children;Z.push(G),s.push(G)}}),i.merge(c,h)}else{var f=p;if(!f.pivotValueColumn)return;var b=f.pivotValueColumn.getColId(),x=c.has(b)?c.get(b):[];x.push(f.colId),c.set(b,x)}};t.forEach(function(p){g(p,a,r,new Map)})}},n.prototype.addPivotTotalsToGroups=function(t,a,r){var i=this;if(!!this.gridOptionsWrapper.getPivotColumnGroupTotals()){var g=this.gridOptionsWrapper.getPivotColumnGroupTotals()==="after",p=this.columnModel.getValueColumns(),s=p.map(function(c){return c.getAggFunc()});if(!(!s||s.length<1||!this.sameAggFuncs(s))){var d=p[0];t.forEach(function(c){i.recursivelyAddPivotTotal(c,a,r,d,g)})}}},n.prototype.recursivelyAddPivotTotal=function(t,a,r,i,g){var p=this,s=t;if(!s.children){var d=t;return d.colId?[d.colId]:null}var c=[];if(s.children.forEach(function(b){var x=p.recursivelyAddPivotTotal(b,a,r,i,g);x&&(c=c.concat(x))}),s.children.length>1){var u=this.gridOptionsWrapper.getLocaleTextFunc(),h=u("pivotColumnGroupTotals","Total"),m=this.createColDef(i,h,t.pivotKeys,r);m.pivotTotalColumnIds=c,m.aggFunc=i.getAggFunc();var f=t.children;g?f.push(m):f.unshift(m),a.push(m)}return c},n.prototype.addRowGroupTotals=function(t,a,r,i){var g=this;if(!!this.gridOptionsWrapper.getPivotRowTotals())for(var p=this.gridOptionsWrapper.getPivotRowTotals()==="after",s=p?r.slice():r.slice().reverse(),d=function(h){var m=s[h],f=[];t.forEach(function(b){f=f.concat(g.extractColIdsForValueColumn(b,m))}),c.createRowGroupTotal(t,a,[],i,m,f,p)},c=this,u=0;u<s.length;u++)d(u)},n.prototype.extractColIdsForValueColumn=function(t,a){var r=this,i=t;if(!i.children){var g=i;return g.pivotValueColumn===a&&g.colId?[g.colId]:[]}var p=[];return i.children.forEach(function(s){r.extractColIdsForValueColumn(s,a);var d=r.extractColIdsForValueColumn(s,a);p=p.concat(d)}),p},n.prototype.createRowGroupTotal=function(t,a,r,i,g,p,s){var d=r.slice(0),c=this.columnModel.getValueColumns(),u={children:[],pivotKeys:d,groupId:e.PIVOT_ROW_TOTAL_PREFIX+i.next()};if(c.length===0){var h=this.createColDef(null,"-",d,i);u.children.push(h),a.push(h)}else{var m=this.columnModel.getDisplayNameForColumn(g,"header"),h=this.createColDef(g,m,d,i);h.pivotTotalColumnIds=p,u.children.push(h),a.push(h)}s?t.push(u):t.unshift(u)},n.prototype.createColDef=function(t,a,r,i){var g={};if(t){var p=t.getColDef();l._.assign(g,p),g.hide=!1}return g.headerName=a,g.colId="pivot_"+i.next(),g.field=g.colId,g.pivotKeys=r,g.pivotValueColumn=t,g.filter=!1,g},n.prototype.sameAggFuncs=function(t){if(t.length==1)return!0;for(var a=1;a<t.length;a++)if(t[a]!==t[0])return!1;return!0},n.prototype.headerNameComparator=function(t,a,r){return t?t(a.headerName,r.headerName):a.headerName&&!r.headerName?1:!a.headerName&&r.headerName?-1:!a.headerName||!r.headerName?0:a.headerName<r.headerName?-1:a.headerName>r.headerName?1:0},n.prototype.merge=function(t,a){a.forEach(function(r,i,g){var p=t.has(i)?t.get(i):[],s=Ue(p,r);t.set(i,s)})};var e;return n.PIVOT_ROW_TOTAL_PREFIX="PivotRowTotal_",We([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),n=e=We([(0,l.Vu6)("pivotColDefService")],n),n}(l.AS9),Bn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),se=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Hn=function(o){Bn(n,o);function n(){var e=o!==null&&o.apply(this,arguments)||this;return e.uniqueValues={},e}return n.prototype.execute=function(e){var t=e.rowNode,a=e.changedPath;this.columnModel.isPivotActive()?this.executePivotOn(t,a):this.executePivotOff(a)},n.prototype.executePivotOff=function(e){this.aggregationColumnsHashLastTime=null,this.uniqueValues={},this.columnModel.isSecondaryColumnsPresent()&&(this.columnModel.setSecondaryColumns(null,"rowModelUpdated"),e&&e.setInactive())},n.prototype.executePivotOn=function(e,t){var a=this.bucketUpRowNodes(e),r=this.setUniqueValues(a),i=this.columnModel.getValueColumns(),g=i.map(function(m){return m.getId()}).join("#"),p=i.map(function(m){return m.getAggFunc().toString()}).join("#"),s=this.aggregationColumnsHashLastTime!==g,d=this.aggregationFuncsHashLastTime!==p;if(this.aggregationColumnsHashLastTime=g,this.aggregationFuncsHashLastTime=p,r||s||d){var c=this.pivotColDefService.createPivotColumnDefs(this.uniqueValues),u=c.pivotColumnGroupDefs,h=c.pivotColumnDefs;this.pivotColumnDefs=h,this.columnModel.setSecondaryColumns(u,"rowModelUpdated"),t&&t.setInactive()}},n.prototype.setUniqueValues=function(e){var t=JSON.stringify(e),a=JSON.stringify(this.uniqueValues),r=t!==a;return r?(this.uniqueValues=e,!0):!1},n.prototype.bucketUpRowNodes=function(e){var t=this,a={},r=function(i){i.leafGroup?t.bucketRowNode(i,a):i.childrenAfterFilter.forEach(function(g){r(g)})};return r(e),a},n.prototype.bucketRowNode=function(e,t){var a=this.columnModel.getPivotColumns();if(a.length===0){e.childrenMapped=null;return}e.childrenMapped=this.bucketChildren(e.childrenAfterFilter,a,0,t)},n.prototype.bucketChildren=function(e,t,a,r){var i=this,g={},p=t[a];if(e.forEach(function(d){var c=i.valueService.getKeyForNode(p,d);l._.missing(c)&&(c=""),r[c]||(r[c]={}),g[c]||(g[c]=[]),g[c].push(d)}),a===t.length-1)return g;var s={};return l._.iterateObject(g,function(d,c){s[d]=i.bucketChildren(c,t,a+1,r[d])}),s},n.prototype.getPivotColumnDefs=function(){return this.pivotColumnDefs},se([(0,l.fsG)("valueService")],n.prototype,"valueService",void 0),se([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),se([(0,l.fsG)("pivotColDefService")],n.prototype,"pivotColDefService",void 0),n=se([(0,l.Vu6)("pivotStage")],n),n}(l.AS9),Zn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Be=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},L=typeof BigInt>"u"?null:BigInt,Yn=function(o){Zn(n,o);function n(){var t=o!==null&&o.apply(this,arguments)||this;return t.aggFuncsMap={},t.initialised=!1,t}e=n,n.prototype.init=function(){this.initialised||(this.initialiseWithDefaultAggregations(),this.addAggFuncs(this.gridOptionsWrapper.getAggFuncs()))},n.prototype.initialiseWithDefaultAggregations=function(){this.aggFuncsMap[e.AGG_SUM]=Kn,this.aggFuncsMap[e.AGG_FIRST]=Qn,this.aggFuncsMap[e.AGG_LAST]=Xn,this.aggFuncsMap[e.AGG_MIN]=qn,this.aggFuncsMap[e.AGG_MAX]=Jn,this.aggFuncsMap[e.AGG_COUNT]=$n,this.aggFuncsMap[e.AGG_AVG]=et,this.initialised=!0},n.prototype.getDefaultAggFunc=function(t){var a=this.getFuncNames(t),r=l._.includes(a,e.AGG_SUM),i=l._.exists(this.aggFuncsMap[e.AGG_SUM]);return r&&i?e.AGG_SUM:l._.existsAndNotEmpty(a)?a[0]:null},n.prototype.addAggFuncs=function(t){l._.iterateObject(t,this.addAggFunc.bind(this))},n.prototype.addAggFunc=function(t,a){this.init(),this.aggFuncsMap[t]=a},n.prototype.getAggFunc=function(t){return this.init(),this.aggFuncsMap[t]},n.prototype.getFuncNames=function(t){var a=t.getColDef().allowedAggFuncs;return a??Object.keys(this.aggFuncsMap).sort()},n.prototype.clear=function(){this.aggFuncsMap={}};var e;return n.AGG_SUM="sum",n.AGG_FIRST="first",n.AGG_LAST="last",n.AGG_MIN="min",n.AGG_MAX="max",n.AGG_COUNT="count",n.AGG_AVG="avg",Be([l.NqP],n.prototype,"init",null),n=e=Be([(0,l.Vu6)("aggFuncService")],n),n}(l.AS9);function Kn(o){for(var n=o.values,e=null,t=0;t<n.length;t++){var a=n[t];typeof a=="number"?e===null?e=a:L?e+=typeof e=="number"?a:L(a):e+=a:typeof a=="bigint"&&(e===null?e=a:e=(typeof e=="bigint"?e:L(e))+a)}return e}function Qn(o){return o.values.length>0?o.values[0]:null}function Xn(o){return o.values.length>0?l._.last(o.values):null}function qn(o){for(var n=o.values,e=null,t=0;t<n.length;t++){var a=n[t];(typeof a=="number"||typeof a=="bigint")&&(e===null||e>a)&&(e=a)}return e}function Jn(o){for(var n=o.values,e=null,t=0;t<n.length;t++){var a=n[t];(typeof a=="number"||typeof a=="bigint")&&(e===null||e<a)&&(e=a)}return e}function $n(o){for(var n=o.values,e=0,t=0;t<n.length;t++){var a=n[t];e+=a!=null&&typeof a.value=="number"?a.value:1}return{value:e,toString:function(){return this.value.toString()},toNumber:function(){return this.value}}}function et(o){for(var n=o.values,e=0,t=0,a=0;a<n.length;a++){var r=n[a],i=null;typeof r=="number"||typeof r=="bigint"?(i=r,t++):r!=null&&(typeof r.value=="number"||typeof r.value=="bigint")&&typeof r.count=="number"&&(L?i=r.value*(typeof r.value=="number"?r.count:L(r.count)):i=r.value*r.count,t+=r.count),typeof i=="number"?L?e+=typeof e=="number"?i:L(i):e+=i:typeof i=="bigint"&&(e=(typeof e=="bigint"?e:L(e))+i)}var g=null;return t>0&&(L?g=e/(typeof e=="number"?t:L(t)):g=e/t),{count:t,value:g,toString:function(){return typeof this.value=="number"||typeof this.value=="bigint"?this.value.toString():""},toNumber:function(){return this.value}}}var He=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),N=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Ze=function(o){He(n,o);function n(e,t,a,r,i){var g=o.call(this)||this;return g.column=e,g.dragSourceDropTarget=t,g.ghost=a,g.valueColumn=r,g.horizontal=i,g.popupShowing=!1,g}return n.prototype.init=function(){this.setTemplate(n.TEMPLATE),this.addElementClasses(this.getGui()),this.addElementClasses(this.eDragHandle,"drag-handle"),this.addElementClasses(this.eText,"text"),this.addElementClasses(this.eButton,"button"),this.eDragHandle.appendChild(l._.createIconNoSpan("columnDrag",this.gridOptionsWrapper)),this.eButton.appendChild(l._.createIconNoSpan("cancel",this.gridOptionsWrapper)),this.displayName=this.columnModel.getDisplayNameForColumn(this.column,"columnDrop"),this.setupComponents(),!this.ghost&&!this.gridOptionsWrapper.isFunctionsReadOnly()&&this.addDragSource(),this.setupTooltip()},n.prototype.setupTooltip=function(){var e=this,t=function(){var a=e.column.getColDef().headerTooltip;e.setTooltip(a)};t(),this.addManagedListener(this.eventService,l.zW2.EVENT_NEW_COLUMNS_LOADED,t)},n.prototype.addDragSource=function(){var e=this,t={type:l.rvo.ToolPanel,eElement:this.eDragHandle,defaultIconName:l.jUB.ICON_HIDE,getDragItem:function(){return e.createDragItem()},dragItemName:this.displayName,dragSourceDropTarget:this.dragSourceDropTarget};this.dragAndDropService.addDragSource(t,!0),this.addDestroyFunc(function(){return e.dragAndDropService.removeDragSource(t)})},n.prototype.createDragItem=function(){var e={};return e[this.column.getId()]=this.column.isVisible(),{columns:[this.column],visibleState:e}},n.prototype.setupComponents=function(){this.setTextValue(),this.setupRemove(),this.ghost&&l._.addCssClass(this.getGui(),"ag-column-drop-cell-ghost"),this.valueColumn&&!this.gridOptionsWrapper.isFunctionsReadOnly()&&this.addGuiEventListener("click",this.onShowAggFuncSelection.bind(this))},n.prototype.setupRemove=function(){var e=this;l._.setDisplayed(this.eButton,!this.gridOptionsWrapper.isFunctionsReadOnly()),this.addManagedListener(this.eButton,"click",function(a){var r={type:n.EVENT_COLUMN_REMOVE};e.dispatchEvent(r),a.stopPropagation()});var t=new l.rwP(this.eButton);this.addManagedListener(t,l.rwP.EVENT_TAP,function(a){var r={type:n.EVENT_COLUMN_REMOVE};e.dispatchEvent(r)}),this.addDestroyFunc(t.destroy.bind(t))},n.prototype.setTextValue=function(){var e;if(this.valueColumn){var t=this.column.getAggFunc(),a=typeof t=="string"?t:"agg",r=this.gridOptionsWrapper.getLocaleTextFunc(),i=r(a,a);e=i+"("+this.displayName+")"}else e=this.displayName;var g=l._.escapeString(e);this.eText.innerHTML=g},n.prototype.onShowAggFuncSelection=function(){var e=this;if(!this.popupShowing){this.popupShowing=!0;var t=new l.CPJ("select-agg-func"),a=this.aggFuncService.getFuncNames(this.column);t.setModel({getRow:function(s){return a[s]},getRowCount:function(){return a.length}}),this.getContext().createBean(t);var r=l._.loadTemplate('<div class="ag-select-agg-func-popup"></div>');r.style.top="0px",r.style.left="0px",r.appendChild(t.getGui()),r.style.width=this.getGui().clientWidth+"px";var i=function(){e.destroyBean(t),e.popupShowing=!1},g=this.gridOptionsWrapper.getLocaleTextFunc(),p=this.popupService.addPopup({modal:!0,eChild:r,closeOnEsc:!0,closedCallback:i,ariaLabel:g("ariaLabelAggregationFunction","Aggregation Function")});p&&t.setComponentCreator(this.createAggSelect.bind(this,p.hideFunc)),this.popupService.positionPopupUnderComponent({type:"aggFuncSelect",eventSource:this.getGui(),ePopup:r,keepWithinBounds:!0,column:this.column}),t.refresh()}},n.prototype.createAggSelect=function(e,t){var a=this,r=function(){if(e(),a.gridOptionsWrapper.isFunctionsPassive()){var d={type:l.zW2.EVENT_COLUMN_AGG_FUNC_CHANGE_REQUEST,columns:[a.column],aggFunc:t,api:a.gridApi,columnApi:a.columnApi};a.eventService.dispatchEvent(d)}else a.columnModel.setColumnAggFunc(a.column,t,"toolPanelDragAndDrop")},i=this.gridOptionsWrapper.getLocaleTextFunc(),g=t.toString(),p=i(g,g),s=new nt(r,p);return s},n.prototype.addElementClasses=function(e,t){t=t?"-"+t:"",l._.addCssClass(e,"ag-column-drop-cell"+t);var a=this.horizontal?"horizontal":"vertical";l._.addCssClass(e,"ag-column-drop-"+a+"-cell"+t)},n.EVENT_COLUMN_REMOVE="columnRemove",n.TEMPLATE=`<span>
          <span ref="eDragHandle" class="ag-drag-handle ag-column-drop-cell-drag-handle"></span>
          <span ref="eText" class="ag-column-drop-cell-text"></span>
          <span ref="eButton" class="ag-column-drop-cell-button"></span>
        </span>`,N([(0,l.fsG)("dragAndDropService")],n.prototype,"dragAndDropService",void 0),N([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),N([(0,l.fsG)("popupService")],n.prototype,"popupService",void 0),N([(0,l.FiY)("aggFuncService")],n.prototype,"aggFuncService",void 0),N([(0,l.fsG)("columnApi")],n.prototype,"columnApi",void 0),N([(0,l.fsG)("gridApi")],n.prototype,"gridApi",void 0),N([(0,l.cqo)("eText")],n.prototype,"eText",void 0),N([(0,l.cqo)("eDragHandle")],n.prototype,"eDragHandle",void 0),N([(0,l.cqo)("eButton")],n.prototype,"eButton",void 0),N([l.NqP],n.prototype,"init",null),n}(l.wA2),nt=function(o){He(n,o);function n(e,t){var a=o.call(this,'<div class="ag-select-agg-func-item"/>')||this;return a.getGui().innerText=t,a.value=t,a.addGuiEventListener("click",e),a}return n}(l.wA2),tt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Ae=function(o){tt(n,o);function n(e,t){var a=o.call(this,'<div class="ag-unselectable"></div>')||this;return a.horizontal=e,a.valueColumn=t,a.state=n.STATE_NOT_DRAGGING,a.guiDestroyFunctions=[],a.childColumnComponents=[],a.resizeEnabled=!1,a.addElementClasses(a.getGui()),a.eColumnDropList=document.createElement("div"),a.addElementClasses(a.eColumnDropList,"list"),a}return n.prototype.isHorizontal=function(){return this.horizontal},n.prototype.toggleResizable=function(e){this.positionableFeature.setResizable(e?{bottom:!0}:!1),this.resizeEnabled=e},n.prototype.setBeans=function(e){this.beans=e},n.prototype.destroy=function(){this.destroyGui(),o.prototype.destroy.call(this)},n.prototype.destroyGui=function(){this.guiDestroyFunctions.forEach(function(e){return e()}),this.guiDestroyFunctions.length=0,this.childColumnComponents.length=0,l._.clearElement(this.getGui()),l._.clearElement(this.eColumnDropList)},n.prototype.init=function(e){this.params=e,this.addManagedListener(this.beans.eventService,l.zW2.EVENT_NEW_COLUMNS_LOADED,this.refreshGui.bind(this)),this.addManagedListener(this.beans.gridOptionsWrapper,"functionsReadOnly",this.refreshGui.bind(this)),this.setupDropTarget(),this.positionableFeature=new l.Gxm(this.getGui(),{minHeight:100}),this.createManagedBean(this.positionableFeature),this.refreshGui()},n.prototype.addElementClasses=function(e,t){t=t?"-"+t:"",l._.addCssClass(e,"ag-column-drop"+t);var a=this.horizontal?"horizontal":"vertical";l._.addCssClass(e,"ag-column-drop-"+a+t)},n.prototype.setupDropTarget=function(){this.dropTarget={getContainer:this.getGui.bind(this),getIconName:this.getIconName.bind(this),onDragging:this.onDragging.bind(this),onDragEnter:this.onDragEnter.bind(this),onDragLeave:this.onDragLeave.bind(this),onDragStop:this.onDragStop.bind(this),isInterestedIn:this.isInterestedIn.bind(this)},this.beans.dragAndDropService.addDropTarget(this.dropTarget)},n.prototype.isInterestedIn=function(e){return e===l.rvo.HeaderCell||e===l.rvo.ToolPanel},n.prototype.checkInsertIndex=function(e){var t=this.horizontal?this.getNewHorizontalInsertIndex(e):this.getNewVerticalInsertIndex(e);if(t<0)return!1;var a=t!==this.insertIndex;return a&&(this.insertIndex=t),a},n.prototype.getNewHorizontalInsertIndex=function(e){if(l._.missing(e.hDirection))return-1;var t=0,a=e.event,r=this.beans.gridOptionsWrapper.isEnableRtl(),i=e.hDirection===l.poj.Left,g=a.clientX;return this.childColumnComponents.forEach(function(p){var s=p.getGui().getBoundingClientRect(),d=i?s.right:s.left,c=r?g<=d:g>=d;c&&t++}),t},n.prototype.getNewVerticalInsertIndex=function(e){if(l._.missing(e.vDirection))return-1;var t=0,a=e.event;return this.childColumnComponents.forEach(function(r){var i=r.getGui().getBoundingClientRect(),g=a.clientY>=(e.vDirection===l.HO_.Down?i.top:i.bottom);g&&t++}),t},n.prototype.checkDragStartedBySelf=function(e){this.state===n.STATE_NOT_DRAGGING&&(this.state=n.STATE_REARRANGE_COLUMNS,this.potentialDndColumns=e.dragSource.getDragItem().columns||[],this.refreshGui(),this.checkInsertIndex(e),this.refreshGui())},n.prototype.onDragging=function(e){this.checkDragStartedBySelf(e),this.checkInsertIndex(e)&&this.refreshGui()},n.prototype.onDragEnter=function(e){var t=e.dragSource.getDragItem().columns||[];this.state=n.STATE_NEW_COLUMNS_IN;var a=t.filter(this.isColumnDroppable.bind(this));a.length>0&&(this.potentialDndColumns=a,this.checkInsertIndex(e),this.refreshGui())},n.prototype.isPotentialDndColumns=function(){return l._.existsAndNotEmpty(this.potentialDndColumns)},n.prototype.onDragLeave=function(e){if(this.state===n.STATE_REARRANGE_COLUMNS){var t=e.dragSource.getDragItem().columns||[];this.removeColumns(t)}this.isPotentialDndColumns()&&(this.potentialDndColumns=[],this.refreshGui()),this.state=n.STATE_NOT_DRAGGING},n.prototype.onDragStop=function(){if(this.isPotentialDndColumns()){var e=!1;this.state===n.STATE_NEW_COLUMNS_IN?(this.addColumns(this.potentialDndColumns),e=!0):e=this.rearrangeColumns(this.potentialDndColumns),this.potentialDndColumns=[],(!this.beans.gridOptionsWrapper.isFunctionsPassive()||!e)&&this.refreshGui()}this.state=n.STATE_NOT_DRAGGING},n.prototype.removeColumns=function(e){var t=this.getExistingColumns().filter(function(a){return!l._.includes(e,a)});this.updateColumns(t)},n.prototype.addColumns=function(e){if(!!e){var t=this.getExistingColumns().slice(),a=e.filter(function(r){return t.indexOf(r)<0});l._.insertArrayIntoArray(t,a,this.insertIndex),this.updateColumns(t)}},n.prototype.rearrangeColumns=function(e){var t=this.getNonGhostColumns().slice();return l._.insertArrayIntoArray(t,e,this.insertIndex),l._.areEqual(t,this.getExistingColumns())?!1:(this.updateColumns(t),!0)},n.prototype.refreshGui=function(){var e=this.eColumnDropList.scrollTop,t=this.resizeEnabled;this.toggleResizable(!1),this.destroyGui(),this.addIconAndTitleToGui(),this.addEmptyMessageToGui(),this.addColumnsToGui(),this.isHorizontal()||(this.eColumnDropList.scrollTop=e),t&&this.toggleResizable(t)},n.prototype.getNonGhostColumns=function(){var e=this,t=this.getExistingColumns();return this.isPotentialDndColumns()?t.filter(function(a){return!l._.includes(e.potentialDndColumns,a)}):t},n.prototype.addColumnsToGui=function(){var e=this,t=this.getNonGhostColumns(),a=this.isPotentialDndColumns(),r=[];t.forEach(function(i,g){if(!(a&&g>=e.insertIndex)){var p=e.createColumnComponent(i,!1);r.push(p)}}),this.isPotentialDndColumns()&&(this.potentialDndColumns.forEach(function(i){var g=e.createColumnComponent(i,!0);r.push(g)}),t.forEach(function(i,g){if(!(g<e.insertIndex)){var p=e.createColumnComponent(i,!1);r.push(p)}})),this.getGui().appendChild(this.eColumnDropList),r.forEach(function(i,g){g>0&&e.addArrow(e.eColumnDropList),e.eColumnDropList.appendChild(i.getGui())})},n.prototype.createColumnComponent=function(e,t){var a=this,r=new Ze(e,this.dropTarget,t,this.valueColumn,this.horizontal);return r.addEventListener(Ze.EVENT_COLUMN_REMOVE,this.removeColumns.bind(this,[e])),this.beans.context.createBean(r),this.guiDestroyFunctions.push(function(){return a.destroyBean(r)}),t||this.childColumnComponents.push(r),r},n.prototype.addIconAndTitleToGui=function(){var e=this.params.icon,t=document.createElement("div");if(this.addElementClasses(t,"title-bar"),this.addElementClasses(e,"icon"),l._.addOrRemoveCssClass(this.getGui(),"ag-column-drop-empty",this.isExistingColumnsEmpty()),t.appendChild(e),!this.horizontal){var a=document.createElement("span");this.addElementClasses(a,"title"),a.innerHTML=this.params.title,t.appendChild(a)}this.getGui().appendChild(t)},n.prototype.isExistingColumnsEmpty=function(){return this.getExistingColumns().length===0},n.prototype.addEmptyMessageToGui=function(){if(!(!this.isExistingColumnsEmpty()||this.isPotentialDndColumns())){var e=document.createElement("span");e.innerHTML=this.params.emptyMessage,this.addElementClasses(e,"empty-message"),this.eColumnDropList.appendChild(e)}},n.prototype.addArrow=function(e){if(this.horizontal){var t=this.beans.gridOptionsWrapper.isEnableRtl(),a=l._.createIconNoSpan(t?"smallLeft":"smallRight",this.beans.gridOptionsWrapper);this.addElementClasses(a,"cell-separator"),e.appendChild(a)}},n.STATE_NOT_DRAGGING="notDragging",n.STATE_NEW_COLUMNS_IN="newColumnsIn",n.STATE_REARRANGE_COLUMNS="rearrangeColumns",n}(l.wA2),at=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),X=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Me=function(o){at(n,o);function n(e){return o.call(this,e,!1)||this}return n.prototype.passBeansUp=function(){o.prototype.setBeans.call(this,{gridOptionsWrapper:this.gridOptionsWrapper,eventService:this.eventService,context:this.getContext(),loggerFactory:this.loggerFactory,dragAndDropService:this.dragAndDropService});var e=this.gridOptionsWrapper.getLocaleTextFunc(),t=e("rowGroupColumnsEmptyMessage","Drag here to set row groups"),a=e("groups","Row Groups");o.prototype.init.call(this,{dragAndDropIcon:l.jUB.ICON_GROUP,icon:l._.createIconNoSpan("rowGroupPanel",this.gridOptionsWrapper,null),emptyMessage:t,title:a}),this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_ROW_GROUP_CHANGED,this.refreshGui.bind(this))},n.prototype.getTooltipParams=function(){var e=o.prototype.getTooltipParams.call(this);return e.location="rowGroupColumnsList",e},n.prototype.isColumnDroppable=function(e){return this.gridOptionsWrapper.isFunctionsReadOnly()||!e.isPrimary()?!1:e.isAllowRowGroup()&&!e.isRowGroupActive()},n.prototype.updateColumns=function(e){if(this.gridOptionsWrapper.isFunctionsPassive()){var t={type:l.zW2.EVENT_COLUMN_ROW_GROUP_CHANGE_REQUEST,columns:e,api:this.gridApi,columnApi:this.columnApi};this.eventService.dispatchEvent(t)}else this.columnModel.setRowGroupColumns(e,"toolPanelUi")},n.prototype.getIconName=function(){return this.isPotentialDndColumns()?l.jUB.ICON_GROUP:l.jUB.ICON_NOT_ALLOWED},n.prototype.getExistingColumns=function(){return this.columnModel.getRowGroupColumns()},X([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),X([(0,l.fsG)("loggerFactory")],n.prototype,"loggerFactory",void 0),X([(0,l.fsG)("dragAndDropService")],n.prototype,"dragAndDropService",void 0),X([(0,l.fsG)("columnApi")],n.prototype,"columnApi",void 0),X([(0,l.fsG)("gridApi")],n.prototype,"gridApi",void 0),X([l.NqP],n.prototype,"passBeansUp",null),n}(Ae),rt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),q=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Ee=function(o){rt(n,o);function n(e){return o.call(this,e,!1)||this}return n.prototype.passBeansUp=function(){o.prototype.setBeans.call(this,{gridOptionsWrapper:this.gridOptionsWrapper,eventService:this.eventService,context:this.getContext(),loggerFactory:this.loggerFactory,dragAndDropService:this.dragAndDropService});var e=this.gridOptionsWrapper.getLocaleTextFunc(),t=e("pivotColumnsEmptyMessage","Drag here to set column labels"),a=e("pivots","Column Labels");o.prototype.init.call(this,{dragAndDropIcon:l.jUB.ICON_GROUP,icon:l._.createIconNoSpan("pivotPanel",this.gridOptionsWrapper,null),emptyMessage:t,title:a}),this.addManagedListener(this.eventService,l.zW2.EVENT_NEW_COLUMNS_LOADED,this.refresh.bind(this)),this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_PIVOT_CHANGED,this.refresh.bind(this)),this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_PIVOT_MODE_CHANGED,this.checkVisibility.bind(this)),this.refresh()},n.prototype.getTooltipParams=function(){var e=o.prototype.getTooltipParams.call(this);return e.location="pivotColumnsList",e},n.prototype.refresh=function(){this.checkVisibility(),this.refreshGui()},n.prototype.checkVisibility=function(){var e=this.columnModel.isPivotMode();if(this.isHorizontal())switch(this.gridOptionsWrapper.getPivotPanelShow()){case"always":this.setDisplayed(e);break;case"onlyWhenPivoting":var t=this.columnModel.isPivotActive();this.setDisplayed(e&&t);break;default:this.setDisplayed(!1);break}else this.setDisplayed(e)},n.prototype.isColumnDroppable=function(e){return this.gridOptionsWrapper.isFunctionsReadOnly()||!e.isPrimary()?!1:e.isAllowPivot()&&!e.isPivotActive()},n.prototype.updateColumns=function(e){if(this.gridOptionsWrapper.isFunctionsPassive()){var t={type:l.zW2.EVENT_COLUMN_PIVOT_CHANGE_REQUEST,columns:e,api:this.gridApi,columnApi:this.columnApi};this.eventService.dispatchEvent(t)}else this.columnModel.setPivotColumns(e,"toolPanelUi")},n.prototype.getIconName=function(){return this.isPotentialDndColumns()?l.jUB.ICON_PIVOT:l.jUB.ICON_NOT_ALLOWED},n.prototype.getExistingColumns=function(){return this.columnModel.getPivotColumns()},q([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),q([(0,l.fsG)("loggerFactory")],n.prototype,"loggerFactory",void 0),q([(0,l.fsG)("dragAndDropService")],n.prototype,"dragAndDropService",void 0),q([(0,l.fsG)("columnApi")],n.prototype,"columnApi",void 0),q([(0,l.fsG)("gridApi")],n.prototype,"gridApi",void 0),q([l.NqP],n.prototype,"passBeansUp",null),n}(Ae),ot=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Ye=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},it=function(o){ot(n,o);function n(){return o.call(this)||this}return n.prototype.postConstruct=function(){this.setGui(this.createNorthPanel()),this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_ROW_GROUP_CHANGED,this.onRowGroupChanged.bind(this)),this.addManagedListener(this.eventService,l.zW2.EVENT_NEW_COLUMNS_LOADED,this.onRowGroupChanged.bind(this)),this.onRowGroupChanged()},n.prototype.createNorthPanel=function(){var e=document.createElement("div"),t=this.onDropPanelVisible.bind(this);return l._.addCssClass(e,"ag-column-drop-wrapper"),this.rowGroupComp=new Me(!0),this.createManagedBean(this.rowGroupComp),this.pivotComp=new Ee(!0),this.createManagedBean(this.pivotComp),e.appendChild(this.rowGroupComp.getGui()),e.appendChild(this.pivotComp.getGui()),this.addManagedListener(this.rowGroupComp,l.wA2.EVENT_DISPLAYED_CHANGED,t),this.addManagedListener(this.pivotComp,l.wA2.EVENT_DISPLAYED_CHANGED,t),this.onDropPanelVisible(),e},n.prototype.onDropPanelVisible=function(){var e=this.rowGroupComp.isDisplayed()&&this.pivotComp.isDisplayed();this.rowGroupComp.addOrRemoveCssClass("ag-column-drop-horizontal-half-width",e),this.pivotComp.addOrRemoveCssClass("ag-column-drop-horizontal-half-width",e)},n.prototype.onRowGroupChanged=function(){if(!!this.rowGroupComp){var e=this.gridOptionsWrapper.getRowGroupPanelShow();if(e===l.gTE.ALWAYS)this.rowGroupComp.setDisplayed(!0);else if(e===l.gTE.ONLY_WHEN_GROUPING){var t=!this.columnModel.isRowGroupEmpty();this.rowGroupComp.setDisplayed(t)}else this.rowGroupComp.setDisplayed(!1)}},Ye([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),Ye([l.NqP],n.prototype,"postConstruct",null),n}(l.wA2),lt={moduleName:l.GXE.RowGroupingModule,beans:[Vn,zn,Un,Hn,Yn],agStackComponents:[{componentName:"AgGridHeaderDropZones",componentClass:it}],dependantModules:[z]},gt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),J=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Ke=function(o){gt(n,o);function n(e){return o.call(this,e,!0)||this}return n.prototype.passBeansUp=function(){o.prototype.setBeans.call(this,{gridOptionsWrapper:this.gridOptionsWrapper,eventService:this.eventService,context:this.getContext(),loggerFactory:this.loggerFactory,dragAndDropService:this.dragAndDropService});var e=this.gridOptionsWrapper.getLocaleTextFunc(),t=e("valueColumnsEmptyMessage","Drag here to aggregate"),a=e("values","Values");o.prototype.init.call(this,{dragAndDropIcon:l.jUB.ICON_AGGREGATE,icon:l._.createIconNoSpan("valuePanel",this.gridOptionsWrapper,null),emptyMessage:t,title:a}),this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_VALUE_CHANGED,this.refreshGui.bind(this))},n.prototype.getTooltipParams=function(){var e=o.prototype.getTooltipParams.call(this);return e.location="valueColumnsList",e},n.prototype.getIconName=function(){return this.isPotentialDndColumns()?l.jUB.ICON_AGGREGATE:l.jUB.ICON_NOT_ALLOWED},n.prototype.isColumnDroppable=function(e){return this.gridOptionsWrapper.isFunctionsReadOnly()||!e.isPrimary()?!1:e.isAllowValue()&&!e.isValueActive()},n.prototype.updateColumns=function(e){if(this.gridOptionsWrapper.isFunctionsPassive()){var t={type:l.zW2.EVENT_COLUMN_VALUE_CHANGE_REQUEST,columns:e,api:this.gridApi,columnApi:this.columnApi};this.eventService.dispatchEvent(t)}else this.columnModel.setValueColumns(e,"toolPanelUi")},n.prototype.getExistingColumns=function(){return this.columnModel.getValueColumns()},J([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),J([(0,l.fsG)("loggerFactory")],n.prototype,"loggerFactory",void 0),J([(0,l.fsG)("dragAndDropService")],n.prototype,"dragAndDropService",void 0),J([(0,l.fsG)("columnApi")],n.prototype,"columnApi",void 0),J([(0,l.fsG)("gridApi")],n.prototype,"gridApi",void 0),J([l.NqP],n.prototype,"passBeansUp",null),n}(Ae),st=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Te=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},De=function(o){st(n,o);function n(){return o.call(this,n.TEMPLATE)||this}return n.prototype.postConstruct=function(){this.initialiseTabGuard({})},n.prototype.init=function(e,t,a){this.allowDragging=e,this.params=t,this.eventType=a,this.primaryColsHeaderPanel.init(this.params);var r=this.params.suppressColumnFilter,i=this.params.suppressColumnSelectAll,g=this.params.suppressColumnExpandAll;g&&r&&i&&this.primaryColsHeaderPanel.setDisplayed(!1),this.addManagedListener(this.primaryColsListPanel,"groupExpanded",this.onGroupExpanded.bind(this)),this.addManagedListener(this.primaryColsListPanel,"selectionChanged",this.onSelectionChange.bind(this)),this.primaryColsListPanel.init(this.params,this.allowDragging,this.eventType),this.addManagedListener(this.primaryColsHeaderPanel,"expandAll",this.onExpandAll.bind(this)),this.addManagedListener(this.primaryColsHeaderPanel,"collapseAll",this.onCollapseAll.bind(this)),this.addManagedListener(this.primaryColsHeaderPanel,"selectAll",this.onSelectAll.bind(this)),this.addManagedListener(this.primaryColsHeaderPanel,"unselectAll",this.onUnselectAll.bind(this)),this.addManagedListener(this.primaryColsHeaderPanel,"filterChanged",this.onFilterChanged.bind(this)),this.positionableFeature=new l.Gxm(this.getGui(),{minHeight:100}),this.createManagedBean(this.positionableFeature)},n.prototype.toggleResizable=function(e){this.positionableFeature.setResizable(e?{bottom:!0}:!1)},n.prototype.onExpandAll=function(){this.primaryColsListPanel.doSetExpandedAll(!0)},n.prototype.onCollapseAll=function(){this.primaryColsListPanel.doSetExpandedAll(!1)},n.prototype.expandGroups=function(e){this.primaryColsListPanel.setGroupsExpanded(!0,e)},n.prototype.collapseGroups=function(e){this.primaryColsListPanel.setGroupsExpanded(!1,e)},n.prototype.setColumnLayout=function(e){this.primaryColsListPanel.setColumnLayout(e)},n.prototype.onFilterChanged=function(e){this.primaryColsListPanel.setFilterText(e.filterText)},n.prototype.syncLayoutWithGrid=function(){this.primaryColsListPanel.onColumnsChanged()},n.prototype.onSelectAll=function(){this.primaryColsListPanel.doSetSelectedAll(!0)},n.prototype.onUnselectAll=function(){this.primaryColsListPanel.doSetSelectedAll(!1)},n.prototype.onGroupExpanded=function(e){this.primaryColsHeaderPanel.setExpandState(e.state)},n.prototype.onSelectionChange=function(e){this.primaryColsHeaderPanel.setSelectionState(e.state)},n.TEMPLATE=`<div class="ag-column-select">
            <ag-primary-cols-header ref="primaryColsHeaderPanel"></ag-primary-cols-header>
            <ag-primary-cols-list ref="primaryColsListPanel"></ag-primary-cols-list>
        </div>`,Te([(0,l.cqo)("primaryColsHeaderPanel")],n.prototype,"primaryColsHeaderPanel",void 0),Te([(0,l.cqo)("primaryColsListPanel")],n.prototype,"primaryColsListPanel",void 0),Te([l.NqP],n.prototype,"postConstruct",null),n}(l.BxR),pt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Qe=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},dt=function(o){pt(n,o);function n(){var e=o.call(this,n.TEMPLATE)||this;return e.initialised=!1,e.childDestroyFuncs=[],e}return n.prototype.setVisible=function(e){o.prototype.setDisplayed.call(this,e),e&&!this.initialised&&this.init(this.params)},n.prototype.init=function(e){var t=this,a={suppressColumnMove:!1,suppressColumnSelectAll:!1,suppressColumnFilter:!1,suppressColumnExpandAll:!1,contractColumnSelection:!1,suppressPivotMode:!1,suppressRowGroups:!1,suppressValues:!1,suppressPivots:!1,suppressSyncLayoutWithGrid:!1,api:this.gridApi,columnApi:this.columnApi};if(l._.mergeDeep(a,e),this.params=a,this.isRowGroupingModuleLoaded()&&!this.params.suppressPivotMode&&(this.pivotModePanel=this.createBean(new ze),this.childDestroyFuncs.push(function(){return t.destroyBean(t.pivotModePanel)}),this.appendChild(this.pivotModePanel)),this.primaryColsPanel=this.createBean(new De),this.childDestroyFuncs.push(function(){return t.destroyBean(t.primaryColsPanel)}),this.primaryColsPanel.init(!0,this.params,"toolPanelUi"),l._.addCssClass(this.primaryColsPanel.getGui(),"ag-column-panel-column-select"),this.appendChild(this.primaryColsPanel),this.isRowGroupingModuleLoaded()){this.params.suppressRowGroups||(this.rowGroupDropZonePanel=this.createBean(new Me(!1)),this.childDestroyFuncs.push(function(){return t.destroyBean(t.rowGroupDropZonePanel)}),this.appendChild(this.rowGroupDropZonePanel)),this.params.suppressValues||(this.valuesDropZonePanel=this.createBean(new Ke(!1)),this.childDestroyFuncs.push(function(){return t.destroyBean(t.valuesDropZonePanel)}),this.appendChild(this.valuesDropZonePanel)),this.params.suppressPivots||(this.pivotDropZonePanel=this.createBean(new Ee(!1)),this.childDestroyFuncs.push(function(){return t.destroyBean(t.pivotDropZonePanel)}),this.appendChild(this.pivotDropZonePanel)),this.setLastVisible();var r=this.addManagedListener(this.eventService,l.zW2.EVENT_COLUMN_PIVOT_MODE_CHANGED,function(){t.resetChildrenHeight(),t.setLastVisible()});this.childDestroyFuncs.push(function(){return r()})}this.initialised=!0},n.prototype.setPivotModeSectionVisible=function(e){var t=this;!this.isRowGroupingModuleLoaded()||(this.pivotModePanel?this.pivotModePanel.setDisplayed(e):e&&(this.pivotModePanel=this.createBean(new ze),this.getGui().insertBefore(this.pivotModePanel.getGui(),this.getGui().firstChild),this.childDestroyFuncs.push(function(){return t.destroyBean(t.pivotModePanel)})),this.setLastVisible())},n.prototype.setRowGroupsSectionVisible=function(e){!this.isRowGroupingModuleLoaded()||(this.rowGroupDropZonePanel?this.rowGroupDropZonePanel.setDisplayed(e):e&&(this.rowGroupDropZonePanel=this.createManagedBean(new Me(!1)),this.appendChild(this.rowGroupDropZonePanel)),this.setLastVisible())},n.prototype.setValuesSectionVisible=function(e){!this.isRowGroupingModuleLoaded()||(this.valuesDropZonePanel?this.valuesDropZonePanel.setDisplayed(e):e&&(this.valuesDropZonePanel=this.createManagedBean(new Ke(!1)),this.appendChild(this.valuesDropZonePanel)),this.setLastVisible())},n.prototype.setPivotSectionVisible=function(e){!this.isRowGroupingModuleLoaded()||(this.pivotDropZonePanel?this.pivotDropZonePanel.setDisplayed(e):e&&(this.pivotDropZonePanel=this.createManagedBean(new Ee(!1)),this.appendChild(this.pivotDropZonePanel),this.pivotDropZonePanel.setDisplayed(e)),this.setLastVisible())},n.prototype.setResizers=function(){[this.primaryColsPanel,this.rowGroupDropZonePanel,this.valuesDropZonePanel,this.pivotDropZonePanel].forEach(function(e){if(!!e){var t=e.getGui();e.toggleResizable(!l._.containsClass(t,"ag-last-column-drop")&&!l._.containsClass(t,"ag-hidden"))}})},n.prototype.setLastVisible=function(){var e=this.getGui(),t=Array.prototype.slice.call(e.querySelectorAll(".ag-column-drop"));t.forEach(function(i){return l._.removeCssClass(i,"ag-last-column-drop")});var a=e.querySelectorAll(".ag-column-drop:not(.ag-hidden)"),r=l._.last(a);r&&l._.addCssClass(r,"ag-last-column-drop"),this.setResizers()},n.prototype.resetChildrenHeight=function(){for(var e=this.getGui(),t=e.children,a=0;a<t.length;a++){var r=t[a];r.style.removeProperty("height"),r.style.removeProperty("flex")}},n.prototype.isRowGroupingModuleLoaded=function(){return l.O3h.assertRegistered(l.GXE.RowGroupingModule,"Row Grouping")},n.prototype.expandColumnGroups=function(e){this.primaryColsPanel.expandGroups(e)},n.prototype.collapseColumnGroups=function(e){this.primaryColsPanel.collapseGroups(e)},n.prototype.setColumnLayout=function(e){this.primaryColsPanel.setColumnLayout(e)},n.prototype.syncLayoutWithGrid=function(){this.primaryColsPanel.syncLayoutWithGrid()},n.prototype.destroyChildren=function(){this.childDestroyFuncs.forEach(function(e){return e()}),this.childDestroyFuncs.length=0,l._.clearElement(this.getGui())},n.prototype.refresh=function(){this.destroyChildren(),this.init(this.params)},n.prototype.destroy=function(){this.destroyChildren(),o.prototype.destroy.call(this)},n.TEMPLATE='<div class="ag-column-panel"></div>',Qe([(0,l.fsG)("gridApi")],n.prototype,"gridApi",void 0),Qe([(0,l.fsG)("columnApi")],n.prototype,"columnApi",void 0),n}(l.wA2),ct=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Xe=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},qe=function(o){ct(n,o);function n(){var e=o.call(this,'<div class="ag-tool-panel-horizontal-resize"></div>')||this;return e.minWidth=100,e.maxWidth=null,e}return n.prototype.setElementToResize=function(e){this.elementToResize=e},n.prototype.postConstruct=function(){var e=this.horizontalResizeService.addResizeBar({eResizeBar:this.getGui(),dragStartPixels:1,onResizeStart:this.onResizeStart.bind(this),onResizing:this.onResizing.bind(this),onResizeEnd:this.onResizing.bind(this)});this.addDestroyFunc(e),this.setInverted(this.gridOptionsWrapper.isEnableRtl())},n.prototype.onResizeStart=function(){this.startingWidth=this.elementToResize.offsetWidth},n.prototype.onResizing=function(e){var t=this.inverted?-1:1,a=Math.max(this.minWidth,Math.floor(this.startingWidth-e*t));this.maxWidth!=null&&(a=Math.min(this.maxWidth,a)),this.elementToResize.style.width=a+"px"},n.prototype.setInverted=function(e){this.inverted=e},n.prototype.setMaxWidth=function(e){this.maxWidth=e},n.prototype.setMinWidth=function(e){e!=null?this.minWidth=e:this.minWidth=100},Xe([(0,l.fsG)("horizontalResizeService")],n.prototype,"horizontalResizeService",void 0),Xe([l.NqP],n.prototype,"postConstruct",null),n}(l.wA2),ut=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Se=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Je=function(o){ut(n,o);function n(e){var t=o.call(this)||this;return t.toolPanelDef=e,t}return n.prototype.getToolPanelId=function(){return this.toolPanelDef.id},n.prototype.postConstruct=function(){var e=this.createTemplate();this.setTemplate(e),this.eIconWrapper.insertAdjacentElement("afterbegin",l._.createIconNoSpan(this.toolPanelDef.iconKey,this.gridOptionsWrapper)),this.addManagedListener(this.eToggleButton,"click",this.onButtonPressed.bind(this))},n.prototype.createTemplate=function(){var e=this.gridOptionsWrapper.getLocaleTextFunc(),t=this.toolPanelDef,a=e(t.labelKey,t.labelDefault),r=`<div class="ag-side-button" role="presentation">
                <button type="button" ref="eToggleButton" tabindex="-1" role="tab" class="ag-side-button-button">
                    <div ref="eIconWrapper" class="ag-side-button-icon-wrapper" aria-hidden="true"></div>
                    <span class="ag-side-button-label">`+a+`</span>
                </button>
            </div>`;return r},n.prototype.onButtonPressed=function(){this.dispatchEvent({type:n.EVENT_TOGGLE_BUTTON_CLICKED})},n.prototype.setSelected=function(e){this.addOrRemoveCssClass("ag-selected",e)},n.EVENT_TOGGLE_BUTTON_CLICKED="toggleButtonClicked",Se([(0,l.cqo)("eToggleButton")],n.prototype,"eToggleButton",void 0),Se([(0,l.cqo)("eIconWrapper")],n.prototype,"eIconWrapper",void 0),Se([l.NqP],n.prototype,"postConstruct",null),n}(l.wA2),ht=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),pe=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},$e=function(o){ht(n,o);function n(){var e=o.call(this,n.TEMPLATE)||this;return e.buttonComps=[],e}return n.prototype.postConstruct=function(){this.addManagedListener(this.getFocusableElement(),"keydown",this.handleKeyDown.bind(this))},n.prototype.handleKeyDown=function(e){if(!(e.keyCode!==l.VDZ.TAB||!e.shiftKey)){var t=l._.last(this.columnModel.getAllDisplayedColumns());this.focusService.focusGridView(t,!0)&&e.preventDefault()}},n.prototype.setToolPanelDefs=function(e){e.forEach(this.addButtonComp.bind(this))},n.prototype.setActiveButton=function(e){this.buttonComps.forEach(function(t){t.setSelected(e===t.getToolPanelId())})},n.prototype.addButtonComp=function(e){var t=this,a=this.createBean(new Je(e));this.buttonComps.push(a),this.appendChild(a),a.addEventListener(Je.EVENT_TOGGLE_BUTTON_CLICKED,function(){t.dispatchEvent({type:n.EVENT_SIDE_BAR_BUTTON_CLICKED,toolPanelId:e.id})})},n.prototype.clearButtons=function(){this.buttonComps=this.destroyBeans(this.buttonComps),l._.clearElement(this.getGui())},n.EVENT_SIDE_BAR_BUTTON_CLICKED="sideBarButtonClicked",n.TEMPLATE='<div class="ag-side-buttons" role="tablist"></div>',pe([(0,l.fsG)("focusService")],n.prototype,"focusService",void 0),pe([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),pe([l.NqP],n.prototype,"postConstruct",null),pe([l.FXL],n.prototype,"clearButtons",null),n}(l.wA2),mt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),en=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},ft=function(o){mt(n,o);function n(){return o.call(this,n.TEMPLATE)||this}return n.prototype.setupResize=function(){var e=this.getGui(),t=this.resizeBar=new qe;this.getContext().createBean(t),t.setElementToResize(e),this.appendChild(t)},n.prototype.getToolPanelId=function(){return this.toolPanelId},n.prototype.setToolPanelDef=function(e){var t=e.id,a=e.minWidth,r=e.maxWidth,i=e.width;this.toolPanelId=t,this.width=i;var g={api:this.gridOptionsWrapper.getApi(),columnApi:this.gridOptionsWrapper.getColumnApi()},p=this.userComponentFactory.newToolPanelComponent(e,g);p!=null&&(p.then(this.setToolPanelComponent.bind(this)),a!=null&&this.resizeBar.setMinWidth(a),r!=null&&this.resizeBar.setMaxWidth(r))},n.prototype.setToolPanelComponent=function(e){var t=this;this.toolPanelCompInstance=e,this.appendChild(e.getGui()),this.addDestroyFunc(function(){t.destroyBean(e)}),this.width&&(this.getGui().style.width=this.width+"px")},n.prototype.getToolPanelInstance=function(){return this.toolPanelCompInstance},n.prototype.setResizerSizerSide=function(e){var t=this.gridOptionsWrapper.isEnableRtl(),a=e==="left",r=t?a:!a;this.resizeBar.setInverted(r)},n.prototype.refresh=function(){this.toolPanelCompInstance.refresh()},n.TEMPLATE='<div class="ag-tool-panel-wrapper"/>',en([(0,l.fsG)("userComponentFactory")],n.prototype,"userComponentFactory",void 0),en([l.NqP],n.prototype,"setupResize",null),n}(l.wA2),vt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),de=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},bt=function(o){vt(n,o);function n(){var e=o.call(this,n.TEMPLATE)||this;return e.toolPanelWrappers=[],e}return n.prototype.postConstruct=function(){var e=this;this.sideBarButtonsComp.addEventListener($e.EVENT_SIDE_BAR_BUTTON_CLICKED,this.onToolPanelButtonClicked.bind(this)),this.setSideBarDef(),this.gridOptionsWrapper.addEventListener("sideBar",function(){e.clearDownUi(),e.setSideBarDef()}),this.gridApi.registerSideBarComp(this),this.createManagedBean(new l.D_6(this.getFocusableElement(),{onTabKeyDown:this.onTabKeyDown.bind(this),handleKeyDown:this.handleKeyDown.bind(this)}))},n.prototype.onTabKeyDown=function(e){if(!e.defaultPrevented){var t=this,a=t.focusService,r=t.sideBarButtonsComp,i=this.getGui(),g=r.getGui(),p=document.activeElement,s=i.querySelector(".ag-tool-panel-wrapper:not(.ag-hidden)");if(!!s){if(g.contains(p))a.focusInto(s,e.shiftKey)&&e.preventDefault();else if(!a.isFocusUnderManagedComponent(s)&&e.shiftKey){var d=a.findFocusableElements(s)[0];if(document.activeElement===d){var c=g.querySelector(".ag-selected button");c&&(e.preventDefault(),c.focus())}}}}},n.prototype.handleKeyDown=function(e){if(!!this.sideBarButtonsComp.getGui().contains(document.activeElement)){var t=this.sideBarButtonsComp.getGui(),a=Array.prototype.slice.call(t.querySelectorAll(".ag-side-button")),r=document.activeElement,i=l._.findIndex(a,function(s){return s.contains(r)}),g=null;switch(e.keyCode){case l.VDZ.LEFT:case l.VDZ.UP:g=Math.max(0,i-1);break;case l.VDZ.RIGHT:case l.VDZ.DOWN:g=Math.min(i+1,a.length-1);break}if(g!==null){var p=a[g].querySelector("button");p&&(p.focus(),e.preventDefault())}}},n.prototype.onToolPanelButtonClicked=function(e){var t=e.toolPanelId,a=this.openedItem();a===t?this.openToolPanel(void 0):this.openToolPanel(t)},n.prototype.clearDownUi=function(){this.sideBarButtonsComp.clearButtons(),this.destroyToolPanelWrappers()},n.prototype.setSideBarDef=function(){this.setDisplayed(!1);var e=this.gridOptionsWrapper.getSideBar(),t=!!e&&!!e.toolPanels;if(!!t){var a=t&&!e.hiddenByDefault;this.setDisplayed(a);var r=e.toolPanels;this.sideBarButtonsComp.setToolPanelDefs(r),this.setupToolPanels(r),this.setSideBarPosition(e.position),e.hiddenByDefault||this.openToolPanel(e.defaultToolPanel)}},n.prototype.setSideBarPosition=function(e){e||(e="right");var t=e==="left",a=t?"right":"left",r=this.getGui();return l._.addOrRemoveCssClass(r,"ag-side-bar-left",t),l._.addOrRemoveCssClass(r,"ag-side-bar-right",!t),this.toolPanelWrappers.forEach(function(i){i.setResizerSizerSide(a)}),this},n.prototype.setupToolPanels=function(e){var t=this;e.forEach(function(a){if(a.id!=null){if(a.toolPanel==="agColumnsToolPanel"){var r=!l.O3h.assertRegistered(l.GXE.ColumnToolPanelModule,"Column Tool Panel");if(r)return}if(a.toolPanel==="agFiltersToolPanel"){var r=!l.O3h.assertRegistered(l.GXE.FiltersToolPanelModule,"Filters Tool Panel");if(r)return}var i=new ft;t.getContext().createBean(i),i.setToolPanelDef(a),i.setDisplayed(!1),t.getGui().appendChild(i.getGui()),t.toolPanelWrappers.push(i)}})},n.prototype.refresh=function(){this.toolPanelWrappers.forEach(function(e){return e.refresh()})},n.prototype.openToolPanel=function(e){var t=this.openedItem();if(t!==e){this.toolPanelWrappers.forEach(function(i){var g=e===i.getToolPanelId();i.setDisplayed(g)});var a=this.openedItem(),r=t!==a;r&&(this.sideBarButtonsComp.setActiveButton(e),this.raiseToolPanelVisibleEvent(e))}},n.prototype.getToolPanelInstance=function(e){var t=this.toolPanelWrappers.filter(function(a){return a.getToolPanelId()===e})[0];if(!!t)return t.getToolPanelInstance()},n.prototype.raiseToolPanelVisibleEvent=function(e){var t={type:l.zW2.EVENT_TOOL_PANEL_VISIBLE_CHANGED,source:e,api:this.gridOptionsWrapper.getApi(),columnApi:this.gridOptionsWrapper.getColumnApi()};this.eventService.dispatchEvent(t)},n.prototype.close=function(){this.openToolPanel(void 0)},n.prototype.isToolPanelShowing=function(){return!!this.openedItem()},n.prototype.openedItem=function(){var e=null;return this.toolPanelWrappers.forEach(function(t){t.isDisplayed()&&(e=t.getToolPanelId())}),e},n.prototype.destroyToolPanelWrappers=function(){var e=this;this.toolPanelWrappers.forEach(function(t){l._.removeFromParent(t.getGui()),e.destroyBean(t)}),this.toolPanelWrappers.length=0},n.prototype.destroy=function(){this.destroyToolPanelWrappers(),o.prototype.destroy.call(this)},n.TEMPLATE=`<div class="ag-side-bar ag-unselectable">
            <ag-side-bar-buttons ref="sideBarButtons"></ag-side-bar-buttons>
        </div>`,de([(0,l.fsG)("gridApi")],n.prototype,"gridApi",void 0),de([(0,l.fsG)("focusService")],n.prototype,"focusService",void 0),de([(0,l.cqo)("sideBarButtons")],n.prototype,"sideBarButtonsComp",void 0),de([l.NqP],n.prototype,"postConstruct",null),n}(l.wA2),wt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),nn=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},xt=function(o){wt(n,o);function n(){var e=o!==null&&o.apply(this,arguments)||this;return e.isColGroupDef=function(t){return t&&typeof t.children<"u"},e.getId=function(t){return e.isColGroupDef(t)?t.groupId:t.colId},e}return n.prototype.createColumnTree=function(e){var t=this,a=[],r=function(g,p){if(t.isColGroupDef(g)){var s=g,d=typeof s.groupId<"u"?s.groupId:s.headerName,c=new l.KTm(s,d,!1,p),u=[];return s.children.forEach(function(b){var x=r(b,p+1);x&&u.push(x)}),c.setChildren(u),c}else{var h=g,m=h.colId?h.colId:h.field,f=t.columnModel.getPrimaryColumn(m);return f||a.push(h),f}},i=[];return e.forEach(function(g){var p=r(g,0);p&&i.push(p)}),a.length>0,i},n.prototype.syncLayoutWithGrid=function(e){var t=this.getLeafPathTrees(),a=this.mergeLeafPathTrees(t);e(a)},n.prototype.getLeafPathTrees=function(){var e=function(r,i){var g;if(r instanceof l.KTm)if(r.isPadding())g=i;else{var p=l._.assign({},r.getColGroupDef());p.groupId=r.getGroupId(),p.children=[i],g=p}else{var s=l._.assign({},r.getColDef());s.colId=r.getColId(),g=s}var d=r.getOriginalParent();return d?e(d,g):g},t=this.columnModel.getAllGridColumns(),a=t.filter(function(r){var i=r.getColDef();return r.isPrimary()&&!i.showRowGroup});return a.map(function(r){return e(r,r.getColDef())})},n.prototype.mergeLeafPathTrees=function(e){for(var t=this,a=function(c){var u=c;return u.children?u.groupId+a(u.children[0]):""},r=function(c,u){var h=t.isColGroupDef(c)&&t.isColGroupDef(u);return h&&t.getId(c)===t.getId(u)},i=function(c,u){if(!t.isColGroupDef(u))return c;var h=c,m=u;if(m.children&&m.groupId){var f=t.addChildrenToGroup(h,m.groupId,m.children[0]);if(f)return h}return m.children.forEach(function(b){return i(h,b)}),h},g=[],p=1;p<=e.length;p++){var s=e[p-1],d=e[p];r(s,d)?e[p]=i(s,d):g.push(s)}return g},n.prototype.addChildrenToGroup=function(e,t,a){var r=this,i=function(c,u){var h=c.children.map(r.getId),m=l._.includes(h,r.getId(u)),f=l._.last(c.children),b=f&&r.getId(f)!==r.getId(u);return m&&b};if(!this.isColGroupDef(e))return!0;var g=e,p=a;if(i(g,p))return g.children.push(p),!0;if(g.groupId===t){var s=g.children.map(this.getId),d=l._.includes(s,this.getId(p));if(!d)return g.children.push(p),!0}return g.children.forEach(function(c){return r.addChildrenToGroup(c,t,a)}),!1},nn([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),n=nn([(0,l.Vu6)("toolPanelColDefService")],n),n}(l.AS9),yt={moduleName:l.GXE.SideBarModule,beans:[xt],agStackComponents:[{componentName:"AgHorizontalResize",componentClass:qe},{componentName:"AgSideBar",componentClass:bt},{componentName:"AgSideBarButtons",componentClass:$e}],dependantModules:[z]},B=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Ct=function(){function o(){}return o.prototype.selectAllChildren=function(n,e,t){var a=this.extractAllLeafColumns(n);this.setAllColumns(a,e,t)},o.prototype.setColumn=function(n,e,t){this.setAllColumns([n],e,t)},o.prototype.setAllColumns=function(n,e,t){this.columnModel.isPivotMode()?this.setAllPivot(n,e,t):this.setAllVisible(n,e,t)},o.prototype.extractAllLeafColumns=function(n){var e=[],t=function(a){a.forEach(function(r){!r.isPassesFilter()||(r.isGroup()?t(r.getChildren()):e.push(r.getColumn()))})};return t(n),e},o.prototype.setAllVisible=function(n,e,t){var a=[];n.forEach(function(r){r.getColDef().lockVisible||r.isVisible()!=e&&a.push({colId:r.getId(),hide:!e})}),a.length>0&&this.columnModel.applyColumnState({state:a},t)},o.prototype.setAllPivot=function(n,e,t){this.gridOptionsWrapper.isFunctionsPassive()?this.setAllPivotPassive(n,e):this.setAllPivotActive(n,e,t)},o.prototype.setAllPivotPassive=function(n,e){var t=this.columnModel.getPivotColumns().slice(),a=this.columnModel.getValueColumns().slice(),r=this.columnModel.getRowGroupColumns().slice(),i=!1,g=!1,p=!1,s=function(f){f.isAnyFunctionActive()||(f.isAllowValue()?(a.push(f),g=!0):f.isAllowRowGroup()?(r.push(f),i=!0):f.isAllowPivot()&&(t.push(f),p=!0))},d=function(f){!f.isAnyFunctionActive()||(t.indexOf(f)>=0&&(l._.removeFromArray(t,f),i=!0),a.indexOf(f)>=0&&(l._.removeFromArray(a,f),g=!0),r.indexOf(f)>=0&&(l._.removeFromArray(r,f),p=!0))},c=e?s:d;if(n.forEach(c),i){var u={type:l.zW2.EVENT_COLUMN_PIVOT_CHANGE_REQUEST,columns:t,api:this.gridApi,columnApi:this.columnApi};this.eventService.dispatchEvent(u)}if(p){var h={type:l.zW2.EVENT_COLUMN_ROW_GROUP_CHANGE_REQUEST,columns:r,api:this.gridApi,columnApi:this.columnApi};this.eventService.dispatchEvent(h)}if(g){var m={type:l.zW2.EVENT_COLUMN_VALUE_CHANGE_REQUEST,columns:r,api:this.gridApi,columnApi:this.columnApi};this.eventService.dispatchEvent(m)}},o.prototype.setAllPivotActive=function(n,e,t){var a=this,r=[],i=function(s){if(!s.isAnyFunctionActive())if(s.isAllowValue()){var d=typeof s.getAggFunc()=="string"?s.getAggFunc():a.aggFuncService.getDefaultAggFunc(s);r.push({colId:s.getId(),aggFunc:d})}else s.isAllowRowGroup()?r.push({colId:s.getId(),rowGroup:!0}):s.isAllowPivot()&&r.push({colId:s.getId(),pivot:!0})},g=function(s){var d=s.isPivotActive()||s.isRowGroupActive()||s.isValueActive();d&&r.push({colId:s.getId(),pivot:!1,rowGroup:!1,aggFunc:null})},p=e?i:g;n.forEach(p),r.length>0&&this.columnModel.applyColumnState({state:r},t)},B([(0,l.fsG)("aggFuncService")],o.prototype,"aggFuncService",void 0),B([(0,l.fsG)("columnModel")],o.prototype,"columnModel",void 0),B([(0,l.fsG)("gridOptionsWrapper")],o.prototype,"gridOptionsWrapper",void 0),B([(0,l.fsG)("columnApi")],o.prototype,"columnApi",void 0),B([(0,l.fsG)("gridApi")],o.prototype,"gridApi",void 0),B([(0,l.fsG)("eventService")],o.prototype,"eventService",void 0),o=B([(0,l.Vu6)("modelItemUtils")],o),o}(),_t={moduleName:l.GXE.ColumnToolPanelModule,beans:[Ct],agStackComponents:[{componentName:"AgPrimaryColsHeader",componentClass:Tn},{componentName:"AgPrimaryColsList",componentClass:Rn},{componentName:"AgPrimaryCols",componentClass:De}],userComponents:[{componentName:"agColumnsToolPanel",componentClass:dt}],dependantModules:[z,lt,yt]},At=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Mt=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Et=function(o){At(n,o);function n(e){var t=o.call(this)||this;return t.wrappedComponent=e,t.setTemplateFromElement(e.getGui()),t}return n.prototype.postConstruct=function(){var e=this;this.initialiseTabGuard({onTabKeyDown:function(t){return e.onTabKeyDown(t)},handleKeyDown:function(t){return e.handleKeyDown(t)}})},n.prototype.handleKeyDown=function(e){e.keyCode===l.VDZ.ESCAPE&&this.closePanel()},n.prototype.onTabKeyDown=function(e){e.defaultPrevented||(this.closePanel(),e.preventDefault())},n.prototype.closePanel=function(){var e=this.parentComponent;e.closeSubMenu(),setTimeout(function(){return e.getGui().focus()},0)},Mt([l.NqP],n.prototype,"postConstruct",null),n}(l.BxR),Tt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),tn=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},k=function(o){Tt(n,o);function n(e){var t=o.call(this)||this;return t.params=e,t.isActive=!1,t.subMenuIsOpen=!1,t.setTemplate('<div class="'+t.getClassName()+'" tabindex="-1" role="treeitem"></div>'),t}return n.prototype.init=function(){var e=this;this.addIcon(),this.addName(),this.addShortcut(),this.addSubMenu(),this.addTooltip();var t=this.getGui();this.params.disabled?(this.addCssClass(this.getClassName("disabled")),l._.setAriaDisabled(t,!0)):(this.addGuiEventListener("click",function(a){return e.onItemSelected(a)}),this.addGuiEventListener("keydown",function(a){(a.keyCode===l.VDZ.ENTER||a.keyCode===l.VDZ.SPACE)&&(a.preventDefault(),e.onItemSelected(a))}),this.addGuiEventListener("mouseenter",function(){return e.onMouseEnter()}),this.addGuiEventListener("mouseleave",function(){return e.onMouseLeave()})),this.params.cssClasses&&this.params.cssClasses.forEach(function(a){return l._.addCssClass(t,a)})},n.prototype.isDisabled=function(){return!!this.params.disabled},n.prototype.openSubMenu=function(e){var t=this;if(e===void 0&&(e=!1),this.closeSubMenu(),!!this.params.subMenu){var a=l._.loadTemplate('<div class="ag-menu" role="presentation"></div>'),r;if(this.params.subMenu instanceof Array){var i=l._.getAriaLevel(this.getGui()),g=isNaN(i)?1:i+1,p=this.createBean(new Pe(g));p.setParentComponent(this),p.addMenuItems(this.params.subMenu),a.appendChild(p.getGui()),this.addManagedListener(p,n.EVENT_MENU_ITEM_SELECTED,function(y){return t.dispatchEvent(y)}),p.addGuiEventListener("mouseenter",function(){return t.cancelDeactivate()}),r=function(){return t.destroyBean(p)},e&&setTimeout(function(){return p.activateFirstItem()},0)}else{var s=this.params.subMenu,d=this.createBean(new Et(s));d.setParentComponent(this);var c=d.getGui(),u="mouseenter",h=function(){return t.cancelDeactivate()};c.addEventListener(u,h),r=function(){return c.removeEventListener(u,h)},a.appendChild(c),s.afterGuiAttached&&setTimeout(function(){return s.afterGuiAttached()},0)}var m=this.getGui(),f=this.popupService.positionPopupForMenu.bind(this.popupService,{eventSource:m,ePopup:a}),b=this.gridOptionsWrapper.getLocaleTextFunc(),x=this.popupService.addPopup({modal:!0,eChild:a,positionCallback:f,anchorToElement:m,ariaLabel:b("ariaLabelSubMenu","SubMenu")});this.subMenuIsOpen=!0,l._.setAriaExpanded(m,!0),this.hideSubMenu=function(){x&&x.hideFunc(),t.subMenuIsOpen=!1,l._.setAriaExpanded(m,!1),r()}}},n.prototype.closeSubMenu=function(){!this.hideSubMenu||(this.hideSubMenu(),this.hideSubMenu=null,l._.setAriaExpanded(this.getGui(),!1))},n.prototype.isSubMenuOpen=function(){return this.subMenuIsOpen},n.prototype.activate=function(e){var t=this;this.cancelActivate(),!this.params.disabled&&(this.isActive=!0,this.addCssClass(this.getClassName("active")),this.getGui().focus(),e&&this.params.subMenu&&window.setTimeout(function(){t.isAlive()&&t.isActive&&t.openSubMenu()},300),this.onItemActivated())},n.prototype.deactivate=function(){this.cancelDeactivate(),this.removeCssClass(this.getClassName("active")),this.isActive=!1,this.subMenuIsOpen&&this.hideSubMenu()},n.prototype.addIcon=function(){if(!(!this.params.checked&&!this.params.icon&&this.params.isCompact)){var e=l._.loadTemplate('<span ref="eIcon" class="'+this.getClassName("part")+" "+this.getClassName("icon")+'" role="presentation"></span>');this.params.checked?e.appendChild(l._.createIconNoSpan("check",this.gridOptionsWrapper)):this.params.icon&&(l._.isNodeOrElement(this.params.icon)?e.appendChild(this.params.icon):typeof this.params.icon=="string"&&(e.innerHTML=this.params.icon)),this.getGui().appendChild(e)}},n.prototype.addName=function(){if(!(!this.params.name&&this.params.isCompact)){var e=l._.loadTemplate('<span ref="eName" class="'+this.getClassName("part")+" "+this.getClassName("text")+'">'+(this.params.name||"")+"</span>");this.getGui().appendChild(e)}},n.prototype.addTooltip=function(){!this.params.tooltip||(this.tooltip=this.params.tooltip,this.gridOptionsWrapper.isEnableBrowserTooltips()?this.getGui().setAttribute("title",this.tooltip):this.createManagedBean(new l.oMw(this)))},n.prototype.getTooltipParams=function(){return{location:"menu",value:this.tooltip}},n.prototype.addShortcut=function(){if(!(!this.params.shortcut&&this.params.isCompact)){var e=l._.loadTemplate('<span ref="eShortcut" class="'+this.getClassName("part")+" "+this.getClassName("shortcut")+'">'+(this.params.shortcut||"")+"</span>");this.getGui().appendChild(e)}},n.prototype.addSubMenu=function(){if(!(!this.params.subMenu&&this.params.isCompact)){var e=l._.loadTemplate('<span ref="ePopupPointer" class="'+this.getClassName("part")+" "+this.getClassName("popup-pointer")+'"></span>'),t=this.getGui();if(this.params.subMenu){var a=this.gridOptionsWrapper.isEnableRtl()?"smallLeft":"smallRight";l._.setAriaExpanded(t,!1),e.appendChild(l._.createIconNoSpan(a,this.gridOptionsWrapper))}t.appendChild(e)}},n.prototype.onItemSelected=function(e){if(this.params.action?this.params.action():this.openSubMenu(e&&e.type==="keydown"),!(this.params.subMenu&&!this.params.action)){var t={type:n.EVENT_MENU_ITEM_SELECTED,action:this.params.action,checked:this.params.checked,cssClasses:this.params.cssClasses,disabled:this.params.disabled,icon:this.params.icon,name:this.params.name,shortcut:this.params.shortcut,subMenu:this.params.subMenu,tooltip:this.params.tooltip,event:e};this.dispatchEvent(t)}},n.prototype.onItemActivated=function(){var e={type:n.EVENT_MENU_ITEM_ACTIVATED,menuItem:this};this.dispatchEvent(e)},n.prototype.cancelActivate=function(){this.activateTimeoutId&&(window.clearTimeout(this.activateTimeoutId),this.activateTimeoutId=0)},n.prototype.cancelDeactivate=function(){this.deactivateTimeoutId&&(window.clearTimeout(this.deactivateTimeoutId),this.deactivateTimeoutId=0)},n.prototype.onMouseEnter=function(){var e=this;this.cancelDeactivate(),this.params.isAnotherSubMenuOpen()?this.activateTimeoutId=window.setTimeout(function(){return e.activate(!0)},n.ACTIVATION_DELAY):this.activate(!0)},n.prototype.onMouseLeave=function(){var e=this;this.cancelActivate(),this.isSubMenuOpen()?this.deactivateTimeoutId=window.setTimeout(function(){return e.deactivate()},n.ACTIVATION_DELAY):this.deactivate()},n.prototype.getClassName=function(e){var t=this.params.isCompact?"ag-compact-menu-option":"ag-menu-option";return e?t+"-"+e:t},n.EVENT_MENU_ITEM_SELECTED="menuItemSelected",n.EVENT_MENU_ITEM_ACTIVATED="menuItemActivated",n.ACTIVATION_DELAY=80,tn([(0,l.fsG)("popupService")],n.prototype,"popupService",void 0),tn([l.NqP],n.prototype,"init",null),n}(l.wA2),Dt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),ce=function(){return ce=Object.assign||function(o){for(var n,e=1,t=arguments.length;e<t;e++){n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(o[a]=n[a])}return o},ce.apply(this,arguments)},an=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Pe=function(o){Dt(n,o);function n(e){e===void 0&&(e=1);var t=o.call(this,'<div class="ag-menu-list" role="tree"></div>')||this;return t.level=e,t.menuItems=[],t}return n.prototype.postConstruct=function(){var e=this;this.initialiseTabGuard({onTabKeyDown:function(t){return e.onTabKeyDown(t)},handleKeyDown:function(t){return e.handleKeyDown(t)}})},n.prototype.onTabKeyDown=function(e){var t=this.getParentComponent(),a=t&&t.getGui(),r=a&&l._.containsClass(a,"ag-focus-managed");r||e.preventDefault(),e.shiftKey&&this.closeIfIsChild(e)},n.prototype.handleKeyDown=function(e){switch(e.keyCode){case l.VDZ.UP:case l.VDZ.RIGHT:case l.VDZ.DOWN:case l.VDZ.LEFT:e.preventDefault(),this.handleNavKey(e.keyCode);break;case l.VDZ.ESCAPE:var t=this.findTopMenu();t&&this.focusService.focusInto(t.getGui());break}},n.prototype.clearActiveItem=function(){this.activeMenuItem&&(this.activeMenuItem.deactivate(),this.activeMenuItem=null)},n.prototype.addMenuItems=function(e){var t=this;e?.forEach(function(a){a==="separator"?t.addSeparator():typeof a=="string"||t.addItem(a)})},n.prototype.addItem=function(e){var t=this,a=this.createManagedBean(new k(ce(ce({},e),{isAnotherSubMenuOpen:function(){return l._.some(t.menuItems,function(r){return r.isSubMenuOpen()})}})));a.setParentComponent(this),l._.setAriaLevel(a.getGui(),this.level),this.menuItems.push(a),this.appendChild(a.getGui()),this.addManagedListener(a,k.EVENT_MENU_ITEM_SELECTED,function(r){t.dispatchEvent(r)}),this.addManagedListener(a,k.EVENT_MENU_ITEM_ACTIVATED,function(r){t.activeMenuItem&&t.activeMenuItem!==r.menuItem&&t.activeMenuItem.deactivate(),t.activeMenuItem=r.menuItem})},n.prototype.activateFirstItem=function(){var e=this.menuItems.filter(function(t){return!t.isDisabled()})[0];!e||e.activate()},n.prototype.addSeparator=function(){var e=`
            <div class="ag-menu-separator" aria-hidden="true">
                <div class="ag-menu-separator-part"></div>
                <div class="ag-menu-separator-part"></div>
                <div class="ag-menu-separator-part"></div>
                <div class="ag-menu-separator-part"></div>
            </div>`;this.appendChild(l._.loadTemplate(e))},n.prototype.findTopMenu=function(){var e=this.getParentComponent();if(!e&&this instanceof n)return this;for(;;){var t=e&&e.getParentComponent&&e.getParentComponent();if(!t||!(t instanceof n||t instanceof k))break;e=t}return e instanceof n?e:void 0},n.prototype.handleNavKey=function(e){switch(e){case l.VDZ.UP:case l.VDZ.DOWN:var t=this.findNextItem(e===l.VDZ.UP);t&&t!==this.activeMenuItem&&t.activate();return}var a=this.gridOptionsWrapper.isEnableRtl()?l.VDZ.RIGHT:l.VDZ.LEFT;e===a?this.closeIfIsChild():this.openChild()},n.prototype.closeIfIsChild=function(e){var t=this.getParentComponent();t&&t instanceof k&&(e&&e.preventDefault(),t.closeSubMenu(),t.getGui().focus())},n.prototype.openChild=function(){this.activeMenuItem&&this.activeMenuItem.openSubMenu(!0)},n.prototype.findNextItem=function(e){var t=this.menuItems.filter(function(p){return!p.isDisabled()});if(!!t.length){if(!this.activeMenuItem)return e?l._.last(t):t[0];e&&t.reverse();for(var a,r=!1,i=0;i<t.length;i++){var g=t[i];if(!r){g===this.activeMenuItem&&(r=!0);continue}a=g;break}return a||this.activeMenuItem}},n.prototype.destroy=function(){this.clearActiveItem(),o.prototype.destroy.call(this)},an([(0,l.fsG)("focusService")],n.prototype,"focusService",void 0),an([l.NqP],n.prototype,"postConstruct",null),n}(l.BxR),rn=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),P=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},St=function(o){rn(n,o);function n(){return o!==null&&o.apply(this,arguments)||this}return n.prototype.hideActiveMenu=function(){this.destroyBean(this.activeMenu)},n.prototype.showMenuAfterMouseEvent=function(e,t,a){var r=this;this.showMenu(e,function(i){var g=i.getGui();r.popupService.positionPopupUnderMouseEvent({type:"columnMenu",column:e,mouseEvent:t,ePopup:g}),a&&i.showTab(a)},"columnMenu",a,void 0,t.target)},n.prototype.showMenuAfterButtonClick=function(e,t,a,r,i){var g=this,p=-1,s="left";this.gridOptionsWrapper.isEnableRtl()&&(p=1,s="right"),this.showMenu(e,function(d){var c=d.getGui();g.popupService.positionPopupUnderComponent({type:a,column:e,eventSource:t,ePopup:c,alignSide:s,nudgeX:9*p,nudgeY:-23,keepWithinBounds:!0}),r&&d.showTab(r)},a,r,i,t)},n.prototype.showMenu=function(e,t,a,r,i,g){var p=this,s=this.createBean(new Oe(e,this.lastSelectedTab,i)),d=s.getGui(),c=g||this.ctrlsService.getGridBodyCtrl().getGui(),u=[];u.push(function(b){p.destroyBean(s),e.setMenuVisible(!1,"contextMenu");var x=b instanceof KeyboardEvent;if(x&&g&&l._.isVisible(g)){var y=p.focusService.findTabbableParent(g);y&&y.focus()}});var h=this.gridOptionsWrapper.getLocaleTextFunc(),m=this.popupService.addPopup({modal:!0,eChild:d,closeOnEsc:!0,closedCallback:function(b){u.forEach(function(x){return x(b)})},afterGuiAttached:function(b){return s.afterGuiAttached(l._.assign({},{container:a},b))},positionCallback:function(){return t(s)},anchorToElement:c,ariaLabel:h("ariaLabelColumnMenu","Column Menu")});if(m){var f=m.stopAnchoringPromise;f&&f.then(function(b){e.addEventListener(l.sgG.EVENT_LEFT_CHANGED,b),e.addEventListener(l.sgG.EVENT_VISIBLE_CHANGED,b),u.push(function(){e.removeEventListener(l.sgG.EVENT_LEFT_CHANGED,b),e.removeEventListener(l.sgG.EVENT_VISIBLE_CHANGED,b)})})}r||(s.showTabBasedOnPreviousSelection(),t(s)),s.addEventListener(Oe.EVENT_TAB_SELECTED,function(b){p.lastSelectedTab=b.key}),e.setMenuVisible(!0,"contextMenu"),this.activeMenu=s,s.addEventListener(l.AS9.EVENT_DESTROYED,function(){p.activeMenu===s&&(p.activeMenu=null)})},n.prototype.isMenuEnabled=function(e){return e.getMenuTabs(Oe.TABS_DEFAULT).length>0},P([(0,l.fsG)("popupService")],n.prototype,"popupService",void 0),P([(0,l.fsG)("focusService")],n.prototype,"focusService",void 0),P([(0,l.fsG)("ctrlsService")],n.prototype,"ctrlsService",void 0),n=P([(0,l.Vu6)("menuFactory")],n),n}(l.AS9),Oe=function(o){rn(n,o);function n(e,t,a){var r=o.call(this)||this;return r.tabFactories={},r.includeChecks={},r.column=e,r.initialSelection=t,r.tabFactories[n.TAB_GENERAL]=r.createMainPanel.bind(r),r.tabFactories[n.TAB_FILTER]=r.createFilterPanel.bind(r),r.tabFactories[n.TAB_COLUMNS]=r.createColumnsPanel.bind(r),r.includeChecks[n.TAB_GENERAL]=function(){return!0},r.includeChecks[n.TAB_FILTER]=function(){return e.isFilterAllowed()},r.includeChecks[n.TAB_COLUMNS]=function(){return!0},r.restrictTo=a,r}return n.prototype.init=function(){var e=this,t=this.getTabsToCreate().map(function(a){return e.createTab(a)});this.tabbedLayout=new l.WD6({items:t,cssClass:"ag-menu",onActiveItemClicked:this.onHidePopup.bind(this),onItemClicked:this.onTabItemClicked.bind(this)}),this.createBean(this.tabbedLayout),this.mainMenuList&&this.mainMenuList.setParentComponent(this.tabbedLayout)},n.prototype.getTabsToCreate=function(){var e=this;return this.restrictTo?this.restrictTo:this.column.getMenuTabs(n.TABS_DEFAULT).filter(function(t){return e.isValidMenuTabItem(t)}).filter(function(t){return e.isNotSuppressed(t)}).filter(function(t){return e.isModuleLoaded(t)})},n.prototype.isModuleLoaded=function(e){return e===n.TAB_COLUMNS?l.O3h.isRegistered(l.GXE.ColumnToolPanelModule):!0},n.prototype.isValidMenuTabItem=function(e){var t=!0,a=n.TABS_DEFAULT;return this.restrictTo!=null&&(t=this.restrictTo.indexOf(e)>-1,a=this.restrictTo),t=t&&n.TABS_DEFAULT.indexOf(e)>-1,t},n.prototype.isNotSuppressed=function(e){return this.includeChecks[e]()},n.prototype.createTab=function(e){return this.tabFactories[e]()},n.prototype.showTabBasedOnPreviousSelection=function(){this.showTab(this.initialSelection)},n.prototype.showTab=function(e){this.tabItemColumns&&e===n.TAB_COLUMNS?this.tabbedLayout.showItem(this.tabItemColumns):this.tabItemFilter&&e===n.TAB_FILTER?this.tabbedLayout.showItem(this.tabItemFilter):this.tabItemGeneral&&e===n.TAB_GENERAL?this.tabbedLayout.showItem(this.tabItemGeneral):this.tabbedLayout.showFirstItem()},n.prototype.onTabItemClicked=function(e){var t=null;switch(e.item){case this.tabItemColumns:t=n.TAB_COLUMNS;break;case this.tabItemFilter:t=n.TAB_FILTER;break;case this.tabItemGeneral:t=n.TAB_GENERAL;break}t&&this.activateTab(t)},n.prototype.activateTab=function(e){var t={type:n.EVENT_TAB_SELECTED,key:e};this.dispatchEvent(t)},n.prototype.getMenuItems=function(){var e=this.getDefaultMenuOptions(),t,a=this.gridOptionsWrapper.getMainMenuItemsFunc();return a?t=a({column:this.column,api:this.gridOptionsWrapper.getApi(),columnApi:this.gridOptionsWrapper.getColumnApi(),context:this.gridOptionsWrapper.getContext(),defaultItems:e}):t=e,l._.removeRepeatsFromArray(t,n.MENU_ITEM_SEPARATOR),t},n.prototype.getDefaultMenuOptions=function(){var e=[],t=!this.column.getColDef().lockPinned,a=this.columnModel.getRowGroupColumns().length,r=a>0,i=this.columnModel.getRowGroupColumns().indexOf(this.column)>=0,g=this.column.isAllowValue(),p=this.column.isAllowRowGroup(),s=this.column.isPrimary(),d=this.columnModel.isPivotMode(),c=this.rowModel.getType()===l.gTE.ROW_MODEL_TYPE_CLIENT_SIDE,u=this.gridOptionsWrapper.isTreeData(),h=s&&r&&g||!s;t&&e.push("pinSubMenu"),h&&e.push("valueAggSubMenu"),(t||h)&&e.push(n.MENU_ITEM_SEPARATOR),e.push("autoSizeThis"),e.push("autoSizeAll"),e.push(n.MENU_ITEM_SEPARATOR),p&&this.column.isPrimary()&&(i?e.push("rowUnGroup"):e.push("rowGroup")),e.push(n.MENU_ITEM_SEPARATOR),e.push("resetColumns");var m=c&&(u||a>(d?1:0));return m&&(e.push("expandAll"),e.push("contractAll")),e},n.prototype.createMainPanel=function(){this.mainMenuList=this.createManagedBean(new Pe);var e=this.getMenuItems(),t=this.menuItemMapper.mapWithStockItems(e,this.column);return this.mainMenuList.addMenuItems(t),this.mainMenuList.addEventListener(k.EVENT_MENU_ITEM_SELECTED,this.onHidePopup.bind(this)),this.tabItemGeneral={title:l._.createIconNoSpan("menu",this.gridOptionsWrapper,this.column),titleLabel:n.TAB_GENERAL.replace("MenuTab",""),bodyPromise:l.j_S.resolve(this.mainMenuList.getGui()),name:n.TAB_GENERAL},this.tabItemGeneral},n.prototype.onHidePopup=function(){this.hidePopupFunc();var e=this.focusService.getFocusedCell();if(e){var t=e.rowIndex,a=e.rowPinned,r=e.column;this.focusService.setFocusedCell(t,r,a,!0)}},n.prototype.createFilterPanel=function(){var e=this.filterManager.getOrCreateFilterWrapper(this.column,"COLUMN_MENU"),t=function(a){!e.filterPromise||e.filterPromise.then(function(r){r&&r.afterGuiAttached&&r.afterGuiAttached(a)})};return this.tabItemFilter={title:l._.createIconNoSpan("filter",this.gridOptionsWrapper,this.column),titleLabel:n.TAB_FILTER.replace("MenuTab",""),bodyPromise:e.guiPromise,afterAttachedCallback:t,name:n.TAB_FILTER},this.tabItemFilter},n.prototype.createColumnsPanel=function(){var e=document.createElement("div");l._.addCssClass(e,"ag-menu-column-select-wrapper"),this.columnSelectPanel=this.createManagedBean(new De);var t=this.column.getColDef().columnsMenuParams;return t||(t={}),this.columnSelectPanel.init(!1,{suppressColumnMove:!1,suppressValues:!1,suppressPivots:!1,suppressRowGroups:!1,suppressPivotMode:!1,contractColumnSelection:!!t.contractColumnSelection,suppressColumnExpandAll:!!t.suppressColumnExpandAll,suppressColumnFilter:!!t.suppressColumnFilter,suppressColumnSelectAll:!!t.suppressColumnSelectAll,suppressSyncLayoutWithGrid:!!t.suppressSyncLayoutWithGrid,api:this.gridApi,columnApi:this.columnApi},"columnMenu"),l._.addCssClass(this.columnSelectPanel.getGui(),"ag-menu-column-select"),e.appendChild(this.columnSelectPanel.getGui()),this.tabItemColumns={title:l._.createIconNoSpan("columns",this.gridOptionsWrapper,this.column),titleLabel:n.TAB_COLUMNS.replace("MenuTab",""),bodyPromise:l.j_S.resolve(e),name:n.TAB_COLUMNS},this.tabItemColumns},n.prototype.afterGuiAttached=function(e){var t=e.container,a=e.hidePopup;this.tabbedLayout.setAfterAttachedParams({container:t,hidePopup:a}),a&&(this.hidePopupFunc=a,this.addDestroyFunc(a))},n.prototype.getGui=function(){return this.tabbedLayout.getGui()},n.EVENT_TAB_SELECTED="tabSelected",n.TAB_FILTER="filterMenuTab",n.TAB_GENERAL="generalMenuTab",n.TAB_COLUMNS="columnsMenuTab",n.TABS_DEFAULT=[n.TAB_GENERAL,n.TAB_FILTER,n.TAB_COLUMNS],n.MENU_ITEM_SEPARATOR="separator",P([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),P([(0,l.fsG)("filterManager")],n.prototype,"filterManager",void 0),P([(0,l.fsG)("gridApi")],n.prototype,"gridApi",void 0),P([(0,l.fsG)("columnApi")],n.prototype,"columnApi",void 0),P([(0,l.fsG)("menuItemMapper")],n.prototype,"menuItemMapper",void 0),P([(0,l.fsG)("rowModel")],n.prototype,"rowModel",void 0),P([(0,l.fsG)("focusService")],n.prototype,"focusService",void 0),P([l.NqP],n.prototype,"init",null),n}(l.AS9),on=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),F=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Pt="ag-menu",ln=" ag-context-menu-open",Ot=function(o){on(n,o);function n(){return o!==null&&o.apply(this,arguments)||this}return n.prototype.hideActiveMenu=function(){this.destroyBean(this.activeMenu)},n.prototype.getMenuItems=function(e,t,a){var r=[];if(l._.exists(e)&&l.O3h.isRegistered(l.GXE.ClipboardModule)&&t&&r.push("copy","copyWithHeaders","paste","separator"),this.gridOptionsWrapper.isEnableCharts()&&l.O3h.isRegistered(l.GXE.RangeSelectionModule)&&l.O3h.isRegistered(l.GXE.GridChartsModule)&&(this.columnModel.isPivotMode()&&r.push("pivotChart"),this.rangeService&&!this.rangeService.isEmpty()&&r.push("chartRange")),l._.exists(e)){var i=!l.O3h.isRegistered(l.GXE.CsvExportModule),g=!l.O3h.isRegistered(l.GXE.ExcelExportModule),p=this.gridOptionsWrapper.isSuppressExcelExport()||g,s=this.gridOptionsWrapper.isSuppressCsvExport()||i,d=l._.isIOSUserAgent(),c=!d&&(!p||!s);c&&r.push("export")}if(this.gridOptionsWrapper.getContextMenuItemsFunc()){var u=this.gridOptionsWrapper.getContextMenuItemsFunc(),h={node:e,column:t,value:a,defaultItems:r.length?r:void 0,api:this.gridOptionsWrapper.getApi(),columnApi:this.gridOptionsWrapper.getColumnApi(),context:this.gridOptionsWrapper.getContext()};return u?u(h):void 0}return r},n.prototype.onContextMenu=function(e,t,a,r,i,g){if(!(!this.gridOptionsWrapper.isAllowContextMenuWithControlKey()&&e&&(e.ctrlKey||e.metaKey))&&(e&&this.preventDefaultOnContextMenu(e),!this.gridOptionsWrapper.isSuppressContextMenu())){var p=e||t.touches[0];if(this.showMenu(a,r,i,p,g)){var s=e||t;s.preventDefault()}}},n.prototype.preventDefaultOnContextMenu=function(e){var t=this.gridOptionsWrapper,a=e.which;(t.isPreventDefaultOnContextMenu()||t.isSuppressMiddleClickScrolls()&&a===2)&&e.preventDefault()},n.prototype.showMenu=function(e,t,a,r,i){var g=this,p=this.getMenuItems(e,t,a),s=this.ctrlsService.getGridBodyCtrl().getGui();if(p===void 0||l._.missingOrEmpty(p))return!1;var d=new Lt(p);this.createBean(d);var c=d.getGui(),u={column:t,rowNode:e,type:"contextMenu",mouseEvent:r,ePopup:c,nudgeY:1},h=this.gridOptionsWrapper.getLocaleTextFunc(),m=this.popupService.addPopup({modal:!0,eChild:c,closeOnEsc:!0,closedCallback:function(){l._.removeCssClass(s,ln),g.destroyBean(d)},click:r,positionCallback:function(){g.popupService.positionPopupUnderMouseEvent(l._.assign({},{nudgeX:g.gridOptionsWrapper.isEnableRtl()?(c.offsetWidth+1)*-1:1},u))},anchorToElement:i,ariaLabel:h("ariaLabelContextMenu","Context Menu")});return m&&(l._.addCssClass(s,ln),d.afterGuiAttached({container:"contextMenu",hidePopup:m.hideFunc})),this.activeMenu&&this.hideActiveMenu(),this.activeMenu=d,d.addEventListener(l.AS9.EVENT_DESTROYED,function(){g.activeMenu===d&&(g.activeMenu=null)}),m&&d.addEventListener(k.EVENT_MENU_ITEM_SELECTED,m.hideFunc),!0},F([(0,l.fsG)("popupService")],n.prototype,"popupService",void 0),F([(0,l.FiY)("rangeService")],n.prototype,"rangeService",void 0),F([(0,l.fsG)("ctrlsService")],n.prototype,"ctrlsService",void 0),F([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),n=F([(0,l.Vu6)("contextMenuFactory")],n),n}(l.AS9),Lt=function(o){on(n,o);function n(e){var t=o.call(this,'<div class="'+Pt+'" role="presentation"></div>')||this;return t.menuList=null,t.focusedCell=null,t.menuItems=e,t}return n.prototype.addMenuItems=function(){var e=this,t=this.createBean(new Pe),a=this.menuItemMapper.mapWithStockItems(this.menuItems,null);t.addMenuItems(a),this.appendChild(t),this.menuList=t,t.addEventListener(k.EVENT_MENU_ITEM_SELECTED,function(r){return e.dispatchEvent(r)})},n.prototype.afterGuiAttached=function(e){e.hidePopup&&this.addDestroyFunc(e.hidePopup),this.focusedCell=this.focusService.getFocusedCell(),this.menuList&&this.focusService.focusInto(this.menuList.getGui())},n.prototype.restoreFocusedCell=function(){var e=this.focusService.getFocusedCell();if(e&&this.focusedCell&&this.cellPositionUtils.equals(e,this.focusedCell)){var t=this.focusedCell,a=t.rowIndex,r=t.rowPinned,i=t.column,g=this.gridOptionsWrapper.getDocument();g.activeElement===g.body&&this.focusService.setFocusedCell(a,i,r,!0)}},n.prototype.destroy=function(){this.restoreFocusedCell(),o.prototype.destroy.call(this)},F([(0,l.fsG)("menuItemMapper")],n.prototype,"menuItemMapper",void 0),F([(0,l.fsG)("focusService")],n.prototype,"focusService",void 0),F([(0,l.fsG)("cellPositionUtils")],n.prototype,"cellPositionUtils",void 0),F([l.NqP],n.prototype,"addMenuItems",null),n}(l.wA2),Nt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),$=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},It=function(o){Nt(n,o);function n(){return o!==null&&o.apply(this,arguments)||this}return n.prototype.mapWithStockItems=function(e,t){var a=this;if(!e)return[];var r=[];return e.forEach(function(i){var g;if(typeof i=="string"?g=a.getStockMenuItem(i,t):g=i,!!g){var p=g,s=p.subMenu;s&&s instanceof Array&&(p.subMenu=a.mapWithStockItems(p.subMenu,t)),g!=null&&r.push(g)}}),r},n.prototype.getStockMenuItem=function(e,t){var a=this,r=this.gridOptionsWrapper.getLocaleTextFunc(),i=this.gridOptionsWrapper.isSkipHeaderOnAutoSize();switch(e){case"pinSubMenu":return{name:r("pinColumn","Pin Column"),icon:l._.createIconNoSpan("menuPin",this.gridOptionsWrapper,null),subMenu:["pinLeft","pinRight","clearPinned"]};case"pinLeft":return{name:r("pinLeft","Pin Left"),action:function(){return a.columnModel.setColumnPinned(t,l.gTE.PINNED_LEFT,"contextMenu")},checked:!!t&&t.isPinnedLeft()};case"pinRight":return{name:r("pinRight","Pin Right"),action:function(){return a.columnModel.setColumnPinned(t,l.gTE.PINNED_RIGHT,"contextMenu")},checked:!!t&&t.isPinnedRight()};case"clearPinned":return{name:r("noPin","No Pin"),action:function(){return a.columnModel.setColumnPinned(t,null,"contextMenu")},checked:!!t&&!t.isPinned()};case"valueAggSubMenu":return l.O3h.assertRegistered(l.GXE.RowGroupingModule,"Aggregation from Menu")?{name:r("valueAggregation","Value Aggregation"),icon:l._.createIconNoSpan("menuValue",this.gridOptionsWrapper,null),subMenu:this.createAggregationSubMenu(t)}:null;case"autoSizeThis":return{name:r("autosizeThiscolumn","Autosize This Column"),action:function(){return a.columnModel.autoSizeColumn(t,i,"contextMenu")}};case"autoSizeAll":return{name:r("autosizeAllColumns","Autosize All Columns"),action:function(){return a.columnModel.autoSizeAllColumns(i,"contextMenu")}};case"rowGroup":return{name:r("groupBy","Group by")+" "+l._.escapeString(this.columnModel.getDisplayNameForColumn(t,"header")),action:function(){return a.columnModel.addRowGroupColumn(t,"contextMenu")},icon:l._.createIconNoSpan("menuAddRowGroup",this.gridOptionsWrapper,null)};case"rowUnGroup":return{name:r("ungroupBy","Un-Group by")+" "+l._.escapeString(this.columnModel.getDisplayNameForColumn(t,"header")),action:function(){return a.columnModel.removeRowGroupColumn(t,"contextMenu")},icon:l._.createIconNoSpan("menuRemoveRowGroup",this.gridOptionsWrapper,null)};case"resetColumns":return{name:r("resetColumns","Reset Columns"),action:function(){return a.columnModel.resetColumnState("contextMenu")}};case"expandAll":return{name:r("expandAll","Expand All"),action:function(){return a.gridApi.expandAll()}};case"contractAll":return{name:r("collapseAll","Collapse All"),action:function(){return a.gridApi.collapseAll()}};case"copy":return l.O3h.assertRegistered(l.GXE.ClipboardModule,"Copy from Menu")?{name:r("copy","Copy"),shortcut:r("ctrlC","Ctrl+C"),icon:l._.createIconNoSpan("clipboardCopy",this.gridOptionsWrapper,null),action:function(){return a.clipboardService.copyToClipboard(!1)}}:null;case"copyWithHeaders":return l.O3h.assertRegistered(l.GXE.ClipboardModule,"Copy with Headers from Menu")?{name:r("copyWithHeaders","Copy with Headers"),icon:l._.createIconNoSpan("clipboardCopy",this.gridOptionsWrapper,null),action:function(){return a.clipboardService.copyToClipboard(!0)}}:null;case"paste":return l.O3h.assertRegistered(l.GXE.ClipboardModule,"Paste from Clipboard")?{name:r("paste","Paste"),shortcut:r("ctrlV","Ctrl+V"),disabled:!0,icon:l._.createIconNoSpan("clipboardPaste",this.gridOptionsWrapper,null),action:function(){return a.clipboardService.pasteFromClipboard()}}:null;case"export":var g=[],p=l.O3h.isRegistered(l.GXE.CsvExportModule),s=l.O3h.isRegistered(l.GXE.ExcelExportModule);return!this.gridOptionsWrapper.isSuppressCsvExport()&&p&&g.push("csvExport"),!this.gridOptionsWrapper.isSuppressExcelExport()&&s&&g.push("excelExport"),{name:r("export","Export"),subMenu:g,icon:l._.createIconNoSpan("save",this.gridOptionsWrapper,null)};case"csvExport":return{name:r("csvExport","CSV Export"),icon:l._.createIconNoSpan("csvExport",this.gridOptionsWrapper,null),action:function(){return a.gridApi.exportDataAsCsv({})}};case"excelExport":return{name:r("excelExport","Excel Export"),icon:l._.createIconNoSpan("excelExport",this.gridOptionsWrapper,null),action:function(){return a.gridApi.exportDataAsExcel()}};case"separator":return"separator";default:var d=this.getChartItems(e);return d||null}},n.prototype.getChartItems=function(e){var t=this,a=this.gridOptionsWrapper.getLocaleTextFunc(),r=function(g,p,s){return{name:a(g,p),action:function(){return t.chartService.createPivotChart({chartType:s})}}},i=function(g,p,s){return{name:a(g,p),action:function(){return t.chartService.createChartFromCurrentRange(s)}}};switch(e){case"pivotChart":return{name:a("pivotChart","Pivot Chart"),subMenu:["pivotColumnChart","pivotBarChart","pivotPieChart","pivotLineChart","pivotXYChart","pivotAreaChart"],icon:l._.createIconNoSpan("chart",this.gridOptionsWrapper,null)};case"chartRange":return{name:a("chartRange","Chart Range"),subMenu:["rangeColumnChart","rangeBarChart","rangePieChart","rangeLineChart","rangeXYChart","rangeAreaChart","rangeHistogramChart"],icon:l._.createIconNoSpan("chart",this.gridOptionsWrapper,null)};case"pivotColumnChart":return{name:a("columnChart","Column"),subMenu:["pivotGroupedColumn","pivotStackedColumn","pivotNormalizedColumn"]};case"pivotGroupedColumn":return r("groupedColumn","Grouped&lrm;",l.oXM.GroupedColumn);case"pivotStackedColumn":return r("stackedColumn","Stacked&lrm;",l.oXM.StackedColumn);case"pivotNormalizedColumn":return r("normalizedColumn","100% Stacked&lrm;",l.oXM.NormalizedColumn);case"rangeColumnChart":return{name:a("columnChart","Column"),subMenu:["rangeGroupedColumn","rangeStackedColumn","rangeNormalizedColumn"]};case"rangeGroupedColumn":return i("groupedColumn","Grouped&lrm;",l.oXM.GroupedColumn);case"rangeStackedColumn":return i("stackedColumn","Stacked&lrm;",l.oXM.StackedColumn);case"rangeNormalizedColumn":return i("normalizedColumn","100% Stacked&lrm;",l.oXM.NormalizedColumn);case"pivotBarChart":return{name:a("barChart","Bar"),subMenu:["pivotGroupedBar","pivotStackedBar","pivotNormalizedBar"]};case"pivotGroupedBar":return r("groupedBar","Grouped&lrm;",l.oXM.GroupedBar);case"pivotStackedBar":return r("stackedBar","Stacked&lrm;",l.oXM.StackedBar);case"pivotNormalizedBar":return r("normalizedBar","100% Stacked&lrm;",l.oXM.NormalizedBar);case"rangeBarChart":return{name:a("barChart","Bar"),subMenu:["rangeGroupedBar","rangeStackedBar","rangeNormalizedBar"]};case"rangeGroupedBar":return i("groupedBar","Grouped&lrm;",l.oXM.GroupedBar);case"rangeStackedBar":return i("stackedBar","Stacked&lrm;",l.oXM.StackedBar);case"rangeNormalizedBar":return i("normalizedBar","100% Stacked&lrm;",l.oXM.NormalizedBar);case"pivotPieChart":return{name:a("pieChart","Pie"),subMenu:["pivotPie","pivotDoughnut"]};case"pivotPie":return r("pie","Pie&lrm;",l.oXM.Pie);case"pivotDoughnut":return r("doughnut","Doughnut&lrm;",l.oXM.Doughnut);case"rangePieChart":return{name:a("pieChart","Pie"),subMenu:["rangePie","rangeDoughnut"]};case"rangePie":return i("pie","Pie&lrm;",l.oXM.Pie);case"rangeDoughnut":return i("doughnut","Doughnut&lrm;",l.oXM.Doughnut);case"pivotLineChart":return r("line","Line&lrm;",l.oXM.Line);case"rangeLineChart":return i("line","Line&lrm;",l.oXM.Line);case"pivotXYChart":return{name:a("xyChart","X Y (Scatter)"),subMenu:["pivotScatter","pivotBubble"]};case"pivotScatter":return r("scatter","Scatter&lrm;",l.oXM.Scatter);case"pivotBubble":return r("bubble","Bubble&lrm;",l.oXM.Bubble);case"rangeXYChart":return{name:a("xyChart","X Y (Scatter)"),subMenu:["rangeScatter","rangeBubble"]};case"rangeScatter":return i("scatter","Scatter&lrm;",l.oXM.Scatter);case"rangeBubble":return i("bubble","Bubble&lrm;",l.oXM.Bubble);case"pivotAreaChart":return{name:a("areaChart","Area"),subMenu:["pivotArea","pivotStackedArea","pivotNormalizedArea"]};case"pivotArea":return r("area","Area&lrm;",l.oXM.Area);case"pivotStackedArea":return r("stackedArea","Stacked&lrm;",l.oXM.StackedArea);case"pivotNormalizedArea":return r("normalizedArea","100% Stacked&lrm;",l.oXM.NormalizedArea);case"rangeAreaChart":return{name:a("areaChart","Area"),subMenu:["rangeArea","rangeStackedArea","rangeNormalizedArea"]};case"rangeArea":return i("area","Area&lrm;",l.oXM.Area);case"rangeStackedArea":return i("stackedArea","Stacked&lrm;",l.oXM.StackedArea);case"rangeNormalizedArea":return i("normalizedArea","100% Stacked&lrm;",l.oXM.NormalizedArea);case"rangeHistogramChart":return i("histogramChart","Histogram&lrm;",l.oXM.Histogram);default:return null}},n.prototype.createAggregationSubMenu=function(e){var t=this,a=this.gridOptionsWrapper.getLocaleTextFunc(),r=e.isValueActive(),i=this.aggFuncService.getFuncNames(e),g;if(e.isPrimary())g=e;else{var p=e.getColDef().pivotValueColumn;g=l._.exists(p)?p:void 0}var s=[];return i.forEach(function(d){s.push({name:a(d,d),action:function(){t.columnModel.setColumnAggFunc(g,d,"contextMenu"),t.columnModel.addValueColumn(g,"contextMenu")},checked:r&&g.getAggFunc()===d})}),s},$([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),$([(0,l.fsG)("gridApi")],n.prototype,"gridApi",void 0),$([(0,l.FiY)("clipboardService")],n.prototype,"clipboardService",void 0),$([(0,l.FiY)("aggFuncService")],n.prototype,"aggFuncService",void 0),$([(0,l.FiY)("chartService")],n.prototype,"chartService",void 0),n=$([(0,l.Vu6)("menuItemMapper")],n),n}(l.AS9),Gt={moduleName:l.GXE.MenuModule,beans:[St,Ot,It],dependantModules:[z]},Rt=w(7073),Ft=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),A=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},kt=function(o){Ft(n,o);function n(){var e=o!==null&&o.apply(this,arguments)||this;return e.navigatorApiFailed=!1,e}return n.prototype.init=function(){var e=this;this.logger=this.loggerFactory.create("ClipboardService"),this.rowModel.getType()===l.gTE.ROW_MODEL_TYPE_CLIENT_SIDE&&(this.clientSideRowModel=this.rowModel),this.ctrlsService.whenReady(function(t){e.gridCtrl=t.gridCtrl})},n.prototype.pasteFromClipboard=function(){var e=this;this.logger.log("pasteFromClipboard");var t=!this.gridOptionsWrapper.isSuppressClipboardApi();t&&!this.navigatorApiFailed&&navigator.clipboard&&navigator.clipboard.readText?navigator.clipboard.readText().then(this.processClipboardData.bind(this)).catch(function(a){l._.doOnce(function(){},"clipboardApiError"),e.navigatorApiFailed=!0,e.pasteFromClipboardLegacy()}):this.pasteFromClipboardLegacy()},n.prototype.pasteFromClipboardLegacy=function(){var e=this;this.executeOnTempElement(function(t){return t.focus({preventScroll:!0})},function(t){var a=t.value;e.processClipboardData(a)})},n.prototype.processClipboardData=function(e){var t=this;if(e!=null){var a=l._.stringToArray(e,this.gridOptionsWrapper.getClipboardDeliminator()),r=this.gridOptionsWrapper.getProcessDataFromClipboardFunc();if(r&&(a=r({data:a})),a!=null){this.gridOptionsWrapper.isSuppressLastEmptyLineOnPaste()&&this.removeLastLineIfBlank(a);var i=function(g,p,s,d){var c=t.rangeService&&t.rangeService.isMoreThanOneCell(),u=c&&!t.hasOnlyOneValueToPaste(a);u?t.pasteIntoActiveRange(a,g,p,d):t.pasteStartingFromFocusedCell(a,g,p,s,d)};this.doPasteOperation(i)}}},n.prototype.doPasteOperation=function(e){var t=this.gridOptionsWrapper.getApi(),a=this.gridOptionsWrapper.getColumnApi(),r="clipboard";this.eventService.dispatchEvent({type:l.zW2.EVENT_PASTE_START,api:t,columnApi:a,source:r});var i;if(this.clientSideRowModel){var g=this.gridOptionsWrapper.isAggregateOnlyChangedColumns();i=new l.Dkq(g,this.clientSideRowModel.getRootNode())}var p={},s=[],d=this.focusService.getFocusedCell();e(p,s,d,i),i&&this.clientSideRowModel.doAggregate(i),this.rowRenderer.refreshCells(),this.dispatchFlashCells(p),this.fireRowChanged(s),d&&this.focusService.setFocusedCell(d.rowIndex,d.column,d.rowPinned,!0),this.eventService.dispatchEvent({type:l.zW2.EVENT_PASTE_END,api:t,columnApi:a,source:r})},n.prototype.pasteIntoActiveRange=function(e,t,a,r){var i=this,g=this.getRangeSize()%e.length!=0,p=0,s=0,d=function(c,u,h,m){var f=m-p>=e.length;if(f){if(g)return;p+=s,s=0}var b=e[m-p];a.push(u);var x=i.gridOptionsWrapper.getProcessCellFromClipboardFunc();h.forEach(function(y,S){if(!(!y.isCellEditable(u)||y.isSuppressPaste(u))){S>=b.length&&(S=S%b.length);var G=i.processCell(u,y,b[S],l.gTE.EXPORT_TYPE_DRAG_COPY,x);u.setDataValue(y,G,l.gTE.SOURCE_PASTE),r&&r.addParentNode(u.parent,[y]);var Z=i.cellPositionUtils.createIdFromValues(c.rowIndex,y,c.rowPinned);t[Z]=!0}}),s++};this.iterateActiveRanges(!1,d)},n.prototype.pasteStartingFromFocusedCell=function(e,t,a,r,i){if(!!r){var g={rowIndex:r.rowIndex,rowPinned:r.rowPinned},p=this.columnModel.getDisplayedColumnsStartingAt(r.column);this.isPasteSingleValueIntoRange(e)?this.pasteSingleValueIntoRange(e,a,t,i):this.pasteMultipleValues(e,g,a,p,t,l.gTE.EXPORT_TYPE_CLIPBOARD,i)}},n.prototype.isPasteSingleValueIntoRange=function(e){return this.hasOnlyOneValueToPaste(e)&&this.rangeService!=null&&!this.rangeService.isEmpty()},n.prototype.pasteSingleValueIntoRange=function(e,t,a,r){var i=this,g=e[0][0],p=function(s,d,c){t.push(d),c.forEach(function(u){return i.updateCellValue(d,u,g,a,l.gTE.EXPORT_TYPE_CLIPBOARD,r)})};this.iterateActiveRanges(!1,p)},n.prototype.hasOnlyOneValueToPaste=function(e){return e.length===1&&e[0].length===1},n.prototype.copyRangeDown=function(){var e=this;if(!(!this.rangeService||this.rangeService.isEmpty())){var t=[],a=function(r,i,g,p){var s=e.gridOptionsWrapper.getProcessCellForClipboardFunc(),d=e.gridOptionsWrapper.getProcessCellFromClipboardFunc(),c=function(u,h,m){t.length?(i.push(h),m.forEach(function(f,b){if(!(!f.isCellEditable(h)||f.isSuppressPaste(h))){var x=e.processCell(h,f,t[b],l.gTE.EXPORT_TYPE_DRAG_COPY,d);h.setDataValue(f,x,l.gTE.SOURCE_PASTE),p&&p.addParentNode(h.parent,[f]);var y=e.cellPositionUtils.createIdFromValues(u.rowIndex,f,u.rowPinned);r[y]=!0}})):m.forEach(function(f){var b=e.processCell(h,f,e.valueService.getValue(f,h),l.gTE.EXPORT_TYPE_DRAG_COPY,s);t.push(b)})};e.iterateActiveRanges(!0,c)};this.doPasteOperation(a)}},n.prototype.removeLastLineIfBlank=function(e){var t=l._.last(e),a=t&&t.length===1&&t[0]==="";a&&l._.removeFromArray(e,t)},n.prototype.fireRowChanged=function(e){var t=this;!this.gridOptionsWrapper.isFullRowEdit()||e.forEach(function(a){var r={type:l.zW2.EVENT_ROW_VALUE_CHANGED,node:a,data:a.data,rowIndex:a.rowIndex,rowPinned:a.rowPinned,context:t.gridOptionsWrapper.getContext(),api:t.gridOptionsWrapper.getApi(),columnApi:t.gridOptionsWrapper.getColumnApi()};t.eventService.dispatchEvent(r)})},n.prototype.pasteMultipleValues=function(e,t,a,r,i,g,p){var s=this,d=t,c=this.clientSideRowModel!=null&&!this.gridOptionsWrapper.isTreeData(),u=function(){for(;;){if(!d)return null;var h=s.rowPositionUtils.getRowNode(d);if(d=s.cellNavigationService.getRowBelow({rowPinned:d.rowPinned,rowIndex:d.rowIndex}),h==null)return null;var m=h.detail||h.footer||c&&h.group;if(!m)return h}};e.forEach(function(h){var m=u();!m||(h.forEach(function(f,b){return s.updateCellValue(m,r[b],f,i,g,p)}),a.push(m))})},n.prototype.updateCellValue=function(e,t,a,r,i,g){if(!(!e||!t||!t.isCellEditable(e)||t.isSuppressPaste(e))){var p=this.processCell(e,t,a,i,this.gridOptionsWrapper.getProcessCellFromClipboardFunc());e.setDataValue(t,p,l.gTE.SOURCE_PASTE);var s=this.cellPositionUtils.createIdFromValues(e.rowIndex,t,e.rowPinned);r[s]=!0,g&&g.addParentNode(e.parent,[t])}},n.prototype.copyToClipboard=function(e){this.logger.log("copyToClipboard: includeHeaders = "+e),e==null&&(e=this.gridOptionsWrapper.isCopyHeadersToClipboard());var t=!this.selectionService.isEmpty()&&!this.gridOptionsWrapper.isSuppressCopyRowsToClipboard();this.rangeService&&this.rangeService.isMoreThanOneCell()?this.copySelectedRangeToClipboard(e):t?this.copySelectedRowsToClipboard(e):this.focusService.isAnyCellFocused()?this.copyFocusedCellToClipboard(e):this.copySelectedRangeToClipboard(e)},n.prototype.iterateActiveRanges=function(e,t,a){var r=this;if(!(!this.rangeService||this.rangeService.isEmpty())){var i=this.rangeService.getCellRanges();e?this.iterateActiveRange(i[0],t,a,!0):i.forEach(function(g,p){return r.iterateActiveRange(g,t,a,p===i.length-1)})}},n.prototype.iterateActiveRange=function(e,t,a,r){if(!!this.rangeService){var i=this.rangeService.getRangeStartRow(e),g=this.rangeService.getRangeEndRow(e);a&&e.columns&&a(e.columns);for(var p=0,s=!1;!s&&i!=null;){var d=this.rowPositionUtils.getRowNode(i);s=this.rowPositionUtils.sameRow(i,g),t(i,d,e.columns,p++,s&&r),i=this.cellNavigationService.getRowBelow(i)}}},n.prototype.copySelectedRangeToClipboard=function(e){var t=this;if(e===void 0&&(e=!1),!(!this.rangeService||this.rangeService.isEmpty())){var a=this.gridOptionsWrapper.getClipboardDeliminator(),r="",i={},g=function(s){if(!!e){var d=t.gridOptionsWrapper.getProcessHeaderForClipboardFunc(),c=s.map(function(u){var h=t.columnModel.getDisplayNameForColumn(u,"clipboard",!0);return t.processHeader(u,h,d)||""});r+=c.join(a)+`\r
`}},p=function(s,d,c,u,h){var m=t.gridOptionsWrapper.getProcessCellForClipboardFunc();c.forEach(function(f,b){var x=t.valueService.getValue(f,d),y=t.processCell(d,f,x,l.gTE.EXPORT_TYPE_CLIPBOARD,m);b!=0&&(r+=a),l._.exists(y)&&(r+=y);var S=t.cellPositionUtils.createIdFromValues(s.rowIndex,f,s.rowPinned);i[S]=!0}),h||(r+=`\r
`)};this.iterateActiveRanges(!1,p,g),this.copyDataToClipboard(r),this.dispatchFlashCells(i)}},n.prototype.copyFocusedCellToClipboard=function(e){var t;e===void 0&&(e=!1);var a=this.focusService.getFocusedCell();if(a!=null){var r=this.cellPositionUtils.createId(a),i={rowPinned:a.rowPinned,rowIndex:a.rowIndex},g=this.rowPositionUtils.getRowNode(i),p=a.column,s=this.valueService.getValue(p,g),d=this.processCell(g,p,s,l.gTE.EXPORT_TYPE_CLIPBOARD,this.gridOptionsWrapper.getProcessCellForClipboardFunc());d=l._.missing(d)?"":d.toString();var c;if(e){var u=this.columnModel.getDisplayNameForColumn(p,"clipboard",!0);c=this.processHeader(p,u,this.gridOptionsWrapper.getProcessHeaderForClipboardFunc())+`\r
`+d}else c=d;this.copyDataToClipboard(c),this.dispatchFlashCells((t={},t[r]=!0,t))}},n.prototype.dispatchFlashCells=function(e){var t=this;window.setTimeout(function(){var a={type:l.zW2.EVENT_FLASH_CELLS,cells:e,api:t.gridApi,columnApi:t.columnApi};t.eventService.dispatchEvent(a)},0)},n.prototype.processCell=function(e,t,a,r,i){if(i){var g={column:t,node:e,value:a,api:this.gridOptionsWrapper.getApi(),columnApi:this.gridOptionsWrapper.getColumnApi(),context:this.gridOptionsWrapper.getContext(),type:r};return i(g)}return a},n.prototype.processHeader=function(e,t,a){if(a){var r={column:e,api:this.gridOptionsWrapper.getApi(),columnApi:this.gridOptionsWrapper.getColumnApi(),context:this.gridOptionsWrapper.getContext()};return a(r)}return t},n.prototype.copySelectedRowsToClipboard=function(e,t){e===void 0&&(e=!1);var a={columnKeys:t,skipColumnHeaders:!e,suppressQuotes:!0,columnSeparator:this.gridOptionsWrapper.getClipboardDeliminator(),onlySelected:!0,processCellCallback:this.gridOptionsWrapper.getProcessCellForClipboardFunc(),processHeaderCallback:this.gridOptionsWrapper.getProcessHeaderForClipboardFunc()},r=this.csvCreator.getDataAsCsv(a);this.copyDataToClipboard(r)},n.prototype.copyDataToClipboard=function(e){var t=this,a=this.gridOptionsWrapper.getSendToClipboardFunc();if(a){a({data:e});return}var r=!this.gridOptionsWrapper.isSuppressClipboardApi();if(r&&navigator.clipboard){navigator.clipboard.writeText(e).catch(function(i){l._.doOnce(function(){},"clipboardApiError"),t.copyDataToClipboardLegacy(e)});return}this.copyDataToClipboardLegacy(e)},n.prototype.copyDataToClipboardLegacy=function(e){var t=this;this.executeOnTempElement(function(a){var r=t.gridOptionsWrapper.getDocument().activeElement;a.value=e||" ",a.select(),a.focus({preventScroll:!0});var i=document.execCommand("copy");r!=null&&r.focus!=null&&r.focus({preventScroll:!0})})},n.prototype.executeOnTempElement=function(e,t){var a=this.gridOptionsWrapper.getDocument(),r=a.createElement("textarea");r.style.width="1px",r.style.height="1px",r.style.top=a.documentElement.scrollTop+"px",r.style.left=a.documentElement.scrollLeft+"px",r.style.position="absolute",r.style.opacity="0";var i=this.gridCtrl.getGui();i.appendChild(r);try{e(r)}catch{}t?window.setTimeout(function(){t(r),i.removeChild(r)},100):i.removeChild(r)},n.prototype.getRangeSize=function(){var e=this.rangeService.getCellRanges(),t=0,a=0;return e.length>0&&(t=this.rangeService.getRangeStartRow(e[0]).rowIndex,a=this.rangeService.getRangeEndRow(e[0]).rowIndex),t-a+1},A([(0,l.fsG)("csvCreator")],n.prototype,"csvCreator",void 0),A([(0,l.fsG)("loggerFactory")],n.prototype,"loggerFactory",void 0),A([(0,l.fsG)("selectionService")],n.prototype,"selectionService",void 0),A([(0,l.FiY)("rangeService")],n.prototype,"rangeService",void 0),A([(0,l.fsG)("rowModel")],n.prototype,"rowModel",void 0),A([(0,l.fsG)("ctrlsService")],n.prototype,"ctrlsService",void 0),A([(0,l.fsG)("valueService")],n.prototype,"valueService",void 0),A([(0,l.fsG)("focusService")],n.prototype,"focusService",void 0),A([(0,l.fsG)("rowRenderer")],n.prototype,"rowRenderer",void 0),A([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),A([(0,l.fsG)("cellNavigationService")],n.prototype,"cellNavigationService",void 0),A([(0,l.fsG)("columnApi")],n.prototype,"columnApi",void 0),A([(0,l.fsG)("gridApi")],n.prototype,"gridApi",void 0),A([(0,l.fsG)("cellPositionUtils")],n.prototype,"cellPositionUtils",void 0),A([(0,l.fsG)("rowPositionUtils")],n.prototype,"rowPositionUtils",void 0),A([l.NqP],n.prototype,"init",null),n=A([(0,l.Vu6)("clipboardService")],n),n}(l.AS9),Vt={moduleName:l.GXE.ClipboardModule,beans:[kt],dependantModules:[z,Rt.jM]},jt=function(){function o(n,e){this.rowModel=n,this.filterParams=e}return o.prototype.extractUniqueValues=function(n){var e=this,t=new Set,a=this.filterParams.colDef.keyCreator;return this.rowModel.forEachLeafNode(function(r){if(!(!r.data||!n(r))){var i=e.filterParams.valueGetter(r);if(a){var g={value:i,colDef:e.filterParams.colDef,column:e.filterParams.column,node:r,data:r.data,api:e.filterParams.api,columnApi:e.filterParams.columnApi,context:e.filterParams.context};i=a(g)}i=l._.makeNull(i),i!=null&&Array.isArray(i)?l._.forEach(i,function(p){var s=l._.toStringOrNull(l._.makeNull(p));t.add(s)}):t.add(l._.toStringOrNull(i))}}),l._.values(t)},o}(),D;(function(o){o[o.PROVIDED_LIST=0]="PROVIDED_LIST",o[o.PROVIDED_CALLBACK=1]="PROVIDED_CALLBACK",o[o.TAKEN_FROM_GRID_VALUES=2]="TAKEN_FROM_GRID_VALUES"})(D||(D={}));var gn=function(){function o(n,e,t,a){var r=this;this.filterParams=n,this.setIsLoading=e,this.valueFormatterService=t,this.translate=a,this.localEventService=new l.POd,this.miniFilterText=null,this.providedValues=null,this.allValues=[],this.availableValues=new Set,this.displayedValues=[],this.selectedValues=new Set,this.initialised=!1;var i=n.column,g=n.colDef,p=n.textFormatter,s=n.doesRowPassOtherFilter,d=n.suppressSorting,c=n.comparator,u=n.rowModel,h=n.values;this.column=i,this.colDef=g,this.formatter=p||l.QVL.DEFAULT_FORMATTER,this.doesRowPassOtherFilters=s,this.suppressSorting=d||!1,this.comparator=c||g.comparator||l._.defaultComparator,u.getType()===l.gTE.ROW_MODEL_TYPE_CLIENT_SIDE&&(this.clientSideValuesExtractor=new jt(u,this.filterParams)),h==null?this.valuesType=D.TAKEN_FROM_GRID_VALUES:(this.valuesType=Array.isArray(h)?D.PROVIDED_LIST:D.PROVIDED_CALLBACK,this.providedValues=h),this.updateAllValues().then(function(m){return r.resetSelectionState(m||[])})}return o.prototype.addEventListener=function(n,e,t){this.localEventService.addEventListener(n,e,t)},o.prototype.removeEventListener=function(n,e,t){this.localEventService.removeEventListener(n,e,t)},o.prototype.refreshValues=function(n){n===void 0&&(n=!0);var e=this.getModel();return this.updateAllValues(),this.setModel(n?e:null)},o.prototype.overrideValues=function(n,e){var t=this;return e===void 0&&(e=!0),new l.j_S(function(a){t.allValuesPromise.then(function(){t.valuesType=D.PROVIDED_LIST,t.providedValues=n,t.refreshValues(e).then(function(){return a()})})})},o.prototype.refreshAfterAnyFilterChanged=function(){var n=this;return this.showAvailableOnly()?this.allValuesPromise.then(function(e){return n.updateAvailableValues(e||[])}):l.j_S.resolve()},o.prototype.isInitialised=function(){return this.initialised},o.prototype.updateAllValues=function(){var n=this;return this.allValuesPromise=new l.j_S(function(e){switch(n.valuesType){case D.TAKEN_FROM_GRID_VALUES:case D.PROVIDED_LIST:{var t=n.valuesType===D.TAKEN_FROM_GRID_VALUES?n.getValuesFromRows(!1):l._.toStrings(n.providedValues),a=n.sortValues(t||[]);n.allValues=a,e(a);break}case D.PROVIDED_CALLBACK:{n.setIsLoading(!0);var r=n.providedValues,i={success:function(g){var p=l._.toStrings(g);n.setIsLoading(!1);var s=n.sortValues(p||[]);n.allValues=s,e(s)},colDef:n.colDef};window.setTimeout(function(){return r(i)},0);break}default:throw new Error("Unrecognised valuesType")}}),this.allValuesPromise.then(function(e){return n.updateAvailableValues(e||[])}).then(function(){return n.initialised=!0}),this.allValuesPromise},o.prototype.setValuesType=function(n){this.valuesType=n},o.prototype.getValuesType=function(){return this.valuesType},o.prototype.isValueAvailable=function(n){return this.availableValues.has(n)},o.prototype.showAvailableOnly=function(){return this.valuesType===D.TAKEN_FROM_GRID_VALUES&&!this.filterParams.suppressRemoveEntries},o.prototype.updateAvailableValues=function(n){var e=this.showAvailableOnly()?this.sortValues(this.getValuesFromRows(!0)):n;this.availableValues=l._.convertToSet(e),this.localEventService.dispatchEvent({type:o.EVENT_AVAILABLE_VALUES_CHANGED}),this.updateDisplayedValues()},o.prototype.sortValues=function(n){return this.suppressSorting?n:!this.filterParams.excelMode||n.indexOf(null)<0?n.sort(this.comparator):l._.filter(n,function(e){return e!=null}).sort(this.comparator).concat(null)},o.prototype.getValuesFromRows=function(n){var e=this;if(n===void 0&&(n=!1),!this.clientSideValuesExtractor)return[];var t=function(a){return!n||e.doesRowPassOtherFilters(a)};return this.clientSideValuesExtractor.extractUniqueValues(t)},o.prototype.setMiniFilter=function(n){return n=l._.makeNull(n),this.miniFilterText===n?!1:(this.miniFilterText=n,this.updateDisplayedValues(),!0)},o.prototype.getMiniFilter=function(){return this.miniFilterText},o.prototype.updateDisplayedValues=function(){var n=this;if(this.miniFilterText==null){this.displayedValues=l._.values(this.availableValues);return}this.displayedValues=[];var e=(this.formatter(this.miniFilterText)||"").toUpperCase(),t=function(a){return a!=null&&a.toUpperCase().indexOf(e)>=0};this.availableValues.forEach(function(a){if(a==null)n.filterParams.excelMode&&t(n.translate("blanks"))&&n.displayedValues.push(a);else{var r=n.formatter(a),i=n.valueFormatterService.formatValue(n.column,null,null,r,n.filterParams.valueFormatter,!1);(t(r)||t(i))&&n.displayedValues.push(a)}})},o.prototype.getDisplayedValueCount=function(){return this.displayedValues.length},o.prototype.getDisplayedValue=function(n){return this.displayedValues[n]},o.prototype.hasSelections=function(){return this.filterParams.defaultToNothingSelected?this.selectedValues.size>0:this.allValues.length!==this.selectedValues.size},o.prototype.getUniqueValueCount=function(){return this.allValues.length},o.prototype.getUniqueValue=function(n){return this.allValues[n]},o.prototype.getValues=function(){return this.allValues.slice()},o.prototype.selectAllMatchingMiniFilter=function(n){var e=this;n===void 0&&(n=!1),this.miniFilterText==null?this.selectedValues=l._.convertToSet(this.allValues):(n&&this.selectedValues.clear(),l._.forEach(this.displayedValues,function(t){return e.selectedValues.add(t)}))},o.prototype.deselectAllMatchingMiniFilter=function(){var n=this;this.miniFilterText==null?this.selectedValues.clear():l._.forEach(this.displayedValues,function(e){return n.selectedValues.delete(e)})},o.prototype.selectValue=function(n){this.selectedValues.add(n)},o.prototype.deselectValue=function(n){this.filterParams.excelMode&&this.isEverythingVisibleSelected()&&this.resetSelectionState(this.displayedValues),this.selectedValues.delete(n)},o.prototype.isValueSelected=function(n){return this.selectedValues.has(n)},o.prototype.isEverythingVisibleSelected=function(){var n=this;return l._.filter(this.displayedValues,function(e){return n.isValueSelected(e)}).length===this.displayedValues.length},o.prototype.isNothingVisibleSelected=function(){var n=this;return l._.filter(this.displayedValues,function(e){return n.isValueSelected(e)}).length===0},o.prototype.getModel=function(){return this.hasSelections()?l._.values(this.selectedValues):null},o.prototype.setModel=function(n){var e=this;return this.allValuesPromise.then(function(t){if(n==null)e.resetSelectionState(t||[]);else{e.selectedValues.clear();var a=l._.convertToSet(t||[]);l._.forEach(n,function(r){a.has(r)&&e.selectedValues.add(r)})}})},o.prototype.resetSelectionState=function(n){this.filterParams.defaultToNothingSelected?this.selectedValues.clear():this.selectedValues=l._.convertToSet(n||[])},o.EVENT_AVAILABLE_VALUES_CHANGED="availableValuesChanged",o}(),zt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),ue=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},he=function(o){zt(n,o);function n(e,t,a,r){var i=o.call(this,n.TEMPLATE)||this;return i.value=e,i.params=t,i.translate=a,i.isSelected=r,i}return n.prototype.init=function(){var e=this;this.render(),this.eCheckbox.setValue(this.isSelected,!0),this.eCheckbox.onValueChange(function(t){var a=t||!1;e.isSelected=a;var r={type:n.EVENT_SELECTION_CHANGED,isSelected:a};e.dispatchEvent(r)})},n.prototype.toggleSelected=function(){this.isSelected=!this.isSelected,this.eCheckbox.setValue(this.isSelected)},n.prototype.render=function(){var e=this.params.column,t=this.value,a=null;if(typeof t=="function"?t=t():a=this.getFormattedValue(this.params,e,t),this.params.showTooltips){var r=a??t;this.setTooltip(r)}var i={value:t,valueFormatted:a,api:this.gridOptionsWrapper.getApi(),context:this.gridOptionsWrapper.getContext()};this.renderCell(i)},n.prototype.getTooltipParams=function(){var e=o.prototype.getTooltipParams.call(this);return e.location="setFilterValue",e.colDef=this.getComponentHolder(),e},n.prototype.getFormattedValue=function(e,t,a){var r=e&&e.valueFormatter;return this.valueFormatterService.formatValue(t,null,null,a,r,!1)},n.prototype.renderCell=function(e){var t=this,a=this.userComponentFactory.newSetFilterCellRenderer(this.params,e);if(a==null){var r=e.valueFormatted==null?e.value:e.valueFormatted;this.eCheckbox.setLabel(r??this.translate("blanks"));return}a.then(function(i){i&&(t.eCheckbox.setLabel(i.getGui()),t.addDestroyFunc(function(){return t.destroyBean(i)}))})},n.prototype.getComponentHolder=function(){return this.params.column.getColDef()},n.EVENT_SELECTION_CHANGED="selectionChanged",n.TEMPLATE=`
        <div class="ag-set-filter-item">
            <ag-checkbox ref="eCheckbox" class="ag-set-filter-item-checkbox"></ag-checkbox>
        </div>`,ue([(0,l.fsG)("valueFormatterService")],n.prototype,"valueFormatterService",void 0),ue([(0,l.fsG)("userComponentFactory")],n.prototype,"userComponentFactory",void 0),ue([(0,l.cqo)("eCheckbox")],n.prototype,"eCheckbox",void 0),ue([l.NqP],n.prototype,"init",null),n}(l.wA2),sn={loadingOoo:"Loading...",blanks:"(Blanks)",searchOoo:"Search...",selectAll:"(Select All)",selectAllSearchResults:"(Select All Search Results)",noMatches:"No matches."},Wt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),oe=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},pn=function(o){Wt(n,o);function n(){var e=o.call(this,"setFilter")||this;return e.valueModel=null,e.setFilterParams=null,e.virtualList=null,e.appliedModelValues=null,e}return n.prototype.postConstruct=function(){o.prototype.postConstruct.call(this),this.positionableFeature=new l.Gxm(this.eSetFilterList,{forcePopupParentAsOffsetParent:!0}),this.createBean(this.positionableFeature)},n.prototype.updateUiVisibility=function(){},n.prototype.createBodyTemplate=function(){return`
            <div class="ag-set-filter">
                <div ref="eFilterLoading" class="ag-filter-loading ag-hidden">`+this.translateForSetFilter("loadingOoo")+`</div>
                <ag-input-text-field class="ag-mini-filter" ref="eMiniFilter"></ag-input-text-field>
                <div ref="eFilterNoMatches" class="ag-filter-no-matches ag-hidden">`+this.translateForSetFilter("noMatches")+`</div>
                <div ref="eSetFilterList" class="ag-set-filter-list" role="presentation"></div>
            </div>`},n.prototype.handleKeyDown=function(e){if(o.prototype.handleKeyDown.call(this,e),!e.defaultPrevented)switch(e.which||e.keyCode){case l.VDZ.SPACE:this.handleKeySpace(e);break;case l.VDZ.ENTER:this.handleKeyEnter(e);break}},n.prototype.handleKeySpace=function(e){if(!(!this.eSetFilterList.contains(document.activeElement)||!this.virtualList)){var t=this.virtualList.getLastFocusedRow();if(t!=null){var a=this.virtualList.getComponentAt(t);a&&(e.preventDefault(),a.toggleSelected())}}},n.prototype.handleKeyEnter=function(e){!this.setFilterParams||this.setFilterParams.excelMode&&(e.preventDefault(),this.onBtApply(!1,!1,e),this.setFilterParams.excelMode==="mac"&&this.eMiniFilter.getInputElement().select())},n.prototype.getCssIdentifier=function(){return"set-filter"},n.prototype.setModelAndRefresh=function(e){var t=this;return this.valueModel?this.valueModel.setModel(e).then(function(){return t.refresh()}):l.j_S.resolve()},n.prototype.resetUiToDefaults=function(){return this.setMiniFilter(null),this.setModelAndRefresh(null)},n.prototype.setModelIntoUi=function(e){if(this.setMiniFilter(null),e instanceof Array){var t="AG Grid: The Set Filter Model is no longer an array and models as arrays are deprecated. Please check the docs on what the set filter model looks like. Future versions of AG Grid will have the array version of the model removed.";l._.doOnce(function(){},"setFilter.modelAsArray")}var a=e==null?null:e instanceof Array?e:e.values;return this.setModelAndRefresh(a)},n.prototype.getModelFromUi=function(){if(!this.valueModel)throw new Error("Value model has not been created.");var e=this.valueModel.getModel();return e?this.gridOptionsWrapper.isEnableOldSetFilterModel()?e:{values:e,filterType:this.getFilterType()}:null},n.prototype.getModel=function(){return o.prototype.getModel.call(this)},n.prototype.getFilterType=function(){return"set"},n.prototype.getValueModel=function(){return this.valueModel},n.prototype.areModelsEqual=function(e,t){return e==null&&t==null?!0:e!=null&&t!=null&&l._.areEqual(e.values,t.values)},n.prototype.setParams=function(e){var t=this;this.applyExcelModeOptions(e),o.prototype.setParams.call(this,e),this.checkSetFilterDeprecatedParams(e),this.setFilterParams=e,this.valueModel=new gn(e,function(a){return t.showOrHideLoadingScreen(a)},this.valueFormatterService,function(a){return t.translateForSetFilter(a)}),this.initialiseFilterBodyUi(),e.rowModel.getType()===l.gTE.ROW_MODEL_TYPE_CLIENT_SIDE&&!e.values&&!e.suppressSyncValuesAfterDataChange&&this.addEventListenersForDataChanges()},n.prototype.applyExcelModeOptions=function(e){e.excelMode==="windows"?(e.buttons||(e.buttons=["apply","cancel"]),e.closeOnApply==null&&(e.closeOnApply=!0)):e.excelMode==="mac"&&(e.buttons||(e.buttons=["reset"]),e.applyMiniFilterWhileTyping==null&&(e.applyMiniFilterWhileTyping=!0),e.debounceMs==null&&(e.debounceMs=500))},n.prototype.checkSetFilterDeprecatedParams=function(e){if(e.syncValuesLikeExcel){var t="AG Grid: since version 22.x, the Set Filter param syncValuesLikeExcel is no longer used as this is the default behaviour. To turn this default behaviour off, use the param suppressSyncValuesAfterDataChange";l._.doOnce(function(){},"syncValuesLikeExcel deprecated")}if(e.selectAllOnMiniFilter){var a="AG Grid: since version 22.x, the Set Filter param selectAllOnMiniFilter is no longer used as this is the default behaviour.";l._.doOnce(function(){},"selectAllOnMiniFilter deprecated")}if(e.suppressSyncValuesAfterDataChange){var r="AG Grid: since version 23.1, the Set Filter param suppressSyncValuesAfterDataChange has been deprecated and will be removed in a future major release.";l._.doOnce(function(){},"suppressSyncValuesAfterDataChange deprecated")}if(e.suppressRemoveEntries){var i="AG Grid: since version 23.1, the Set Filter param suppressRemoveEntries has been deprecated and will be removed in a future major release.";l._.doOnce(function(){},"suppressRemoveEntries deprecated")}},n.prototype.addEventListenersForDataChanges=function(){var e=this;this.addManagedListener(this.eventService,l.zW2.EVENT_ROW_DATA_UPDATED,function(){return e.syncAfterDataChange()}),this.addManagedListener(this.eventService,l.zW2.EVENT_CELL_VALUE_CHANGED,function(t){e.setFilterParams&&t.column===e.setFilterParams.column&&e.syncAfterDataChange()})},n.prototype.syncAfterDataChange=function(e,t){var a=this;if(e===void 0&&(e=!0),t===void 0&&(t=!0),!this.valueModel)throw new Error("Value model has not been created.");var r=l.j_S.resolve();return e?r=this.valueModel.refreshValues(t):t||(r=this.valueModel.setModel(null)),r.then(function(){a.refresh(),a.onBtApply(!1,!0)})},n.prototype.setLoading=function(e){var t="AG Grid: since version 23.2, setLoading has been deprecated. The loading screen is displayed automatically when the set filter is retrieving values.";l._.doOnce(function(){},"setFilter.setLoading"),this.showOrHideLoadingScreen(e)},n.prototype.showOrHideLoadingScreen=function(e){l._.setDisplayed(this.eFilterLoading,e)},n.prototype.initialiseFilterBodyUi=function(){this.initVirtualList(),this.initMiniFilter()},n.prototype.initVirtualList=function(){var e=this;if(!this.setFilterParams)throw new Error("Set filter params have not been provided.");if(!this.valueModel)throw new Error("Value model has not been created.");var t=this.virtualList=this.createBean(new l.CPJ("filter")),a=this.getRefElement("eSetFilterList");a&&a.appendChild(t.getGui());var r=this.setFilterParams.cellHeight;r!=null&&t.setRowHeight(r),t.setComponentCreator(function(g){return e.createSetListItem(g)});var i;this.setFilterParams.suppressSelectAll?i=new Ut(this.valueModel):i=new Bt(this.valueModel,function(){return e.isSelectAllSelected()}),t.setModel(i)},n.prototype.getSelectAllLabel=function(){if(!this.setFilterParams)throw new Error("Set filter params have not been provided.");if(!this.valueModel)throw new Error("Value model has not been created.");var e=this.valueModel.getMiniFilter()==null||!this.setFilterParams.excelMode?"selectAll":"selectAllSearchResults";return this.translateForSetFilter(e)},n.prototype.createSetListItem=function(e){var t=this;if(!this.setFilterParams)throw new Error("Set filter params have not been provided.");if(!this.valueModel)throw new Error("Value model has not been created.");var a;return e===n.SELECT_ALL_VALUE?(a=this.createBean(new he(function(){return t.getSelectAllLabel()},this.setFilterParams,function(r){return t.translateForSetFilter(r)},this.isSelectAllSelected())),a.addEventListener(he.EVENT_SELECTION_CHANGED,function(r){return t.onSelectAll(r.isSelected)}),a):(a=this.createBean(new he(e,this.setFilterParams,function(r){return t.translateForSetFilter(r)},this.valueModel.isValueSelected(e))),a.addEventListener(he.EVENT_SELECTION_CHANGED,function(r){return t.onItemSelected(e,r.isSelected)}),a)},n.prototype.initMiniFilter=function(){var e=this;if(!this.setFilterParams)throw new Error("Set filter params have not been provided.");if(!this.valueModel)throw new Error("Value model has not been created.");var t=this,a=t.eMiniFilter,r=t.gridOptionsWrapper,i=r.getLocaleTextFunc();l._.setDisplayed(a.getGui(),!this.setFilterParams.suppressMiniFilter),a.setValue(this.valueModel.getMiniFilter()),a.onValueChange(function(){return e.onMiniFilterInput()}),a.setInputAriaLabel(i("ariaSearchFilterValues","Search filter values")),this.addManagedListener(a.getInputElement(),"keypress",function(g){return e.onMiniFilterKeyPress(g)})},n.prototype.afterGuiAttached=function(e){if(!this.setFilterParams)throw new Error("Set filter params have not been provided.");o.prototype.afterGuiAttached.call(this,e),this.refreshVirtualList(),this.setFilterParams.excelMode&&this.resetUiToActiveModel();var t=this.eMiniFilter;t.setInputPlaceholder(this.translateForSetFilter("searchOoo")),(!e||!e.suppressFocus)&&t.getFocusableElement().focus();var a=!!(e&&e.container==="floatingFilter"),r;this.gridOptionsWrapper.isEnableRtl()?r={bottom:!0,bottomLeft:!0,left:!0}:r={bottom:!0,bottomRight:!0,right:!0},a?(this.positionableFeature.restoreLastSize(),this.positionableFeature.setResizable(r)):(this.positionableFeature.removeSizeFromEl(),this.positionableFeature.setResizable(!1))},n.prototype.applyModel=function(){if(!this.setFilterParams)throw new Error("Set filter params have not been provided.");if(!this.valueModel)throw new Error("Value model has not been created.");this.setFilterParams.excelMode&&this.valueModel.isEverythingVisibleSelected()&&this.valueModel.selectAllMatchingMiniFilter();var e=o.prototype.applyModel.call(this),t=this.getModel();return t?this.appliedModelValues=l._.reduce(t.values,function(a,r){return a[String(r)]=!0,a},{}):this.appliedModelValues=null,e},n.prototype.isModelValid=function(e){return this.setFilterParams&&this.setFilterParams.excelMode?e==null||e.values.length>0:!0},n.prototype.doesFilterPass=function(e){var t=this;if(!this.setFilterParams||!this.valueModel||!this.appliedModelValues)return!0;var a=this.setFilterParams,r=a.valueGetter,i=a.colDef.keyCreator,g=r(e.node);if(i){var p={value:g,colDef:this.setFilterParams.colDef,column:this.setFilterParams.column,node:e.node,data:e.data,api:this.gridOptionsWrapper.getApi(),columnApi:this.gridOptionsWrapper.getColumnApi(),context:this.gridOptionsWrapper.getContext()};g=i(p)}return g=l._.makeNull(g),Array.isArray(g)?l._.some(g,function(s){return t.appliedModelValues[l._.makeNull(s)]===!0}):this.appliedModelValues[g]===!0},n.prototype.onNewRowsLoaded=function(){if(!this.valueModel)throw new Error("Value model has not been created.");var e=this.valueModel.getValuesType(),t=this.isNewRowsActionKeep();this.syncAfterDataChange(e===D.TAKEN_FROM_GRID_VALUES,t)},n.prototype.setFilterValues=function(e){var t=this;if(!this.valueModel)throw new Error("Value model has not been created.");this.valueModel.overrideValues(e,this.isNewRowsActionKeep()).then(function(){t.refresh(),t.onUiChanged()})},n.prototype.resetFilterValues=function(){if(!this.valueModel)throw new Error("Value model has not been created.");this.valueModel.setValuesType(D.TAKEN_FROM_GRID_VALUES),this.syncAfterDataChange(!0,this.isNewRowsActionKeep())},n.prototype.refreshFilterValues=function(){var e=this;if(!this.valueModel)throw new Error("Value model has not been created.");!this.valueModel.isInitialised()||this.valueModel.refreshValues().then(function(){e.refresh(),e.onUiChanged()})},n.prototype.onAnyFilterChanged=function(){var e=this;setTimeout(function(){if(!!e.isAlive()){if(!e.valueModel)throw new Error("Value model has not been created.");e.valueModel.refreshAfterAnyFilterChanged().then(function(){return e.refresh()})}},0)},n.prototype.onMiniFilterInput=function(){if(!this.setFilterParams)throw new Error("Set filter params have not been provided.");if(!this.valueModel)throw new Error("Value model has not been created.");this.valueModel.setMiniFilter(this.eMiniFilter.getValue())&&(this.setFilterParams.applyMiniFilterWhileTyping?this.filterOnAllVisibleValues(!1):this.updateUiAfterMiniFilterChange())},n.prototype.updateUiAfterMiniFilterChange=function(){if(!this.setFilterParams)throw new Error("Set filter params have not been provided.");if(!this.valueModel)throw new Error("Value model has not been created.");this.setFilterParams.excelMode?this.valueModel.getMiniFilter()==null?this.resetUiToActiveModel():(this.valueModel.selectAllMatchingMiniFilter(!0),this.refresh(),this.onUiChanged()):this.refresh(),this.showOrHideResults()},n.prototype.showOrHideResults=function(){if(!this.valueModel)throw new Error("Value model has not been created.");var e=this.valueModel.getMiniFilter()!=null&&this.valueModel.getDisplayedValueCount()<1;l._.setDisplayed(this.eNoMatches,e),l._.setDisplayed(this.eSetFilterList,!e)},n.prototype.resetUiToActiveModel=function(){var e=this;if(!this.valueModel)throw new Error("Value model has not been created.");this.eMiniFilter.setValue(null,!0),this.valueModel.setMiniFilter(null),this.setModelIntoUi(this.getModel()).then(function(){return e.onUiChanged(!1,"prevent")})},n.prototype.onMiniFilterKeyPress=function(e){l._.isKeyPressed(e,l.VDZ.ENTER)&&(!this.setFilterParams||!this.setFilterParams.excelMode)&&this.filterOnAllVisibleValues()},n.prototype.filterOnAllVisibleValues=function(e){if(e===void 0&&(e=!0),!this.valueModel)throw new Error("Value model has not been created.");this.valueModel.selectAllMatchingMiniFilter(!0),this.refresh(),this.onUiChanged(!1,e?"immediately":"debounce"),this.showOrHideResults()},n.prototype.focusRowIfAlive=function(e){var t=this;e!=null&&window.setTimeout(function(){if(!t.virtualList)throw new Error("Virtual list has not been created.");t.isAlive()&&t.virtualList.focusRow(e)},0)},n.prototype.onSelectAll=function(e){if(!this.valueModel)throw new Error("Value model has not been created.");if(!this.virtualList)throw new Error("Virtual list has not been created.");e?this.valueModel.selectAllMatchingMiniFilter():this.valueModel.deselectAllMatchingMiniFilter();var t=this.virtualList.getLastFocusedRow();this.refresh(),this.onUiChanged(),this.focusRowIfAlive(t)},n.prototype.onItemSelected=function(e,t){if(!this.valueModel)throw new Error("Value model has not been created.");if(!this.virtualList)throw new Error("Virtual list has not been created.");t?this.valueModel.selectValue(e):this.valueModel.deselectValue(e);var a=this.virtualList.getLastFocusedRow();this.refresh(),this.onUiChanged(),this.focusRowIfAlive(a)},n.prototype.setMiniFilter=function(e){this.eMiniFilter.setValue(e),this.onMiniFilterInput()},n.prototype.getMiniFilter=function(){return this.valueModel?this.valueModel.getMiniFilter():null},n.prototype.selectEverything=function(){var e="AG Grid: since version 23.2, selectEverything has been deprecated. Please use setModel instead.";if(l._.doOnce(function(){},"setFilter.selectEverything"),!this.valueModel)throw new Error("Value model has not been created.");this.valueModel.selectAllMatchingMiniFilter(),this.refresh()},n.prototype.selectNothing=function(){var e="AG Grid: since version 23.2, selectNothing has been deprecated. Please use setModel instead.";if(l._.doOnce(function(){},"setFilter.selectNothing"),!this.valueModel)throw new Error("Value model has not been created.");this.valueModel.deselectAllMatchingMiniFilter(),this.refresh()},n.prototype.unselectValue=function(e){var t="AG Grid: since version 23.2, unselectValue has been deprecated. Please use setModel instead.";if(l._.doOnce(function(){},"setFilter.unselectValue"),!this.valueModel)throw new Error("Value model has not been created.");this.valueModel.deselectValue(e),this.refresh()},n.prototype.selectValue=function(e){var t="AG Grid: since version 23.2, selectValue has been deprecated. Please use setModel instead.";if(l._.doOnce(function(){},"setFilter.selectValue"),!this.valueModel)throw new Error("Value model has not been created.");this.valueModel.selectValue(e),this.refresh()},n.prototype.refresh=function(){if(!this.virtualList)throw new Error("Virtual list has not been created.");this.virtualList.refresh()},n.prototype.isValueSelected=function(e){var t="AG Grid: since version 23.2, isValueSelected has been deprecated. Please use getModel instead.";if(l._.doOnce(function(){},"setFilter.isValueSelected"),!this.valueModel)throw new Error("Value model has not been created.");return this.valueModel.isValueSelected(e)},n.prototype.isEverythingSelected=function(){var e="AG Grid: since version 23.2, isEverythingSelected has been deprecated. Please use getModel instead.";if(l._.doOnce(function(){},"setFilter.isEverythingSelected"),!this.valueModel)throw new Error("Value model has not been created.");return this.valueModel.isEverythingVisibleSelected()},n.prototype.isNothingSelected=function(){var e="AG Grid: since version 23.2, isNothingSelected has been deprecated. Please use getModel instead.";if(l._.doOnce(function(){},"setFilter.isNothingSelected"),!this.valueModel)throw new Error("Value model has not been created.");return this.valueModel.isNothingVisibleSelected()},n.prototype.getUniqueValueCount=function(){var e="AG Grid: since version 23.2, getUniqueValueCount has been deprecated. Please use getValues instead.";if(l._.doOnce(function(){},"setFilter.getUniqueValueCount"),!this.valueModel)throw new Error("Value model has not been created.");return this.valueModel.getUniqueValueCount()},n.prototype.getUniqueValue=function(e){var t="AG Grid: since version 23.2, getUniqueValue has been deprecated. Please use getValues instead.";if(l._.doOnce(function(){},"setFilter.getUniqueValue"),!this.valueModel)throw new Error("Value model has not been created.");return this.valueModel.getUniqueValue(e)},n.prototype.getValues=function(){return this.valueModel?this.valueModel.getValues():[]},n.prototype.refreshVirtualList=function(){this.setFilterParams&&this.setFilterParams.refreshValuesOnOpen?this.refreshFilterValues():this.refresh()},n.prototype.translateForSetFilter=function(e){var t=this.gridOptionsWrapper.getLocaleTextFunc();return t(e,sn[e])},n.prototype.isSelectAllSelected=function(){if(!this.setFilterParams||!this.valueModel)return!1;if(this.setFilterParams.defaultToNothingSelected){if(this.valueModel.hasSelections()&&this.valueModel.isEverythingVisibleSelected())return!0;if(this.valueModel.isNothingVisibleSelected())return!1}else{if(this.valueModel.hasSelections()&&this.valueModel.isNothingVisibleSelected())return!1;if(this.valueModel.isEverythingVisibleSelected())return!0}},n.prototype.destroy=function(){this.virtualList!=null&&(this.virtualList.destroy(),this.virtualList=null),o.prototype.destroy.call(this)},n.SELECT_ALL_VALUE="__AG_SELECT_ALL__",oe([(0,l.cqo)("eMiniFilter")],n.prototype,"eMiniFilter",void 0),oe([(0,l.cqo)("eFilterLoading")],n.prototype,"eFilterLoading",void 0),oe([(0,l.cqo)("eSetFilterList")],n.prototype,"eSetFilterList",void 0),oe([(0,l.cqo)("eFilterNoMatches")],n.prototype,"eNoMatches",void 0),oe([(0,l.fsG)("valueFormatterService")],n.prototype,"valueFormatterService",void 0),n}(l.AGU),Ut=function(){function o(n){this.model=n}return o.prototype.getRowCount=function(){return this.model.getDisplayedValueCount()},o.prototype.getRow=function(n){return this.model.getDisplayedValue(n)},o.prototype.isRowSelected=function(n){return this.model.isValueSelected(this.getRow(n))},o}(),Bt=function(){function o(n,e){this.model=n,this.isSelectAllSelected=e}return o.prototype.getRowCount=function(){return this.model.getDisplayedValueCount()+1},o.prototype.getRow=function(n){return n===0?pn.SELECT_ALL_VALUE:this.model.getDisplayedValue(n-1)},o.prototype.isRowSelected=function(n){return n===0?this.isSelectAllSelected():this.model.isValueSelected(this.getRow(n))},o}(),Ht=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Le=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Zt=function(o){Ht(n,o);function n(){var e=o.call(this,`
            <div class="ag-floating-filter-input" role="presentation">
                <ag-input-text-field ref="eFloatingFilterText"></ag-input-text-field>
            </div>`)||this;return e.availableValuesListenerAdded=!1,e}return n.prototype.destroy=function(){o.prototype.destroy.call(this)},n.prototype.init=function(e){var t=this.columnModel.getDisplayNameForColumn(e.column,"header",!0),a=this.gridOptionsWrapper.getLocaleTextFunc();this.eFloatingFilterText.setDisabled(!0).setInputAriaLabel(t+" "+a("ariaFilterInput","Filter Input")).addGuiEventListener("click",function(){return e.showParentFilter()}),this.params=e},n.prototype.onParentModelChanged=function(e){this.lastKnownModel=e,this.updateFloatingFilterText()},n.prototype.addAvailableValuesListener=function(){var e=this;this.params.parentFilterInstance(function(t){var a=t.getValueModel();!a||e.addManagedListener(a,gn.EVENT_AVAILABLE_VALUES_CHANGED,function(){return e.updateFloatingFilterText()})}),this.availableValuesListenerAdded=!0},n.prototype.updateFloatingFilterText=function(){var e=this;if(!this.lastKnownModel){this.eFloatingFilterText.setValue("");return}this.availableValuesListenerAdded||this.addAvailableValuesListener();var t=this.lastKnownModel instanceof Array?this.lastKnownModel:this.lastKnownModel.values;if(!t){this.eFloatingFilterText.setValue("");return}this.params.parentFilterInstance(function(a){var r=a.getValueModel();if(!!r){var i=l._.filter(t,function(c){return r.isValueAvailable(c)}),g=e.gridOptionsWrapper.getLocaleTextFunc(),p=l._.map(i,function(c){var u=e.params,h=u.column,m=u.filterParams,f=e.valueFormatterService.formatValue(h,null,null,c,m.valueFormatter,!1),b=f??c;return b??g("blanks",sn.blanks)}),s=p.length>10?p.slice(0,10).concat("..."):p,d="("+p.length+") "+s.join(",");e.eFloatingFilterText.setValue(d)}})},Le([(0,l.cqo)("eFloatingFilterText")],n.prototype,"eFloatingFilterText",void 0),Le([(0,l.fsG)("valueFormatterService")],n.prototype,"valueFormatterService",void 0),Le([(0,l.fsG)("columnModel")],n.prototype,"columnModel",void 0),n}(l.wA2),Yt={moduleName:l.GXE.SetFilterModule,beans:[],userComponents:[{componentName:"agSetColumnFilter",componentClass:pn},{componentName:"agSetColumnFloatingFilter",componentClass:Zt}],dependantModules:[z]},Kt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),Ne=function(){return Ne=Object.assign||function(o){for(var n,e=1,t=arguments.length;e<t;e++){n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(o[a]=n[a])}return o},Ne.apply(this,arguments)},Qt=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},dn=function(o){Kt(n,o);function n(){var e=o!==null&&o.apply(this,arguments)||this;return e.loadRowDataVersion=0,e.needRefresh=!1,e}return n.prototype.init=function(e,t){var a=this;this.params=t,this.comp=e;var r=t.pinned!=null;r||(this.setAutoHeightClasses(),this.checkForDeprecations(),this.ensureValidRefreshStrategy(),this.addThemeToDetailGrid(),this.createDetailGrid(),this.loadRowData(),this.addManagedListener(t.node.parent,l.Fxk.EVENT_DATA_CHANGED,function(){a.needRefresh=!0}))},n.prototype.setAutoHeightClasses=function(){var e=this.gridOptionsWrapper.isDetailRowAutoHeight(),t=e?"ag-details-row-auto-height":"ag-details-row-fixed-height",a=e?"ag-details-grid-auto-height":"ag-details-grid-fixed-height";this.comp.addOrRemoveCssClass(t,!0),this.comp.addOrRemoveDetailGridCssClass(a,!0)},n.prototype.checkForDeprecations=function(){this.params.suppressRefresh&&(this.params.refreshStrategy="nothing")},n.prototype.ensureValidRefreshStrategy=function(){switch(this.params.refreshStrategy){case"rows":case"nothing":case"everything":return}this.params.refreshStrategy,this.params.refreshStrategy="rows"},n.prototype.addThemeToDetailGrid=function(){var e=this.environment.getTheme().theme;e&&this.comp.addOrRemoveDetailGridCssClass(e,!0)},n.prototype.createDetailGrid=function(){if(!l._.missing(this.params.detailGridOptions)){var e=this.gridOptionsWrapper.isDetailRowAutoHeight(),t=Ne({},this.params.detailGridOptions);e&&(t.domLayout="autoHeight"),this.comp.setDetailGrid(t)}},n.prototype.registerDetailWithMaster=function(e,t){var a=this.params.node.id,r=this.params.api,i={id:a,api:e,columnApi:t},g=this.params.node;r.addDetailGridInfo(a,i),g.detailGridInfo=i,this.addDestroyFunc(function(){r.removeDetailGridInfo(a),g.detailGridInfo=null})},n.prototype.loadRowData=function(){var e=this;this.loadRowDataVersion++;var t=this.loadRowDataVersion,a=this.params.getDetailRowData;if(!!a){var r=function(g){var p=e.loadRowDataVersion===t;p&&e.comp.setRowData(g)},i={node:this.params.node,data:this.params.node.data,successCallback:r,context:this.gridOptionsWrapper.getContext()};a(i)}},n.prototype.refresh=function(){var e=!1,t=!0,a=!this.needRefresh||this.params.refreshStrategy==="nothing";return a?t:(this.needRefresh=!1,this.params.refreshStrategy==="everything"?e:(this.loadRowData(),t))},Qt([(0,l.fsG)("environment")],n.prototype,"environment",void 0),n}(l.AS9),Xt=function(){var o=function(n,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,a){t.__proto__=a}||function(t,a){for(var r in a)a.hasOwnProperty(r)&&(t[r]=a[r])},o(n,e)};return function(n,e){o(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}}(),qt=function(o,n,e,t){var a=arguments.length,r=a<3?n:t===null?t=Object.getOwnPropertyDescriptor(n,e):t,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,e,t);else for(var g=o.length-1;g>=0;g--)(i=o[g])&&(r=(a<3?i(r):a>3?i(n,e,r):i(n,e))||r);return a>3&&r&&Object.defineProperty(n,e,r),r},Jt=function(o){Xt(n,o);function n(){return o!==null&&o.apply(this,arguments)||this}return n.prototype.init=function(e){var t=this;this.params=e,this.selectAndSetTemplate();var a={addOrRemoveCssClass:function(r,i){return t.addOrRemoveCssClass(r,i)},addOrRemoveDetailGridCssClass:function(r,i){return l._.addOrRemoveCssClass(t.eDetailGrid,r,i)},setDetailGrid:function(r){return t.setDetailGrid(r)},setRowData:function(r){return t.setRowData(r)}};this.ctrl=this.createManagedBean(new dn),this.ctrl.init(a,e)},n.prototype.refresh=function(){return this.ctrl&&this.ctrl.refresh()},n.prototype.destroy=function(){o.prototype.destroy.call(this)},n.prototype.selectAndSetTemplate=function(){var e=this;if(this.params.pinned){this.setTemplate('<div class="ag-details-row"></div>');return}var t=function(){e.setTemplate(n.TEMPLATE)};if(l._.missing(this.params.template))t();else if(typeof this.params.template=="string")this.setTemplate(this.params.template);else if(typeof this.params.template=="function"){var a=this.params.template,r=a(this.params);this.setTemplate(r)}else t();this.eDetailGrid==null},n.prototype.setDetailGrid=function(e){!this.eDetailGrid||(new l.rjZ(this.eDetailGrid,e,{$scope:this.params.$scope,$compile:this.params.$compile,providedBeanInstances:{agGridReact:this.params.agGridReact,frameworkComponentWrapper:this.params.frameworkComponentWrapper}}),this.detailApi=e.api,this.ctrl.registerDetailWithMaster(e.api,e.columnApi),this.addDestroyFunc(function(){e.api&&e.api.destroy()}))},n.prototype.setRowData=function(e){this.detailApi&&this.detailApi.setRowData(e)},n.TEMPLATE=`<div class="ag-details-row">
            <div ref="eDetailGrid" class="ag-details-grid"></div>
        </div>`,qt([(0,l.cqo)("eDetailGrid")],n.prototype,"eDetailGrid",void 0),n}(l.wA2),$t={moduleName:l.GXE.MasterDetailModule,beans:[],userComponents:[{componentName:"agDetailCellRenderer",componentClass:Jt}],controllers:[{controllerName:"detailCellRenderer",controllerClass:dn}],dependantModules:[z]},ea=w(7731),na=w.n(ea),v=w(4174);const ta="COGITO_SOFTWARE_Co_Ltd_on_behalf_of_FAST_FISH_(CHINA)_APPAREL_LTD._,CO_MultiApp_1Devs2_July_2019__MTU2MjAyMjAwMDAwMA==73f4b2d33a7f2bf6aca17a21940fd8ed",cn=function(){return{page:v.ZP.t("tips.page"),more:v.ZP.t("tips.more"),to:v.ZP.t("tips.to"),of:v.ZP.t("tips.total"),next:v.ZP.t("tips.next"),previous:v.ZP.t("tips.previous"),loadingOoo:`${v.ZP.t("tips.loading")}...`,selectAll:v.ZP.t("tips.selectAll"),searchOoo:`${v.ZP.t("tips.search")}...`,blanks:v.ZP.t("tips.null"),filterOoo:`${v.ZP.t("tips.search")}...`,applyFilter:v.ZP.t("tips.search"),equals:v.ZP.t("tips.equal"),notEqual:v.ZP.t("tips.notEqual"),notContains:v.ZP.t("tips.exclude"),lessThanOrEqual:v.ZP.t("tips.lessThanOrEqual"),greaterThanOrEqual:v.ZP.t("tips.greaterOrEqual"),inRange:v.ZP.t("tips.inRange"),lessThan:v.ZP.t("tips.lessThan"),greaterThan:v.ZP.t("tips.greater"),contains:v.ZP.t("tips.contain"),startsWith:v.ZP.t("tips.startWith"),endsWith:v.ZP.t("tips.endWith"),group:v.ZP.t("table.currentGroup"),columns:v.ZP.t("table.allColumns"),rowGroupColumns:v.ZP.t("table.perspectiveColumn"),rowGroupColumnsEmptyMessage:v.ZP.t("table.dropGroupColumnHere"),valueColumns:v.ZP.t("table.aggregateColumn"),pivotMode:v.ZP.t("table.perspectiveMode"),groups:v.ZP.t("table.groupDetails"),values:v.ZP.t("table.aggregateAnalysisValue"),pivots:v.ZP.t("table.perspectiveColumn"),valueColumnsEmptyMessage:v.ZP.t("table.dropAggregatedGroupColumnHere"),pivotColumnsEmptyMessage:v.ZP.t("table.dropPerspectiveGroupColumnHere"),noRowsToShow:v.ZP.t("tips.noData"),pinColumn:v.ZP.t("table.pinnedColumn"),valueAggregation:v.ZP.t("table.aggregateValue"),autosizeThiscolumn:v.ZP.t("table.autosizeThiscolumn"),autosizeAllColumns:v.ZP.t("table.autosizeAllColumns"),groupBy:v.ZP.t("tips.groupBy"),ungroupBy:v.ZP.t("tips.ungroupBy"),resetColumns:v.ZP.t("table.resetColumns"),destroyColumnComps:v.ZP.t("table.resetColumns"),expandAll:v.ZP.t("tips.expandAll"),collapseAll:v.ZP.t("tips.collapseAll"),toolPanel:v.ZP.t("tips.toolPanel"),export:v.ZP.t("tips.export"),csvExport:v.ZP.t("tips.csvExport"),excelExport:v.ZP.t("tips.excelExport"),pinLeft:v.ZP.t("tips.pinLeft"),pinRight:v.ZP.t("tips.pinRight"),noPin:v.ZP.t("tips.unpin"),sum:v.ZP.t("tips.sum"),min:v.ZP.t("tips.minimum"),max:v.ZP.t("tips.max"),first:v.ZP.t("table.firstValue"),last:v.ZP.t("table.lastValue"),none:v.ZP.t("tips.noData"),count:v.ZP.t("table.count"),avg:v.ZP.t("tips.avg"),average:v.ZP.t("tips.average"),copyWithHeaders:v.ZP.t("table.copyWithHeaders"),copy:v.ZP.t("tips.copy"),ctrlC:"ctrl+C",paste:v.ZP.t("tips.paste"),ctrlV:"ctrl+V"}},Ie={hover:"ag-syman-hover",imagePreviewBox:"image-preview-box",tooltipBox:"tooltip-box",tooltipTopBox:"tooltip-top-box",textRight:"text-right",attachment:"attachment","table-cell-left":"table-cell-left","table-cell-center":"table-cell-center","table-cell-right":"table-cell-right"},Ge={debounceVerticalScrollbar:!0,columnDefs:[],rowData:[],multiSortKey:"ctrl",animateRows:!0,pagination:!1,paginationPageSize:10,suppressAutoSize:!1,enableRangeSelection:!1,rowSelection:"multiple",suppressRowClickSelection:!0,quickFilterText:null,groupSelectsChildren:!1,defaultColDef:{comparator:function(){return 0},enableRowGroup:!0,enablePivot:!0,enableValue:!0,resizable:!0},enableCellChangeFlash:!0,suppressDragLeaveHidesColumns:!0,rowDragManaged:!0,rowGroupPanelShow:"onlyWhenGrouping",rowBuffer:10,rowHeight:32,enterMovesDownAfterEdit:!0,enterMovesDown:!0,localeText:cn(),groupDefaultExpanded:1,domLayout:null,groupDisplayType:"multipleColumns",suppressClipboardPaste:!0,columnTypes:{NUMBER:{},STRING:{}},overlayLoadingTemplate:`<img src="${na()}" />`};Object.defineProperty(Ge,"localeText",{get(){return cn()}});var me=w(5331),I=w(9277),T=w(8192),fe=w(4470),aa=function(){var o=this,n=o.$createElement,e=o._self._c||n;return o.params.column.colDef.checkboxSelection?e("span",{staticClass:"ag-header-index",attrs:{title:o.params.headerName||o.params.displayName}},[o._v(o._s(o.params.headerName||o.params.displayName))]):e("div",{staticClass:"ag-cell-label-container",on:{mouseenter:o.containerMouseenter,mouseleave:o.containeroMouseleave,click:o.headerClick}},[e("span",{ref:"eMenu",staticClass:"ag-header-icon ag-header-cell-menu-button",style:o.eMenuStyle,on:{click:o.menuClick}},[e("span",{staticClass:"ag-icon ag-icon-menu"})]),o._v(" "),e("div",{ref:"eLabel",staticClass:"ag-header-cell-label",style:o.eLabelStyle,attrs:{role:"presentation"}},[e("div",{staticClass:"one-line-flow ag-header-wrap",class:[o.params.column.colDef.thAlign?"text-"+o.params.column.colDef.thAlign:""]},[e("span",{ref:"eText",staticClass:"ag-header-cell-text",attrs:{role:"columnheader",title:o.params.headerName||o.params.displayName}},[o._v(`
        `+o._s(o.params.headerName||o.params.displayName)+`
        `),o.params.column.colDef.comment?e("i",{class:["iconfont","comment","iconios-information-circle-outline",o.cssFeatures.hover],staticStyle:{color:"orangered"},on:{mouseenter:o.commentMouseenter,mouseleave:o.commentMouseleave}}):o._e()]),o._v(" "),e("span",{ref:"eSortAsc",class:["ag-header-sort","ag-header-icon","ag-sort-ascending-icon",o.params.column.colDef.isorder&&o.params.column.colDef.sort==="asc"?"":"ag-hidden"]},[e("span",{class:"ag-icon ag-icon-asc "+o.cssFeatures.hover+" trigger-sorting"})]),o._v(" "),e("span",{ref:"eSortDesc",class:["ag-header-sort","ag-header-icon","ag-sort-descending-icon",o.params.column.colDef.isorder&&o.params.column.colDef.sort==="desc"?"":"ag-hidden"]},[e("span",{class:"ag-icon ag-icon-desc "+o.cssFeatures.hover+" trigger-sorting"})]),o._v(" "),e("span",{ref:"eSortNone",class:["ag-header-sort","ag-header-icon","ag-sort-none-icon",!o.params.column.colDef.sort&&o.params.column.colDef.isorder?"":"ag-hidden"]},[e("span",{class:"ag-icon ag-icon-none "+o.cssFeatures.hover+" trigger-sorting"})])])])])},ra=[];const oa={hover:"ag-syman-hover",imagePreviewBox:"image-preview-box",tooltipBox:"tooltip-box",tooltipTopBox:"tooltip-top-box",textRight:"text-right",attachment:"attachment"},ia={name:"AgCustomHeader",data(){return{cssFeatures:oa}},computed:{eMenuStyle(){return`opacity: 0; ${this.params.enableMenu?"":"display: none;"}`},eLabelStyle(){return`${this.params.enableMenu?"":"width: 100%;"}`}},methods:{commentMouseenter(o){const{target:n}=o,e=n.getBoundingClientRect().left+window.scrollX,t=n.getBoundingClientRect().top+window.scrollY,{tooltipTopBox:a,column:r}=this.params;a.innerText=r.colDef.comment,a.style.display="",a.style.top=`${t-a.offsetHeight-7}px`,a.style.left=`${e-a.offsetWidth/2}px`},commentMouseleave(){const{tooltipTopBox:o}=this.params;o.style.display="none"},containerMouseenter(){const{enableMenu:o}=this.params;o&&(this.$refs.eMenu.style.opacity=1)},containeroMouseleave(){this.$refs.eMenu.style.opacity=0},menuClick(){this.params.enableMenu&&this.params.showColumnMenu(this.$refs.eMenu)},headerClick(o){this.params.column.colDef.isorder&&o.target.getAttribute("class").indexOf("trigger-sorting")>-1&&this.params.progressSort(o.shiftKey)},onSortChanged:(0,T.Ds)(function(){const{column:o}=this.params,{eSortAsc:n,eSortDesc:e,eSortNone:t}=this.$refs,a=o.getSort();a==="asc"?n&&n.classList.remove("ag-hidden"):n&&n.classList.add("ag-hidden"),a==="desc"?e&&e.classList.remove("ag-hidden"):e&&e.classList.add("ag-hidden"),a===null&&o.colDef.isorder?t&&t.classList.remove("ag-hidden"):t&&t.classList.add("ag-hidden")})},mounted(){const{enableSorting:o,column:n}=this.params;o&&n.addEventListener("sortChanged",this.onSortChanged)},beforeDestroy(){this.params.column.removeEventListener("sortChanged",this.onSortChanged)}};var ve=w(1900),la=(0,ve.Z)(ia,aa,ra,!1,null,"39104ec8",null);const ga=la.exports;var sa=function(){var o=this,n=o.$createElement,e=o._self._c||n;return e(o.params.renderComponent,o._g(o._b({tag:"component",attrs:{params:o.params}},"component",o.$attrs,!1),o.$listeners))},pa=[];const da={name:"AgCellRender",inheritAttrs:!1,data(){return{}},methods:{}};var ca=(0,ve.Z)(da,sa,pa,!1,null,"4fa49d18",null);const ua=ca.exports;var ha=Object.defineProperty,ma=Object.defineProperties,fa=Object.getOwnPropertyDescriptors,un=Object.getOwnPropertySymbols,va=Object.prototype.hasOwnProperty,ba=Object.prototype.propertyIsEnumerable,hn=(o,n,e)=>n in o?ha(o,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[n]=e,wa=(o,n)=>{for(var e in n||(n={}))va.call(n,e)&&hn(o,e,n[e]);if(un)for(var e of un(n))ba.call(n,e)&&hn(o,e,n[e]);return o},xa=(o,n)=>ma(o,fa(n));const ya={name:"CellRenderByFunction",render(o){const n=xa(wa({},this.params),{row:this.params.data,index:this.params.rowIndex,column:this.params.colDef});return typeof this.params.renderComponent!="function"?o("div",{domProps:{innerHTML:"<span></span>"}}):this.params.renderComponent(o,n)}};var Ca,_a,Aa=(0,ve.Z)(ya,Ca,_a,!1,null,null,null);const Ma=Aa.exports;var Re=w(2826),mn=w(4819);function fn(o){var n=/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,e=o.replace(n,"$1,");return e}var Ea=Object.defineProperty,Ta=Object.defineProperties,Da=Object.getOwnPropertyDescriptors,vn=Object.getOwnPropertySymbols,Sa=Object.prototype.hasOwnProperty,Pa=Object.prototype.propertyIsEnumerable,bn=(o,n,e)=>n in o?Ea(o,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[n]=e,ee=(o,n)=>{for(var e in n||(n={}))Sa.call(n,e)&&bn(o,e,n[e]);if(vn)for(var e of vn(n))Pa.call(n,e)&&bn(o,e,n[e]);return o},wn=(o,n)=>Ta(o,Da(n));ke.setLicenseKey(ta);const ie=document.createElement("div");ie.classList.add(Ie.tooltipBox);const ne=document.createElement("div");ne.classList.add(Ie.tooltipTopBox),ne.classList.add("arrow-down"),ne.style.display="none";let le=null,H=null;const Oa="commonTable",La="__ag_sequence_column_name__",Na={name:"AgGridTable",components:{AgGridVue:j.AgGridVue,CustomHeader:ga,CellRender:ua,CellRenderByFunction:Ma,TextComponent:Re.Z,SequenceComponent:mn.Z},props:{options:{type:Object,default:()=>({})},height:{type:String},data:{default:()=>[]},columns:{default:()=>[]},renderParams:{type:Function},mode:{type:String,default:""},externalModules:{type:Array,default:()=>[]},sequenceColumnField:{type:String,default:La},rowDataType:{type:String,default:"object"},cellStyle:{type:Function}},computed:{tableStyle(){return this.height?`height: ${this.height};`:""},gridOptions(){const o={onGridReady:this.onGridReady,getContextMenuItems:this.getContextMenuItems.bind(this),getMainMenuItems:this.getMainMenuItems.bind(this),onCellClicked:this.onCellClicked,onCellDoubleClicked:this.onCellDoubleClicked,onRowClicked:this.onRowClicked,onRowDoubleClicked:this.onRowDoubleClicked,onSelectionChanged:this.onSelectionChanged.bind(this),onSortChanged:this.onSortChanged,onVirtualColumnsChanged:this.onVirtualColumnsChanged,onColumnVisible:this.onColumnVisible,onColumnMoved:this.onColumnMoved,onColumnPinned:this.onColumnPinned,onRowDataChanged:this.onRowDataChanged,onBodyScroll:this.onBodyScroll,onFilterChanged:this.onFilterChanged,onColumnResized:this.onColumnResized,getRowClass:this.getRowClass,getRowStyle:this.getRowStyle,onGridSizeChanged:this.onGridSizeChanged},n=this.options.defaultColDef||{};return Object.assign({},Ge,o,this.options,{defaultColDef:ee(ee({},Ge.defaultColDef),n)})},realAgOptions(){const o=Object.assign({},this.gridOptions);return delete o.cssStatus,delete o.defaultSort,delete o.datas,delete o.agCellSingleClick,delete o.agCellDoubleClick,delete o.agRowClick,delete o.agRowDoubleClick,delete o.agSortChanged,delete o.agColumnVisibleChanged,delete o.agSelectionChanged,delete o.agColumnMoved,delete o.agColumnPinned,delete o.agHidePaste,o}},watch:{data:{handler(o){(0,I.kJ)(o)&&this._gridReady&&this.$nextTick(()=>{this.setRows(o),this._lockRecordScroll&&this.restoreScrollTop(!0)})}},columns:{handler(o){(0,I.kJ)(o)&&this._gridReady&&this.setCols(o)}}},data(){return{api:null,columnApi:null,subtotalRowData:null,fullRangeSubTotalRowData:null,realRows:[],realColumns:[],modules:[K.I,_t,Gt,Vt,Yt,$t,...this.externalModules]}},methods:{onGridReady(o){this.api=o.api,this.columnApi=o.columnApi,this._gridReady=!0;const n=this.$refs.table.$el,e=this.$refs.tableContainer;setTimeout(()=>{this._horizontalScrollTo(n.querySelector(".ag-body-viewport"),e.getAttribute("data-scroll-left")),this._autoSizeColumns()},20),n.appendChild(ie),document.body.appendChild(ne),(0,I.kJ)(this.columns)&&this.columns.length>0&&(this.setCols(this.columns),(0,I.kJ)(this.data)&&this.data.length>0&&this.$nextTick(()=>{this.setRows(this.data)})),this.$emit("grid-ready",o)},_scrollToRow(){const{rowHeight:o="32"}=this.gridOptions,n=Math.ceil(this._scrollTop/o)-1;this.api.ensureIndexVisible(Math.max(n,0),"top");const e=document.querySelector(".ag-body-viewport");e&&(e.scrollTop=this._scrollTop)},restoreScrollTop:(0,T.Ds)(function(o){this._scrollToRow(),o&&(this._lockRecordScroll=!1)},20),onSuppressKeyboardEvent(o){const{event:n}=o,e=n.code;if(e==="ArrowDown"||e==="ArrowUp")return!1;{const t=document.activeElement;if(t&&t.tagName==="INPUT"){const a=t.selectionStart,r=t.value,i=e==="ArrowLeft"&&a===0,g=e==="ArrowRight"&&a===r.length;return!(i||g)}else return!1}},onGridSizeChanged(o){this.$emit("on-grid-size-changed",o),setTimeout(()=>{const{clientWidth:n}=o;n!==this._tableWidthCache&&(this._tableWidthCache=n,this._resetColumnWidth())},200)},setRows(o){const n=this.$refs.table;if(!o)return n;if(!(0,I.kJ)(o))return alert("agTable.setRows requires Array as first param"),n;const{rowData:e,pinnedBottomRowData:t}=this._transformRowData(o),a=this.options.datas&&this.options.datas.start||0;return e.forEach((r,i)=>{r[this.sequenceColumnField]={val:a+(i+1)}}),this._pinnedBottomRowData=t,this.realRows=e,this.api.setRowData(e),this.api.setPinnedBottomRowData(t),this._fixAgRenderChoke(),this.api.hideOverlay(),n},setCols(o){const n=this.$refs.table;if(!o)return n;if(!(0,I.kJ)(o))return alert("agTable.setCols requires Array as first param"),n;this._colPosition="",this._originColumnDefs=o;const e=this.gridOptions,t=e.datas&&e.datas.colPosition||"";let a;return t&&t!==""?a=this._getSortedData(o,t):(this.options.datas&&this.options.datas.pinnedColumns&&this._sortPinnedColumns(o),a=o),this.realColumns=this._transformColumnDefs(a),this.api.setColumnDefs(this.realColumns),setTimeout(()=>{this._autoSizeColumns()},20),n},getContextMenuItems(o){const n=["copy","copyWithHeaders","paste",{name:this.$t("table.showAllColumns"),action:()=>{const e=this.options;o.columnApi.setColumnsVisible(o.columnApi.getColumnState().map(t=>t.colId),!0),setTimeout(()=>{le&&clearTimeout(le)},0),this._colPosition&&this._colPosition!==""&&(this._colPosition.split(",").forEach((t,a)=>{o.columnApi.moveColumn(t,a)}),setTimeout(()=>{H&&clearTimeout(H)},0)),(0,T.mf)(e.agColumnVisibleChanged)&&(this._preventPinnedEmit=!0,e.agColumnVisibleChanged("",()=>{this._preventPinnedEmit=!1}))}}];return this.options.agHidePaste&&n.splice(2,1),n},getMainMenuItems(o){return["pinSubMenu","separator","autoSizeThis","autoSizeAll","separator",{name:this.$t("table.hideCurrentColumn"),action:()=>{const{columnApi:n,column:e}=o;n.setColumnVisible(e.colId,!1)}},{name:this.$t("table.resetColumns"),action:()=>{this._isResetAllColumn=!0;const n=this.options,e=[];this._originColumnDefs.map(g=>g.colname||g.field).forEach(g=>{const p=o.columnApi.getColumn(g);p&&p.visible&&e.push(g)}),e.forEach((g,p)=>{o.columnApi.moveColumn(g,p)});const t=this.options.datas&&this.options.datas.pinnedColumns||"",{pinnedLeftColumns:a,pinnedRightColumns:r}=this._getPinnedColumns(t);o.columnApi.getDisplayedLeftColumns().map(g=>g.colId).concat(o.columnApi.getDisplayedRightColumns().map(g=>g.colId)).forEach(g=>{g!=="ID"&&!a.includes(g)&&!r.includes(g)&&o.columnApi.setColumnPinned(g,!1)}),setTimeout(()=>{H&&clearTimeout(H)},0),this._colPosition="",(0,T.mf)(n.agColumnMoved)&&n.agColumnMoved(""),(0,T.mf)(n.agColumnPinned)&&n.agColumnPinned("ID|"),setTimeout(()=>{this._isResetAllColumn=!1},500)}}]},onCellClicked(o){const{colDef:n,data:e,event:t}=o,{__ag_is_statistic_row__:a}=e,r=this.options;(0,T.mf)(r.agCellSingleClick)&&!a&&r.agCellSingleClick(n,e,t.target),this.$emit("on-cell-single-click",o),window.arkui_BCL_in_mobile&&this._cellDoubleClickedInMobile(o)},_cellDoubleClickedInMobile(o){if(this._clickTime===void 0){this._clickTime=+new Date;return}+new Date-this._clickTime<400&&this.onCellDoubleClicked(Object.assign(o,{type:"cellDoubleClicked",mockEvent:!0})),this._clickTime=+new Date},onCellDoubleClicked(o){const{colDef:n,data:e,event:t}=o,{__ag_is_statistic_row__:a}=e,r=this.options;(0,T.mf)(r.agCellDoubleClick)&&!a&&r.agCellDoubleClick(n,e,t.target),this.$emit("on-cell-double-click",o)},onRowClicked(o){const{colDef:n,data:e,event:t}=o,{__ag_is_statistic_row__:a}=e,r=this.options;(0,T.mf)(r.agRowClick)&&!a&&r.agRowClick(n,e,t.target),this.$emit("on-row-click",o)},onRowDoubleClicked(o){const{colDef:n,data:e,event:t}=o,{__ag_is_statistic_row__:a}=e,r=this.options;(0,T.mf)(r.agRowDoubleClick)&&!a&&r.agRowDoubleClick(n,e,t.target),this.$emit("on-row-dblclick",o)},onSelectionChanged(o){const n=this.options,e=[],t=[];o.api.getSelectedRows().forEach(a=>{const{val:r}=a.ID;r!==this.$t("tips.summation")&&r!==this.$t("tips.total")&&(e.push(r),t.push(a))}),(0,T.mf)(n.agSelectionChanged)&&n.agSelectionChanged(e,t),this.$emit("on-selection-change",t)},onSortChanged(o){const{api:n}=o,e=this.options,t=n.getSortModel();t.length!==0&&(n.showLoadingOverlay(),(0,T.mf)(e.agSortChanged)||this.handleSort(t[0]),this.$emit("on-sort-change",t),n.hideOverlay()),(0,T.mf)(e.agSortChanged)&&e.agSortChanged(t)},handleSort(o){const n=o.colId,e=this.data;let t=[];o.sort==="desc"?t=e.sort((a,r)=>typeof a[n]=="string"||typeof r[n]=="string"?String(a[n])>String(r[n])?-1:1:r[n]-a[n]):t=e.sort((a,r)=>typeof a[n]=="string"||typeof r[n]=="string"?String(a[n])<String(r[n])?-1:1:a[n]-r[n]),this.columns.forEach(a=>{a.sort&&(a.sort=null),a.field===n&&(a.sort=o.sort)}),this.api.setColumnDefs(this._transformColumnDefs(this.columns))},onVirtualColumnsChanged(o){},onColumnVisible(o){const n=this.options;le&&clearTimeout(le),le=setTimeout(()=>{if((0,T.mf)(n.agColumnVisibleChanged)){const e=[];o.columnApi.getColumnState().forEach(t=>{t.hide&&e.push(t.colId)}),n.agColumnVisibleChanged(e.toString(),o)}},10),this.$emit("on-column-visible",o)},onColumnMoved(o){const{columnApi:n}=o,e=this.options;H&&clearTimeout(H),H=setTimeout(()=>{if((0,T.mf)(e.agColumnMoved)){const t=n.getColumnState().map(i=>i.colId),a=[],r=e.datas&&e.datas.hideColumn&&e.datas.hideColumn!==""?e.datas.hideColumn.split(","):[];t.forEach(i=>{r.indexOf(i)===-1&&i!=="ID"&&a.push(i)}),this._colPosition=["ID"].concat(a).toString(),e.agColumnMoved(["ID"].concat(a).toString())}},500),this.$emit("on-column-moved",o)},onColumnPinned(o){const n=this.options,e=o.columnApi.getDisplayedLeftColumns().map(r=>r.colId),t=o.columnApi.getDisplayedRightColumns().map(r=>r.colId),a=`${e.join(",")}|${t.join(",")}`;if((0,T.mf)(n.agColumnPinned)){if(!this._isResetAllColumn&&o.pinned===null){const r=o.columnApi.getColumnState().map(p=>p.colId),i=[],g=n.datas&&n.datas.hideColumn&&n.datas.hideColumn!==""?n.datas.hideColumn.split(","):[];r.forEach(p=>{g.indexOf(p)===-1&&p!==o.column.colId&&p!=="ID"&&i.push(p)}),this._colPosition=["ID"].concat([o.column.colId].concat(i)).toString(),setTimeout(()=>{this._colPosition.split(",").forEach((p,s)=>{o.columnApi.moveColumn(p,s)})},48),n.agColumnMoved&&n.agColumnMoved(["ID"].concat([o.column.colId].concat(i)).toString())}this._preventPinnedEmit||n.agColumnPinned(a)}this.$emit("on-column-pinned",o)},onRowDataChanged(o){this.$emit("row-data-changed",o)},onBodyScroll(o){if(o.direction==="vertical"){if(this._lockRecordScroll)return;this._scrollTop=o.top}this.$emit("on-body-scroll",o)},getRowStyle(o){const{rowHeight:n}=this.gridOptions;return n?{lineHeight:`${n}px`}:{lineHeight:"28px"}},getRowClass(o){let n="";const{data:e}=o,t=this.options;return t.cssStatus&&t.cssStatus.forEach(a=>{if(e&&this._zhColumnNameMap[a.desc]){const r=this._zhColumnNameMap[a.desc],i=e[r].val;n+=`${a.css[a.value.indexOf(i)]||""} `||" "}}),n},onFilterChanged(o){this.$emit("on-filter-changed",o);const{api:n,columnApi:e}=o,t=this.options.datas;if(!t)return;const{isFullRangeSubTotalEnabled:a,isSubTotalEnabled:r,subtotalRow:i}=t;if(!a&&!r)return;const g=n.getModel().rowsToDisplay.map(s=>s.data);if(r||a){const s=this._getSumOfEachColumn(Object.keys(i),g);Object.keys(s).forEach(d=>{const c=s[d];this.rowDataType==="string"?this.subtotalRowData[d]=fn(c):this.subtotalRowData[d].val=fn(c)})}const p=[];r&&p.push(this.subtotalRowData),a&&p.push(this.fullRangeSubTotalRowData),p.length>0&&n.setPinnedBottomRowData(p)},onColumnResized(o){this.$emit("on-column-resized",o)},_fixAgRenderChoke(){const o=this.$refs.table;return document.querySelector(".ag-body-viewport")&&setTimeout(()=>{this._resetColumnWidth()},100),o},_getPinnedColumns(o){let n=[],e=[];if(o){const t=o.split("|");n=t[0].split(","),t[1]&&(e=t[1].split(","))}return{pinnedLeftColumns:n,pinnedRightColumns:e}},_sortPinnedColumns(o){const{pinnedLeftColumns:n,pinnedRightColumns:e}=this._getPinnedColumns(this.options.datas.pinnedColumns);let t=0,a=Math.max(o.length-1,0);const r=(0,me.Z)(o);for(let i=0;i<o.length;i++){if(i>a)return;const g=r[i],p=g;(n.includes(g.colname)||g.colname==="ID")&&(r.splice(i,1),r.splice(t,0,p),t++),e.includes(g.colname)&&(r.splice(i,1),r.splice(a,0,p),a--)}o.forEach((i,g)=>{o[g]=r[g]})},_getSortedData(o,n){this._colPosition=n;const e=n.split(","),t=[],a=[],r={};return o.forEach(i=>{r[i.colname]=i,e.indexOf(i.colname)===-1&&a.push(i)}),e.forEach(i=>{r[i]&&t.push(r[i])}),this.options.datas&&this.options.datas.pinnedColumns&&this._sortPinnedColumns(t),t.concat(a)},_getRowValue(o){return(0,fe.K)(o)?o.val:o},_transformColumnDefs(o){const n=this.$refs.table,e=this.gridOptions,t=this;let a=[];e&&e.datas&&e.datas.hideColumn&&(a=(0,me.Z)(e.datas.hideColumn.split(",")));const r={};e&&e.datas&&e.datas.ordids&&(0,I.kJ)(e.datas.ordids)&&e.datas.ordids.forEach(s=>{s.colname!=="ID"&&(r[s.colname]=s.ordasc?"asc":"desc")});const i={generalMenuTab:e&&e.generalMenuTab?e.generalMenuTab:!0,filterMenuTab:e&&e.filterMenuTab?e.filterMenuTab:!0,columnsMenuTab:e&&e.columnsMenuTab?e.columnsMenuTab:!0},g=[];return["generalMenuTab","filterMenuTab","columnsMenuTab"].forEach(s=>{i[s]&&g.push(s)}),o.map(s=>{s.colname==="headerName"&&alert(`headerName : ${this.$t("table.columnNameConflict")}`),s.colname==="field"&&alert(`field : ${this.$t("table.columnNameConflict")}`);const d=(0,me.Z)(s);d._index=s._index,d.headerName=s.colname==="ID"?this.$t("tips.index"):s.headerName||s.name,d.lockVisible=s.lockVisible||s.colname==="ID",d.suppressToolPanel=s.suppressToolPanel||s.colname==="ID",d.pinned=s.pinned||(s.colname==="ID"?"left":s.pinned),d.maxWidth=s.maxWidth||(s.colname==="ID"?80:null),d.width=s.width||(s.webconf&&s.webconf.standard_width?Number(s.webconf.standard_width):null),d.width&&(d.maxWidth=d.width,d.minWidth=d.width),d.suppressResize=s.suppressResize||s.colname==="ID",d.suppressMovable=s.suppressMovable||s.colname==="ID",d.lockPinned=s.lockPinned||!0,d.lockPosition=s.lockPosition||s.colanme==="ID",d.headerComponentFramework=s.headerComponentFramework||(e&&e.useDefaultHeader?null:"CustomHeader"),d.headerComponentParams=s.headerComponentParams||{agGridDiv:n.$el,tooltipBox:ie,tooltipTopBox:ne},d.field=d.field?d.field:`${s.colname}.val`,d.colname==="ID"&&(d.field=`${this.sequenceColumnField}.val`),d.colId=s.colId||s.colname||s.field,d.sort=s.sort||r[s.colname],d.filter=s.filter||s.isagfilter,s.agfilter==="FUZZY"&&s.isagfilter&&(d.filter="agTextColumnFilter"),d.cellStyle=this.cellStyle,d.suppressKeyboardEvent=this.onSuppressKeyboardEvent;const c=this.renderParams&&this.renderParams(d)||{};let u=s.cellRendererFramework||(c.renderContainer?c.renderContainer:"CellRender");(s.colname==="ID"||this.sequenceColumnField===s.field)&&(u="CellRender");const h=s.cellRendererParams||ee({renderComponent:Re.Z,agGridDiv:n.$el,options:{datas:Object.freeze(e.datas)},tooltipBox:ie,tooltipTopBox:ne,failIds:this._getFailIds(),mode:this.mode,$t:Object.freeze(this.$t)},c);return!s.cellRendererSelector&&!s.cellRenderer&&(d.cellRendererSelector=m=>{const f={component:u,params:wn(ee({},h),{renderComponent:m.colDef.colname==="ID"||this.sequenceColumnField===m.colDef.field?mn.Z:h.renderComponent})};let b=this._getRowValue(m.data[this.sequenceColumnField]);return b===this.$t("tips.summation")||b===this.$t("tips.total")?{component:"CellRender",params:wn(ee(ee({},h),m),{renderComponent:Re.Z})}:f}),d.sortingOrder=s.sortingOrder||(d.isorder?["asc","desc"]:[null]),d.unSortIcon=s.unSortIcon||d.isorder,d.hide=s.hide||a.includes(d.colname),d.suppressMenu=s.suppressMenu||s.colname==="ID",d.checkboxSelection=s.colname==="ID"?function(m){return m.columnApi.getRowGroupColumns().length===0&&m.data.ID&&m.data.ID.val!==t.$t("tips.summation")&&m.data.ID.val!==t.$t("tips.total")}:s.checkboxSelection,d.headerCheckboxSelection=s.colname==="ID"?function(m){return m.columnApi.getRowGroupColumns().length===0}:s.checkboxSelection,d.headerCheckboxSelectionFilteredOnly=s.headerCheckboxSelectionFilteredOnly||s.colname==="ID",d.cellClass=s.cellClass||function(m){const{colDef:f}=m,{colId:b,align:x,tdAlign:y}=f,S=y||x||"center";return b==="ID"?null:Ie[`table-cell-${S}`]},this._zhColumnNameMap[d.headerName]=s.colname,d})},_transformRowData(o){const n=this.gridOptions,e=n.datas&&n.datas.ids||"",t={};let a=[];(0,I.kJ)(e)&&e.length>0?(e.forEach((d,c)=>{t[d]=parseInt(c+1,10)}),a=o.concat([]).sort((d,c)=>(t[d.ID.val]||1/0)-(t[c.ID.val]||1/0))):a=o;const r=[];let i=null,g=null,p=null,s=null;if(n.datas){const{datas:d}=n;i=d.fullRangeSubTotalRow,g=d.isFullRangeSubTotalEnabled,p=d.isSubTotalEnabled,s=d.subtotalRow}if(p&&(this.subtotalRowData=this._dealWithSubTotalRow(s),r.push(this.subtotalRowData)),g&&i&&(this.fullRangeSubTotalRowData=this._dealWithFullRangeSubTotalRow(i),r.push(this.fullRangeSubTotalRowData)),this.mode===Oa)for(let d of r){let c=d.__ag_is_statistic_row__;for(const u in d)d[u]=d[u].val;d[this.sequenceColumnField]={val:d.ID},d.__ag_is_statistic_row__=c}return{rowData:a,pinnedBottomRowData:r}},_dealWithFullRangeSubTotalRow(o){let n={};return this.columnApi.getAllColumns().forEach(e=>{const t=e.colDef.colname||e.colDef.field,a=(0,fe.K)(o[t])?o[t].val:o[t],r=a??"";n[t]={val:t==="ID"?this.$t("tips.total"):r}}),JSON.stringify(o)!=="{}"&&(n.__ag_is_statistic_row__=!0),n[this.sequenceColumnField]={},n[this.sequenceColumnField].val=this.$t("tips.total"),this.rowDataType==="string"&&(n=this._objectToString(n)),n},_getSumOfEachColumn(o,n){const e={};let t=0;return o.forEach(a=>{const i=this.columnApi.getAllColumns().find(g=>g.colId===a).colDef.scale||0;t=n.reduce((g,p)=>{let s;return this.rowDataType==="string"?s=p[a]||0:s=p[a].val||0,typeof s=="string"&&(s=s.replace(/,/g,"")),g+Number(s)},0),t=t.toFixed(i),e[a]=t}),e},_dealWithSubTotalRow(o){let n={};return this.columnApi.getAllColumns().forEach(e=>{const t=e.colDef.colname||e.colDef.field,a=(0,fe.K)(o[t])?o[t].val:o[t],r=a??"";n[t]={val:t==="ID"?this.$t("tips.summation"):r}}),n.__ag_is_statistic_row__=!0,n[this.sequenceColumnField]={},n[this.sequenceColumnField].val=this.$t("tips.summation"),this.rowDataType==="string"&&(n=this._objectToString(n)),n},_objectToString(o){const n=(0,me.Z)(o);return Object.keys(n).forEach(e=>{const t=n[e];(0,fe.K)(t)&&(n[e]=t.val)}),n},_getFailIds(){const o=this.gridOptions,n=[];if(o&&o.datas&&o.datas.deleteFailInfo&&(0,I.kJ)(o.datas.deleteFailInfo))return o.datas.deleteFailInfo.forEach(e=>{e.objid&&e.objid!==""&&n.push(`${e.objid}`)}),n},_horizontalScrollTo(o,n){o.scrollLeft=parseFloat(n),this._autoSizeColumns()},_resetHeaderPosition(){const o=this.$refs.tableContainer;if(o){const n=o.querySelector(".ag-header-container");n.style.left=0}},_autoSizeColumns(){if(!this._isActive||!this.$refs.table||!this.api||!this.columnApi)return;let o,n;const e=this.$refs.table.$el;this.data.length===0?(o=e.querySelector(".ag-header-viewport"),n=e.querySelector(".ag-header-container>.ag-header-row")):(o=e.querySelector(".ag-center-cols-clipper"),n=e.querySelector(".ag-center-cols-container"));let t=o.clientWidth,a=n.clientWidth;if(a===0&&t===0){if(this._viewportWidth===0&&this._containerWidth===0)return;t=this._viewportWidth,a=this._containerWidth}this._viewportWidth=t,this._containerWidth=a,a<=t?this.api.sizeColumnsToFit():this.columnApi.autoSizeAllColumns()},_resetColumnWidth(o){this._autoSizeColumns(),setTimeout(()=>{this._autoSizeColumns(),o&&o()},200)}},beforeCreate(){this.$t=v.ZP.t.bind(v.ZP)},created(){this._zhColumnNameMap={},this._colPosition="",this._originColumnDefs=null,this._preventPinnedEmit=null,this._isResetAllColumn=!1,this._pinnedBottomRowData=null,this._gridReady=!1,this._tableWidthCache=0,this._viewportWidth=0,this._containerWidth=0,this._isActive=!0,this._clickTime=void 0,this._scrollTop=0,this._lockRecordScroll=!1},mounted(){},activated(){this._isActive=!0,this._lockRecordScroll=!0;const o=this.$route.query.isBack;this.restoreScrollTop(!o),this.$nextTick(()=>{setTimeout(()=>{(0,I.kJ)(this.data)&&this.data.length>0&&this._resetColumnWidth(this._resetHeaderPosition)},500),document.querySelector(".ag-grid-table-wrap .tooltip-box")||this.$refs.table.$el.appendChild(ie)})},deactivated(){this._isActive=!1}};var Ia=(0,ve.Z)(Na,C,V,!1,null,"3d2c76e4",null);const Ga=Ia.exports}}]);

//# sourceMappingURL=AgGridTable.js.map