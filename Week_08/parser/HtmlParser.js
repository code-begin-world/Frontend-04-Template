const CSSParser = require('./CSSParser.js');
const layout = require('./Layout.js');

const EOF = Symbol('EOF');

const SPACE_REG = /^[\t\n\f ]$/;

/** @type Token */
let currentToken = null;
/** @type Attribute */
let currentAttribute = {
  name: '',
  value: ''
};

let currentTextNode = null;
const stack = [{ type: 'document', children: [] }];

/**
 *
 * @param {Token} token
 */
function emit(token) {
  // console.log(token);

  let top = stack[stack.length - 1];

  if (token.type === 'startTag') {
    currentTextNode = null;
    const element = {
      type: 'element',
      children: [],
      attributes: []
    };
    element.tagName = token.tagName;

    Object.keys(token).forEach((k) => {
      if (k !== 'type' && k !== 'tagName') {
        element.attributes.push({
          name: k,
          value: token[k]
        });
      }
    });

    CSSParser.computedCSSStyle(element, stack);

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    } else {
      console.log('element', element);
    }
  } else if (token.type === 'endTag') {
    currentTextNode = null;
    if (top.tagName !== token.tagName) {
      throw new Error(`Tag start and end doesn\'t match. start [${top.tagName}] and end [${token.tagName}]`);
    } else {
      if (top.tagName === 'style') {
        CSSParser.addCSSRules(top.children[0].content);
      }

      layout(top);
      console.log('element', top);
      stack.pop();
    }
  } else if (token.type === 'text') {
    if (currentTextNode == null) {
      currentTextNode = { type: 'text', content: '' };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

// 初始状态
function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    });
    return;
  }
  emit({
    type: 'text',
    content: c
  });
  return data;
}

// 标签开始
function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    };
    return tagName(c);
  }

  return;
}

// 标签结束开始
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    };
    return tagName(c);
  } else if (c == '>') {
  } else if (c === EOF) {
  }

  return;
}

function tagName(c) {
  // 遇到空白 则是属性开始
  if (c.match(SPACE_REG)) {
    return beforeAttributeName;
  } else if (c == '/') {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === '>') {
    // 开始标签结束
    emit(currentToken);
    return data;
  }
  return tagName;
}

function beforeAttributeName(c) {
  if (c.match(SPACE_REG)) {
    return beforeAttributeName;
  } else if (~['/', '>', EOF].indexOf(c)) {
    return afterAttributeName(c);
  } else if (c === '=') {
  }
  currentAttribute.name = '';
  currentAttribute.value = '';
  return attributeName(c);
}
function attributeName(c) {
  if (c.match(SPACE_REG) || ~['/', '>', EOF].indexOf(c)) {
    return afterAttributeName(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === '"' || c === '"' || c === '<') {
  }
  currentAttribute.name += c;
  return attributeName;
}

function beforeAttributeValue(c) {
  if (c.match(SPACE_REG) || ~['/', '>', EOF].indexOf(c)) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === '>') {
  }

  return unquotedAttributeValue;
}
// 双引号属性值
function doubleQuotedAttributeValue(c) {
  // 只会以双引号结束
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  }

  currentAttribute.value += c;
  return doubleQuotedAttributeValue;
}

// 单引号属性值
function singleQuotedAttributeValue(c) {
  // 只会以单引号结束
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  }
  currentAttribute.value += c;
  return singleQuotedAttributeValue;
}

function afterQuotedAttributeValue(c) {
  if (c.match(SPACE_REG)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  }

  currentAttribute.value += c;
  return doubleQuotedAttributeValue;
}
// 无引号的属性值
function unquotedAttributeValue(c) {
  if (c.match(SPACE_REG)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === '\u0000') {
  } else if (~['"', "'", '<', '=', '`'].indexOf(c)) {
  } else if (c === EOF) {
  }

  currentAttribute.value += c;
  return unquotedAttributeValue;
}

function afterAttributeName(c) {
  if (c.match(SPACE_REG)) {
    return afterAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  }
  currentToken[currentAttribute.name] = currentAttribute.value;
  currentAttribute.name = '';
  currentAttribute.value = '';
  return attributeName(c);
}
function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  }

  return;
}

exports.parseHTML = function parseHTML(html) {
  let state = data;

  for (let c of html) {
    state = state(c);
  }

  state = state(EOF);

  return stack[0];
};
