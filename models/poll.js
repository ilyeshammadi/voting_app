var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Choice = new Schema({
    title : String,
    votes : {type: Number, default: 0}
});

var Poll = new Schema({
    title : String,
    user_id : {type: Schema.Types.ObjectId, ref: 'Account', required: true},
    created : {type: Date, default: Date.now},
    choices : [Choice],
    voters : [{type: Schema.Types.ObjectId, ref: 'Account', unique: true, dropDups: true}],
    can_vote : {type: Boolean, default: true}
});

// Poll.plugin(passportLocalMongoose);
Poll.plugin(uniqueValidator);


module.exports = mongoose.model('Poll', Poll);
