/**
 * utf8 编码 仅支持0000~FFFF范围的
 * @param {string} str
 */
function encodeUtf8(str) {
    const arr = [];

    for (let i = 0; i < str.length; i++) {
        // const char = str[i];
        const point = str.charCodeAt(i);

        // 0 ~ 127 占用1字节
        if (point < 128) {
            // 0000 ~ 007F
            arr.push(point);
        } else if (point < 2048) {
            // 0080 ~ 07FF 2 字节
            // 110xxxxx  10xxxxxx
            arr.push((point >> 6) | 192); // 110 + 前5位
            arr.push((point & 63) | 128); // 10 + 后6位
        } else if (point <= 0xffff) {
            // 0800 ~ FFFF 3 字节
            // 1110xxxx 10xxxxxx 10xxxxxx
            arr.push((point >> 12) | 224); // 1110 + 前4位
            arr.push(((point >> 6) & 63) | 128); // 10 + 中间6位
            arr.push((point & 63) | 128); // 10 + 后6位
        }
    }

    return Buffer.from(arr);
}
encodeUtf8('一');
var str = '一二';
console.log(encodeUtf8(str));
console.log(Buffer.from(str, 'utf8'));
