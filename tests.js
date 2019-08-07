var express = require('express');
var app = express();
app.use(require('body-parser')());//解析post参数
// 设置端口号
app.set('port', process.env.PORT || 3000);
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
// 处理所有API
require('./lib/api/apis')(app);
app.listen(app.get('port'), function(){
	console.log( 'Express started on http://localhost:' +
	app.get('port') +' '+app.get('env')+ '; press Ctrl-C to terminate.' );
});
