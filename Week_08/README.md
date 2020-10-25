# week_08

本周主要完成每个元素布局的计算，以及使用 images 库将元素转换为图片进行可视化展示。

使用 `flex` 完成 layout 的过程对加深理解 flex 布局非常有帮助，可以清晰的理解每个属性的作用和计算原理。

## flex 布局

**容器**

分主轴和交叉轴，主轴和交叉轴上都有对齐相关的属性，

- 声明方式 `display: flex`   `display: inline-flex`
- 轴线方式方向定义： `flex-direction` ，取值如下
  - `row` 默认值，主轴为行方向，即 x 轴线为主轴
  - `row-reverse` 主轴为行方向，但是反向排列
  - `column` 主轴为列方向，即 Y 轴线为主轴
  - `column-reverse` 主轴为列方向，但是反向排列
- 是否允许换行 `flex-wrap`, 取值：
  - `nowrap` 默认值 不换行
  - `wrap` 允许换行
  - `wrap-reverse` ：允许换行，但是反向，即第一行在下方
- 主轴上的对齐方式 `justify-content` 取值：
  - `flex-start`: 默认值，向主轴开始方向对齐
  - `flex-end`： 向主轴结束方向对齐
  - `center`： 居中对齐
  - `space-between`： 向主轴两端对齐，保障项目之间间隔相等（项目首尾会贴着容器）
  - `space-around`： 向主轴两端对齐，保障每个项目两侧间隔相等（项目首尾与容器也也有间隙）
- 交叉轴上的对齐方式 `align-items`, 取值
  - `stretch`：默认值，若项目未设置高度，则将占满容器。
  - `flex-start`: 向交叉轴开始方向对齐
  - `flex-end`： 向交叉轴结束方向对齐
  - `center`： 居中对齐
  - `baseline`： 取项目中文字的基线进行对齐
- 多轴线时的对齐方式 `align-content` 仅一根轴线未换行时不会有效果
  - `stretch`：默认值， 拉伸占满交叉轴
  - `flex-start`: 向交叉轴开始方向对齐
  - `flex-end`： 向交叉轴结束方向对齐
  - `center`： 向交叉轴居中对齐
  - `space-between`： 向交叉轴两端对齐，保障轴线之间间隔相等，交叉轴线首尾会贴着容器
  - `space-around`： 向交叉轴两端对齐，保障每个轴线间隔相等，交叉轴线首尾与容器有间隙
- `flex-flow` 是 `flex-direction` 属性和 `flex-wrap` 属性的简写形式
  
**项目属性**

- `order`： 定义项目的排序值，可控制元素的位置，数值较小的靠前
- `flex-grow`: 定义项目在弹性拉伸时的比例值，默认值为 0 ，即不具备弹性，不会被主轴方向尺寸拉伸
- `flex-shrink`:  定义项目的缩小比例，默认为 1 ，即空间不足时，会按照元素的比例进行主轴方向尺寸缩小
- `flex-basis`:  定义此元素的基本尺寸，默认值为 auto ，即取元素本来宽度
- `align-self`:  用于控制单个元素在交叉轴的对齐方式，即某个元素可不服从容器的 `align-items` 定义。 默认值为 auto
- `flex`: 为 `flex-grow`, `flex-shrink` 和 `flex-basis` 的简写, 默认值 `0 1 auto` [https://www.zhangxinxu.com/wordpress/2020/10/css-flex-0-1-none/](https://www.zhangxinxu.com/wordpress/2020/10/css-flex-0-1-none/)
