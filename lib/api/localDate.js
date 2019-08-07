// 测试get接口/跨域/ajax请求
var tours = [
	{ id: 0, name: 'Hood River', price: 99.99 },
	{ id: 1, name: 'Oregon Coast', price: 149.95 },
];
module.exports = function(app){
	app.get('/api/loaclDate', function(req, res){
		// console.log(req.xhr)
		res.json(tours);
	});
};