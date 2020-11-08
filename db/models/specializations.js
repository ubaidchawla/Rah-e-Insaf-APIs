const mongoose = require('mongoose');
var SpecializationSchema= mongoose.Schema(
    {
    title:{type: String, required: true},
    lawyer :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lawyer'
    },
    date: { type: Date, default: Date.now }
    });
    
    module.exports = mongoose.model('Specialization', SpecializationSchema);