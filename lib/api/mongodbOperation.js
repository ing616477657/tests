//数据库增删改查
var Models = require('../mongodb/getModels')
module.exports = function(app){
	app.post('/api/add', function(req, res){
		// 接下来可以对单个集合进行增删改查操作
		Models.first.find({username:req.body.username},function(err,v){
			if(err) return;
			if(v.length>0) {
				res.json({success:'error',message:'用户名已存在'});
				return;
			};
			new Models.first({
				"username" : req.body.username,
			    "password" : req.body.password,
			    "email" : req.body.email,
			    "token":"",
			    "date" : Date.now()
			}).save(function(err,v){
				// console.log('增：' + v)
				res.json({success:'success'});
			})
		})
	});
	app.post('/api/delete', function(req, res){
		// 接下来可以对单个集合进行增删改查操作
		Models.first.find({username:req.body.username},function(err,v){
			if(err) return;
			if(v.length>0) {
				Models.first.remove({username:req.body.username},function(err,v){
					// console.log(err)
					if(err) return;
					// console.log('删：' + v.ok)
					res.json({success:'success'});
				})
				return;
			}else{
				res.json({success:'error',message:'用户不存在'});
			}
			
		})
		
	});
	app.post('/api/change', function(req, res){
		// 接下来可以对单个集合进行增删改查操作
		Models.first.find({username:req.body.username},function(err,v){
			if(err) return;
			if(v.length>0) {
				Models.first.update({username:req.body.username},{
					$set: {
					    password : req.body.password,
					    email : req.body.email,
					    date : Date.now()
					}
					},{multi:true}, function(err, v){
					console.log('改：' + v.ok)
					res.json({success:'success'});
				});
				return;
			}else {
				res.json({success:'error',message:'用户不存在'});
			}
			
		})
	});
	app.post('/api/find', function(req, res){
		// 接下来可以对单个集合进行增删改查操作
		var query;
		if(req.body.username===''){
			query={}
		}else{
			query = {username:req.body.username}
		}	
		Models.first.find(query,function(err,v){
			if(err) return;
			if(v.length>0) {
				res.json({success:'success',data:v});
				return;
			}else {
				res.json({success:'error',message:'用户不存在'});
			}
			
		})
	});
}