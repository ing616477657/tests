var mongoose = require('./lib/db');
var Models = require('./lib/getModels')
var express = require('express');
var app = express();
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
app.use(require('body-parser')());//解析post参数
app.use(require('cookie-parser')(credentials.cookieSecret));//引入cookie
app.use(require('express-session')());
// 逻辑脚本
var fortune = require('./lib/fortune.js');
var tours = require('./lib/database.js');
// 设置handlebars 视图引擎
var handlebars = require('express3-handlebars')
.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// 设置端口号
app.set('port', process.env.PORT || 3000);
// 使用静态文件中间件
app.use(express.static(__dirname + '/public'));

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

app.use(function(req, res, next){
// 如果有即显消息，把它传到上下文中，然后清除它
res.locals.username = req.session.username;
res.locals.password = req.session.password;
res.locals.email = req.session.email;
delete req.session.username;
delete req.session.password;
delete req.session.email;
next();
});
// 多个集合组成了对象Models
// 接下来可以对单个集合进行增删改查操作
Models.first.find(function(err,v){
	console.log(v)
})
// 路由
app.get('/emailCode', function(req, res){
	res.render('emailCode');
});
// 提交邮箱获得验证码
app.post('/api/email',function(req,res){
	mailTransport.sendMail({
		from: '"Meadowlark Travel" <'+credentials.qq.user+'>',
		to: req.body.email,
		subject: '验证码',
		text: '123456',
	}, function(err){
		if(err) console.error( 'Unable to send email: ' + err );
	});
	req.session.email = '邮件已发送'
	res.redirect(303, '/emailCode');
})
app.get('/', function(req, res) {
	res.cookie('homeCookie', 'home', { signed: true,httpOnly:true});
	req.session.userName = 'Anonymous';
	var colorScheme = req.session.colorScheme || 'dark';
	res.render('home');
});
app.get('/about', function(req, res){
	res.cookie('aboutCookie', 'about', { signed: true,httpOnly:true});
	res.render('about', { fortune: fortune.getFortune() });
});
// api
app.get('/api/tours', function(req, res){
	console.log(req.xhr)

	res.json(tours);
});
app.get('/postinfo', function(req, res) {
	// res.cookie('homeCookie', 'home', { signed: true,httpOnly:true});
	// req.session.userName = 'Anonymous';
	// var colorScheme = req.session.colorScheme || 'dark';
	req.session.username = '用户已存在'
	req.session.password = '密码不符合大小写要求'
	res.redirect(303, '/');
});
// 404 catch-all 处理器（中间件）
app.use(function(req, res, next){
res.status(404);
res.render('404');
});
// 500 错误处理器（中间件）
app.use(function(err, req, res, next){
console.error(err.stack);
res.status(500);
res.render('500');
});
app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
app.get('port') + '; press Ctrl-C to terminate.' );
});
console.log('test commit1')
console.log(app.get('env'))