const net = require('net');
const fs = require('fs');
const path = require('path');
const images = require('images');

const ResponseParser = require('./parser/ResponseParsers.js');
const HtmlParser = require('./parser/HtmlParser.js');
const render = require('./parser/Render.js');

// 构造 Request 请求对象
class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.body = options.body || {};
    this.headers = options.headers || {};
    // 设置默认的 Content-Type
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-from-urlencoded';
    }

    // 特定的 Content-Type 有特定的格式
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === 'application/x-www-from-urlencoded') {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join('&');
    }
    // TODO: 其他更多状态的处理

    this.headers['Content-Length'] = this.bodyText.length;
  }

  send(connection) {
    // send 发送的过程 是逐步逐步发送的， 所有接收的过程也是逐步逐步的
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port
          },
          () => {
            connection.write(this.toString());
          }
        );
      }
      connection.on('data', (data) => {
        console.log('connection data event: \n', data.toString());
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
        } else {
          console.error('some thing wrong');
        }
      });
      connection.on('error', (err) => {
        reject(err);
        connection.end();
      });
    });
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers)
      .map((key) => `${key}: ${this.headers[key]}`)
      .join('\r\n')}\r\n\r\n${this.bodyText}`;
  }
}

void (async function () {
  let request = new Request({
    method: 'POST', // http的一部分
    host: '127.0.0.1', // 来自ip层
    port: '1991', // 来自tcp层
    path: '/', // http的一部分
    headers: {
      // ['X-Toy-Browser']: 'custom'
    },
    body: {
      request: 'test request and parser'
    }
  });

  let response = await request.send();
  console.log('response: \n', response);

  const dom = HtmlParser.parseHTML(response.body);
  console.log(dom);

  let viewport = images(800, 600);
  // render(viewport, dom.children[0].children[3].children[1].children[1]);
  render(viewport, dom);
  viewport.save(path.join(__dirname, 'viewport.jpg'));
  // testOutPut(dom);
})();

function testOutPut(dom) {
  function dealChildren(obj) {
    obj.children = obj.children.map((item) => {
      delete item.parent;
      if (item.children) {
        dealChildren(item);
      }
      return item;
    });
  }

  dealChildren(dom);

  fs.writeFileSync(path.join(__dirname, '/out.json'), JSON.stringify(dom, 0, 2));
}
