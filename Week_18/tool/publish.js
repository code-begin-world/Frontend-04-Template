const http = require('http');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');
const querystring = require('querystring');

const archive = archiver('zip', {
  zlib: { level: 9 }
});

// 1 打开GitHub 登录
child_process.exec('start https://github.com/login/oauth/authorize?client_id=Iv1.ea21a6329e88bdb8', function (err) {
  console.log(err);
});

// 3 创建server 接受token 确认后发布
http
  .createServer(function (request, response) {
    const query = querystring.parse(request.url.replace(/^\/\?/, ''));
    console.log(query);
    publish(query.token);
  })
  .listen(8003);

function publish(token) {
  archive.directory(path.join(__dirname, 'sample/'), false);

  let request = http.request(
    {
      host: '127.0.0.1',
      port: 8002,
      path: `/publish?token=${token}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
        // Authorization: `token ${token}`
      }
    },
    (response) => {
      console.log(response.statusCode);
    }
  );
  archive.pipe(request);
  archive.finalize();
}

// archive.directory(path.join(__dirname, 'sample/'), false);

// // archive.pipe(fs.createWriteStream(path.join(__dirname, 'tmp.zip')));
// // archive.finalize();

// let request = http.request(
//   {
//     host: '127.0.0.1',
//     port: 8002,
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/octet-stream'
//     }
//   },
//   (response) => {
//     console.log(response);
//   }
// );
// archive.pipe(request);
// archive.finalize();
