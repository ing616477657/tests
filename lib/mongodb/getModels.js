var mongoose = require('mongoose');
var listSchema = mongoose.Schema({
	"_name" : String,
    "username" : String,
    "password" : String,
    "email":String,
    "token" : String,
    "date" : String
	},{ collection: "first" ,versionKey: false});
var emailCodess = mongoose.Schema({
	"email":String,
	"emailCode":String,
	"date" : String
	},{ collection: "emailCodes" ,versionKey: false});


const  Models = {
	first : mongoose.model('first', listSchema),
	emailCodes : mongoose.model('emailCodes', emailCodess),
}
module.exports = Models;