const mongoose = require('mongoose');
var AppraisalSchema= mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        lawyer :{       
            type:mongoose.Schema.Types.ObjectId,
            ref:'Lawyer'
        },
        client :{       
            type:mongoose.Schema.Types.ObjectId,
            ref:'Client'
        },
        date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('Appraisal', AppraisalSchema);