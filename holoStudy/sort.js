var http = require('http');
var fs = require('fs');
var url = require('url'); // 모듈 url

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // url에서 쿼리스트링 가져오기
    var title = queryData.id;
    var pathname = url.parse(_url,true).pathname //root 경로인듯

    title = 'welcome';
    description = 'hello, node.js!';

    

    response.writeHead(200);
    response.end(template);
      
});
app.listen(3000);