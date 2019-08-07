// 注册账号
function getCode(){
	var code = Math.floor(Math.random() * 8);
	var code1 = Math.floor(Math.random() * 8);
	var code2 = Math.floor(Math.random() * 8);
	var code3 = Math.floor(Math.random() * 8);
	var codes = code.toString() + code1.toString() +code2.toString() + code3.toString()
	return codes
};
let codes;//邮箱验证码
var qq = require('../credentials.js').qq;//密码秘钥集合
console.log(qq)
var nodemailer = require('nodemailer');//邮箱服务
let mailTransport = nodemailer.createTransport({
  // 配置邮箱SMTP
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
	 user: qq.user,
	 pass: qq.password,
  }
});
module.exports = function(app){
	app.post('/api/emails', function(req, res){
		// 邮箱发送邮件接口
		// 发送验证码
		// console.log(req.body.email);
		codes = getCode();//4位随机数
		mailTransport.sendMail({
			from: '"Meadowlark Travel" <'+qq.user+'>',
			to: req.body.email,
			subject: '注册验证码',
			text: codes,
		}, function(err){
			if(err) console.error( 'Unable to send email: ' + err );
		});
		res.json({success:'success'});
	});
	app.post('/api/register', function(req, res){
		// 验证邮箱验证码
		console.log(req.body.emailcode,codes);
		if(req.body.emailcode===codes){
			res.json({success:'success'});
		}else{
			res.json({error:'error',message:'邮箱验证码错误'});
		}
	});
};