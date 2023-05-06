const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');

function copyDir (folderPath) {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
    if (err) throw err; 
  });
  fs.readdir(folderPath, {withFileTypes: true}, (error, files) => {
    if (error) {
      console.log(error);
    } else {
      files.forEach(file => {
        if (!file.isDirectory()) {
          const filePath = path.join(__dirname, 'files', file.name);
          const fileCopyPath = path.join(__dirname, 'files-copy', file.name);
          fs.copyFile(filePath, fileCopyPath, err => {
            if (err) throw err; 
          });
        }
      });
    }
  });
}

copyDir(folderPath);