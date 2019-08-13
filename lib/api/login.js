var Models = require('../mongodb/getModels');//连接数据库
var md5=require('md5-node');//MD5加密
module.exports = function(app){
	app.post('/api/login', function(req, res){
		// console.log(req.body)
		if(req.body.token){
			Models.first.find({token:req.body.token},function(err,v){
				if(err) return;
				if(v.length>0) {
					var nowD = Date.now();
					var _times = nowD - parseInt(v[0].loDate)
					var testm = _times/1000
					var hours = _times/1000/3600;
					// console.log(hours)
					// 间隔12小时首次登录/访问自动验证token登录奖励
					if(hours>=12&&hours<240){
						var _lvs = v[0].lvs + 2
						var userdata = {
							 _name:v[0]._name,
							 lvs:_lvs,
							 tokens:true,
							 addLv:true
						}
						Models.first.update({token:req.body.token},{
							$set: {
							    "loDate" : nowD,
							    "lvs":_lvs
							}
							},{multi:true}, function(err, v){
							// console.log('改：' + v.ok)
							// res.json({success:'success'});
							res.json({success:'success',message:'发经验奖励啦',data:userdata});
						});
					}
					// 间隔10天访问自动验证返回重新登录
					if(hours>=240){
						Models.first.update({token:req.body.token},{
							$set: {
							    "loDate" : ""
							}
							},{multi:true}, function(err, v){
							// console.log('改：' + v.ok)
							// res.json({success:'success'});
							res.json({success:'error',message:'登录超时',data:{tokens:false}});
						});
					}
					if(hours<12){
						var userdata = {
							 _name:v[0]._name,
							 lvs:v[0].lvs,
							 tokens:true,
							 addLv:false
						}
						res.json({success:'success',message:'持续登陆中',data:userdata});
					}
				}else{
					res.json({success:'error',message:'账号不存在',data:{tokens:false}});
				}
			})
		}else{
			Models.first.find({username:req.body.username},function(err,v){
				if(err) return;
				if(v.length>0) {
					if(v[0].password===md5(req.body.password)){
						var nowD = Date.now();
						var _lvs,addLvs;
						if(v[0].loDate!=''){
							var _times = nowD - parseInt(v[0].loDate)
							var testm = _times/1000
							var hours = _times/1000/3600;
							if(hours>=12){
								_lvs = v[0].lvs + 2
								addLvs=true
							}else{
								_lvs = v[0].lvs
								addLvs= false
							}
						}else{
							_lvs = v[0].lvs
							addLvs= false
						}
						var _token =  md5(Date.now()+'123456')
						var userdata = {
							 _name:v[0]._name,
							 token:_token,
							 addLv:addLvs,
							 lvs:_lvs
						}

						// 超时之后登录和第一次登录一样超过奖励间隔了，所以直接奖励经验值
						Models.first.update({username:req.body.username},{
							$set: {
							    "token":_token,
							    "lvs":_lvs,
							    "loDate" : Date.now()
							}
							},{multi:true}, function(err, v){
							// console.log('改：' + v.ok)
							// res.json({success:'success'});
							res.json({success:'success',message:'登陆成功',data:userdata});
						});
					}else{
						res.json({success:'error',message:'密码错误'});
					}
					return this;
				}else{
					res.json({success:'error',message:'账号不存在'});
				}
			})
		}
	});
};