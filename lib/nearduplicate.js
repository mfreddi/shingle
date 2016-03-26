'use strict';
var shingleLength = 10,
	crc = require('crc');

const nearduplicate = exports;

var removeShortWords = function(array){
		array.forEach(function(val, k) {
			if(val.length<3){
				array.splice(k, 1);
			}
		});
		return array;
	},
	compareShingles = function(arr1, arr2) {
		var count = 0;
		arr1.forEach(function(item) {
			if(arr2.indexOf(item) !== -1) {
				count++;
			}
		});
		return count*2/(arr1.length + arr2.length)*100;
	},
	hashingShingles = function(shingles) {
		var hashedArr = [];
		for(var j = 0, k = shingles.length; j < k; j++) {
			hashedArr.push(crc.crc32(shingles[j]));
		}
		return hashedArr;
	},
	createShingles = function(text) {
		var words = text.split(' ');
		var shingles = [];
		var wordsLength = words.length;
		while(shingles.length !== (wordsLength - shingleLength + 1)) {
			shingles.push(words.slice(0, shingleLength).join(' '));
			words = words.slice(1);
		}

		return shingles;
	},
	textCanonization = function(text) {
		var clearTags = new RegExp('(<([^>]+)>)', 'ig'),
			SpecialCharacters = new RegExp('[”|“|»|«|\\n|\\r|\\t|\,|\.|\:|\$|\#|\"|\(|\)|\[|\]|\;]', 'ig'),
			arrText;
		// удаление html тегов
		text = text.replace(clearTags, "");
		// удаление спец. символов, табов, переносов строк...
		text = text.replace(SpecialCharacters, " ");
		text = text.trim().toLowerCase();
		// удаление лишних пробелов
		text = text.replace(/ +(?= )/g, '');
		// удаление чисел
		text = text.replace(/[0-9]/g, '');
		arrText = text.split(' ');
		// удаляем слова короче 3х символов
		return removeShortWords(arrText).join(' ');
	},
	findDuplicateStr = function(text1, text2){
		// TODO: лучше переделать
		var Shingles1 = createShingles(text1),
			Shingles2 = createShingles(text2),
			old_k = 0,
			str_grup = [],
			arrStr = [],
			i = 0;
		Shingles1.forEach(function(item, k) {
			var iarr;
			if(Shingles2.indexOf(item) !== -1) {
				if((k-1)===old_k){
					iarr = item.split(' ');
					if(!str_grup[i]){
						str_grup[i] = arrStr[arrStr.length-1] + ' ' + iarr[iarr.length-1];
					}else{
						str_grup[i] = str_grup[i] + ' ' + iarr[iarr.length-1];
					}
				}else{
					i++;
					arrStr.push(item);
				}
				old_k = k;
			}
		});
		arrStr.forEach(function(item){
			if(str_grup.join(' ').indexOf(item) < 0){
				str_grup.push(item);
			}
		});
		for(var j = 0; j < str_grup.length; j++){
			if(!str_grup[j]) str_grup.splice(j, 1);
		}
		return str_grup;
	};
/*
* Возвращает процент схожести текстов и совпадающие строки в тексте
* @param {string} text1 теекст для сравнения.
* @param {string} text2 теекст для сравнения.
* @param {number} lengthShingle Число шинглов для сравнения.
*/
nearduplicate.compareText = function(text1,text2,lengthShingle) {
	if(lengthShingle>0) shingleLength = lengthShingle;
	var canoniz1 = textCanonization(text1),
		canoniz2 = textCanonization(text2),
		Shingles1 = createShingles(canoniz1),
		Shingles2 = createShingles(canoniz2),
		hashingShingles1 = hashingShingles(Shingles1),
		hashingShingles2 = hashingShingles(Shingles2);
	return {
		percent: Math.round(compareShingles(hashingShingles1, hashingShingles2)),
		duplicate_str: findDuplicateStr(text1,text2)
	};
};
nearduplicate.getHasShingles = function(text1,lengthShingle) {
	if(lengthShingle>0) shingleLength = lengthShingle;
	var canoniz1 = textCanonization(text1),
		Shingles1 = createShingles(canoniz1);
	return hashingShingles(Shingles1);
};