var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/test";
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  console.log('数据库已创建')
  var dbase = db.db("test");
  dbase.collection("first").find({}).toArray(function(err, result) { // 返回集合中所有数据
        if (err) throw err;
	    console.log(result);
	    db.close();
  });
  module.exports = db;
});

