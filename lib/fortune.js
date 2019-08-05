var fortuneCookies = [
"一桶面",
"一包辣条",
"一个吴亦凡",
"一个吴彦祖",
"一个猪猪",
];
exports.getFortune = function() {
var idx = Math.floor(Math.random() * fortuneCookies.length);
return fortuneCookies[idx];
};