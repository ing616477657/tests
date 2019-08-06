var express = require('express');
var app = express();
var fs = require('fs');
app.use(require('body-parser')());//解析post参数
var formidable = require('formidable');//解析上传文件
var dataDir = __dirname + '/upload';// 上传存放目录
var photosDir = dataDir + '/photos';//图片存放目录or创建其他文件类型的目录
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);//创建目录
fs.existsSync(photosDir) || fs.mkdirSync(photosDir);//创建目录
var credentials = require('./credentials.js');//密码秘钥集合
var nodemailer = require('nodemailer');//邮箱服务
let mailTransport = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
	 user: credentials.qq.user,
	 pass: credentials.qq.password,
  }
});
let codes;//邮箱验证码
// 逻辑脚本
var fortune = require('./lib/fortune.js');
var tours = require('./lib/database.js');
var emailcode = require('./lib/emailcode.js');//生产随机注册码
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
// 邮箱验证发送验证码
app.post('/api/emails', function(req, res){
	console.log(req.body.email);
	codes = emailcode.getCode();//4位随机数
	mailTransport.sendMail({
		from: '"Meadowlark Travel" <'+credentials.qq.user+'>',
		to: req.body.email,
		subject: '注册验证码',
		text: codes,
	}, function(err){
		if(err) console.error( 'Unable to send email: ' + err );
	});
	res.json({success:'success'});
});
// 邮箱验证发送验证码
app.post('/api/register', function(req, res){
	console.log(req.body.emailcode,codes);
	if(req.body.emailcode===codes){
		res.json({success:'success'});
	}else{
		res.json({error:'error',message:'邮箱验证码错误'});
	}
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
res.json({error:err});
});
app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
app.get('port') + '; press Ctrl-C to terminate.' );
});
console.log(app.get('env'))