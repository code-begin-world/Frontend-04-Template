# week09

## @规则

- `@charset` [ https://www.w3.org/TR/css-syntax-3/](https://www.w3.org/TR/css-syntax-3/)
- `@import` [https://www.w3.org/TR/css-cascade-4/](https://www.w3.org/TR/css-cascade-4/)
- `@media` [https://www.w3.org/TR/css3-conditional/](https://www.w3.org/TR/css3-conditional/)
- `@page` [https://www.w3.org/TR/css-page-3/](https://www.w3.org/TR/css-page-3/)
- `@counter-style` [https://www.w3.org/TR/css-counter-styles-3](https://www.w3.org/TR/css-counter-styles-3)
- `@keyframes` [https://www.w3.org/TR/css-animations-1/](https://www.w3.org/TR/css-animations-1/)
- `@fontface` [https://www.w3.org/TR/css-fonts-3/](https://www.w3.org/TR/css-fonts-3/)
- `@supports` [https://www.w3.org/TR/css3-conditional/](https://www.w3.org/TR/css3-conditional/)
- `@namespace` [https://www.w3.org/TR/css-namespaces-3/](https://www.w3.org/TR/css-namespaces-3/)

## 选择器优先级

```
div#a.b .c[id=x]
style 没有 0
id 1个 1
伪元素、class、属性选择器 3个 3
标签 1个 1
结果:
[0, 1, 3, 1 ]

#a:not(#b)
style 没有 0
id 2个 2
伪元素、class、属性选择器 1个 1
标签 0个 0
结果:
[0, 2, 0, 0 ]

*.a 
style 没有 0
id 0个 0
伪元素、class、属性选择器 0个 0
标签 1个 1
结果:
[0, 0, 1, 0 ]

div.a 
style 没有 0
id 0个 0
伪元素、class、属性选择器 1个 1
标签 1个 1
结果:
[0, 0, 1, 1]
```

## 实现 match

编写一个 match 函数。它接收两个参数，第一个参数是一个选择器字符串性质，第二个是一个 HTML 元素。这个元素你可以认为它一定会在一棵 DOM 树里面。通过选择器和 DOM 元素来判断，当前的元素是否能够匹配到我们的选择器。（不能使用任何内置的浏览器的函数，仅通过 DOM 的 parent 和 children 这些 API，来判断一个元素是否能够跟一个选择器相匹配。）

本题并简单，然而最开始做的时候却想简单了。 具体的实现在[这里](./match.js)

最初的想法很简单：

1. 讲选择器按照空格拆分开
2. 倒序检查拆分后的选择器，检查元素是否匹配，匹配到则前移，直到列表为空或元素没有父节点

想法是没啥问题，然而实际每个步骤都没那么简单。第一步中，首先不能按照空格拆分，因为还有 `+` , `~`, `>` 的情况。每个元素的匹配中，也没那么简单，经过第一步拆分后的选择器，内部仍然会有很多种情况，比如 `div#div.div[a=1][class='container']`。 这个选择器必须进行再次拆分才能和元素进行匹配。

两种情况都试过写正则，然而都没写出来，最后还是状态机好用。

实现核心有以下辅助方法：

**splitSelector** 

负责将选择器进行拆分，并记录关联关系

```js
/**
 * 将选择器 按照 [’ ‘,'>','+','~'] 进行拆分
 * @param {string} selector
 * @returns {selector []}
 * @example
 * 输入：'html > body div#div.div ~ a'
 * 输出：
 * [
 *    {"value":"html", "prev":null},
 *    {"value":"body", "prev":">"},
 *    {"value":"div#div.div", "prev":" "},
 *    {"value":"a", "prev":"~"}
 * ]
 */
function splitSelector(selector){}
```

**getAllSingleSelector** 

负责将上一步拆分后的选择器进行进一步拆分为单个的选择器

```js
/**
 * 将一个选择器拆分成简单的单个并列选择器
 * @param {string} selector
 * @returns {string []}
 * @example 'div#div.div[hidden]' => ['div' ,'#div', '.div', '[hidden]']
 */
function getAllSingleSelector(selector) {}
```

**matchOne**

其仅负责检查单个的简单选择器是否和给定元素是否匹配

```js
/**
 * 检查指定元素是否满足给定的选择器
 * @param {string} selector 单个的简单选择器
 * @param {HTMLElement} element 检查的元素
 */
function matchOne(selector, element) {}
```

有了上面的这些子功能点的实现，后续再做匹配就相对容易了。

- 列表倒序检查，首先检查第一个，即元素自身，不匹配直接结束。
- 循环列表根据记录的关联关系
  - `>` 向上查找1层即可
  - ` ` 向上检查，直到匹配或元素不再有父元素。
  - `+` 检查当前元素的前一个兄弟即可。
  - `~` 检查当前元素的所有前面的兄弟元素，任意匹配即可。


**目前实现存在的缺陷**

- [ ] `div p span`， `div > p span`  `div ~ p span` span 向上匹配 p 的情况下，不能匹配到 p 就终止，因为可能导致p继续向上时失败。 `~` 关系存在类似情况，因为可能有多重符合的元素，直接取到的第一个可能导致继续向上时失败。此处我的实现不完全。
- [ ] 属性选择器中除了 `=` 还可以 `*=` `^=` ，本次里面也也未作实现。 不过这个在 `matchOne` 中实现即可。
- [ ] `splitSelector` 实现中存在一定的问题。比如 `'body [c="a>1"]'` 选择器进行拆分时，会在空格和 `>` 两个位置都拆开。首先这拆错了，其次这也导致匹配时候出现选择器不合法的情况。要解决，应该是 `splitSelector` 和 `getAllSingleSelector` 放在一起考虑，这样就可以避免属性选择器中的`+` `~` `>` 等符号被当成选择器间的分割。
