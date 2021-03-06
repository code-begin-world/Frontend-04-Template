function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for (let prop in element.computedStyle) {
    // var p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop], 10);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop], 10);
    }
  }
  return element.style;
}

function layout(element) {
  if (element.attributes.filter((it) => it.name == 'id' && it.value == 'container').length) {
    debugger;
  }
  if (element.attributes.filter((it) => it.name == 'class' && it.value == 'c1').length) {
    debugger;
  }
  if (!element.computedStyle) return;

  var style = getStyle(element);

  if (style.display !== 'flex') return;

  var items = element.children.filter((it) => it.type == 'element');
  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });

  ['width', 'height'].forEach((size) => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  });

  if (!style.flexDirection || style.flexDirection == 'auto') {
    style.flexDirection = 'row';
  }
  if (!style.alignItems || style.alignItems == 'auto') {
    style.alignItems = 'stretch';
  }
  if (!style.justifyContent || style.justifyContent == 'auto') {
    style.justifyContent = 'flex-start';
  }
  if (!style.flexWrap || style.flexWrap == 'auto') {
    style.flexWrap = 'nowrap';
  }
  if (!style.alignContent || style.alignContent == 'auto') {
    style.alignContent = 'stretch';
  }

  var mainSize, mainStart, mainEnd, mainSign, mainBase;
  var crossSize, crossStart, crossEnd, crossSign, crossBase;

  switch (style.flexDirection) {
    case 'row':
      mainSize = 'width';
      mainStart = 'left';
      mainEnd = 'right';
      mainSign = 1;
      mainBase = 0;

      crossSize = 'height';
      crossStart = 'top';
      crossEnd = 'bottom';
      break;
    case 'row-reverse':
      mainSize = 'width';
      mainStart = 'right';
      mainEnd = 'left';
      mainSign = -1;
      mainBase = style.width;

      crossSize = 'height';
      crossStart = 'top';
      crossEnd = 'bottom';
      break;

    case 'column':
      mainSize = 'height';
      mainStart = 'top';
      mainEnd = 'bottom';
      mainSign = 1;
      mainBase = 0;

      crossSize = 'width';
      crossStart = 'left';
      crossEnd = 'right';
      break;
    case 'column-reverse':
      mainSize = 'height';
      mainStart = 'bottom';
      mainEnd = 'top';
      mainSign = -1;
      mainBase = style.height;

      crossSize = 'width';
      crossStart = 'left';
      crossEnd = 'right';
      break;

    default:
      break;
  }

  if (style.flexWrap == 'wrap-reverse') {
    [crossStart, crossEnd] = [crossEnd, crossStart];
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  var isAutoMainSize = false;
  if (!style[mainSize]) {
    style[mainSize] = 0;
    for (var i = 0; i < items.length; i++) {
      var itemStyle = getStyle(items[i]);
      if (itemStyle[mainSize] != null) {
        style[mainSize] = style[mainSize] + itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  var flexLine = [];
  var flexLines = [flexLine];

  var mainSpace = style[mainSize];
  var crossSpace = 0;

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var itemStyle = getStyle(item);
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (itemStyle.flexWrap == 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] != null) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }

      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }

      if (itemStyle[crossSize] != null) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  }

  flexLine.mainSpace = mainSpace;

  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = style[crossSize] !== undefined ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }

  // 处理弹性缩放
  if (mainSpace < 0) {
    var scale = style[mainSize] / (style[mainSize] - mainSpace);
    var currentMain = mainBase;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemStyle = getStyle(item);

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    flexLines.forEach((items) => {
      var mainSpace = items.mainSpace;
      var flexTotal = 0;

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemStyle = getStyle(item);
        if (itemStyle.flex != null) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }

      if (flexTotal > 0) {
        var currentMain = mainBase;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var itemStyle = getStyle(item);

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }

          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        // 内部全部无弹性的情况 处理对齐方式
        var currentMain;
        var step;
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase;
          step = 0;
        } else if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase;
          step = 0;
        } else if (style.justifyContent === 'center') {
          currentMain = (mainSpace / 2) * mainSign + mainBase;
          step = 0;
        } else if (style.justifyContent === 'space-between') {
          currentMain = mainBase;
          step = (mainSpace / (items.length - 1)) * mainSign;
        } else if (style.justifyContent === 'space-around') {
          step = (mainSpace / items.length) * mainSign;
          currentMain = step / 2 + mainBase;
        }
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var itemStyle = getStyle(item);
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];

          currentMain = itemStyle[mainEnd] + step;
        }
      }
    });
  }

  // 交叉 轴对齐处理
  var crossSpace;
  if (!style[crossSize]) {
    crossSpace = 0;
    style[crossSize] = 0;

    for (var i = 0; i < flexLines.length; i++) {
      style[crossSize] = style[crossSize] + flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for (var i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }
  if (style.flexWrap == 'wrap-reverse') {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }

  var lineSize = style[crossSize] / flexLines.length;

  var step;
  if (style.alignContent === 'flex-start') {
    crossBase += 0;
    step = 0;
  } else if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace;
    step = 0;
  } else if (style.alignContent === 'center') {
    crossBase += (crossSign * crossSpace) / 2;
    step = 0;
  } else if (style.alignContent === 'space-between') {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  } else if (style.alignContent === 'space-around') {
    step = crossSpace / flexLines.length;
    crossBase += (crossSign * step) / 2;
  } else if (style.alignContent === 'stretch') {
    crossBase += 0;
    step = 0;
  }
  flexLines.forEach((items) => {
    var lineCrossSize = style.alignContent === 'stretch' ? items.crossSpace + crossSpace / flexLines.length : items.crossSpace;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemStyle = getStyle(item);

      var align = itemStyle.alignSelf || style.alignItems;

      if (itemStyle[crossSize] === null) {
        itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
      }
      switch (align) {
        case 'flex-start':
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
          break;
        case 'flex-end':
          itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
          itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
          break;
        case 'center':
          itemStyle[crossStart] = crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
          itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
          break;
        case 'stretch':
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] = crossBase + crossSign * (itemStyle[crossSize] != null ? itemStyle[crossSize] : lineCrossSize);
          itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
          break;

        default:
          break;
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  });
}

module.exports = layout;
