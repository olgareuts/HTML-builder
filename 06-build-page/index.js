const fs = require('fs');
const path = require('path');
const fsp = require('fs/promises');

const projectFolderPath = path.join(__dirname, 'project-dist');
const styleFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const templateFilePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components');
const outputStyleFilePath = path.join(projectFolderPath, 'style.css');
const assetsFolderPathCopy = path.join(projectFolderPath, 'assets');
const outputHTMLFilePath = path.join(projectFolderPath, 'index.html');


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
            fsp.mkdir(outputPath, { recursive: true }).then(()=>{
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

function mergeStyles (styleFolder, outputStyleFile) {
  fs.readdir(styleFolder, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.log(error);
    } else {
      const writeStream = fs.createWriteStream(outputStyleFile);
      files.forEach(file => {
        const fileCopyPath = path.join(styleFolder, file.name);
        if (!file.isDirectory() && path.parse(fileCopyPath).ext === '.css') {
          fs.readFile(fileCopyPath, 'utf8', (error, data) => { 
            error ? console.log(error) : writeStream.write(data + '\n');
          });
        }
      });
    }
  });
}

function createHTML (templateFile, outputFile, componentsFolder) {
  fs.readFile(templateFile, 'utf8', (error, data) => {
    if (error) {
      console.log(error);
    } 
    let template = data;
    const templateTags = data.match(/{{(.*)}}/gi);
    templateTags.forEach(el => {
      const componentFileName = `${el.slice(2, -2)}.html`;
      const componentsPath = path.join(componentsFolder, componentFileName);
      fs.readFile(componentsPath, 'utf8', (error, componentData) => {
        if (error) {
          console.log(error);
        } 
        template = template.replace(el, componentData);
        const writeStream = fs.createWriteStream(outputFile);
        writeStream.write(template);
      });
    });
  });
}

function buildPage (projectFolder) {
  fsp.mkdir(projectFolder, { recursive: true }).finally(() => {
    mergeStyles(styleFolderPath, outputStyleFilePath);
    createHTML(templateFilePath, outputHTMLFilePath, componentsFolderPath);
    copyDir(assetsFolderPath, assetsFolderPathCopy);
  });
}

buildPage(projectFolderPath);
