var mongoose = require('mongoose');
var listSchema = mongoose.Schema({name:String,date:String},{ collection: "first" ,versionKey: false});
const  Models = {
	first : mongoose.model('first', listSchema)
}
module.exports = Models;