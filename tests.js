var express = require('express');
var app = express();
var fs = require('fs');
app.use(require('body-parser')());//解析post参数
var formidable = require('formidable');//解析上传文件
var dataDir = __dirname + '/upload';// 上传存放目录
var photosDir = dataDir + '/photos';//图片存放目录or创建其他文件类型的目录
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);//创建目录
fs.existsSync(photosDir) || fs.mkdirSync(photosDir);//创建目录
// 逻辑脚本
var fortune = require('./lib/fortune.js');
var tours = require('./lib/database.js');
// 设置端口号
app.set('port', process.env.PORT || 3000);
// 我是一个中间件创建一个服务器端数据对象
app.use(function(req, res, next){
if(!res.locals.partials) res.locals.partials = {data:'giaogiaogiao'};
next();
});
// 处理跨域请求
app.all('*',function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE,OPTIONS');
   if (req.method == 'OPTIONS') {
       res.send(200);
   }
   else {
       next();
   }
});
// api
app.get('/api/tours', function(req, res){
	console.log(req.xhr)
	res.json(tours);
});
app.get('/api/gets', function(req, res){
	console.log(req.query)
	res.json({success:'success'});
});
app.post('/api/process', function(req, res){
	console.log(req.body);
	res.json({success:'success'});
});
// 上传图片
// 客户端判断数据类型请求对应的图片上传还是其他文件上传接口
// 或者服务器端进行判断
// 根据接口不同将文件保存到对应创建的目录中
// 例如
// var pdfsDir = dataDir + '/pdfs';//pdf
// fs.existsSync(pdfsDir) || fs.mkdirSync(pdfsDir);//创建pdf目录
// var dir = pdfsDir + '/' + Date.now();//通过时间轴创建pdf文件夹
// var path = dir + '/' + filePdf.name;//保持pdf的地址
app.post('/api/photos', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
		var fileImg = files.fileImg;
		var dir = photosDir + '/' + Date.now();//通过时间轴创建图片文件夹
		var path = dir + '/' + fileImg.name;//保持图片的地址
		fs.mkdirSync(dir);
		// fs.renameSync(fileImg.path, dir + '/' + fileImg.name);
		var readStream=fs.createReadStream(fileImg.path);//通过图片地址读取图片
		 var writeStream=fs.createWriteStream(path);//通过图片地址写入图片
		 readStream.pipe(writeStream);
		 readStream.on('end',function(){
		  fs.unlinkSync(fileImg.path);
		 });
		res.json({success:'success'});
	});
});

// 404 catch-all 处理器（中间件）
app.use(function(req, res, next){
res.status(404);
// res.render('404');
res.json({error:'404'});
});
// 500 错误处理器（中间件）
app.use(function(err, req, res, next){
console.error(err.stack);
res.status(500);
res.json({error:'error'});
});
app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
app.get('port') + '; press Ctrl-C to terminate.' );
});
console.log(app.get('env'))