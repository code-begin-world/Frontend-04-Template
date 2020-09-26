const numbers = '0123456789' + [...new Array(26)].map((_, i) => String.fromCharCode(65 + i)).join('');
/**
 * 字符串转数值
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

    let n = num;
    let str = [];

    while (n >= radix) {
        let s = n % radix;
        n = (n / radix) >> 0;
        str = numbers[s] + str;
    }
    if (n != 0) {
        str = numbers[n] + str;
    }

    return negative ? '-' + str : str;
}
