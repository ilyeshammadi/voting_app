var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Poll = new Schema({
    title : String
});

// Poll.plugin(passportLocalMongoose);

module.exports = mongoose.model('Poll', Poll);
