const mongoose = require('mongoose');
var ClientSchema= mongoose.Schema(
    {
        phone: {type: Number, required: true},
        city: {type: String, required: true},
        user :{       
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        date: { type: Date, default: Date.now }
    });
    
    module.exports = mongoose.model('Client', ClientSchema);