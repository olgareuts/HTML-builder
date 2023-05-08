const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'styles');
const filePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(folderPath, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.log(error);
  } else {
    const writeStream = fs.createWriteStream(filePath);
    files.forEach(file => {
      const fileCopyPath = path.join(__dirname, 'styles', file.name);
      if (!file.isDirectory() && path.parse(fileCopyPath).ext === '.css') {
        fs.readFile(fileCopyPath, 'utf8', function(error, data) { 
          error ? console.log(error) : writeStream.write(data + '\n');
        });
      }
    });
  }
});