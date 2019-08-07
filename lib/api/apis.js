// 管理所有接口
module.exports = function(app){
	require('./localDate')(app);
	require('./testGetAndPost')(app);
	require('./uploadLocal')(app);
	require('./register')(app);

	// 其他错误处理
	app.use(function(req, res, next){
		// 404 catch-all 处理器（中间件）
		res.status(404);
		res.json({error:'404'});
	});
	app.use(function(err, req, res, next){
		// 500 错误处理器（中间件）
		res.status(500);
		res.json({error:'500'});
	});
};