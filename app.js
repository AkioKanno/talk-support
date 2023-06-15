// API立ち上げ
// ※APIが増えてきたらちゃんとルーティング作る
require('./api/responceAI')
const url = require('url');

const http = require('http');
const fs = require('fs');

const hostname = 'localhost';
const port = 3000;
const server = http.createServer(RouteSetting);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



/***
 * ルーティング設定
 * (Frontで読み込むJS/CSSなどはここで定義しないとだめ...使いづらい)
 **/
function RouteSetting(req, res) {
  const url_parts = url.parse(req.url);
  switch (url_parts.pathname) {
    case '/':
    case '/index.html':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(fs.readFileSync('./page/index.html', 'UTF-8'));
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
    case '/assets/img/mic_button.jpg':
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.write(fs.readFileSync('./assets/img/mic_button.jpg'));
    res.end();
    break;
    // FrontでJSファイルを読み込む場合
    case '/module/xxxx.js':
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(fs.readFileSync('./module/xxxx.js', 'UTF-8'));
      res.end();
      break;
    default:
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Page Not found');
      break;
  }
}





