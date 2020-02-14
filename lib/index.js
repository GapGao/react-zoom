import React, { Component } from "react";
import PropTypes from 'prop-types';

import "./index.css";

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

class Zoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zoom: 100,
      isMove: false,
      top: 0,
      left: 0,
      oldTop: 0, // 按下时的定位top
      oldLeft: 0, // 按下时的定位left
      oldX: 0, // 按下时的偏移值x
      oldY: 0 //按下时的偏移值y
    };

    this.container = null;
    this.content = null;
    this.onContainerChange = ref => this.container = ref;
    this.onContentChange = ref => this.content = ref;

    this.preventDefault = e => e.preventDefault();
    this.onZoom = zoom => this.setState({ zoom });
    this.onMouseUp = () => this.setState({ isMove: false });

    this.getContainerSize = this.getContainerSize.bind(this);
    this.getContentSize = this.getContentSize.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onMouseDownHandler = this.onMouseDownHandler.bind(this);
    this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
    this.onWheelHandler = this.onWheelHandler.bind(this);

  }

  componentDidMount() {
    // 本组件的滚轮相关手势和浏览器触摸板双指左滑返回上一页冲突，解决办法就是阻止浏览器的默认行为
    this.container.addEventListener('wheel', this.onWheelHandler, {
      passive: false,
    });
    this.setContentCenter();
  }

  Unmounting() {
    this.container.removeEventListener('wheel', this.onWheelHandler, {
      passive: false,
    });
  }

  // 获取画布大小
  getContainerSize() {
    if (this.container) {
      return {
        containerWidth: this.container.offsetWidth,
        containerHeight: this.container.offsetHeight
      };
    }
    return { containerWidth: 0, containerHeight: 0 };
  };

  // 获取内容大小
  getContentSize() {
    if (this.content) {
      return {
        contentWidth: this.content.offsetWidth,
        contentHeight: this.content.offsetHeight
      };
    }
    return { contentWidth: 0, contentHeight: 0 };
  };

  // 设置可缩放树图位置到画布中心
  onReset() {
    const { padding } = this.props;
    const { containerWidth, containerHeight } = this.getContainerSize();
    const { contentWidth, contentHeight } = this.getContentSize();

    const heightZoom = Math.min(
      Math.floor(((containerHeight - 2 * padding) / contentHeight) * 100),
      100
    );
    const widthZoom = Math.min(Math.floor((containerWidth / contentWidth) * 100), 100);

    const zoom = Math.min(heightZoom, widthZoom);
    this.setState({
      top: padding - (((100 - zoom) / 100) * contentHeight) / 2,
      left: (containerWidth - contentWidth) / 2,
      zoom
    });
  };

  onMouseDownHandler(event) {
    const { top, left } = this.state;
    this.setState({
      isMove: true,
      oldX: event.clientX,
      oldY: event.clientY,
      oldTop: top,
      oldLeft: left
    });
  };

  // 鼠标拖拽
  onMouseMoveHandler(event) {
    const { oldX, oldY, oldTop, oldLeft } = this.state;
    const top = oldTop + event.clientY - oldY;
    const left = oldLeft + event.clientX - oldX;
    this.setState({ top, left });
  };

  // 鼠标滚轮
  onWheelHandler(event) {
    event.stopPropagation();
    event.preventDefault();

    const { minZoom, maxZoom } = this.props;
    const newState = { ...this.state };

    if (Number.isInteger(event.deltaY)) {
      newState.top -= event.deltaY;
      newState.left -= event.deltaX;
    } else if (event.deltaY < 0) {
      newState.zoom = Math.min(newState.zoom + 2, maxZoom);
    } else {
      newState.zoom = Math.max(newState.zoom - 2, minZoom);
    }

    this.setState(newState);
  };


  render() {
    const { children, toolbarRender, minZoom, maxZoom } = this.props;
    const { zoom, isMove, top, left } = this.state;

    return (
      <div
        className="moka-zoom-container"
        ref={this.onContainerChange}
        onMouseDown={this.onMouseDownHandler}
        onMouseMove={isMove ? this.onMouseMoveHandler : null}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseUp}
      >
        {toolbarRender(zoom, this.onZoom, this.onReset, minZoom, maxZoom)}
        <div
          className="moka-zoom-content"
          ref={this.onContentChange}
          style={{
            transform: `scale(${zoom / 100})`,
            top: `${top}px`,
            left: `${left}px`
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

Zoom.defaultProps = {
  // 最小缩放比例 基数 100
  minZoom: 10,
  // 最大缩放比例 基数 100
  maxZoom: 200,
  // 顶部底部留白 xx px
  padding: 20,
  // 自定义toolbar
  toolbarRender: toolbarRender,
};

Zoom.propsType = {
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  padding: PropTypes.number,
  toolbarRender: PropTypes.function,
  children: PropTypes.node,
};

export default Zoom;
