# react-zoom

一个可缩放、拖动的react组件 支持mac双指手势

## 使用手册

1. 安装依赖
`npm install --save @mokahr/react-zoom`
2. 组件使用

```js
import Zoom from '@mokahr/react-zoom';

/**
 * toolbarRender 自定义toolbar render函数
 *
 * @param {Number} zoom 当前缩放比例 基数是100
 * @param {Function} onZoom 改变缩放比例的function
 * @param {Function} onReset 重置缩放 会根据当前children的宽高 计算出 合适的比例（刚好全显示 除去留白）
 *                           位置（水平居中，垂直置顶在顶部留白下）的function
 * @param {Number} minZoom 当前最小缩放比例
 * @param {Number} minZoom 当前最大缩放比例
*/
// demo
const toolbarRender = (zoom, onZoom, onReset, minZoom = 10, maxZoom = 200) => (
  <div>
    <div onClick={onReset}>复位</div>
    <div
      onClick={
        zoom > minZoom
        ? () => onZoom(Math.ceil(zoom / 10) * 10 - 10)
        : null
      }
    >-</div>
    <div>{zoom}%</div>
    <div
      onClick={
        zoom < maxZoom
        ? () => onZoom(Math.floor(zoom / 10) * 10 + 10)
        : null
      }
    >+</div>
  </div>
);

<Zoom
  // 最小缩放比例 基数 100
  minZoom={10}
  // 最大缩放比例 基数 100
  maxZoom={200}
  // 顶部底部留白 xx px
  padding={20}
  // 自定义toolbar
  toolbarRender={toolbarRender}
>
  <div>需要缩放的组件</div>
</Zoom>
```
