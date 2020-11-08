const mongoose = require('mongoose');
var SubCategorySchema= mongoose.Schema(
    {
    name:{type: String, required: true},
    category :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('SubCategory', SubCategorySchema);