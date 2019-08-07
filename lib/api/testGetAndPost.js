// 测试get接口和post接口接受参数
module.exports = function(app){
	app.get('/api/gets', function(req, res){
		// console.log(req.query)
		res.json({success:'success'});
	});
	app.post('/api/process', function(req, res){
		// console.log(req.body);
		res.json({success:'success'});
	});
};