var Models = require('../mongodb/getModels');//连接数据库
// 请求装备数据
module.exports = function(app){
	app.get('/api/getEquip', function(req, res){
		var data = {};
		Models.equipOne.find({},function(err,v){
			if(err) return;
			if(v.length>0) {
				// console.log(v)
				data.equipOne = v
				Models.equipTwo.find({},function(err,v){
					if(err) return;
					if(v.length>0) {
						// console.log(v)
						data.equipTwo = v
						res.json({success:'success',message:'请求成功',data:data});
					};
				})
			};
		})
	});
};