var mongoose = require('mongoose');
var listSchema = mongoose.Schema({
	"_name" : String,
    "username" : String,
    "password" : String,
    "email":String,
    "token" : String,
    "lvs":0,
    "reDate" : String,
    "loDate":String
	},{ collection: "first" ,versionKey: false});
var emailCodess = mongoose.Schema({
	"email":String,
	"emailCode":String,
	"date" : String
	},{ collection: "emailCodes" ,versionKey: false});
var equipOneSm  = mongoose.Schema({
	"src" : String,
    "name" : String,
    "number" : Number,
    "property":String,
    "uploadDate":String
	},{ collection: "equipOne" ,versionKey: false});
var equipTwoSm  = mongoose.Schema({
	"src" : String,
    "name" : String,
    "number" : Array,
    "property":String,
    "special":String,
    "uploadDate":String
	},{ collection: "equipTwo" ,versionKey: false});
const  Models = {
	first : mongoose.model('first', listSchema),
	emailCodes : mongoose.model('emailCodes', emailCodess),
	equipOne:mongoose.model('equipOne', equipOneSm),
	equipTwo:mongoose.model('equipTwo', equipTwoSm),
}
module.exports = Models;