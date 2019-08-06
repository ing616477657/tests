exports.getCode = function() {
	var code = Math.floor(Math.random() * 8);
	var code1 = Math.floor(Math.random() * 8);
	var code2 = Math.floor(Math.random() * 8);
	var code3 = Math.floor(Math.random() * 8);
	var codes = code.toString() + code1.toString() +code2.toString() + code3.toString()
	return codes
};