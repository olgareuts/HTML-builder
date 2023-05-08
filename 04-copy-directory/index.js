const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const folderCopyPath = path.join(__dirname, 'files-copy');

function copyDir (input, output) {
  fsp.rm(output, { recursive: true, force: true }).finally (() => {
    fs.mkdir(output, { recursive: true }, err => {
      if (err) throw err; 
    });
    fs.readdir(input, { withFileTypes: true }, (error, files) => {
      if (error) {
        console.log(error);
      } else {
        files.forEach(file => {
          const inputPath = path.join(input, file.name);
          const outputPath = path.join(output, file.name);
          if (file.isDirectory()) {
            fsp.mkdir(outputPath, { recursive: true }).then(() => {
              copyDir(inputPath, outputPath);
            });
          } else {
            fs.copyFile(inputPath, outputPath, err => {
              if (err) throw err; 
            }); 
          }
        });
      }
    });
  });
}

copyDir(folderPath, folderCopyPath);