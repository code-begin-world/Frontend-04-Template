const http = require('http');
const fs = require('fs');

http
  .createServer((request, response) => {
    let body = [];
    request
      .on('error', (err) => {
        console.log(err);
      })
      .on('data', (chunk) => {
        body.push(chunk.toString());
      })
      .on('end', () => {
        body = body.join('').toString();
        console.log('body:', body);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        // response.end(' Hello world\n');
        response.end(fs.readFileSync('./html/1.html', 'utf-8'));
      });
  })
  .listen(1991);

console.log('server started');
