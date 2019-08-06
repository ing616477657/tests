var mongoose = require('mongoose');
var listSchema = mongoose.Schema({},{ collection: "first" });
const  Models = {
	first : mongoose.model('first', listSchema)
}
module.exports = Models;