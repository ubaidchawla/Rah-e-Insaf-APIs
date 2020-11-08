const mongoose = require('mongoose');
var HearingSchema= mongoose.Schema(
    {
    time:{type: Date, required: true},
    hearing_location: {type: String, required: true},
    hearing_result: {type: String, default: "pending"},
    attachment: {type: String, required: true},
    lawsuit :{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lawsuit'
    },
    comments :[{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('Hearing', HearingSchema);