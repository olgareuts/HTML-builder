const fs = require ('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdout, stdin, exit } = process;

const exitProgram = () => {
  stdout.write('Good bye!\n');
  exit();
};

stdout.write('Hello! Enter some text:\n');

stdin.on('data', data => { 
  const text = data.toString();
  text.trim() === 'exit' ? exitProgram() : output.write(text);
});

process.on('SIGINT', () => {
  exitProgram();
});