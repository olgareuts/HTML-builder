const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const outputCSSFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesFolder, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.log(error);
  } else {
    const writeStream = fs.createWriteStream(outputCSSFile);
    files.forEach(file => {
      const filePath = path.join(stylesFolder, file.name);
      if (!file.isDirectory() && path.parse(filePath).ext === '.css') {
        fs.readFile(filePath, 'utf8', function(error, data) { 
          error ? console.log(error) : writeStream.write(data + '\n');
        });
      }
    });
  }
});