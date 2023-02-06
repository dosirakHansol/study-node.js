var http = require('http');
var fs = require('fs');
var url = require('url'); // 모듈 url
var qs = require('querystring');

function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>    
  `;
};

function templateList(fileList){
  var list = '<ul>';

  for(var i = 0; i < fileList.length; i++){
    list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
  }

  list += '</ul>';8

  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // url에서 쿼리스트링 가져오기
    var title = queryData.id;
    var pathname = url.parse(_url,true).pathname //root 경로인듯

    if(pathname === '/'){
      if(queryData.id === undefined) {
        title = 'welcome kkk';
        description = 'hello, node.js!'

        fs.readdir('./data', function(error, fileList){

          var list = templateList(fileList);
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);

          response.writeHead(200);
          response.end(template);
        })

      } else{
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          fs.readdir('./data', function(error, fileList){
            
            var list = templateList(fileList);
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);

            response.writeHead(200);
            response.end(template);
          })
         });
      }
    } else if(pathname === '/create'){
        title = 'WEB - create';

        fs.readdir('./data', function(error, fileList){

          var list = templateList(fileList);
          var template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>        
          `);

          response.writeHead(200);
          response.end(template);
        })
    } else if(pathname === '/create_process'){
        var body ='';
        request.on('data', function(data){
          body += data;
        });

        request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function (err){
            response.writeHead(302, {Location : `/?id=${title}`});
            response.end('success');
          })
        });

    } else {
        response.writeHead(404);
        response.end('not found lol');
    } 
      
});
app.listen(3000);