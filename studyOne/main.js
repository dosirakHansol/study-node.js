var http = require('http');
var fs = require('fs');
var url = require('url'); // 모듈 url

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // url에서 쿼리스트링 가져오기
    var title = queryData.id;
    var pathname = url.parse(_url,true).pathname //root 경로인듯

    if(pathname === '/'){
      if(queryData.id === undefined) {
        title = 'welcome';
        description = 'hello, node.js!'

        fs.readdir('./data', function(error, fileList){
          // var list = `<li><a href="/?id=html">HTML</a></li>
          // <li><a href="/?id=css">CSS</a></li>
          // <li><a href="/?id=js">JavaScript</a></li>`

          var list = '<ul>';

          for(var i = 0; i < fileList.length; i++){
            list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
          }

          list += '</ul>';

          var template = 
            `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
            ${list}
            </ol>
            <h2>${title}</h2>
            <p>
            ${description}
            </p>
            </body>
            </html>    
            `;
          response.writeHead(200);
          response.end(template);
        })

      } else{
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          fs.readdir('./data', function(error, fileList){
            var list = '<ul>';
  
            for(var i = 0; i < fileList.length; i++){
              list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
            }
  
            list += '</ul>';
  
            var template = 
              `
              <!doctype html>
              <html>
              <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
              </head>
              <body>
              <h1><a href="/">WEB</a></h1>
              <ol>
              ${list}
              </ol>
              <h2>${title}</h2>
              <p>
              ${description}
              </p>
              </body>
              </html>    
              `;
            response.writeHead(200);
            response.end(template);
          })
         });
      }
    } else{
      response.writeHead(404);
      response.end('not found');
    } 
      
  });
app.listen(3000);