var express = require('express');
var app = express();
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


app.get('/', function(req, res) {
res.render('home');
});
app.get('/about', function(req, res){
res.render('about', { fortune: fortune.getFortune() });
});

app.get('/api/tours', function(req, res){
	console.log(req.xhr)
	res.json(tours);
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