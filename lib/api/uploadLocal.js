// 处理上传文件接口
// 存储在本地
// 上传图片
// 客户端判断数据类型请求对应的图片上传还是其他文件上传接口
// 或者服务器端进行判断
// 根据接口不同将文件保存到对应创建的目录中
// 例如
// var pdfsDir = dataDir + '/pdfs';//pdf
// fs.existsSync(pdfsDir) || fs.mkdirSync(pdfsDir);//创建pdf目录
// var dir = pdfsDir + '/' + Date.now();//通过时间轴创建pdf文件夹
// var path = dir + '/' + filePdf.name;//保持pdf的地址
var fs = require('fs');
var path = require('path');
var rootDir = path.resolve(__dirname,'../..');
var formidable = require('formidable');//解析上传文件
var dataDir = rootDir + '/upload';// 上传存放目录
var photosDir = dataDir + '/photos';//图片存放目录or创建其他文件类型的目录
var pdfsDir = dataDir + '/pdfs';//PDF存放目录
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);//创建目录
fs.existsSync(photosDir) || fs.mkdirSync(photosDir);//创建目录
fs.existsSync(pdfsDir) || fs.mkdirSync(pdfsDir);//创建目录
module.exports = function(app){
	app.post('/api/photos', function(req, res){
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files){
			// console.log('received fields:');
			// console.log(fields);
			// console.log('received files:');
			// console.log(files);
			var fileImg = files.fileImg;
			// 这里可以判断文件类型，改变dir的路径photosDir/pdfsDir
			// 判断类型只能上传pdf/img
			var img = /image/,pdf=/pdf/;//正则匹配图片或者pdf
			if(img.test(fileImg.type)){
				// console.log('img')
				var dir = photosDir + '/' + Date.now();//通过时间轴创建图片文件夹
			}else if (pdf.test(fileImg.type)){
				// console.log('pdf')
				var dir = pdfsDir + '/' + Date.now();//通过时间轴创建pdf文件夹
			}else{
				res.json({success:'error',message:'文件类型错误请上传pdf或者image文件'});
			}
			var path = dir + '/' + fileImg.name;//保持图片的地址
			fs.mkdirSync(dir);
			// fs.renameSync(fileImg.path, dir + '/' + fileImg.name);
			var readStream=fs.createReadStream(fileImg.path);//通过图片地址读取图片
			var writeStream=fs.createWriteStream(path);//通过图片地址写入图片
			readStream.pipe(writeStream);
			readStream.on('end',function(){
			   fs.unlinkSync(fileImg.path);
			   res.json({success:'success',message:'存储在本地成功'});
			});
		});
	});
};