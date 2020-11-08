const mongoose = require('mongoose');
var LawSchema= mongoose.Schema(
    {
    name:{type: String, required: true},
    offence_type: {type: String, required: true},
    penal_code: {type: Number, required: true},
    punishment_period: {type: Number},
    bookmarks: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    sub_category :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory'
    },
    date: { type: Date, default: Date.now }
    });
    
    module.exports = mongoose.model('Law', LawSchema);