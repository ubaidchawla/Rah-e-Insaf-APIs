const mongoose = require('mongoose');
var CategorySchema= mongoose.Schema(
    {
        name:{type: String, required: true},
        date: { type: Date, default: Date.now },
        subcategories :[{       
            type:mongoose.Schema.Types.ObjectId,
            ref:'SubCategory'
        }],
    });
        
    module.exports = mongoose.model('Category', CategorySchema);