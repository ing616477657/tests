// 注册账号
var Models = require('../mongodb/getModels');//连接数据库
var md5=require('md5-node');
function getCode(){
	var code = Math.floor(Math.random() * 8);
	var code1 = Math.floor(Math.random() * 8);
	var code2 = Math.floor(Math.random() * 8);
	var code3 = Math.floor(Math.random() * 8);
	var codes = code.toString() + code1.toString() +code2.toString() + code3.toString()
	return codes
};
// let codes;//邮箱验证码
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
		var codes = getCode();//4位随机数
		var _codes = md5(codes)
		Models.emailCodes.find({email:req.body.email},function(err,v){
			if(err) return;
			if(v.length>0) {

				Models.emailCodes.update({email:req.body.email},{
					$set: {
					    "emailCode":_codes,
					    "date" : Date.now()
					}
					},{multi:true}, function(err, v){
					// console.log('改：' + v.ok)
					// res.json({success:'success'});
				});
				return;
			};
			new Models.emailCodes({
				"email":req.body.email,
				"emailCode":_codes,
				"date" : Date.now()
			}).save(function(err,v){
				// console.log('增：' + v)
				// res.json({success:'success'});
			})
		})
		mailTransport.sendMail({
			from: '"Meadowlark Travel" <'+qq.user+'>',
			to: req.body.email,
			subject: '注册验证码',
			text: codes,
		}, function(err,v){
			if(err) res.json({success:'error',message:'邮件发送失败'});
		});
	    res.json({success:'success',message:'验证码发送中'});
	});
	app.post('/api/register', function(req, res){
		var _this = this;
		// 验证邮箱验证码
		// console.log(req.body.emailcode,codes);
		// console.log(req.body.email)
		Models.first.find({username:req.body.username},function(err,v){
			if(err) return;
			if(v.length>0) {
				res.json({success:'error',message:'用户已存在'});
				return this;
			}else{
				Models.emailCodes.find({email:req.body.email},function(err,v){
					if(err) return;
					if(v.length>0) {
						if(v[0].emailCode===md5(req.body.emailCode)){
						  // res.json({success:'success'});
						  Models.emailCodes.update({email:req.body.email},{
								$set: {
								    "emailCode":'',
								    "date" : Date.now()
								}
								},{multi:true}, function(err, v){
								// console.log('改：' + v.ok)
								// res.json({success:'success'});
							});
						  	new Models.first({
								"_name" : req.body._name,
							    "username" : req.body.username,
							    "password" : req.body.password,
							    "email":req.body.email,
							    "date" : Date.now()
							}).save(function(err,v){
								// console.log('增：' + v)
								// res.json({success:'success'});
								res.json({success:'success',message:'账号注册成功'});
							})
						}else{
							res.json({success:'error',message:'验证码错误'});
						}
						return;
					}else{
						res.json({success:'error',message:'验证码错误'});
					}
				})
			}
		})
	});
};