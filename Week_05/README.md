# week05

## 类型转换

[实现](./02/index.html)

**字符串转数值**

使用和 `parseInt` 相同的参数，并使用它来检查结果。

1. 从首位开始，逐步检查当前位置是否是指定进制内有效的字符，并将此字符对应的数值记录下来，直到遇到非法字符或传入字符结束即可
2. 将得到的有效字符采用”按权展开求和“方法累计求和即可

如字符串 `FFZ` 采用16进制转换，第三位的 `Z` 非法，第一步将得到: `[15, 15]` ，之后累加即可，即：

$$15 * 16 ^ 1 + 15 * 16 ^ 0 = 255$$

如果存在负数，可直接先检查字符串首位是否为 `-` ，是则去掉，最后返回时再补上即可。

实现代码：

```js
// 36 进制以内有效的字符
const numbers = '0123456789' + [...new Array(26)].map((_, i) => String.fromCharCode(65 + i)).join('');
/**
 * 字符串转数值 参考 parseInt 的规范实现
 * @param {string} str 要处理的字符串
 * @param {number | undefined} radix 进制 2~36
 */
function string2number(str, radix) {
    // 强制参数为 string
    str = (str + '').toUpperCase();
    const negative = str[0] === '-';
    if (negative) {
        str = str.substr(1);
    }
    // 进制处理
    if (radix === void 0) {
        if (str[0] === '0' && str[1] === 'X') {
            radix = 16;
            // str = str.substr(2);
        } else if (str[0] === '0') {
            radix = 8;
            // str = str.substr(1);
        } else {
            radix = 10;
        }
    } else {
        // radix 非法
        if (!Number.isInteger(radix) || radix < 2 || radix > 36) {
            return NaN;
        }
    }

    if (radix === 16 && str[0] === '0' && str[1] === 'X') {
        str = str.substr(2);
    } else if (radix === 8 && str[0] === '0') {
        str = str.substr(1);
    }

    let numberArr = [];

    // const reg = new RegExp()
    const validateNumbers = numbers.substring(0, radix);

    for (let i = 0; i < str.length; i++) {
        const num = validateNumbers.indexOf(str[i]);
        if (num === -1) {
            break;
        } else {
            numberArr.push(num);
        }
    }

    if (!numberArr.length) {
        return NaN;
    }

    const len = numberArr.length;
    const n = numberArr.reduce((t, c, index) => {
        t += c * radix ** (len - index - 1);
        return t;
    }, 0);
    return negative ? -n : n;
}
```

**数值转字符串**

首先分整数部分和小数部分，因为这两个部分的处理逻辑不同。

针对整数部分，除进制取余，商继续取整后继续此操作，最后再将余数反向连接即可。

针对小数部分，则是乘进制，整数部分作为当前尾数的小数，小数部分继续此运算，由于可能永远无法得到整数，需注意限制下位数结束循环即可。

以 `254.5` 转 16 进制字符串为例：

1. 整数部分 `254` , 对进制 16 取余得到 `14` , 对应字符 `E` ，剩下 `254 / 16 >> 0 = 15` 继续，再次取余得到 `15` ， 对应字符 `F` ，余下 `15/16 >> 0 = 0`， 整数部分借宿，反向连接得到字符串 `FE` ，即 `254` 转化为 16 进制字符串为 `FE`
2. 小数部分， `0.5` , 乘以进制 16 得到 `8`， 整数部分的 8 作为第一位小数，没有小数部分，处理结束。（若有继续此过程即可）
3. 最终得到 `FE.8`

```js

/**
 * 数值转字符串
 * @param {number} num 数值
 * @param {number | undefined} radix 进制 2~36
 */
function number2string(num, radix) {
    if (Number.isNaN(num)) return NaN;
    if (Object.prototype.toString.call(1) !== '[object Number]') return NaN;
    if (radix === void 0) {
        radix = 10;
    } else if (!Number.isInteger(radix) || radix < 2 || radix > 36) {
        throw new RangeError('radix must be 2~36');
    }

    const negative = num < 0;
    if (negative) {
        num = -num;
    }
    const pointIndex = ('' + num).indexOf('.');

    // #region 整数部分
    let n;
    if (pointIndex != -1) {
        n = num >> 0;
    } else {
        n = num;
    }
    let str = '';

    while (n >= radix) {
        let s = n % radix;
        n = (n / radix) >> 0;
        str = numbers[s] + str;
    }
    if (n != 0) {
        str = numbers[n] + str;
    }

    // #endregion

    // #region 小数部分 小数 * 进制 余数继续此操作
    if (pointIndex !== -1) {
        if (!str) {
            str = '0';
        }
        str += '.';
        // todo： 如何提取数值的小数部分 不转字符串的情况下 很难精确提取数值的小数部分 也许是我没想到 ？
        n = Number((num + '').substr(pointIndex));

        const limitLen = 18;
        let i = 0;

        while (i++ < limitLen && n) {
            let t = n * radix;
            s = t >> 0;
            n = t - s;
            str += numbers[s];
        }
    }
    // #endregion

    return negative ? '-' + str : str;
}

```

效果及测试验证：

![](images/2020-09-26-23-19-43.png)

## reaml

参考资料

- [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)
- [https://github.com/tc39/proposal-realms](https://github.com/tc39/proposal-realms)

[可视化展示](./07/index.html)

![reamls](images/2020-09-26-23-18-30.png)
