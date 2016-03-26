var nD = require('./lib/nearduplicate');
var fs = require('fs');
var text1 = fs.readFileSync('./test_files/text4.txt', 'utf8');
var text2 = fs.readFileSync('./test_files/text3.txt', 'utf8');
var obj = nD.compareText(text1, text2, 4);
console.log(JSON.stringify(obj, null, 4));
