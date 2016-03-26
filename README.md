# Поиск нечетких дубликатов. Алгоритм шинглов.
## Example
    var nD = require('./lib/nearduplicate');
    var fs = require('fs');
    var text1 = fs.readFileSync('./test_files/text4.txt', 'utf8');
    var text2 = fs.readFileSync('./test_files/text3.txt', 'utf8');
    /*
    * Возвращает процент схожести текстов и совпадающие строки в тексте
    * nD.compareText(text1, text2, lengthShingle)
    * @param {string} text1 теекст для сравнения.
    * @param {string} text2 теекст для сравнения.
    * @param {number} lengthShingle Число шинглов для сравнения.
    */
    var obj = nD.compareText(text1, text2, 4);
    // форматированный вывод
    console.log(JSON.stringify(obj, null, 4));

