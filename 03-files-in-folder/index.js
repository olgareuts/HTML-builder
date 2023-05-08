const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), (error, files) => {
  if (error) {
    console.log(error);
  } else {
    files.forEach(file => {
      const filePath = path.join(__dirname, 'secret-folder', file);
      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.log(error);
        } else {
          if (stats.isFile()) {
            console.log(`${path.parse(filePath).name} - ${path.parse(filePath).ext.slice(1)} - ${stats.size}b`);
          }
        }
      });
    });
  }
});