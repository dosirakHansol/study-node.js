var http = require('http');
var fs = require('fs');
var url = require('url'); // 모듈 url
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
const sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query; // url에서 쿼리스트링 가져오기
  var title = queryData.id;
  var pathname = url.parse(_url,true).pathname //root 경로인듯

    if(pathname === '/'){
      if(queryData.id === undefined) {
        title = 'welcome kkk';
        description = 'hello, node.js!';
        var filteredTitle = sanitizeHtml(title);
        var filteredDes = sanitizeHtml(description);
        fs.readdir('./data', function(error, fileList){
          var list = template.list(fileList);
          var html = template.HTML(filteredTitle, list, 
              `<h2>${filteredTitle}</h2><p>${filteredDes}</p>`,
              `<a href="/create">create</a>`,''
              );
          response.writeHead(200);
          response.end(html);
        })

      } else{
        var fileteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${fileteredId}`, 'utf8', function(err, description){
          fs.readdir('./data', function(error, fileList){
            var list = template.list(fileList);
            var filteredTitle = sanitizeHtml(title);
            var filteredDes = sanitizeHtml(description,{
              allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'h1' ],
              allowedAttributes: {
                'a': [ 'href' ]
              },
              allowedIframeHostnames: ['www.youtube.com']
            });
            var html = template.HTML(filteredTitle, list,
               `<h2>${filteredTitle}</h2><p>${filteredDes}</p>`,
               `<a href="/create">create</a> 
               <a href="/update?id=${filteredTitle}">update</a>
               <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${filteredTitle}"/>
                <input type="submit" value="delete"/>
               </form>
               `
               );
            response.writeHead(200);
            response.end(html);
          })
         });
      }
    } else if(pathname === '/create'){
        title = 'WEB - create';

        fs.readdir('./data', function(error, fileList){

          var list = template.list(fileList);
          var html = template.HTML(title, list, `
            <form action="/create_process" method="post">
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
          response.end(html);
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

    } else if(pathname === '/update'){
      var fileteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${fileteredId}`, 'utf8', function(err, description){
        fs.readdir('./data', function(error, fileList){
          
          var list = template.list(fileList);
          var html = template.HTML(title, list,
             `
             <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
             `,
             `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
             );

          response.writeHead(200);
          response.end(html);
        })
       });
    } else if(pathname === '/update_process'){
      var body ='';
      request.on('data', function(data){
        body += data;
      });

      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;

        fs.rename(`data/${id}`, `data/${title}`, function(err){
          fs.writeFile(`data/${title}`, description, 'utf8', function (err){
            response.writeHead(302, {Location : `/?id=${title}`});
            response.end('success');
          })
        })
      });
    } else if(pathname === '/delete_process'){
      var body ='';
      request.on('data', function(data){
        body += data;
      });

      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var fileteredId = path.parse(id).base;
        fs.unlink(`data/${fileteredId}`,function(){
          response.writeHead(302, {Location : `/`});
          response.end('success');
        })
      });
    } else {
      response.writeHead(404);
      response.end('not found lol');
    } 
      
});
app.listen(3000);