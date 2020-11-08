const mongoose = require('mongoose');
var EducationSchema= mongoose.Schema(
    {
    title:{type: String, required: true},
    start_date: {type: Date, required: true},
    end_date: {type: Date, required: true},
    lawyer :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lawyer'
    },
    date: { type: Date, default: Date.now }
    });
    
    module.exports = mongoose.model('Education', EducationSchema);