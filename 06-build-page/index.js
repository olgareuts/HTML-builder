const fs = require('fs');
const path = require('path');

const outputFolderPath = path.join(__dirname, 'project-dist');
const styleFolderPath = path.join(__dirname, 'styles');
const outputStyleFilePath = path.join(__dirname, 'project-dist', 'style.css');
const folderPath = path.join(__dirname, 'assets');
const copyFolderPath = path.join(__dirname, 'project-dist', 'assets');
const templateFilePath = path.join(__dirname, 'template.html');
const outputFilePath = path.join(__dirname, 'project-dist', 'index.html');
const fsp = require('fs/promises');

function createFolder (folder) {
  fs.mkdir(folder, { recursive: true }, err => {
    if (err) throw err; 
  });
}

function copyDir (input, output) {
  fs.readdir(input, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.log(error);
    } else {
      files.forEach(file => {
        const inputPath = path.join(input, file.name);
        const outputPath = path.join(output, file.name);
        if (file.isDirectory()) {
          const inputPath = path.join(input, file.name);
          const outputPath = path.join(output, file.name);
          fsp.mkdir(outputPath, { recursive: true }).then(()=>{
            copyDir(inputPath, outputPath);
          })
        } else {
         fs.copyFile(inputPath, outputPath, err => {
            if (err) throw err; 
          }); 
      }
      });
    }
  });
}

function mergeStyles () {
  fs.readdir(styleFolderPath, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.log(error);
    } else {
      const writeStream = fs.createWriteStream(outputStyleFilePath);
      files.forEach(file => {
        const fileCopyPath = path.join(__dirname, 'styles', file.name);
        if (!file.isDirectory() && path.parse(fileCopyPath).ext === '.css') {
          fs.readFile(fileCopyPath, 'utf8', (error, data) => { 
            if (error) {
              console.log(error);
            } else {
              writeStream.write(data + '\n');
            }
          });
        }
      });
    }
  });
}

function createHTML (templateFile, outputFile) {
  fs.copyFile(templateFile, outputFile, err => {
    if (err) throw err; 
  });

  fs.readFile(templateFile, 'utf8', (error, data) => {
    if (error) {
      console.log(error);
    } 
      let template = data;
      const templateTags = data.match(/{{(.*)}}/gi);
      templateTags.forEach(el=> {
        const componentFileName = `${el.slice(2, -2)}.html`
        const componentsPath = path.join(__dirname, 'components', componentFileName);
        fs.readFile(componentsPath, 'utf8', (error, componentData) => {
          if (error) {
            console.log(error);
          } 
          template = template.replace(el, componentData);
          const writeStream = fs.createWriteStream(outputFilePath);
          writeStream.write(template);
        });
      });
  });
}

function buildPage () {
  createFolder(outputFolderPath);
  createFolder(copyFolderPath); 
  mergeStyles();
  createHTML(templateFilePath, outputFilePath);
  copyDir(folderPath, copyFolderPath);
}

buildPage ();
