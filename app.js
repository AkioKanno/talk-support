// API立ち上げ

const conf = require('./config.js')
const url = require('url');
const http = require('http');
const fs = require('fs');

// User用画面
const hostname = conf.HOST_NAME
const port = conf.PORT
const userServer = http.createServer(RouteSetting);
socketIo = require('socket.io')(userServer)
userServer.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

require('./api/responceAI')
require('./api/socketChat')

/***
 * ルーティング設定
 * (Frontで読み込むJS/CSSなどはここで定義しないとだめ...使いづらい)
 **/
function RouteSetting(req, res) {
  const url_parts = url.parse(req.url);
  switch (url_parts.pathname) {
    case '/':
    case '/index.html':
    case '/worker.html':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(fs.readFileSync('./page/index.html', 'UTF-8'));
      res.end();
      break;
    case '/worker':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(fs.readFileSync('./page/worker.html', 'UTF-8'));
      res.end();
      break;
    case '/assets/chat.css':
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(fs.readFileSync('./assets/chat.css', 'UTF-8'));
      res.end();
      break;
    case '/assets/base.css':
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(fs.readFileSync('./assets/base.css', 'UTF-8'));
      res.end();
      break;
    case '/assets/textForm.css':
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(fs.readFileSync('./assets/textForm.css', 'UTF-8'));
      res.end();
      break;
    case '/assets/img/mic_button.png':
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.write(fs.readFileSync('./assets/img/mic_button.png'));
      res.end();
      break;
    case '/assets/img/babyIcon.png':
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.write(fs.readFileSync('./assets/img/babyIcon.png'));
      res.end();
      break;
    case '/assets/img/angry.png':
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.write(fs.readFileSync('./assets/img/angry.png'));
      res.end();
      break;
    case '/assets/img/enjoy.png':
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.write(fs.readFileSync('./assets/img/enjoy.png'));
      res.end();
      break;
    case '/assets/img/normal.png':
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.write(fs.readFileSync('./assets/img/normal.png'));
      res.end();
      break;
    // FrontでJSファイルを読み込む場合
    case '/module/speechRec.js':
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(fs.readFileSync('./module/speechRec.js', 'UTF-8'));
      res.end();
      break;
    case '/module/workerClient.js':
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(fs.readFileSync('./module/workerClient.js', 'UTF-8'));
      res.end();
      break;
    default:
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Page Not found');
      break;
  }
}

