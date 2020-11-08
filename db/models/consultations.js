const mongoose = require('mongoose');
var ConsultationSchema= mongoose.Schema(
    {
    time:{type: Date, required: true},
    status:{type: String, default: "pending"},
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
    
    module.exports = mongoose.model('Consultation', ConsultationSchema);