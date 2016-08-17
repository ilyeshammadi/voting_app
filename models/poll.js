var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Choice = new Schema({
    title : String,
    votes : {type: Number, default: 0}
});

var Poll = new Schema({
    title : String,
    user_id : {type: Schema.Types.ObjectId, ref: 'Account'},
    created : {type: Date, default: Date.now},
    choices : [Choice]
});

// Poll.plugin(passportLocalMongoose);

module.exports = mongoose.model('Poll', Poll);
