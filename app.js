// API立ち上げ
// ※APIが増えてきたらちゃんとルーティング作る
require('./api/responceAI')

const http = require('http');
const fs = require('fs');

var server = http.createServer(
    (request,response)=>{
        fs.readFile('./page/index.html','UTF-8',(error,data)=>{
            response.writeHead(200, {'Content-Type':'text/html'});
            response.write(data);
            response.end();
        })
       
    }
);
server.listen(3000);
