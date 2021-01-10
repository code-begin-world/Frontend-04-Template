const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const querystring = require('querystring');

function auth(request, response) {
  const query = querystring.parse(request.url.replace(/^\/auth\?/, ''));
  const code = query.code;
  getToken(code, (r) => {
    // response.write(JSON.stringify(r));
    response.write(`<a href="http://localhost:8003/?token=${r.access_token}">publish</a>`);
    response.end();
  });
}

function getToken(code, cb) {
  let req = https.request(
    {
      hostname: 'github.com',
      path: `/login/oauth/access_token?code=${code}&client_id=Iv1.ea21a6329e88bdb8&client_secret=182c31c93191f660a7baea3f6d536cfebbb0a62a`,
      port: 443,
      method: 'POST'
    },
    function (response) {
      var data = '';
      response.on('data', (chunk) => {
        data += chunk.toString();
      });
      response.on('end', function () {
        console.log(data);
        cb(querystring.parse(data));
      });
    }
  );
  req.end();
}

function getUser(token, cb) {
  let req = https.request(
    {
      hostname: 'api.github.com',
      path: `/user`,
      port: 443,
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'publish'
      }
    },
    function (response) {
      var data = '';
      response.on('data', (chunk) => {
        data += chunk.toString();
      });
      response.on('end', function () {
        console.log(data);
        cb(JSON.parse(data));
      });
    }
  );
  req.end();
}
function publish(request, response) {
  const query = querystring.parse(request.url.replace(/^\/publish\?/, ''));
  if (query && query.token) {
    getUser(query.token, function (data) {
      if (data.login === 'cdswyda') {
        request.pipe(unzipper.Extract({ path: path.join(__dirname, 'public') }));
        request.on('end',()=>{
          response.end('ok')
        })
      } else {
        response.end(401);
      }
    });
  } else {
    response.end(401);
  }
}

http
  .createServer(function (request, response) {
    if (/^\/auth/.test(request.url)) {
      return auth(request, response);
    }
    if (/^\/publish/.test(request.url)) {
      return publish(request, response);
    }
    // console.log('request');
    // // let outFile = fs.createWriteStream(path.join(__dirname, 'tmp.zip'));
    // // request.pipe(outFile);
    // request.pipe(unzipper.Extract({ path: path.join(__dirname, 'public') }));
  })
  .listen(8002);
