var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder, function(error, fileList){
  console.log(fileList);
})

// 어떤 폴더에있는 파일들을 배열로 만들어서 반환해줌