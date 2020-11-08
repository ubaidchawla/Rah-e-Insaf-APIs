const mongoose = require('mongoose');
var LawyerSchema= mongoose.Schema(
    {
    tier: {type: String, required: true},
    overall_experience: {type: Number, required: true},
    consultation_fee: {type: Number, required: true},
    introduction: {type: String},
    bar_council: {type: String, required: true},
    city: {type: String, required: true},
    date: { type: Date, default: Date.now },
    followers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    hearings: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hearing'
    }],
    bookmarks: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    user :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }]
});
    
    module.exports = mongoose.model('Lawyer', LawyerSchema);